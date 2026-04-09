/**
 * Mock data for the GreenEcoGenius traceability module.
 *
 * All data targets the French industrial recycling sector with realistic
 * company names, cities, material types and CO2 calculations.
 */

import { calculateLotCo2 } from '~/lib/services/carbon-calculator-shared';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MockLot {
  id: string;
  lotId: string;
  materialType: string;
  weightKg: number;
  qualityGrade: string;
  sellerName: string;
  buyerName: string | null;
  source: 'marketplace' | 'collecte' | 'import';
  status:
    | 'created'
    | 'qualified'
    | 'listed'
    | 'sold'
    | 'in_transit'
    | 'delivered'
    | 'certified';
  co2VirginKg: number;
  co2RecycledKg: number;
  co2TransportKg: number;
  co2AvoidedKg: number;
  transportDistanceKm: number;
  transportMode: string;
  dataHash: string;
  blockchainTxHash: string | null;
  blockNumber: number | null;
  certificateNumber: string | null;
  originCity: string;
  destinationCity: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockActivity {
  id: string;
  type:
    | 'lot_created'
    | 'lot_sold'
    | 'lot_in_transit'
    | 'lot_delivered'
    | 'certificate_issued'
    | 'blockchain_recorded';
  lotId: string;
  description: string;
  affectedSections: string[];
  timestamp: string;
}

export interface MockMonthlyData {
  month: string;
  lotsTracked: number;
  co2AvoidedKg: number;
  tonnesRecycled: number;
}

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

const SELLERS = [
  'EcoRecycle SAS',
  'PlastiPro SARL',
  'MetalVert SA',
  'ForetDurable',
  'VerreClair',
  'TextiLoop',
  'PapierCo',
  'BioRecup SAS',
  'AlluCycle SARL',
  'GreenMat SA',
];

const BUYERS = [
  'Renault Circular',
  'Veolia Recyclage',
  'Suez Environnement',
  'Saint-Gobain Recyclage',
  'TotalEnergies Mat',
  'Michelin Durable',
  'Airbus GreenParts',
  'Schneider ReUse',
  'Danone Circulaire',
  'LVMH EcoSource',
];

const MATERIALS = [
  'plastique',
  'metal',
  'aluminium',
  'bois',
  'verre',
  'textile',
  'organique',
  'papier',
] as const;

const CITIES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Toulouse',
  'Nantes',
  'Montpellier',
  'Bordeaux',
  'Lille',
  'Strasbourg',
  'Nimes',
];

const QUALITY_GRADES = ['A+', 'A', 'B+', 'B', 'C'];

const SOURCES: Array<'marketplace' | 'collecte' | 'import'> = [
  'marketplace',
  'collecte',
  'import',
];

const STATUSES: MockLot['status'][] = [
  'created',
  'qualified',
  'listed',
  'sold',
  'in_transit',
  'delivered',
  'certified',
];

// Weighted distribution so later statuses are more common
const STATUS_WEIGHTS: MockLot['status'][] = [
  'created',
  'qualified',
  'qualified',
  'listed',
  'listed',
  'sold',
  'sold',
  'sold',
  'in_transit',
  'in_transit',
  'in_transit',
  'delivered',
  'delivered',
  'delivered',
  'delivered',
  'certified',
  'certified',
  'certified',
  'certified',
  'certified',
];

// ---------------------------------------------------------------------------
// Deterministic pseudo-random helpers (seeded from index)
// ---------------------------------------------------------------------------

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function hexHash(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  const base = Math.abs(h).toString(16).padStart(8, '0');
  // Repeat and trim to 64 hex chars
  return '0x' + (base.repeat(8) + base).slice(0, 64);
}

function txHash(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(37, h) + seed.charCodeAt(i)) | 0;
  }
  const base = Math.abs(h).toString(16).padStart(8, '0');
  return '0x' + (base.repeat(8) + base).slice(0, 64);
}

// ---------------------------------------------------------------------------
// Distance matrix (approximate km between French cities)
// ---------------------------------------------------------------------------

