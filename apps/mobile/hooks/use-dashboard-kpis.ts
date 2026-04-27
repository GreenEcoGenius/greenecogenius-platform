'use client';

import { useEffect, useState } from 'react';
import {
  fetchDashboardKpis,
  getCurrentAccountId,
  type DashboardKpis,
} from '~/lib/queries/dashboard';

interface State {
  data: DashboardKpis | null;
  loading: boolean;
  error: Error | null;
}

export function useDashboardKpis() {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const accountId = await getCurrentAccountId();
        if (!accountId) {
          if (!cancelled) {
            setState({ data: null, loading: false, error: new Error('No account') });
          }
          return;
        }
        const data = await fetchDashboardKpis(accountId);
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err : new Error('Unknown error'),
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
