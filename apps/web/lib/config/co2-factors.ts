/**
 * Environmental impact factors by recyclable material category.
 *
 * Each factor represents the impact AVOIDED by using recycled material
 * instead of virgin material, across four dimensions:
 *   - CO₂ (tCO₂e / tonne)
 *   - Water (litres / tonne)
 *   - Energy (kWh / tonne)
 *   - Raw material (tonnes of virgin feedstock avoided / tonne recycled)
 *
 * Sources: Base Carbone ADEME v23, Eco-Emballages, ADEME sectorial studies.
 *
 * Used by:
 * - Comptoir Circulaire (per-transaction impact)
 * - Impact Carbone (avoided emissions dashboard)
 * - Blockchain certificates (certified impact on-chain)
 * - ESG reports (ESRS E5 indicators)
 * - Compliance engine (norm evaluation + label eligibility)
 */

export interface CO2Factor {
  category: string;
  /** tCO₂e avoided per tonne recycled (kept for backwards compatibility) */
  factor: number;
  /** tCO₂e avoided per tonne recycled (alias of `factor`) */
  co2_avoided_per_tonne: number;
  /** Litres of water saved per tonne recycled */
  water_saved_per_tonne: number;
  /** kWh of energy saved per tonne recycled */
  energy_saved_per_tonne: number;
  /** Tonnes of virgin raw material not extracted per tonne recycled */
  raw_material_saved_per_tonne: number;
  /** Human-readable name of the virgin feedstock avoided */
  raw_material_type: string;
  /** 1-10 relative environmental significance of recycling this category */
  environmental_significance: number;
  source: string;
  methodology: string;
  year: number;
}

export const CO2_AVOIDED_FACTORS: Record<string, CO2Factor> = {
  'Papier-Carton': {
    category: 'Papier-Carton',
    factor: 0.96,
    co2_avoided_per_tonne: 0.96,
    water_saved_per_tonne: 26000,
    energy_saved_per_tonne: 4000,
    raw_material_saved_per_tonne: 2.2,
    raw_material_type: 'Bois (arbres)',
    environmental_significance: 6,
    source: 'Base Carbone ADEME v23',
    methodology: 'Emissions evitees : production recyclee vs vierge',
    year: 2023,
  },
  Plastiques: {
    category: 'Plastiques',
    factor: 1.53,
    co2_avoided_per_tonne: 1.53,
    water_saved_per_tonne: 17000,
    energy_saved_per_tonne: 5500,
    raw_material_saved_per_tonne: 1.8,
    raw_material_type: 'Petrole brut',
    environmental_significance: 9,
    source: 'Base Carbone ADEME v23 + Eco-Emballages',
    methodology: 'Moyenne PET/PEHD/PP recycle vs vierge',
    year: 2023,
  },
  Métaux: {
    category: 'Métaux',
    factor: 1.78,
    co2_avoided_per_tonne: 1.78,
    water_saved_per_tonne: 40000,
    energy_saved_per_tonne: 14000,
    raw_material_saved_per_tonne: 4.0,
    raw_material_type: 'Minerai (fer, bauxite, cuivre)',
    environmental_significance: 8,
    source: 'Base Carbone ADEME v23',
    methodology: 'Moyenne ferreux/aluminium/cuivre recycle vs vierge',
    year: 2023,
  },
  Verre: {
    category: 'Verre',
    factor: 0.5,
    co2_avoided_per_tonne: 0.5,
    water_saved_per_tonne: 3000,
    energy_saved_per_tonne: 1200,
    raw_material_saved_per_tonne: 1.2,
    raw_material_type: 'Sable + soude + calcaire',
    environmental_significance: 4,
    source: 'Base Carbone ADEME v23',
    methodology: 'Calcin vs verre vierge (sable + soude + calcaire)',
    year: 2023,
  },
  Bois: {
    category: 'Bois',
    factor: 0.42,
    co2_avoided_per_tonne: 0.42,
    water_saved_per_tonne: 5000,
    energy_saved_per_tonne: 1500,
    raw_material_saved_per_tonne: 1.0,
    raw_material_type: 'Bois exploite',
    environmental_significance: 5,
    source: 'Base Carbone ADEME v23',
    methodology: 'Bois recycle vs bois exploite + transport',
    year: 2023,
  },
  DEEE: {
    category: 'DEEE',
    factor: 2.1,
    co2_avoided_per_tonne: 2.1,
    water_saved_per_tonne: 25000,
    energy_saved_per_tonne: 9000,
    raw_material_saved_per_tonne: 3.0,
    raw_material_type: 'Metaux rares + plastiques',
    environmental_significance: 9,
    source: 'Base Carbone ADEME v23',
    methodology: 'Recuperation metaux precieux + plastiques vs extraction',
    year: 2023,
  },
  Textiles: {
    category: 'Textiles',
    factor: 3.2,
    co2_avoided_per_tonne: 3.2,
    water_saved_per_tonne: 20000,
    energy_saved_per_tonne: 8000,
    raw_material_saved_per_tonne: 2.5,
    raw_material_type: 'Coton / polyester vierge',
    environmental_significance: 8,
    source: 'Base Carbone ADEME v23',
    methodology: 'Fibre recyclee vs coton/polyester vierge',
    year: 2023,
  },
  Biodéchets: {
    category: 'Biodéchets',
    factor: 0.23,
    co2_avoided_per_tonne: 0.23,
    water_saved_per_tonne: 1000,
    energy_saved_per_tonne: 400,
    raw_material_saved_per_tonne: 0.5,
    raw_material_type: 'Engrais chimiques (via compost)',
    environmental_significance: 5,
    source: 'Base Carbone ADEME v23',
    methodology: 'Compostage/methanisation vs mise en decharge',
    year: 2023,
  },
  BTP: {
    category: 'BTP',
    factor: 0.02,
    co2_avoided_per_tonne: 0.02,
    water_saved_per_tonne: 200,
    energy_saved_per_tonne: 50,
    raw_material_saved_per_tonne: 0.9,
    raw_material_type: 'Granulats naturels (carriere)',
    environmental_significance: 3,
    source: 'Base Carbone ADEME v23',
    methodology: 'Granulats recycles vs extraction carriere',
    year: 2023,
  },
};