const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  Paris: {
    Lyon: 465,
    Marseille: 775,
    Toulouse: 680,
    Nantes: 385,
    Montpellier: 750,
    Bordeaux: 585,
    Lille: 225,
    Strasbourg: 490,
    Nimes: 710,
  },
  Lyon: {
    Paris: 465,
    Marseille: 315,
    Toulouse: 540,
    Nantes: 690,
    Montpellier: 305,
    Bordeaux: 555,
    Lille: 665,
    Strasbourg: 490,
    Nimes: 250,
  },
  Marseille: {
    Paris: 775,
    Lyon: 315,
    Toulouse: 405,
    Nantes: 1000,
    Montpellier: 170,
    Bordeaux: 645,
    Lille: 1000,
    Strasbourg: 805,
    Nimes: 125,
  },
  Toulouse: {
    Paris: 680,
    Lyon: 540,
    Marseille: 405,
    Nantes: 580,
    Montpellier: 245,
    Bordeaux: 245,
    Lille: 900,
    Strasbourg: 900,
    Nimes: 290,
  },
  Nantes: {
    Paris: 385,
    Lyon: 690,
    Marseille: 1000,
    Toulouse: 580,
    Montpellier: 890,
    Bordeaux: 345,
    Lille: 600,
    Strasbourg: 870,
    Nimes: 860,
  },
  Montpellier: {
    Paris: 750,
    Lyon: 305,
    Marseille: 170,
    Toulouse: 245,
    Nantes: 890,
    Bordeaux: 500,
    Lille: 970,
    Strasbourg: 790,
    Nimes: 55,
  },
  Bordeaux: {
    Paris: 585,
    Lyon: 555,
    Marseille: 645,
    Toulouse: 245,
    Nantes: 345,
    Montpellier: 500,
    Lille: 810,
    Strasbourg: 940,
    Nimes: 560,
  },
  Lille: {
    Paris: 225,
    Lyon: 665,
    Marseille: 1000,
    Toulouse: 900,
    Nantes: 600,
    Montpellier: 970,
    Bordeaux: 810,
    Strasbourg: 530,
    Nimes: 930,
  },
  Strasbourg: {
    Paris: 490,
    Lyon: 490,
    Marseille: 805,
    Toulouse: 900,
    Nantes: 870,
    Montpellier: 790,
    Bordeaux: 940,
    Lille: 530,
    Nimes: 750,
  },
  Nimes: {
    Paris: 710,
    Lyon: 250,
    Marseille: 125,
    Toulouse: 290,
    Nantes: 860,
    Montpellier: 55,
    Bordeaux: 560,
    Lille: 930,
    Strasbourg: 750,
  },
};

function getDistance(a: string, b: string): number {
  return DISTANCE_MATRIX[a]?.[b] ?? 400;
}

// ---------------------------------------------------------------------------
// Generate 30 lots
// ---------------------------------------------------------------------------

function generateLots(): MockLot[] {
  const lots: MockLot[] = [];

  const baseDateMs = new Date('2026-01-05T08:00:00Z').getTime();

  for (let i = 0; i < 30; i++) {
    const rand = seededRandom(i + 42);
    const lotId = `LOT-${String(i + 1).padStart(4, '0')}`;
    const material = pick(MATERIALS, rand);
    const weightKg = Math.round(500 + rand() * 19500); // 500 - 20 000 kg
    const qualityGrade = pick(QUALITY_GRADES, rand);
    const seller = pick(SELLERS, rand);
    const status = pick(STATUS_WEIGHTS, rand);
    const source = pick(SOURCES, rand);

    const originCity = pick(CITIES, rand);
    let destinationCity: string | null = null;
    const statusIndex = STATUSES.indexOf(status);

    if (statusIndex >= 3) {
      // sold or later -> has a destination
      let dest = pick(CITIES, rand);
      while (dest === originCity) {
        dest = pick(CITIES, rand);
      }
      destinationCity = dest;
    }

    const distanceKm = destinationCity
      ? getDistance(originCity, destinationCity)
      : 0;

    const co2 = calculateLotCo2(material, weightKg, distanceKm, 'camion');

    const hasBuyer = statusIndex >= 3;
    const buyer = hasBuyer ? pick(BUYERS, rand) : null;

    const hasBlockchain = statusIndex >= 5; // delivered or certified
    const hasCertificate = status === 'certified';

    const createdOffset = Math.round(rand() * 85) * 24 * 60 * 60 * 1000; // up to ~85 days ago
    const createdAt = new Date(baseDateMs + createdOffset).toISOString();
    const updatedOffset =
      createdOffset + Math.round(rand() * 10) * 24 * 60 * 60 * 1000;
    const updatedAt = new Date(baseDateMs + updatedOffset).toISOString();

    lots.push({
      id: `lot-${i + 1}-${String((rand() * 1e9) | 0).padStart(9, '0')}`,
      lotId,
      materialType: material,
      weightKg,
      qualityGrade,
      sellerName: seller,
      buyerName: buyer,
      source,
      status,
      co2VirginKg: co2.co2Virgin,
      co2RecycledKg: co2.co2Recycled,
      co2TransportKg: co2.co2Transport,
      co2AvoidedKg: co2.co2Avoided,
      transportDistanceKm: distanceKm,
      transportMode: 'camion',
      dataHash: hexHash(`${lotId}-${material}-${weightKg}`),
      blockchainTxHash: hasBlockchain
        ? txHash(`tx-${lotId}-${material}`)
        : null,
      blockNumber: hasBlockchain
        ? 18_000_000 + Math.round(rand() * 500_000)
        : null,
      certificateNumber: hasCertificate
        ? `CERT-FR-${String(2026)}-${String(i + 1).padStart(5, '0')}`
        : null,
      originCity,
      destinationCity,
      createdAt,
      updatedAt,
    });
  }

  return lots;
}

