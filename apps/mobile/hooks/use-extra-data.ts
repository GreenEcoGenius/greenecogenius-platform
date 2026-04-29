'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  fetchExternalActivities,
  createExternalActivity,
  type ExternalActivity,
  type ExternalActivityCategory,
} from '~/lib/queries/extra-data';
import { getCurrentAccountId } from '~/lib/queries/dashboard';

interface State {
  activities: ExternalActivity[];
  loading: boolean;
  error: Error | null;
}

export function useExtraData() {
  const [state, setState] = useState<State>({
    activities: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const accountId = await getCurrentAccountId();
      if (!accountId) {
        setState({ activities: [], loading: false, error: null });
        return;
      }
      const activities = await fetchExternalActivities(accountId);
      setState({ activities, loading: false, error: null });
    } catch (err) {
      setState({
        activities: [],
        loading: false,
        error: err instanceof Error ? err : new Error('Unknown'),
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addActivity = useCallback(
    async (input: {
      category: ExternalActivityCategory;
      subcategory: string;
      title: string;
      description?: string;
      quantitative_value?: number;
      quantitative_unit?: string;
      document_url?: string;
    }) => {
      const accountId = await getCurrentAccountId();
      if (!accountId) throw new Error('No account');
      await createExternalActivity(accountId, input);
      await load();
    },
    [load],
  );

  return { ...state, addActivity, reload: load };
}
