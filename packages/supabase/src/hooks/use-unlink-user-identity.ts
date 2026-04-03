import type { UserIdentity } from '@supabase/supabase-js';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { USER_IDENTITIES_QUERY_KEY } from './use-user-identities';

export function useUnlinkUserIdentity() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (identity: UserIdentity) => {
      const { data, error } = await supabase.auth.unlinkIdentity(identity);

      if (error) {
        console.error('[unlink-identity]', error.message, error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: USER_IDENTITIES_QUERY_KEY,
      });
    },
  });
}
