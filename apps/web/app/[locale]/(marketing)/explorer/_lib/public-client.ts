import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for public read-only queries (no cookies needed).
 * Used by the Explorer pages which display public data to anonymous visitors.
 */
export function getPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY;

  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLIC_KEY');
  }

  return createClient(url, key);
}
