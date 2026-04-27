'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  fetchCertificates,
  type CertificateWithBlockchain,
} from '~/lib/queries/traceability';
import { getCurrentAccountId } from '~/lib/queries/dashboard';

export interface UseTraceabilityState {
  certificates: CertificateWithBlockchain[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTraceability(): UseTraceabilityState {
  const [certificates, setCertificates] = useState<CertificateWithBlockchain[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const accountId = await getCurrentAccountId();
      if (!accountId) {
        setCertificates([]);
        return;
      }

      const data = await fetchCertificates(accountId);
      setCertificates(data);
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

  return { certificates, loading, refreshing, error, refetch };
}
