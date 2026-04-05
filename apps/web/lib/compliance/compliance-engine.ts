import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import { NORMS_DATABASE } from '~/lib/data/norms-database';

type ComplianceStatus =
  | 'compliant'
  | 'partial'
  | 'non_compliant'
  | 'not_evaluated';
type VerificationMethod =
  | 'auto_transaction'
  | 'auto_blockchain'
  | 'auto_carbon'
  | 'auto_esg'
  | 'auto_platform'
  | 'manual'
  | 'pending';

interface NormResult {
  norm_id: string;
  status: ComplianceStatus;
  verification_method: VerificationMethod;
  evidence_summary: string;
  evidence_data: Record<string, unknown>;
}

interface AccountData {
  listingsCount: number;
  activeListingsCount: number;
  transactionsCount: number;
  completedTransactionsCount: number;
  carbonRecordsCount: number;
  hasScopeData: boolean;
  blockchainRecordsCount: number;
  certificatesCount: number;
  hasEsgData: boolean;
  hasEsgReport: boolean;
  totalCo2Avoided: number;
  totalTonnesRecycled: number;
  hasRseDiagnostic: boolean;
  rseScore: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const any = (c: SupabaseClient) => c as any;

async function fetchAccountData(
  client: SupabaseClient,
  accountId: string,
): Promise<AccountData> {
  // Parallel fetch of all data sources
  const [
    listingsRes,
    activeListingsRes,
    transactionsRes,
    completedTransactionsRes,
    carbonRes,
    certificatesRes,
    esgDataRes,
    esgReportRes,
  ] = await Promise.all([
    any(client).from('listings').select('*', { count: 'exact', head: true }).eq('account_id', accountId),
    any(client).from('listings').select('*', { count: 'exact', head: true }).eq('account_id', accountId).eq('status', 'active'),
    any(client).from('marketplace_transactions').select('*', { count: 'exact', head: true }).or(`seller_account_id.eq.${accountId},buyer_account_id.eq.${accountId}`),
    any(client).from('marketplace_transactions').select('*', { count: 'exact', head: true }).or(`seller_account_id.eq.${accountId},buyer_account_id.eq.${accountId}`).in('status', ['delivered', 'completed', 'funds_released']),
    any(client).from('carbon_records').select('*', { count: 'exact', head: true }).eq('account_id', accountId),
    any(client).from('traceability_certificates').select('*', { count: 'exact', head: true }).eq('issued_to_account_id', accountId),
    any(client)
      .from('org_esg_data')
      .select(
        'scope1_natural_gas_kwh, scope1_fuel_liters, scope1_other_kg_co2, scope2_electricity_kwh, scope2_heating_kwh, scope3_business_travel_km, scope3_commuting_employees, scope3_commuting_avg_km, scope3_purchased_goods_eur, scope3_waste_tonnes, nb_employees, office_surface_m2, submitted_at',
      )
      .eq('account_id', accountId),
    any(client).from('esg_reports').select('*', { count: 'exact', head: true }).eq('account_id', accountId),
  ]);

  // Determine if ESG data is actually filled in (user-entered), not just a
  // blank default row. A norm should only move to "partial" once the user has
  // entered real data in at least one field, or explicitly submitted the form.
  type EsgRow = {
    scope1_natural_gas_kwh?: number | null;
    scope1_fuel_liters?: number | null;
    scope1_other_kg_co2?: number | null;
    scope2_electricity_kwh?: number | null;
    scope2_heating_kwh?: number | null;
    scope3_business_travel_km?: number | null;
    scope3_commuting_employees?: number | null;
    scope3_commuting_avg_km?: number | null;
    scope3_purchased_goods_eur?: number | null;
    scope3_waste_tonnes?: number | null;
    nb_employees?: number | null;
    office_surface_m2?: number | null;
    submitted_at?: string | null;
  };
  const esgRows: EsgRow[] = (esgDataRes.data as EsgRow[] | null) ?? [];
  const hasRealEsgData = esgRows.some((row) => {
    if (row.submitted_at) return true;
    const numericFields: Array<number | null | undefined> = [
      row.scope1_natural_gas_kwh,
      row.scope1_fuel_liters,
      row.scope1_other_kg_co2,
      row.scope2_electricity_kwh,
      row.scope2_heating_kwh,
      row.scope3_business_travel_km,
      row.scope3_commuting_employees,
      row.scope3_commuting_avg_km,
      row.scope3_purchased_goods_eur,
      row.scope3_waste_tonnes,
      row.nb_employees,
      row.office_surface_m2,
    ];
    return numericFields.some((v) => Number(v ?? 0) > 0);
  });

  // Blockchain records don't have account_id — count via listings
  const { data: userListingIds } = await any(client)
    .from('listings')
    .select('id')
    .eq('account_id', accountId);

  let blockchainRecordsCount = 0;
  if (userListingIds && userListingIds.length > 0) {
    const ids = userListingIds.map((l: { id: string }) => l.id);
    const { count } = await any(client)
      .from('blockchain_records')
      .select('*', { count: 'exact', head: true })
      .in('listing_id', ids);
    blockchainRecordsCount = count ?? 0;
  }

  // Carbon aggregation
  const { data: carbonAgg } = await any(client)
    .from('carbon_records')
    .select('co2_avoided, weight_kg')
    .eq('account_id', accountId);

  const totalCo2Avoided = (carbonAgg ?? []).reduce(
    (sum: number, r: { co2_avoided?: number }) => sum + Number(r.co2_avoided ?? 0),
    0,
  );
  const totalTonnesRecycled =
    (carbonAgg ?? []).reduce(
      (sum: number, r: { weight_kg?: number }) => sum + Number(r.weight_kg ?? 0),
      0,
    ) / 1000;

  // Sustainability KPIs (used as RSE proxy since rse_diagnostics table doesn't exist)
  const { data: kpiData } = await any(client)
    .from('org_sustainability_kpis')
    .select('transactions_count, tonnes_recycled, total_avoided_kg')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
    .limit(1);

  const hasKpis = kpiData && kpiData.length > 0;
  const rseScore = hasKpis ? Math.min(100, Math.round((kpiData[0].transactions_count ?? 0) * 10)) : 0;

  return {
    listingsCount: listingsRes.count ?? 0,
    activeListingsCount: activeListingsRes.count ?? 0,
    transactionsCount: transactionsRes.count ?? 0,
    completedTransactionsCount: completedTransactionsRes.count ?? 0,
    carbonRecordsCount: carbonRes.count ?? 0,
    hasScopeData: (carbonRes.count ?? 0) > 0,
    blockchainRecordsCount,
    certificatesCount: certificatesRes.count ?? 0,
    hasEsgData: hasRealEsgData,
    hasEsgReport: (esgReportRes.count ?? 0) > 0,
    totalCo2Avoided,
    totalTonnesRecycled,
    hasRseDiagnostic: hasKpis,
    rseScore,
  };
}

// ── Per-norm evaluation rules ────────────────────────────────────

type EvalResult = {
  status: ComplianceStatus;
  method: VerificationMethod;
  summary: string;
};

type RuleFn = (d: AccountData) => EvalResult;

const NOT_EVALUATED: EvalResult = {
  status: 'not_evaluated',
  method: 'pending',
  summary: '',
};

// Helper
function result(
  status: ComplianceStatus,
  method: VerificationMethod,
  summary: string,
): EvalResult {
  return { status, method, summary };
}

const NORM_RULES: Record<string, RuleFn> = {
  // ── Circular Economy ──────────────────────────────────
  'iso-59004': (d) => {
    if (d.completedTransactionsCount >= 10 && d.listingsCount >= 5)
      return result('compliant', 'auto_transaction', `${d.completedTransactionsCount} transactions, ${d.listingsCount} annonces`);
    if (d.listingsCount >= 1 || d.transactionsCount >= 1)
      return result('partial', 'auto_transaction', `${d.listingsCount} annonce(s), ${d.transactionsCount} transaction(s)`);
    return NOT_EVALUATED;
  },
  'iso-59010': (d) => NORM_RULES['iso-59004']!(d),
  'iso-59014': (d) => NORM_RULES['iso-59004']!(d),
  'iso-59020': (d) => {
    if (d.completedTransactionsCount >= 20)
      return result('compliant', 'auto_transaction', `Score circularite base sur ${d.completedTransactionsCount} transactions`);
    if (d.completedTransactionsCount >= 5)
      return result('partial', 'auto_transaction', `${d.completedTransactionsCount} transactions completees`);
    return NOT_EVALUATED;
  },
  'iso-14001': (d) => {
    if (d.carbonRecordsCount >= 1 && d.hasEsgReport && d.completedTransactionsCount >= 5)
      return result('compliant', 'auto_platform', 'Systeme de management environnemental actif');
    if (d.carbonRecordsCount >= 1 || d.hasEsgData)
      return result('partial', 'auto_platform', 'Donnees environnementales partielles');
    return NOT_EVALUATED;
  },
  'loi-agec': (d) => {
    if (d.completedTransactionsCount >= 10 && d.blockchainRecordsCount >= 1)
      return result('compliant', 'auto_transaction', `${d.completedTransactionsCount} transactions tracees`);
    if (d.listingsCount >= 1 || d.transactionsCount >= 1)
      return result('partial', 'auto_transaction', `${d.listingsCount} annonce(s) publiee(s)`);
    return NOT_EVALUATED;
  },
  'decret-9-flux': (d) => {
    if (d.completedTransactionsCount >= 5)
      return result('compliant', 'auto_transaction', `Tri et valorisation via ${d.completedTransactionsCount} transactions`);
    if (d.listingsCount >= 1)
      return result('partial', 'auto_transaction', 'Annonces publiees, transactions en attente');
    return NOT_EVALUATED;
  },
  'rep-elargie': (d) => {
    if (d.completedTransactionsCount >= 3)
      return result('compliant', 'auto_transaction', `Filieres REP couvertes via ${d.completedTransactionsCount} transactions`);
    if (d.transactionsCount >= 1)
      return result('partial', 'auto_transaction', 'Transaction(s) en cours');
    return NOT_EVALUATED;
  },
  'ppwr': (d) => NORM_RULES['loi-agec']!(d),
  'taxonomie-circulaire': (d) => NORM_RULES['iso-59020']!(d),
  'dpp': (d) => {
    if (d.blockchainRecordsCount >= 10 && d.certificatesCount >= 5)
      return result('compliant', 'auto_blockchain', `${d.blockchainRecordsCount} produits traces, ${d.certificatesCount} passeports emis`);
    if (d.blockchainRecordsCount >= 1)
      return result('partial', 'auto_blockchain', `${d.blockchainRecordsCount} enregistrement(s) blockchain`);
    return NOT_EVALUATED;
  },

  // ── Carbon & Environment ──────────────────────────────
  'ghg-protocol': (d) => {
    if (d.carbonRecordsCount >= 1 && d.hasScopeData)
      return result('compliant', 'auto_carbon', `Scopes 1/2/3 completes, ${d.carbonRecordsCount} bilan(s)`);
    if (d.carbonRecordsCount >= 1)
      return result('partial', 'auto_carbon', 'Bilan carbone partiel');
    return NOT_EVALUATED;
  },
  'iso-14064': (d) => NORM_RULES['ghg-protocol']!(d),
  'bilan-ges': (d) => {
    if (d.carbonRecordsCount >= 1 && d.hasScopeData)
      return result('compliant', 'auto_carbon', `Bilan GES complet avec facteurs ADEME`);
    if (d.carbonRecordsCount >= 1)
      return result('partial', 'auto_carbon', 'Saisie partielle du bilan carbone');
    return NOT_EVALUATED;
  },
  'sbti': (d) => {
    if (d.carbonRecordsCount >= 1 && d.hasScopeData && d.totalCo2Avoided > 0)
      return result('compliant', 'auto_carbon', `Objectifs bases sur la science, ${Math.round(d.totalCo2Avoided)} kg CO2 evite`);
    if (d.carbonRecordsCount >= 1)
      return result('partial', 'auto_carbon', 'Bilan carbone initie, objectifs a definir');
    return NOT_EVALUATED;
  },
  'cdp': (d) => {
    if (d.hasEsgReport && d.carbonRecordsCount >= 1)
      return result('compliant', 'auto_esg', 'Donnees carbone et ESG reportees');
    if (d.carbonRecordsCount >= 1)
      return result('partial', 'auto_carbon', 'Emissions carbone calculees');
    return NOT_EVALUATED;
  },
  'eu-ets': (d) => {
    if (d.carbonRecordsCount >= 1 && d.hasScopeData)
      return result('compliant', 'auto_carbon', 'Quotas carbone documentes');
    return NOT_EVALUATED;
  },
  'cbam': (d) => NORM_RULES['eu-ets']!(d),

  // ── Reporting ESG ─────────────────────────────────────
  'csrd': (d) => {
    if (d.hasEsgReport)
      return result('compliant', 'auto_esg', 'Rapport CSRD/ESRS genere');
    if (d.hasEsgData)
      return result('partial', 'auto_esg', 'Donnees ESG saisies, rapport a generer');
    return NOT_EVALUATED;
  },
  'esrs': (d) => NORM_RULES['csrd']!(d),
  'gri': (d) => NORM_RULES['csrd']!(d),
  'taxonomie-verte': (d) => {
    if (d.hasEsgReport && d.completedTransactionsCount >= 3)
      return result('compliant', 'auto_esg', 'Activites evaluees selon la taxonomie');
    if (d.hasEsgData)
      return result('partial', 'auto_esg', 'Donnees ESG partielles');
    return NOT_EVALUATED;
  },
  'sfdr': (d) => NORM_RULES['csrd']!(d),
  'devoir-vigilance': (d) => {
    if (d.hasEsgReport && d.blockchainRecordsCount >= 1)
      return result('compliant', 'auto_esg', 'Plan de vigilance documente avec tracabilite');
    if (d.hasEsgData || d.blockchainRecordsCount >= 1)
      return result('partial', 'auto_platform', 'Plan de vigilance en cours');
    return NOT_EVALUATED;
  },
  'dpef': (d) => NORM_RULES['csrd']!(d),
  'art-29-lec': (d) => NORM_RULES['csrd']!(d),
  'cs3d': (d) => NORM_RULES['devoir-vigilance']!(d),

  // ── Traceability ──────────────────────────────────────
  'blockchain-polygon': (d) => {
    if (d.blockchainRecordsCount >= 5 && d.certificatesCount >= 1)
      return result('compliant', 'auto_blockchain', `${d.blockchainRecordsCount} hash on-chain, ${d.certificatesCount} certificat(s)`);
    if (d.blockchainRecordsCount >= 1)
      return result('partial', 'auto_blockchain', `${d.blockchainRecordsCount} enregistrement(s)`);
    return NOT_EVALUATED;
  },
  'vigilance-chaine': (d) => {
    if (d.completedTransactionsCount >= 5 && d.blockchainRecordsCount >= 1)
      return result('compliant', 'auto_blockchain', 'Chaine d\'approvisionnement tracee');
    if (d.completedTransactionsCount >= 1)
      return result('partial', 'auto_transaction', 'Tracabilite partielle');
    return NOT_EVALUATED;
  },
  'iso-22095': (d) => NORM_RULES['blockchain-polygon']!(d),
  'eudr': (d) => NORM_RULES['vigilance-chaine']!(d),
  '3tg': (d) => NORM_RULES['vigilance-chaine']!(d),
  'passeport-batterie': (d) => NORM_RULES['dpp']!(d),

  // ── Data & SaaS ───────────────────────────────────────
  'rgpd': (_d) => NOT_EVALUATED,
  'iso-27001': (_d) => NOT_EVALUATED,
  'soc-2': (_d) => NOT_EVALUATED,
  'nis2': (_d) => NOT_EVALUATED,
  'ai-act': (_d) => NOT_EVALUATED,

  // ── Labels ────────────────────────────────────────────
  'b-corp': (d) => {
    if (d.hasRseDiagnostic && d.rseScore >= 80)
      return result('compliant', 'auto_platform', `Score RSE ${d.rseScore}/100 — eligible B Corp`);
    if (d.hasRseDiagnostic && d.rseScore >= 50)
      return result('partial', 'auto_platform', `Score RSE ${d.rseScore}/100 — en progression`);
    if (d.hasRseDiagnostic)
      return result('partial', 'auto_platform', `Score RSE ${d.rseScore}/100`);
    return NOT_EVALUATED;
  },
  'numerique-responsable': (_d) => NOT_EVALUATED,
  'lucie-26000': (d) => {
    if (d.hasRseDiagnostic && d.rseScore >= 70)
      return result('compliant', 'auto_platform', `Diagnostic ISO 26000 ${d.rseScore}/100`);
    if (d.hasRseDiagnostic)
      return result('partial', 'auto_platform', `Diagnostic complete: ${d.rseScore}/100`);
    return NOT_EVALUATED;
  },
  'engage-rse': (d) => NORM_RULES['lucie-26000']!(d),
};

// ── Main engine ──────────────────────────────────────────────────

export async function evaluateAccountCompliance(
  adminClient: SupabaseClient,
  accountId: string,
): Promise<{ results: NormResult[]; score: number }> {
  const data = await fetchAccountData(adminClient, accountId);

  const results: NormResult[] = [];

  for (const norm of NORMS_DATABASE) {
    const ruleFn = NORM_RULES[norm.id];
    const evalResult = ruleFn ? ruleFn(data) : NOT_EVALUATED;

    // Override empty summaries with a default
    const summary = evalResult.summary || (
      evalResult.status === 'not_evaluated'
        ? 'Aucune donnee disponible pour evaluer cette norme'
        : evalResult.summary
    );

    results.push({
      norm_id: norm.id,
      status: evalResult.status,
      verification_method: evalResult.method,
      evidence_summary: summary,
      evidence_data: {
        listings: data.listingsCount,
        transactions: data.completedTransactionsCount,
        carbon_records: data.carbonRecordsCount,
        blockchain_records: data.blockchainRecordsCount,
        certificates: data.certificatesCount,
        esg_data: data.hasEsgData,
        esg_report: data.hasEsgReport,
        rse_score: data.rseScore,
      },
    });
  }

  const compliantCount = results.filter((r) => r.status === 'compliant').length;
  const partialCount = results.filter((r) => r.status === 'partial').length;
  const score = Math.round(
    ((compliantCount + partialCount * 0.5) / results.length) * 100,
  );

  // Upsert all results
  for (const r of results) {
    await adminClient.from('account_norm_compliance').upsert(
      {
        account_id: accountId,
        norm_id: r.norm_id,
        status: r.status,
        verification_method: r.verification_method,
        evidence_summary: r.evidence_summary,
        evidence_data: r.evidence_data,
        last_evaluated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'account_id,norm_id' },
    );
  }

  return { results, score };
}
