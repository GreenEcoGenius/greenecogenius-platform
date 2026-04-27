'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  fetchCarbonRecords,
  computeCarbonRecordsStats,
  type CarbonRecord,
  type CarbonRecordsStats,
} from '~/lib/queries/carbon-records';
import { getCurrentAccountId } from '~/lib/queries/dashboard';

export interface UseCarbonRecordsState {
  records: CarbonRecord[];
  stats: CarbonRecordsStats;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCarbonRecords(): UseCarbonRecordsState {
  const [records, setRecords] = useState<CarbonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const accountId = await getCurrentAccountId();
      if (!accountId) {
        setRecords([]);
        return;
      }

      const data = await fetchCarbonRecords(accountId);
      setRecords(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const refetch = useCallback(async () => {
    await load(true);
  }, [load]);

  const stats = computeCarbonRecordsStats(records);

  return { records, stats, loading, refreshing, error, refetch };
}
