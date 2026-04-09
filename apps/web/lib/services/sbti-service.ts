/**
 * SBTi (Science Based Targets initiative) trajectory calculation service.
 *
 * Calculates the required emissions reduction trajectory to align
 * with 1.5C or well-below 2C pathways per SBTi methodology.
 */

export type SBTiPathway = 'well_below_2c' | '1_5c';

export interface TrajectoryYear {
  year: number;
  targetEmissions: number;
  actualEmissions: number | null;
  projectedEmissions: number;
  onTrack: boolean;
}

export interface SBTiTrajectory {
  baseYear: number;
  baseEmissions: number;
  targetYear: number;
  annualReductionRate: number;
  pathway: SBTiPathway;
  years: TrajectoryYear[];
}

/** SBTi annual reduction rates (compound) */
const SBTI_RATES: Record<SBTiPathway, { scope_1_2: number; scope_3: number }> =
  {
    well_below_2c: { scope_1_2: 0.042, scope_3: 0.025 },
    '1_5c': { scope_1_2: 0.042, scope_3: 0.025 },
  };

/**
 * Calculate a SBTi-aligned trajectory from base year to target year.
 *
 * @param baseYear - First year of emissions data
 * @param baseEmissions - Total emissions in base year (tCO2e)
 * @param historicalEmissions - Actual emissions by year (past data)
 * @param pathway - 1.5C or well-below 2C
 * @param targetYear - Target year for near-term target (default 2030)
 */
export function calculateSBTiTrajectory(
  baseYear: number,
  baseEmissions: number,
  historicalEmissions: Record<number, number>,
  pathway: SBTiPathway = '1_5c',
  targetYear: number = 2030,
): SBTiTrajectory {
  const rate = SBTI_RATES[pathway].scope_1_2;
  const years: TrajectoryYear[] = [];

  // Calculate projection slope from historical data
  const historicalYears = Object.keys(historicalEmissions)
    .map(Number)
    .sort();
  let projectionSlope = 0;

  if (historicalYears.length >= 2) {
    const n = historicalYears.length;
    const sumX = historicalYears.reduce((a, b) => a + b, 0);
    const sumY = historicalYears.reduce(
      (a, y) => a + (historicalEmissions[y] ?? 0),
      0,
    );
    const sumXY = historicalYears.reduce(
      (a, y) => a + y * (historicalEmissions[y] ?? 0),
      0,
    );
    const sumX2 = historicalYears.reduce((a, y) => a + y * y, 0);
    const denom = n * sumX2 - sumX * sumX;
    if (denom !== 0) {
      projectionSlope = (n * sumXY - sumX * sumY) / denom;
    }
  }

  const currentYear = new Date().getFullYear();
  const lastKnownYear =
    historicalYears[historicalYears.length - 1] ?? baseYear;
  const lastKnownEmissions =
    historicalEmissions[lastKnownYear] ?? baseEmissions;

  const endYear = Math.max(targetYear, 2050);

  for (let year = baseYear; year <= endYear; year++) {
    const yearsFromBase = year - baseYear;
    const targetEmissions =
      baseEmissions * Math.pow(1 - rate, yearsFromBase);

    const actualEmissions = historicalEmissions[year] ?? null;

    const yearsFromLast = year - lastKnownYear;
    const projectedEmissions =
      year <= lastKnownYear
        ? historicalEmissions[year] ?? baseEmissions
        : Math.max(0, lastKnownEmissions + projectionSlope * yearsFromLast);

    const effectiveEmissions = actualEmissions ?? projectedEmissions;

    years.push({
      year,
      targetEmissions: Math.round(targetEmissions * 10) / 10,
      actualEmissions:
        actualEmissions !== null
          ? Math.round(actualEmissions * 10) / 10
          : null,
      projectedEmissions: Math.round(projectedEmissions * 10) / 10,
      onTrack: effectiveEmissions <= targetEmissions,
    });
  }

  return {
    baseYear,
    baseEmissions,
    targetYear,
    annualReductionRate: rate * 100,
    pathway,
    years,
  };
}

/**
 * Check if the company is on track for its SBTi target.
 */
export function isOnTrack(trajectory: SBTiTrajectory): boolean {
  const currentYear = new Date().getFullYear();
  const currentYearData = trajectory.years.find((y) => y.year === currentYear);
  return currentYearData?.onTrack ?? false;
}

/**
 * Calculate how many years until the company reaches the SBTi target
 * at the current reduction rate.
 */
export function yearsToTarget(trajectory: SBTiTrajectory): number | null {
  const currentYear = new Date().getFullYear();
  for (const year of trajectory.years) {
    if (year.year >= currentYear && year.onTrack) {
      return year.year - currentYear;
    }
  }
  return null;
}
