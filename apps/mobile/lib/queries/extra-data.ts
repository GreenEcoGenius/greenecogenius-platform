import { supabase } from '~/lib/supabase-client';

export type ExternalActivityCategory =
  | 'governance'
  | 'social'
  | 'environment'
  | 'procurement'
  | 'community';

export interface ExternalActivity {
  id: string;
  account_id: string;
  category: ExternalActivityCategory;
  subcategory: string;
  title: string;
  description: string | null;
  quantitative_value: number | null;
  quantitative_unit: string | null;
  document_url: string | null;
  created_at: string;
}

export async function fetchExternalActivities(
  accountId: string,
): Promise<ExternalActivity[]> {
  const { data, error } = await supabase
    .from('external_activities')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) {
    if (error.code === '42P01') return [];
    throw error;
  }

  return (data ?? []) as ExternalActivity[];
}

export async function createExternalActivity(
  accountId: string,
  input: {
    category: ExternalActivityCategory;
    subcategory: string;
    title: string;
    description?: string;
    quantitative_value?: number;
    quantitative_unit?: string;
    document_url?: string;
  },
): Promise<ExternalActivity> {
  const { data, error } = await supabase
    .from('external_activities')
    .insert({
      account_id: accountId,
      ...input,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ExternalActivity;
}
