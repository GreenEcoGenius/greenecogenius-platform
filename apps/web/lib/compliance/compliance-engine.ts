import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import { NORMS_DATABASE } from '~/lib/data/norms-database';

type ComplianceStatus = 'compliant' | 'partial' | 'non_compliant' | 'not_evaluated';
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
}

async function fetchAccountData(
  client: SupabaseClient,
  accountId: string,
): Promise<AccountData> {
  const [
    { count: listingsCount },
    { count: activeListingsCount },
    { count: transactionsCount },
    { count: completedTransactionsCount },
    { count: carbonRecordsCount },
    { count: blockchainRecordsCount },
    { count: certificatesCount },
    { count: esgDataCount },
    { count: esgReportCount },
  ] = await Promise.all([
    client
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId),
    client
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('status', 'active'),
    client
      .from('marketplace_transactions')
      .select('*', { count: 'exact', head: true })
      .or(`seller_account_id.eq.${accountId},buyer_account_id.eq.${accountId}`),
    client
      .from('marketplace_transactions')
      .select('*', { count: 'exact', head: true })
      .or(`seller_account_id.eq.${accountId},buyer_account_id.eq.${accountId}`)
      .in('status', ['delivered', 'completed', 'funds_released']),
    client
      .from('carbon_records')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId),
    client
      .from('blockchain_records')
      .select('*', { count: 'exact', head: true }),
    client
      .from('traceability_certificates')
      .select('*', { count: 'exact', head: true })
      .eq('issued_to_account_id', accountId),
    client
      .from('org_esg_data')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId),
    client
      .from('esg_reports')
      .select('*', { count: 'exact', head: true }),
  ]);

  const { data: carbonAgg } = await client
    .from('carbon_records')
    .select('co2_avoided, weight_kg')
    .eq('account_id', accountId);

  const totalCo2Avoided = (carbonAgg ?? []).reduce(
    (sum, r) => sum + Number(r.co2_avoided ?? 0),
    0,
  );
  const totalTonnesRecycled =
    (carbonAgg ?? []).reduce(
      (sum, r) => sum + Number(r.weight_kg ?? 0),
      0,
    ) / 1000;

  const hasScopeData = (carbonRecordsCount ?? 0) > 0;

  return {
    listingsCount: listingsCount ?? 0,
    activeListingsCount: activeListingsCount ?? 0,
    transactionsCount: transactionsCount ?? 0,
    completedTransactionsCount: completedTransactionsCount ?? 0,
    carbonRecordsCount: carbonRecordsCount ?? 0,
    hasScopeData,
    blockchainRecordsCount: blockchainRecordsCount ?? 0,
    certificatesCount: certificatesCount ?? 0,
    hasEsgData: (esgDataCount ?? 0) > 0,
    hasEsgReport: (esgReportCount ?? 0) > 0,
    totalCo2Avoided,
    totalTonnesRecycled,
  };
}

// ── Rule definitions per norm ─────────────────────────────────────

type RuleFn = (d: AccountData) => {
  status: ComplianceStatus;
  method: VerificationMethod;
  summary: string;
};

function circularRule(d: AccountData): ReturnType<RuleFn> {
  if (d.completedTransactionsCount >= 1 && d.listingsCount >= 1) {
    return {
      status: 'compliant',
      method: 'auto_transaction',
      summary: `${d.completedTransactionsCount} transaction(s) complétée(s), ${d.listingsCount} annonce(s) publiée(s)`,
    };
  }
  if (d.listingsCount >= 1 || d.transactionsCount >= 1) {
    return {
      status: 'partial',
      method: 'auto_transaction',
      summary: `${d.listingsCount} annonce(s), ${d.transactionsCount} transaction(s) en cours`,
    };
  }
  return {
    status: 'not_evaluated',
    method: 'pending',
    summary: 'Publiez une annonce ou réalisez une transaction pour activer',
  };
}

function carbonRule(d: AccountData): ReturnType<RuleFn> {
  if (d.carbonRecordsCount >= 1 && d.hasScopeData) {
    return {
      status: 'compliant',
      method: 'auto_carbon',
      summary: `${d.carbonRecordsCount} bilan(s) carbone calculé(s), ${Math.round(d.totalCo2Avoided / 1000)} t CO₂ évité`,
    };
  }
  if (d.completedTransactionsCount >= 1) {
    return {
      status: 'partial',
      method: 'auto_carbon',
      summary: 'Transactions existantes, bilan carbone en cours de calcul',
    };
  }
  return {
    status: 'not_evaluated',
    method: 'pending',
    summary: 'Complétez une transaction pour générer votre premier bilan carbone',
  };
}

