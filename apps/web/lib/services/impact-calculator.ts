/**
 * Transaction Impact Calculator.
 *
 * Pure, framework-agnostic. Given a material + volume, produces the full
 * environmental impact (CO₂, water, energy, raw material), visual
 * equivalences, the list of norms touched, and the expected score gain.
 *
 * Sources cited per factor come from lib/config/co2-factors.ts (ADEME v23).
 */

import {
  CO2_AVOIDED_FACTORS,
  normalizeMaterialCategory,
  type CO2Factor,
} from '~/lib/config/co2-factors';

export interface NormImpact {
  norm_id: string;
  norm_name: string;
  pillar: string;
  impact: string;
  field: string;
}

export interface ImpactEquivalences {
  /** Round-trip Paris — New York flights (~2 tCO₂e each) */
  flights_paris_ny: number;
  /** Average French cars driven for a year (~4.6 tCO₂e/year) */
  cars_per_year: number;
  /** Mature trees needed to absorb the CO₂ for one year (~22 kgCO₂/year) */
  trees_needed: number;
  /** French households' annual electricity consumption (~4 700 kWh/year) */
  households_electricity: number;
  /** Olympic-ish swimming pools of water (~60 000 L each) */
  swimming_pools_water: number;
}

export interface TransactionImpact {
  // Inputs
  material: string;
  volume_tonnes: number;

  // Quantified impact
  co2_avoided_tonnes: number;
  co2_avoided_kg: number;
  water_saved_liters: number;
  energy_saved_kwh: number;
  raw_material_saved_tonnes: number;
  raw_material_type: string;

  // Visual equivalences
  equivalences: ImpactEquivalences;

  // Norms reflected by this transaction
  norms_impacted: NormImpact[];

  // Scoring (optional — only set when currentScore is provided)
  score_before: number | null;
  score_after: number | null;
  score_gain: number;

  // Methodology
  source: string;
  methodology: string;
  environmental_significance: number;
}

/**
 * Compute the score gain contributed by one transaction. Scaled by volume and
 * by the category's environmental significance, capped so a single lot cannot
 * move the needle more than ~3 points.
 */
function computeScoreGain(factor: CO2Factor, volumeTonnes: number): number {
  const base = factor.environmental_significance * 0.1; // 0.3 — 1.0
  const volumeBoost = Math.log10(Math.max(volumeTonnes, 0.1) + 1); // soft curve
  return Math.round(Math.min(3, base * (1 + volumeBoost)) * 10) / 10;
}

function computeNormsImpacted(
  material: string,
  volumeTonnes: number,
  co2Tonnes: number,
): NormImpact[] {
  const vol = volumeTonnes.toFixed(2);
  const co2 = co2Tonnes.toFixed(2);

  return [
    {
      norm_id: 'ghg-protocol',
      norm_name: 'GHG Protocol',
      pillar: 'Carbone & Environnement',
      impact: `+${co2} tCO₂e comptabilisees en emissions evitees (Scope 3 aval)`,
      field: 'scope_3_downstream_avoided',
    },
    {
      norm_id: 'loi-agec',
      norm_name: 'Loi AGEC',
      pillar: 'Economie circulaire',
      impact: `+${vol} t de matieres tracees et valorisees`,
      field: 'volume_valorise',
    },
    {
      norm_id: 'rep-elargie',
      norm_name: 'REP elargie',
      pillar: 'Economie circulaire',
      impact: `Filiere ${material} — obligation producteur documentee`,
      field: 'rep_filiere',
    },
    {
      norm_id: 'iso-14001',
      norm_name: 'ISO 14001',
      pillar: 'Economie circulaire',
      impact: 'Action de management environnemental enregistree (cycle PDCA)',
      field: 'environmental_action',
    },
    {
      norm_id: 'iso-59020',
      norm_name: 'ISO 59020',
      pillar: 'Economie circulaire',
      impact: `Indicateur de circularite : +${vol} t recyclees`,
      field: 'circularity_indicator',
    },
    {
      norm_id: 'csrd',
      norm_name: 'CSRD (ESRS E5)',
      pillar: 'Reporting ESG',
      impact: `ESRS E5 — utilisation des ressources : +${vol} t, CO₂ evite : +${co2} t`,
      field: 'esrs_e5',
    },
    {
      norm_id: 'taxonomie-circulaire',
      norm_name: 'Taxonomie EU (Obj. 4)',
      pillar: 'Reporting ESG',
      impact: "Activite alignee sur l'objectif 4 : economie circulaire",
      field: 'taxonomy_obj4',
    },
    {
      norm_id: 'dpp',
      norm_name: 'DPP — Passeport Produit Numerique',
      pillar: 'Tracabilite',
      impact: 'Donnees produit ancrees sur blockchain',
      field: 'dpp_entry',
    },
  ];
}

export function calculateTransactionImpact(
  material: string,
  volumeTonnes: number,
  currentScore: number | null = null,
): TransactionImpact {
  const key = normalizeMaterialCategory(material);
  const factor = key ? CO2_AVOIDED_FACTORS[key] : undefined;

  if (!factor) {
    throw new Error(
      `Categorie matiere inconnue: "${material}". Ajoutez-la dans CO2_AVOIDED_FACTORS.`,
    );
  }

  const co2Tonnes = volumeTonnes * factor.co2_avoided_per_tonne;
  const water = volumeTonnes * factor.water_saved_per_tonne;
  const energy = volumeTonnes * factor.energy_saved_per_tonne;
  const raw = volumeTonnes * factor.raw_material_saved_per_tonne;

  const equivalences: ImpactEquivalences = {
    flights_paris_ny: Math.round((co2Tonnes / 2.0) * 10) / 10,
    cars_per_year: Math.round((co2Tonnes / 4.6) * 10) / 10,
    trees_needed: Math.round((co2Tonnes * 1000) / 22),
    households_electricity: Math.round((energy / 4700) * 10) / 10,
    swimming_pools_water: Math.round((water / 60000) * 10) / 10,
  };

  const scoreGain = computeScoreGain(factor, volumeTonnes);

  return {
    material: factor.category,
    volume_tonnes: volumeTonnes,

    co2_avoided_tonnes: co2Tonnes,
    co2_avoided_kg: co2Tonnes * 1000,
    water_saved_liters: water,
    energy_saved_kwh: energy,
    raw_material_saved_tonnes: raw,
    raw_material_type: factor.raw_material_type,

    equivalences,

    norms_impacted: computeNormsImpacted(factor.category, volumeTonnes, co2Tonnes),

    score_before: currentScore,
    score_after:
      currentScore !== null ? Math.min(100, currentScore + scoreGain) : null,
    score_gain: scoreGain,

    source: factor.source,
    methodology: factor.methodology,
    environmental_significance: factor.environmental_significance,
  };
}
