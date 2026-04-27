import { supabase } from '~/lib/supabase-client';
import type { Database } from '@kit/supabase/database';

export type CarbonRecord = Database['public']['Tables']['carbon_records']['Row'];

export interface FetchCarbonRecordsOpts {
  /** Limit number of records returned (default 50) */
  limit?: number;
  /** Filter by date range (start) */
  fromDate?: string;
  /** Filter by date range (end) */
  toDate?: string;
}

/**
 * Fetch all carbon records for an account, ordered by most recent first.
 */
export async function fetchCarbonRecords(
  accountId: string,
  opts: FetchCarbonRecordsOpts = {},
): Promise<CarbonRecord[]> {
  const { limit = 50, fromDate, toDate } = opts;

  let query = supabase
    .from('carbon_records')
    .select('*')
    .eq('account_id', accountId)
    .order('calculated_at', { ascending: false })
    .limit(limit);

  if (fromDate) {
    query = query.gte('calculated_at', fromDate);
  }
  if (toDate) {
    query = query.lte('calculated_at', toDate);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Fetch a single carbon record by ID. Returns null if not found.
 */
export async function fetchCarbonRecordById(
  id: string,
): Promise<CarbonRecord | null> {
  const { data, error } = await supabase
    .from('carbon_records')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data ?? null;
}

/**
 * Aggregate stats for the carbon records list view.
 */
export interface CarbonRecordsStats {
  totalRecords: number;
  totalCo2Avoided: number;
  totalTonnesRecycled: number;
}

export function computeCarbonRecordsStats(
  records: CarbonRecord[],
): CarbonRecordsStats {
  return records.reduce<CarbonRecordsStats>(
    (acc, r) => ({
      totalRecords: acc.totalRecords + 1,
      totalCo2Avoided: acc.totalCo2Avoided + Number(r.co2_avoided ?? 0),
      totalTonnesRecycled: acc.totalTonnesRecycled + Number(r.weight_tonnes ?? 0),
    }),
    { totalRecords: 0, totalCo2Avoided: 0, totalTonnesRecycled: 0 },
  );
}