/**
 * Normalise user-provided category labels (case / accents / aliases) to the
 * canonical keys used in CO2_AVOIDED_FACTORS.
 */
export function normalizeMaterialCategory(input: string): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (CO2_AVOIDED_FACTORS[raw]) return raw;

  const lower = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const aliases: Record<string, string> = {
    plastique: 'Plastiques',
    plastiques: 'Plastiques',
    plastic: 'Plastiques',
    metal: 'Métaux',
    metaux: 'Métaux',
    metals: 'Métaux',
    aluminium: 'Métaux',
    acier: 'Métaux',
    cuivre: 'Métaux',
    papier: 'Papier-Carton',
    carton: 'Papier-Carton',
    'papier-carton': 'Papier-Carton',
    'papier/carton': 'Papier-Carton',
    verre: 'Verre',
    glass: 'Verre',
    bois: 'Bois',
    wood: 'Bois',
    deee: 'DEEE',
    electronique: 'DEEE',
    textile: 'Textiles',
    textiles: 'Textiles',
    biodechets: 'Biodéchets',
    organique: 'Biodéchets',
    compost: 'Biodéchets',
    btp: 'BTP',
    beton: 'BTP',
    gravats: 'BTP',
  };

  return aliases[lower] ?? null;
}

/**
 * Calculate CO₂ avoided for a given material category and volume.
 * Kept for backwards compatibility — prefer calculateTransactionImpact.
 */
export function calculateCO2Avoided(
  category: string,
  volumeTonnes: number,
): {
  co2AvoidedKg: number;
  co2AvoidedTonnes: number;
  factor: CO2Factor | null;
} {
  const key = normalizeMaterialCategory(category) ?? category;
  const factor = CO2_AVOIDED_FACTORS[key] ?? null;
  if (!factor) {
    return { co2AvoidedKg: 0, co2AvoidedTonnes: 0, factor: null };
  }
  const co2AvoidedTonnes = volumeTonnes * factor.factor;
  return {
    co2AvoidedKg: co2AvoidedTonnes * 1000,
    co2AvoidedTonnes,
    factor,
  };
}
