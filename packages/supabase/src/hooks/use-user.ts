import { useQuery } from '@tanstack/react-query';

import { requireUser } from '../require-user';
import { JWTUserData } from '../types';
import { useSupabase } from './use-supabase';

const queryKey = ['supabase:user'];

export function useUser(initialData?: JWTUserData | null) {
  const client = useSupabase();

  const queryFn = async () => {
    const response = await requireUser(client);

    if (response.error) {
      // React Query forbids `undefined` as a query result; return `null`
      // so the cache stays consistent and consumers branch on falsy.
      return null;
    }

    return response.data;
  };

  return useQuery({
    queryFn,
    queryKey,
    initialData,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
