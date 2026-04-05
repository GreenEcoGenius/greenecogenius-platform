import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

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
  qualitative_value: string | null;
  document_url: string | null;
  date_start: string | null;
  date_end: string | null;
  norms_impacted: string[];
  verified: boolean;
  created_at: string;
  updated_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anyClient = (c: SupabaseClient) => c as any;

/**
 * Postgres error 42P01 = "relation does not exist". Returned when the
 * external_activities migration has not yet been applied. Tolerate it so
 * the UI renders an empty state rather than a 500.
 */
function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: string }).code;
  return code === '42P01';
}

export interface CreateExternalActivityInput {
  category: ExternalActivityCategory;
  subcategory: string;
  title: string;
  description?: string | null;
  quantitative_value?: number | null;
  quantitative_unit?: string | null;
  qualitative_value?: string | null;
  document_url?: string | null;
  date_start?: string | null;
  date_end?: string | null;
}

export class ExternalActivitiesService {
  static async listForAccount(
    client: SupabaseClient,
    accountId: string,
  ): Promise<ExternalActivity[]> {
    const { data, error } = await anyClient(client)
      .from('external_activities')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return [];
      throw error;
    }
    return (data ?? []) as ExternalActivity[];
  }

  static async listByCategory(
    client: SupabaseClient,
    accountId: string,
    category: ExternalActivityCategory,
  ): Promise<ExternalActivity[]> {
    const { data, error } = await anyClient(client)
      .from('external_activities')
      .select('*')
      .eq('account_id', accountId)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMissingTableError(error)) return [];
      throw error;
    }
    return (data ?? []) as ExternalActivity[];
  }

  static async create(
    client: SupabaseClient,
    accountId: string,
    input: CreateExternalActivityInput,
  ): Promise<ExternalActivity> {
    const row = {
      account_id: accountId,
      category: input.category,
      subcategory: input.subcategory,
      title: input.title,
      description: input.description ?? null,
      quantitative_value: input.quantitative_value ?? null,
      quantitative_unit: input.quantitative_unit ?? null,
      qualitative_value: input.qualitative_value ?? null,
      document_url: input.document_url ?? null,
      date_start: input.date_start ?? null,
      date_end: input.date_end ?? null,
      norms_impacted: normsImpactedByCategory(input.category),
      verified: Boolean(input.document_url),
    };

    const { data, error } = await anyClient(client)
      .from('external_activities')
      .insert(row)
      .select()
      .single();

    if (error) throw error;
    return data as ExternalActivity;
  }

  static async delete(
    client: SupabaseClient,
    accountId: string,
    id: string,
  ): Promise<void> {
    const { error } = await anyClient(client)
      .from('external_activities')
      .delete()
      .eq('id', id)
      .eq('account_id', accountId);

    if (error) throw error;
  }

  static async countByCategory(
    client: SupabaseClient,
    accountId: string,
  ): Promise<Record<ExternalActivityCategory, number>> {
    const rows = await this.listForAccount(client, accountId);
    const counts: Record<ExternalActivityCategory, number> = {
      governance: 0,
      social: 0,
      environment: 0,
      procurement: 0,
      community: 0,
    };
    for (const r of rows) counts[r.category]++;
    return counts;
  }
}

/**
 * Map each category to the norms whose score is boosted by activities in it.
 * This keeps the compliance engine decoupled from UI category labels.
 */
export function normsImpactedByCategory(
  category: ExternalActivityCategory,
): string[] {
  switch (category) {
    case 'governance':
      return ['iso-26000', 'b-corp', 'csrd', 'esrs', 'lucie-26000', 'engage-rse'];
    case 'social':
      return ['iso-26000', 'b-corp', 'csrd', 'esrs', 'lucie-26000', 'engage-rse'];
    case 'environment':
      return ['iso-14001', 'csrd', 'esrs', 'taxonomie-verte', 'gri'];
    case 'procurement':
      return ['devoir-vigilance', 'cs3d', 'iso-26000', 'vigilance-chaine'];
    case 'community':
      return ['iso-26000', 'b-corp', 'csrd', 'lucie-26000'];
  }
}