// ---------------------------------------------------------------------------
// Generate 20 activity events over last 30 days
// ---------------------------------------------------------------------------

function generateActivities(lots: MockLot[]): MockActivity[] {
  const activities: MockActivity[] = [];
  const now = new Date('2026-03-30T12:00:00Z').getTime();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  const activityDefs: Array<{
    type: MockActivity['type'];
    descFn: (lot: MockLot) => string;
    sections: string[];
    minStatus: number;
  }> = [
    {
      type: 'lot_created',
      descFn: (l) =>
        `Lot ${l.lotId} cree par ${l.sellerName} (${l.materialType}, ${l.weightKg} kg)`,
      sections: ['inventaire', 'dashboard'],
      minStatus: 0,
    },
    {
      type: 'lot_sold',
      descFn: (l) =>
        `Lot ${l.lotId} vendu a ${l.buyerName ?? 'acheteur inconnu'} pour ${l.weightKg} kg de ${l.materialType}`,
      sections: ['marketplace', 'inventaire', 'dashboard'],
      minStatus: 3,
    },
    {
      type: 'lot_in_transit',
      descFn: (l) =>
        `Lot ${l.lotId} en transit de ${l.originCity} vers ${l.destinationCity ?? 'destination'}`,
      sections: ['transport', 'suivi', 'dashboard'],
      minStatus: 4,
    },
    {
      type: 'lot_delivered',
      descFn: (l) =>
        `Lot ${l.lotId} livre a ${l.destinationCity ?? 'destination'} (${l.weightKg} kg)`,
      sections: ['transport', 'suivi', 'certification', 'dashboard'],
      minStatus: 5,
    },
    {
      type: 'certificate_issued',
      descFn: (l) =>
        `Certificat ${l.certificateNumber ?? 'N/A'} emis pour lot ${l.lotId}`,
      sections: ['certification', 'blockchain', 'dashboard'],
      minStatus: 6,
    },
    {
      type: 'blockchain_recorded',
      descFn: (l) =>
        `Lot ${l.lotId} enregistre sur la blockchain (bloc #${l.blockNumber ?? 0})`,
      sections: ['blockchain', 'certification', 'dashboard'],
      minStatus: 5,
    },
  ];

  const rand = seededRandom(999);

  for (let i = 0; i < 20; i++) {
    const lot = pick(lots, rand);
    const lotStatusIdx = STATUSES.indexOf(lot.status);
    // pick a compatible activity
    const compatibleDefs = activityDefs.filter(
      (d) => d.minStatus <= lotStatusIdx,
    );
    const def = pick(compatibleDefs, rand);

    const timeOffset = Math.round(rand() * thirtyDaysMs);
    const timestamp = new Date(now - timeOffset).toISOString();

    activities.push({
      id: `act-${String(i + 1).padStart(3, '0')}`,
      type: def.type,
      lotId: lot.lotId,
      description: def.descFn(lot),
      affectedSections: def.sections,
      timestamp,
    });
  }

  // Sort newest first
  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return activities;
}

// ---------------------------------------------------------------------------
// Generate 12 months of monthly data (Apr 2025 - Mar 2026)
// ---------------------------------------------------------------------------

function generateMonthlyData(lots: MockLot[]): MockMonthlyData[] {
  const months: MockMonthlyData[] = [];
  const rand = seededRandom(777);

  // Base values that grow over time to show a positive trend
  const baseLotsPerMonth = 15;
  const baseCo2PerMonth = 45_000;
  const baseTonnesPerMonth = 120;

  for (let m = 0; m < 12; m++) {
    const year = m < 9 ? 2025 : 2026;
    const month = m < 9 ? m + 4 : m - 8;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    // Growth factor: ~10% growth trend over the year with some noise
    const growthFactor = 1 + m * 0.08 + (rand() - 0.5) * 0.15;

    months.push({
      month: monthStr,
      lotsTracked: Math.round(baseLotsPerMonth * growthFactor),
      co2AvoidedKg: Math.round(baseCo2PerMonth * growthFactor),
      tonnesRecycled: Math.round(baseTonnesPerMonth * growthFactor * 10) / 10,
    });
  }

  return months;
}

// ---------------------------------------------------------------------------
// Cached data (generated once)
// ---------------------------------------------------------------------------

let _lots: MockLot[] | null = null;
let _activities: MockActivity[] | null = null;
let _monthlyData: MockMonthlyData[] | null = null;

function getLots(): MockLot[] {
  if (!_lots) _lots = generateLots();
  return _lots;
}