function reportingRule(d: AccountData): ReturnType<RuleFn> {
  if (d.hasEsgReport) {
    return {
      status: 'compliant',
      method: 'auto_esg',
      summary: 'Rapport ESG généré et disponible',
    };
  }
  if (d.hasEsgData) {
    return {
      status: 'partial',
      method: 'auto_esg',
      summary: 'Données ESG saisies, rapport non encore généré',
    };
  }
  if (d.completedTransactionsCount >= 1 || d.carbonRecordsCount >= 1) {
    return {
      status: 'partial',
      method: 'auto_platform',
      summary: 'Données auto-collectées depuis vos transactions, complétez le formulaire ESG',
    };
  }
  return {
    status: 'not_evaluated',
    method: 'pending',
    summary: 'Commencez votre rapport ESG via le wizard',
  };
}

function traceabilityRule(d: AccountData): ReturnType<RuleFn> {
  if (d.blockchainRecordsCount >= 1 && d.certificatesCount >= 1) {
    return {
      status: 'compliant',
      method: 'auto_blockchain',
      summary: `${d.blockchainRecordsCount} hash blockchain, ${d.certificatesCount} certificat(s) émis`,
    };
  }
  if (d.blockchainRecordsCount >= 1 || d.certificatesCount >= 1) {
    return {
      status: 'partial',
      method: 'auto_blockchain',
      summary: `${d.blockchainRecordsCount} hash, ${d.certificatesCount} certificat(s)`,
    };
  }
  if (d.completedTransactionsCount >= 1) {
    return {
      status: 'partial',
      method: 'auto_transaction',
      summary: 'Transaction complétée, enregistrement blockchain en attente',
    };
  }
  return {
    status: 'not_evaluated',
    method: 'pending',
    summary: 'Complétez une transaction pour activer la traçabilité blockchain',
  };
}

function dataRule(_d: AccountData): ReturnType<RuleFn> {
  return {
    status: 'partial',
    method: 'auto_platform',
    summary: 'Conformité plateforme assurée, audit externe recommandé pour certification complète',
  };
}

function labelRule(
  d: AccountData,
  overallCompliantCount: number,
  totalNorms: number,
): ReturnType<RuleFn> {
  const pct = totalNorms > 0 ? (overallCompliantCount / totalNorms) * 100 : 0;
  if (pct >= 80) {
    return {
      status: 'compliant',
      method: 'auto_platform',
      summary: `Score de conformité ${Math.round(pct)}% — éligible`,
    };
  }
  if (pct >= 50) {
    return {
      status: 'partial',
      method: 'auto_platform',
      summary: `Score de conformité ${Math.round(pct)}% — en progression`,
    };
  }
  if (d.listingsCount >= 1) {
    return {
      status: 'partial',
      method: 'pending',
      summary: 'Commencez votre parcours de conformité pour devenir éligible',
    };
  }
  return {
    status: 'not_evaluated',
    method: 'pending',
    summary: 'Atteignez 80% de conformité pour devenir éligible',
  };
}

const PILLAR_RULES: Record<string, RuleFn> = {
  circular_economy: circularRule,
  carbon: carbonRule,
  reporting: reportingRule,
  traceability: traceabilityRule,
  data: dataRule,
};

// ── Main engine ──────────────────────────────────────────────────

export async function evaluateAccountCompliance(
  adminClient: SupabaseClient,
  accountId: string,
): Promise<{ results: NormResult[]; score: number }> {
  const data = await fetchAccountData(adminClient, accountId);

  const nonLabelNorms = NORMS_DATABASE.filter((n) => n.pillar !== 'labels');
  const labelNorms = NORMS_DATABASE.filter((n) => n.pillar === 'labels');

  const results: NormResult[] = [];

  for (const norm of nonLabelNorms) {
    const ruleFn = PILLAR_RULES[norm.pillar];
    if (!ruleFn) continue;

    const { status, method, summary } = ruleFn(data);

    results.push({
      norm_id: norm.id,
      status,
      verification_method: method,
      evidence_summary: summary,
      evidence_data: {
        listings: data.listingsCount,
        transactions: data.completedTransactionsCount,
        carbon_records: data.carbonRecordsCount,
        blockchain_records: data.blockchainRecordsCount,
        certificates: data.certificatesCount,
      },
    });
  }

  const compliantCount = results.filter((r) => r.status === 'compliant').length;

  for (const norm of labelNorms) {
    const { status, method, summary } = labelRule(
      data,
      compliantCount,
      nonLabelNorms.length,
    );
    results.push({
      norm_id: norm.id,
      status,
      verification_method: method,
      evidence_summary: summary,
      evidence_data: { compliant_norms: compliantCount, total_norms: nonLabelNorms.length },
    });
  }

  const totalCompliant = results.filter((r) => r.status === 'compliant').length;
  const score = Math.round((totalCompliant / results.length) * 100);

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
