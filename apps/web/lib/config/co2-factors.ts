/**
 * CO₂ avoided factors by recyclable material category.
 *
 * These factors represent emissions avoided by using recycled material
 * instead of virgin material. Source: Base Carbone ADEME v23.
 *
 * Used by:
 * - Comptoir Circulaire (CO₂ per transaction)
 * - Impact Carbone (CO₂ avoided dashboard)
 * - Blockchain certificates (certified CO₂)
 * - ESG reports (E5 indicators)
 * - Compliance engine (evaluation)
 */

export interface CO2Factor {
  category: string;
  factor: number; // tCO₂e avoided per tonne recycled
  source: string;
  methodology: string;
  year: number;
}

export const CO2_AVOIDED_FACTORS: Record<string, CO2Factor> = {
  'Papier-Carton': {
    category: 'Papier-Carton',
    factor: 0.96,
    source: 'Base Carbone ADEME v23',
    methodology: 'Emissions evitees : production recycle vs vierge',
    year: 2023,
  },
  Plastiques: {
    category: 'Plastiques',
    factor: 1.53,
    source: 'Base Carbone ADEME v23',
    methodology: 'Moyenne PET/PEHD/PP recycle vs vierge',
    year: 2023,
  },
  Métaux: {
    category: 'Métaux',
    factor: 1.78,
    source: 'Base Carbone ADEME v23',
    methodology: 'Moyenne ferreux/aluminium/cuivre recycle vs vierge',
    year: 2023,
  },
  Verre: {
    category: 'Verre',
    factor: 0.5,
    source: 'Base Carbone ADEME v23',
    methodology: 'Calcin vs verre vierge (sable + soude + calcaire)',
    year: 2023,
  },
  Bois: {
    category: 'Bois',
    factor: 0.42,
    source: 'Base Carbone ADEME v23',
    methodology: 'Bois recycle vs bois exploite + transport',
    year: 2023,
  },
  DEEE: {
    category: 'DEEE',
    factor: 2.1,
    source: 'Base Carbone ADEME v23',
    methodology: 'Recuperation metaux precieux + plastiques vs extraction',
    year: 2023,
  },
  Textiles: {
    category: 'Textiles',
    factor: 3.2,
    source: 'Base Carbone ADEME v23',
    methodology: 'Fibre recyclee vs coton/polyester vierge',
    year: 2023,
  },
  Biodéchets: {
    category: 'Biodéchets',
    factor: 0.23,
    source: 'Base Carbone ADEME v23',
    methodology: 'Compostage/methanisation vs mise en decharge',
    year: 2023,
  },
  BTP: {
    category: 'BTP',
    factor: 0.02,
    source: 'Base Carbone ADEME v23',
    methodology: 'Granulats recycles vs extraction carriere',
    year: 2023,
  },
};

/**
 * Calculate CO₂ avoided for a given material category and volume.
 */
export function calculateCO2Avoided(
  category: string,
  volumeTonnes: number,
): {
  co2AvoidedKg: number;
  co2AvoidedTonnes: number;
  factor: CO2Factor | null;
} {
  const factor = CO2_AVOIDED_FACTORS[category] ?? null;
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