function getActivities(): MockActivity[] {
  if (!_activities) _activities = generateActivities(getLots());
  return _activities;
}

function getMonthlyDataCached(): MockMonthlyData[] {
  if (!_monthlyData) _monthlyData = generateMonthlyData(getLots());
  return _monthlyData;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface TotalStats {
  totalLots: number;
  totalWeightKg: number;
  totalCo2AvoidedKg: number;
  totalCo2VirginKg: number;
  totalCo2RecycledKg: number;
  totalCo2TransportKg: number;
  certifiedLots: number;
  blockchainRecorded: number;
  avgQualityScore: number;
  uniqueSellers: number;
  uniqueBuyers: number;
  uniqueMaterials: number;
}

/**
 * Aggregated statistics across all lots.
 */
export function getTotalStats(): TotalStats {
  const lots = getLots();

  const qualityMap: Record<string, number> = {
    'A+': 5,
    A: 4,
    'B+': 3,
    B: 2,
    C: 1,
  };

  const sellers = new Set(lots.map((l) => l.sellerName));
  const buyers = new Set(
    lots.filter((l) => l.buyerName).map((l) => l.buyerName!),
  );
  const materials = new Set(lots.map((l) => l.materialType));

  return {
    totalLots: lots.length,
    totalWeightKg: lots.reduce((s, l) => s + l.weightKg, 0),
    totalCo2AvoidedKg: lots.reduce((s, l) => s + l.co2AvoidedKg, 0),
    totalCo2VirginKg: lots.reduce((s, l) => s + l.co2VirginKg, 0),
    totalCo2RecycledKg: lots.reduce((s, l) => s + l.co2RecycledKg, 0),
    totalCo2TransportKg: lots.reduce((s, l) => s + l.co2TransportKg, 0),
    certifiedLots: lots.filter((l) => l.status === 'certified').length,
    blockchainRecorded: lots.filter((l) => l.blockchainTxHash !== null).length,
    avgQualityScore:
      Math.round(
        (lots.reduce((s, l) => s + (qualityMap[l.qualityGrade] ?? 2), 0) /
          lots.length) *
          100,
      ) / 100,
    uniqueSellers: sellers.size,
    uniqueBuyers: buyers.size,
    uniqueMaterials: materials.size,
  };
}

export interface MaterialBreakdown {
  material: string;
  lotCount: number;
  totalWeightKg: number;
  totalCo2AvoidedKg: number;
  avgWeightKg: number;
  percentage: number;
}

/**
 * Breakdown of lots by material type.
 */
export function getMaterialBreakdown(): MaterialBreakdown[] {
  const lots = getLots();
  const map = new Map<string, { count: number; weight: number; co2: number }>();

  for (const lot of lots) {
    const entry = map.get(lot.materialType) ?? { count: 0, weight: 0, co2: 0 };
    entry.count++;
    entry.weight += lot.weightKg;
    entry.co2 += lot.co2AvoidedKg;
    map.set(lot.materialType, entry);
  }

  const totalWeight = lots.reduce((s, l) => s + l.weightKg, 0);

  return Array.from(map.entries())
    .map(([material, data]) => ({
      material,
      lotCount: data.count,
      totalWeightKg: data.weight,
      totalCo2AvoidedKg: Math.round(data.co2 * 100) / 100,
      avgWeightKg: Math.round(data.weight / data.count),
      percentage: Math.round((data.weight / totalWeight) * 10000) / 100,
    }))
    .sort((a, b) => b.totalWeightKg - a.totalWeightKg);
}

/**
 * Get monthly data for charts.
 */
export function getMonthlyData(): MockMonthlyData[] {
  return getMonthlyDataCached();
}

/**
 * Get recent activity events.
 */
export function getRecentActivity(limit: number = 20): MockActivity[] {
  return getActivities().slice(0, limit);
}

/**
 * Get all mock lots.
 */
export function getAllLots(): MockLot[] {
  return getLots();
}

/**
 * Get a single lot by lotId.
 */
export function getLotById(lotId: string): MockLot | undefined {
  return getLots().find((l) => l.lotId === lotId);
}

/**
 * Get lots filtered by status.
 */
export function getLotsByStatus(status: MockLot['status']): MockLot[] {
  return getLots().filter((l) => l.status === status);
}

/**
 * Get lots filtered by material type.
 */
export function getLotsByMaterial(material: string): MockLot[] {
  return getLots().filter((l) => l.materialType === material);
}

/**
 * Status distribution across all lots.
 */
export function getStatusDistribution(): Record<string, number> {
  const lots = getLots();
  const dist: Record<string, number> = {};
  for (const lot of lots) {
    dist[lot.status] = (dist[lot.status] ?? 0) + 1;
  }
  return dist;
}
