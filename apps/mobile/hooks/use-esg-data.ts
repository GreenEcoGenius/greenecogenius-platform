'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  fetchLatestEsgData,
  computeEsgScopeTotals,
  type OrgEsgData,
  type EsgScopeTotals,
} from '~/lib/queries/esg-data';
import { getCurrentAccountId } from '~/lib/queries/dashboard';

export interface UseEsgDataState {
  esg: OrgEsgData | null;
  totals: EsgScopeTotals;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEsgData(): UseEsgDataState {
  const [esg, setEsg] = useState<OrgEsgData | null>(null);
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
        setEsg(null);
        return;
      }

      const data = await fetchLatestEsgData(accountId);
      setEsg(data);
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

  const totals = computeEsgScopeTotals(esg);

  return { esg, totals, loading, refreshing, error, refetch };
}
