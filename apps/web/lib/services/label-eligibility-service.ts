import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Label eligibility service.
 *
 * Reads the same signals used by the compliance engine (transactions,
 * carbon, blockchain, ESG, RSE, external activities) and derives whether
 * the account is ready to candidate to the main ESG labels / reporting
 * frameworks. Returns a list of actionable statuses instead of a binary.
 */

export interface LabelEligibility {
  id: string;
  label: string;
  organism: string;
  url: string;
  /** 0-100 percentage of requirements covered */
  coverage: number;
  /** True when the account meets the minimum bar to start applying */
  eligible: boolean;
  /** Human-readable next step or explanation */
  message: string;
  /** Checklist of what's already covered */
  criteria_met: string[];
  /** Checklist of what still needs work */
  criteria_missing: string[];
}

interface AggregateData {
  transactions: number;
  tonnesRecycled: number;
  co2Avoided: number;
  hasScope1or2: boolean;
  hasScope3: boolean;
  hasCarbonReport: boolean;
  hasEsgData: boolean;
  hasEsgReport: boolean;
  blockchainRecords: number;
  certificates: number;
  rseScore: number;
  hasRseDiagnostic: boolean;
  externalGovernance: number;
  externalSocial: number;
  externalEnvironment: number;
  externalProcurement: number;
  externalCommunity: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anyClient = (c: SupabaseClient) => c as any;

async function fetchAggregateData(
  client: SupabaseClient,
  accountId: string,
): Promise<AggregateData> {
  const [
    txRes,
    carbonRes,
    blockchainListingIds,
    certRes,
    esgDataRes,
    esgReportRes,
    kpiRes,
    extRes,
  ] = await Promise.all([
    anyClient(client)
      .from('marketplace_transactions')
      .select('*', { count: 'exact', head: true })
      .or(`seller_account_id.eq.${accountId},buyer_account_id.eq.${accountId}`)
      .in('status', ['delivered', 'completed', 'funds_released']),
    anyClient(client)
      .from('carbon_records')
      .select('co2_avoided, weight_kg, scope')
      .eq('account_id', accountId),
    anyClient(client).from('listings').select('id').eq('account_id', accountId),
    anyClient(client)
      .from('traceability_certificates')
      .select('*', { count: 'exact', head: true })
      .eq('issued_to_account_id', accountId),
    anyClient(client)
      .from('org_esg_data')
      .select('submitted_at, scope1_natural_gas_kwh, scope2_electricity_kwh, scope3_business_travel_km')
      .eq('account_id', accountId),
    anyClient(client)
      .from('esg_reports')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId),
    anyClient(client)
      .from('org_sustainability_kpis')
      .select('transactions_count')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
      .limit(1),
    anyClient(client)
      .from('external_activities')
      .select('category')
      .eq('account_id', accountId),
  ]);

  const carbonRows: Array<{
    co2_avoided?: number;
    weight_kg?: number;
    scope?: number;
  }> = carbonRes.data ?? [];
  const co2Avoided = carbonRows.reduce(
    (s, r) => s + Number(r.co2_avoided ?? 0),
    0,
  );
  const tonnesRecycled =
    carbonRows.reduce((s, r) => s + Number(r.weight_kg ?? 0), 0) / 1000;

  let blockchainRecords = 0;
  const listingIds = (blockchainListingIds.data ?? []).map(
    (l: { id: string }) => l.id,
  );
  if (listingIds.length > 0) {
    const { count } = await anyClient(client)
      .from('blockchain_records')
      .select('*', { count: 'exact', head: true })
      .in('listing_id', listingIds);
    blockchainRecords = count ?? 0;
  }

  const esgRows: Array<{
    submitted_at: string | null;
    scope1_natural_gas_kwh: number | null;
    scope2_electricity_kwh: number | null;
    scope3_business_travel_km: number | null;
  }> = esgDataRes.data ?? [];
  const hasEsgData = esgRows.some(
    (r) =>
      r.submitted_at ||
      Number(r.scope1_natural_gas_kwh ?? 0) > 0 ||
      Number(r.scope2_electricity_kwh ?? 0) > 0 ||
      Number(r.scope3_business_travel_km ?? 0) > 0,
  );
  const hasScope1or2 = esgRows.some(
    (r) =>
      Number(r.scope1_natural_gas_kwh ?? 0) > 0 ||
      Number(r.scope2_electricity_kwh ?? 0) > 0,
  );
  const hasScope3 = esgRows.some(
    (r) => Number(r.scope3_business_travel_km ?? 0) > 0,
  );

  const kpiRow = (kpiRes.data ?? [])[0];
  const rseScore = kpiRow
    ? Math.min(100, Math.round((kpiRow.transactions_count ?? 0) * 10))
    : 0;

