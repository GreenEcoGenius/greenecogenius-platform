import { supabase } from '~/lib/supabase-client';
import type { Database } from '@kit/supabase/database';

export type SustainabilityKpis = Database['public']['Tables']['org_sustainability_kpis']['Row'];
export type CarbonRecord = Database['public']['Tables']['carbon_records']['Row'];

export interface DashboardKpis {
  kpis: SustainabilityKpis | null;
  recentRecords: CarbonRecord[];
  hasData: boolean;
}

/**
 * Fetch the latest sustainability KPIs for the current user's personal account
 * + the 5 most recent carbon records.
 */
export async function fetchDashboardKpis(accountId: string): Promise<DashboardKpis> {
  const [kpisResult, recordsResult] = await Promise.all([
    supabase
      .from('org_sustainability_kpis')
      .select('*')
      .eq('account_id', accountId)
      .order('period_end', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('carbon_records')
      .select('*')
      .eq('account_id', accountId)
      .order('calculated_at', { ascending: false })
      .limit(5),
  ]);

  if (kpisResult.error && kpisResult.error.code !== 'PGRST116') {
    throw kpisResult.error;
  }
  if (recordsResult.error) {
    throw recordsResult.error;
  }

  const kpis = kpisResult.data ?? null;
  const recentRecords = recordsResult.data ?? [];

  return {
    kpis,
    recentRecords,
    hasData: !!kpis || recentRecords.length > 0,
  };
}

/**
 * Find the personal account ID for the currently logged-in user.
 * In Makerkit, the personal account.id == auth.users.id.
 */
export async function getCurrentAccountId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}
