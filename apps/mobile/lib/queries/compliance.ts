import { supabase } from '~/lib/supabase-client';

export interface NormCompliance {
  norm_id: string;
  status: string;
  verification_method: string;
  evidence_summary: string;
  last_evaluated_at: string;
}

export interface ComplianceData {
  rows: NormCompliance[];
  loading: boolean;
}

export async function getCurrentAccountId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function fetchComplianceData(
  accountId: string,
): Promise<NormCompliance[]> {
  const { data, error } = await supabase
    .from('account_norm_compliance')
    .select('*')
    .eq('account_id', accountId);

  if (error) {
    // Table might not exist yet — return empty
    if (error.code === '42P01') return [];
    throw error;
  }

  return (data ?? []) as NormCompliance[];
}
