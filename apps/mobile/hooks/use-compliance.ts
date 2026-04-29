'use client';
import { useEffect, useState } from 'react';
import {
  fetchComplianceData,
  type NormCompliance,
} from '~/lib/queries/compliance';
import { getCurrentAccountId } from '~/lib/queries/dashboard';

interface State {
  rows: NormCompliance[];
  loading: boolean;
  error: Error | null;
}

export function useCompliance() {
  const [state, setState] = useState<State>({
    rows: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const accountId = await getCurrentAccountId();
        if (!accountId) {
          if (!cancelled) setState({ rows: [], loading: false, error: null });
          return;
        }
        const rows = await fetchComplianceData(accountId);
        if (!cancelled) setState({ rows, loading: false, error: null });
      } catch (err) {
        if (!cancelled)
          setState({
            rows: [],
            loading: false,
            error: err instanceof Error ? err : new Error('Unknown'),
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
