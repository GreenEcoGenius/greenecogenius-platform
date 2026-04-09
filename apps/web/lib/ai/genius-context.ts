import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import { NORMS_DATABASE, PILLAR_INFO } from '~/lib/data/norms-database';

export interface GeniusUserContext {
  companyName: string;
  globalScore: number;
  pillarScores: Record<string, number>;
  normSummary: {
    compliant: number;
    partial: number;
    notEvaluated: number;
    total: number;
  };
  topPartialNorms: string[];
  listingsCount: number;
  transactionsCount: number;
  carbonRecordsCount: number;
  hasEsgData: boolean;
  hasEsgReport: boolean;
}

/**
 * Loads the user's compliance and platform data to inject into Genius context.
 * Uses admin client to bypass RLS.
 */
export async function loadGeniusContext(
  adminClient: SupabaseClient,
  userId: string,
): Promise<GeniusUserContext> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = adminClient as any;

  const [
    accountRes,
    complianceRes,
    listingsRes,
    transactionsRes,
    carbonRes,
    esgDataRes,
    esgReportRes,
  ] = await Promise.all([
    c.from('accounts').select('name').eq('id', userId).single(),
    c.from('account_norm_compliance').select('norm_id, status').eq('account_id', userId),
    c.from('listings').select('*', { count: 'exact', head: true }).eq('account_id', userId),
    c.from('marketplace_transactions').select('*', { count: 'exact', head: true }).or(`seller_account_id.eq.${userId},buyer_account_id.eq.${userId}`),
    c.from('carbon_records').select('*', { count: 'exact', head: true }).eq('account_id', userId),
    c.from('org_esg_data').select('*', { count: 'exact', head: true }).eq('account_id', userId),
    c.from('esg_reports').select('*', { count: 'exact', head: true }).eq('account_id', userId),
  ]);

  const companyName = accountRes.data?.name ?? 'Mon entreprise';
  const complianceRows: Array<{ norm_id: string; status: string }> = complianceRes.data ?? [];

  // Count statuses
  const compliant = complianceRows.filter((r) => r.status === 'compliant').length;
  const partial = complianceRows.filter((r) => r.status === 'partial').length;
  const notEvaluated = 42 - compliant - partial;

  // Calculate global score
  const globalScore = complianceRows.length > 0
    ? Math.round(((compliant + partial * 0.5) / 42) * 100)
    : 0;

  // Calculate pillar scores
  const pillarScores: Record<string, number> = {};
  for (const [key, info] of Object.entries(PILLAR_INFO)) {
    const pillarNorms = NORMS_DATABASE.filter((n) => n.pillar === key);
    const pillarCompliance = pillarNorms.map((n) => {
      const row = complianceRows.find((r) => r.norm_id === n.id);
      if (row?.status === 'compliant') return 100;
      if (row?.status === 'partial') return 50;
      return 0;
    });
    let sum = 0;
    for (const v of pillarCompliance) sum += v;
    const avg = pillarCompliance.length > 0
      ? Math.round(sum / pillarCompliance.length)
      : 0;
    pillarScores[info.label] = avg;
  }

  // Top partial norms (closest to compliant)
  const topPartialNorms = complianceRows
    .filter((r) => r.status === 'partial')
    .map((r) => {
      const norm = NORMS_DATABASE.find((n) => n.id === r.norm_id);
      return norm?.title ?? r.norm_id;
    })
    .slice(0, 5);

  return {
    companyName,
    globalScore,
    pillarScores,
    normSummary: {
      compliant,
      partial,
      notEvaluated,
      total: 42,
    },
    topPartialNorms,
    listingsCount: listingsRes.count ?? 0,
    transactionsCount: transactionsRes.count ?? 0,
    carbonRecordsCount: carbonRes.count ?? 0,
    hasEsgData: (esgDataRes.count ?? 0) > 0,
    hasEsgReport: (esgReportRes.count ?? 0) > 0,
  };
}

/**
 * Format the context as a string to inject into the system prompt.
 */
export function formatContextForPrompt(ctx: GeniusUserContext, locale: string): string {
  const isFr = locale === 'fr';

  return `
## ${isFr ? 'CONTEXTE UTILISATEUR' : 'USER CONTEXT'}
- ${isFr ? 'Entreprise' : 'Company'}: ${ctx.companyName}
- ${isFr ? 'Score conformite global' : 'Global compliance score'}: ${ctx.globalScore}%
- ${isFr ? 'Normes conformes' : 'Compliant norms'}: ${ctx.normSummary.compliant}/${ctx.normSummary.total}
- ${isFr ? 'Normes partielles' : 'Partial norms'}: ${ctx.normSummary.partial}
- ${isFr ? 'Non evaluees' : 'Not evaluated'}: ${ctx.normSummary.notEvaluated}

## ${isFr ? 'SCORES PAR PILIER' : 'SCORES BY PILLAR'}
${Object.entries(ctx.pillarScores).map(([k, v]) => `- ${k}: ${v}%`).join('\n')}

## ${isFr ? 'DONNEES PLATEFORME' : 'PLATFORM DATA'}
- ${isFr ? 'Annonces publiees' : 'Published listings'}: ${ctx.listingsCount}
- ${isFr ? 'Transactions' : 'Transactions'}: ${ctx.transactionsCount}
- ${isFr ? 'Bilans carbone' : 'Carbon records'}: ${ctx.carbonRecordsCount}
- ${isFr ? 'Donnees ESG saisies' : 'ESG data entered'}: ${ctx.hasEsgData ? (isFr ? 'Oui' : 'Yes') : (isFr ? 'Non' : 'No')}
- ${isFr ? 'Rapport ESG genere' : 'ESG report generated'}: ${ctx.hasEsgReport ? (isFr ? 'Oui' : 'Yes') : (isFr ? 'Non' : 'No')}

${ctx.topPartialNorms.length > 0 ? `## ${isFr ? 'NORMES PARTIELLES (proches de conforme)' : 'PARTIAL NORMS (close to compliant)'}
${ctx.topPartialNorms.map((n) => `- ${n}`).join('\n')}` : ''}
`.trim();
}