  const extRows: Array<{ category: string }> = extRes.data ?? [];
  const extCounts = {
    governance: 0,
    social: 0,
    environment: 0,
    procurement: 0,
    community: 0,
  };
  for (const r of extRows) {
    if (r.category in extCounts) {
      extCounts[r.category as keyof typeof extCounts]++;
    }
  }

  return {
    transactions: txRes.count ?? 0,
    tonnesRecycled,
    co2Avoided,
    hasScope1or2,
    hasScope3,
    hasCarbonReport: carbonRows.length > 0,
    hasEsgData,
    hasEsgReport: (esgReportRes.count ?? 0) > 0,
    blockchainRecords,
    certificates: certRes.count ?? 0,
    rseScore,
    hasRseDiagnostic: Boolean(kpiRow),
    externalGovernance: extCounts.governance,
    externalSocial: extCounts.social,
    externalEnvironment: extCounts.environment,
    externalProcurement: extCounts.procurement,
    externalCommunity: extCounts.community,
  };
}

function pct(n: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((n / total) * 100));
}

function buildLabels(d: AggregateData): LabelEligibility[] {
  // B Corp — 5 impact areas, each a criterion
  const bCorpMet: string[] = [];
  const bCorpMissing: string[] = [];
  (d.externalGovernance >= 1 ? bCorpMet : bCorpMissing).push(
    'Gouvernance (composition CA, anti-corruption, code de conduite)',
  );
  (d.externalSocial >= 1 ? bCorpMet : bCorpMissing).push(
    'Travailleurs (effectifs, formation, diversite)',
  );
  (d.externalCommunity >= 1 ? bCorpMet : bCorpMissing).push(
    'Communaute (mecenat, benevolat, partenariats)',
  );
  (d.externalEnvironment >= 1 || d.hasCarbonReport
    ? bCorpMet
    : bCorpMissing
  ).push('Environnement (empreinte mesuree ou actions documentees)');
  (d.transactions >= 1 || d.co2Avoided > 0 ? bCorpMet : bCorpMissing).push(
    'Impact client (transactions tracees ou CO₂ evite)',
  );
  const bCorpCoverage = pct(bCorpMet.length, 5);

  // Label Bas-Carbone — requires a measured carbon footprint + reduction path
  const lbcMet: string[] = [];
  const lbcMissing: string[] = [];
  (d.hasCarbonReport ? lbcMet : lbcMissing).push(
    'Bilan carbone realise (Scope 1/2/3)',
  );
  (d.hasScope1or2 ? lbcMet : lbcMissing).push('Scopes 1 & 2 renseignes');
  (d.hasScope3 ? lbcMet : lbcMissing).push('Scope 3 renseigne');
  (d.co2Avoided > 0 ? lbcMet : lbcMissing).push('Emissions evitees mesurables');

  // SBTi — requires Scope 1/2 at minimum, Scope 3 for ambition
  const sbtiMet: string[] = [];
  const sbtiMissing: string[] = [];
  (d.hasScope1or2 ? sbtiMet : sbtiMissing).push('Scopes 1 & 2 couverts');
  (d.hasScope3 ? sbtiMet : sbtiMissing).push('Scope 3 couvert');
  (d.hasCarbonReport ? sbtiMet : sbtiMissing).push('Bilan carbone a jour');

  // Label Lucie (ISO 26000) — 7 sujets centraux
  const lucieMet: string[] = [];
  const lucieMissing: string[] = [];
  (d.externalGovernance >= 1 ? lucieMet : lucieMissing).push('Gouvernance');
  (d.externalSocial >= 1 ? lucieMet : lucieMissing).push(
    "Droits de l'Homme & relations de travail",
  );
  (d.hasCarbonReport || d.externalEnvironment >= 1
    ? lucieMet
    : lucieMissing
  ).push('Environnement');
  (d.externalProcurement >= 1 ? lucieMet : lucieMissing).push(
    'Loyaute des pratiques (achats)',
  );
  (d.transactions >= 1 ? lucieMet : lucieMissing).push('Consommateurs');
  (d.externalCommunity >= 1 ? lucieMet : lucieMissing).push('Communautes');
  const lucieCoverage = pct(lucieMet.length, 6);

  // EcoVadis — 4 themes: environnement, social, ethique, achats
  const ecoMet: string[] = [];
  const ecoMissing: string[] = [];
  (d.hasCarbonReport || d.externalEnvironment >= 1 ? ecoMet : ecoMissing).push(
    'Environnement',
  );
  (d.externalSocial >= 1 ? ecoMet : ecoMissing).push('Social & droits humains');
  (d.externalGovernance >= 1 ? ecoMet : ecoMissing).push(
    'Ethique (anti-corruption, gouvernance)',
  );
  (d.externalProcurement >= 1 ? ecoMet : ecoMissing).push(
    'Achats responsables',
  );
  const ecoCoverage = pct(ecoMet.length, 4);

  // CDP — carbon questionnaire
  const cdpMet: string[] = [];
  const cdpMissing: string[] = [];
  (d.hasScope1or2 ? cdpMet : cdpMissing).push('Scopes 1 & 2');
  (d.hasScope3 ? cdpMet : cdpMissing).push('Scope 3 (recommande)');
  (d.hasEsgReport ? cdpMet : cdpMissing).push('Rapport ESG publie');

  return [
    {
      id: 'b-corp',
      label: 'B Corp',
      organism: 'B Lab',
      url: 'https://www.bcorporation.net',
      coverage: bCorpCoverage,
      eligible: bCorpCoverage >= 80 && d.rseScore >= 80,
      message:
        bCorpCoverage >= 80
          ? 'Pret a candidater sur le BIA (Business Impact Assessment).'
          : `${bCorpCoverage}% des piliers couverts — completez les donnees manquantes pour candidater.`,
      criteria_met: bCorpMet,
      criteria_missing: bCorpMissing,
    },
    {
      id: 'label-bas-carbone',
      label: 'Label Bas-Carbone',
      organism: 'Ministere de la Transition Ecologique',
      url: 'https://label-bas-carbone.ecologie.gouv.fr',
      coverage: pct(lbcMet.length, 4),
      eligible: d.hasCarbonReport && d.hasScope1or2 && d.co2Avoided > 0,
      message:
        d.hasCarbonReport && d.hasScope1or2
          ? 'Le projet peut etre depose, sous reserve de methodologie validee.'
          : 'Completez le bilan carbone avec Scopes 1 & 2 pour deposer un projet.',
      criteria_met: lbcMet,
      criteria_missing: lbcMissing,
    },
    {
      id: 'sbti',
      label: 'SBTi — Science Based Targets',
      organism: 'Science Based Targets initiative',
      url: 'https://sciencebasedtargets.org',
      coverage: pct(sbtiMet.length, 3),
      eligible: d.hasScope1or2 && d.hasCarbonReport,
      message:
        d.hasScope1or2 && d.hasScope3
          ? 'Vous pouvez soumettre une trajectoire alignee 1.5°C.'
          : !d.hasScope1or2
            ? 'Commencez par renseigner vos Scopes 1 & 2.'
            : 'Ajoutez le Scope 3 pour une trajectoire Net Zero credible.',
      criteria_met: sbtiMet,
      criteria_missing: sbtiMissing,
    },
    {
      id: 'lucie-26000',
      label: 'Label Lucie 26000',
      organism: 'Agence Lucie / AFNOR',
      url: 'https://agence-lucie.com',
      coverage: lucieCoverage,
      eligible: lucieCoverage >= 80 && d.rseScore >= 70,
      message:
        lucieCoverage >= 80
          ? 'Dossier de candidature Lucie pret a etre constitue.'
          : `${lucieMet.length}/6 sujets centraux ISO 26000 couverts.`,
      criteria_met: lucieMet,
      criteria_missing: lucieMissing,
    },
    {
      id: 'ecovadis',
      label: 'EcoVadis',
      organism: 'EcoVadis',
      url: 'https://ecovadis.com',
      coverage: ecoCoverage,
      eligible: ecoCoverage >= 75,
      message:
        ecoCoverage >= 75
          ? "Donnees suffisantes pour repondre au questionnaire EcoVadis."
          : `${ecoMet.length}/4 themes EcoVadis couverts.`,
      criteria_met: ecoMet,
      criteria_missing: ecoMissing,
    },
    {
      id: 'cdp',
      label: 'CDP — Carbon Disclosure Project',
      organism: 'CDP Worldwide',
      url: 'https://www.cdp.net',
      coverage: pct(cdpMet.length, 3),
      eligible: d.hasScope1or2,
      message: d.hasScope1or2
        ? 'Vous pouvez repondre au questionnaire Climat CDP.'
        : 'Completez les Scopes 1 & 2 pour repondre au CDP.',
      criteria_met: cdpMet,
      criteria_missing: cdpMissing,
    },
    {
      id: 'greentech-innovation',
      label: 'GreenTech Innovation',
      organism: 'Ecolab / Ministere',
      url: 'https://greentechinnovation.fr',
      coverage: d.transactions >= 5 && d.co2Avoided > 0 ? 100 : 50,
      eligible: d.transactions >= 5 && d.co2Avoided > 0,
      message:
        d.transactions >= 5 && d.co2Avoided > 0
          ? "Candidature possible au prochain Appel a Manifestation d'Interet."
          : 'Poursuivez les transactions pour solidifier votre dossier GreenTech.',
      criteria_met: [],
      criteria_missing: [],
    },
  ];
}

export class LabelEligibilityService {
  static async compute(
    client: SupabaseClient,
    accountId: string,
  ): Promise<LabelEligibility[]> {
    const data = await fetchAggregateData(client, accountId);
    return buildLabels(data);
  }
}
