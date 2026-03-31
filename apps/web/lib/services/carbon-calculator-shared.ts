/**
 * Shared carbon calculator for the GreenEcoGenius traceability module.
 *
 * Emission factors are expressed in kgCO2 per kg of material.
 * Transport factors are expressed in kgCO2 per kg per km.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMISSION_FACTORS: Record<string, { virgin: number; recycled: number }> = {
  plastique: { virgin: 2.3, recycled: 0.5 },
  metal: { virgin: 1.78, recycled: 0.42 },
  aluminium: { virgin: 8.0, recycled: 0.7 },
  bois: { virgin: 0.45, recycled: 0.12 },
  verre: { virgin: 0.85, recycled: 0.35 },
  textile: { virgin: 5.5, recycled: 1.2 },
  organique: { virgin: 0.3, recycled: 0.05 },
  papier: { virgin: 1.1, recycled: 0.35 },
};

const TRANSPORT_FACTORS: Record<string, number> = {
  camion: 0.000062,
  train: 0.000005,
  bateau: 0.000016,
};

// ---------------------------------------------------------------------------
// Material / status visual helpers
// ---------------------------------------------------------------------------

const MATERIAL_COLORS: Record<string, string> = {
  plastique: '#3B82F6', // blue
  metal: '#6B7280', // gray
  aluminium: '#A3A3A3', // silver
  bois: '#92400E', // brown
  verre: '#06B6D4', // cyan
  textile: '#8B5CF6', // violet
  organique: '#22C55E', // green
  papier: '#F59E0B', // amber
};

const STATUS_COLORS: Record<string, string> = {
  created: '#9CA3AF', // gray-400
  qualified: '#60A5FA', // blue-400
  listed: '#A78BFA', // violet-400
  sold: '#FBBF24', // amber-400
  in_transit: '#FB923C', // orange-400
  delivered: '#34D399', // emerald-400
  certified: '#10B981', // emerald-500
};

const STATUS_LABELS: Record<string, string> = {
  created: 'Cree',
  qualified: 'Qualifie',
  listed: 'En vente',
  sold: 'Vendu',
  in_transit: 'En transit',
  delivered: 'Livre',
  certified: 'Certifie',
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface Co2Calculation {
  co2Virgin: number;
  co2Recycled: number;
  co2Transport: number;
  co2Avoided: number;
}

/**
 * Calculate CO2 impact for a given lot.
 *
 * @param material   – material type key (e.g. "plastique")
 * @param weightKg   – weight in kilograms
 * @param distanceKm – transport distance in km
 * @param transportMode – transport mode key (default "camion")
 */
export function calculateLotCo2(
  material: string,
  weightKg: number,
  distanceKm: number,
  transportMode: string = 'camion',
): Co2Calculation {
  const factors = EMISSION_FACTORS[material] ?? { virgin: 1.0, recycled: 0.3 };
  const transportFactor = TRANSPORT_FACTORS[transportMode] ?? TRANSPORT_FACTORS.camion!;

  const co2Virgin = round(weightKg * factors.virgin);
  const co2Recycled = round(weightKg * factors.recycled);
  const co2Transport = round(weightKg * distanceKm * transportFactor);
  const co2Avoided = round(co2Virgin - co2Recycled - co2Transport);

  return { co2Virgin, co2Recycled, co2Transport, co2Avoided };
}

export interface Co2Equivalences {
  /** Kilometres driven by an average car */
  carKm: number;
  /** Number of trees absorbing CO2 for one year */
  trees: number;
  /** Years of average French household heating */
  heatingYears: number;
  /** Number of Paris-New York return flights */
  flights: number;
  /** Number of smartphone charges */
  smartphones: number;
}

/**
 * Convert a CO2 amount (kg) into human-readable equivalences.
 *
 * Reference values (per tonne of CO2):
 *   - 4 230 km driven (avg European car)
 *   - 50 trees absorbing for 1 year
 *   - 0.34 years of household heating
 *   - 2.5 Paris-New York return flights
 *   - 121 951 smartphone charges (8.22 g CO2 per charge)
 */
export function calculateEquivalences(co2Kg: number): Co2Equivalences {
  const tonnes = co2Kg / 1000;

  return {
    carKm: round(tonnes * 4230),
    trees: round(tonnes * 50),
    heatingYears: round(tonnes * 0.34, 2),
    flights: round(tonnes * 2.5, 1),
    smartphones: Math.round(co2Kg / 0.00822),
  };
}

/**
 * Return the display colour (hex) for a material type.
 */
export function getMaterialColor(material: string): string {
  return MATERIAL_COLORS[material] ?? '#6B7280';
}

/**
 * Return the display colour (hex) for a lot status.
 */
export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? '#9CA3AF';
}

/**
 * Return the French label for a lot status.
 */
export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

/**
 * Get the emission factors record (read-only access for UI).
 */
export function getEmissionFactors() {
  return EMISSION_FACTORS;
}

/**
 * Get the transport factors record (read-only access for UI).
 */
export function getTransportFactors() {
  return TRANSPORT_FACTORS;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
