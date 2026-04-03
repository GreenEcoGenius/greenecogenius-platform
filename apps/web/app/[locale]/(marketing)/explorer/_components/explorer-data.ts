import {
  BarChart3,
  Beaker,
  Boxes,
  Cpu,
  Factory,
  Leaf,
  Recycle,
  Shirt,
  Wine,
} from 'lucide-react';

export type Zone = 'france' | 'europe' | 'usa';

/* ── DB category slugs (as stored in Supabase) ↔ display labels ── */

export const DB_TO_DISPLAY: Record<string, string> = {
  plastique: 'Plastiques',
  metal: 'Métaux',
  papier: 'Papier-Carton',
  verre: 'Verre',
  bois: 'Bois',
  deee: 'DEEE',
  textile: 'Textiles',
  organique: 'Biodéchets',
  mineral: 'BTP',
};

export const DISPLAY_TO_DB: Record<string, string> = Object.fromEntries(
  Object.entries(DB_TO_DISPLAY).map(([db, display]) => [display, db]),
);

export function displayCategory(dbCategory: string): string {
  return DB_TO_DISPLAY[dbCategory] ?? dbCategory;
}

export function dbCategory(displayName: string): string {
  return DISPLAY_TO_DB[displayName] ?? displayName;
}

/* ── Category metadata for UI ── */

export const CATEGORY_META: Record<
  string,
  { icon: typeof Recycle; color: string; bgColor: string; slug: string }
> = {
  Plastiques: {
    icon: Boxes,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    slug: 'plastiques',
  },
  Métaux: {
    icon: Factory,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    slug: 'metaux',
  },
  'Papier-Carton': {
    icon: BarChart3,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    slug: 'papier-carton',
  },
  Verre: {
    icon: Wine,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    slug: 'verre',
  },
  Bois: {
    icon: Leaf,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    slug: 'bois',
  },
  DEEE: {
    icon: Cpu,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    slug: 'deee',
  },
  Textiles: {
    icon: Shirt,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    slug: 'textiles',
  },
  Biodéchets: {
    icon: Recycle,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    slug: 'biodechets',
  },
  BTP: {
    icon: Beaker,
    color: 'text-stone-600',
    bgColor: 'bg-stone-50',
    slug: 'btp',
  },
};

export const VALID_CATEGORIES = Object.keys(CATEGORY_META);

export function categoryFromSlug(slug: string): string | undefined {
  return Object.entries(CATEGORY_META).find(
    ([, meta]) => meta.slug === slug,
  )?.[0];
}

export function slugFromCategory(category: string): string {
  return CATEGORY_META[category]?.slug ?? category.toLowerCase();
}

/* ── Regions ── */

export const REGIONS = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Hauts-de-France',
  'Grand Est',
  'Nouvelle-Aquitaine',
  'Occitanie',
  "Provence-Alpes-Côte d'Azur",
  'Pays de la Loire',
  'Normandie',
  'Bretagne',
  'Bourgogne-Franche-Comté',
  'Centre-Val de Loire',
  'Corse',
] as const;

export function regionToSlug(region: string): string {
  return region
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export function regionFromSlug(slug: string): string | undefined {
  return REGIONS.find((r) => regionToSlug(r) === slug);
}

/* ── Formatting ── */

export function formatVolume(tonnes: number): string {
  if (tonnes >= 1_000_000) {
    const m = tonnes / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)} Mt`;
  }
  if (tonnes >= 1_000) {
    const k = tonnes / 1_000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(0)} kt`;
  }
  return `${Math.round(tonnes)} t`;
}

export function formatPrice(value: number | null): string {
  if (!value) return '—';
  return `${value.toLocaleString('fr-FR')} €/t`;
}

export function formatPriceRange(
  min: number | null,
  max: number | null,
): string {
  if (!min && !max) return '—';
  if (min && max)
    return `${min.toLocaleString('fr-FR')}–${max.toLocaleString('fr-FR')} €/t`;
  return formatPrice(min ?? max);
}

export function formatRate(value: number | null): string {
  if (value === null || value === undefined) return '—';
  return `${Number(value).toFixed(1)}%`;
}

/* ── Types matching ACTUAL Supabase schema ── */

/** material_stats_national row */
export interface NationalStat {
  category: string; // display name (mapped from DB)
  total_volume_tonnes: number;
  nb_regions: number;
  nb_sources: number;
  avg_price_min: number;
  avg_price_max: number;
  co2_potential_tonnes: number;
  recycling_rate: number;
  trend_12m: number;
}

/** material_stats_by_region row */
export interface RegionStat {
  region: string;
  category: string; // display name (mapped from DB)
  total_volume_tonnes: number;
  nb_sources: number;
  avg_price_per_tonne: number;
  co2_potential_tonnes: number;
  year: number;
}

/** Static data for Europe/USA display (no DB table) */
export interface CountryStat {
  country_code: string;
  country_name: string;
  category: string;
  tonnage_tonnes: number;
  percentage: number;
  data_year: number;
}

/* ── Static Europe/USA data (no DB tables for these yet) ── */

export const EUROPE_COUNTRY_DATA: CountryStat[] = [
  {
    country_code: 'DE',
    country_name: 'Allemagne',
    category: 'Plastiques',
    tonnage_tonnes: 6_300_000,
    percentage: 17.2,
    data_year: 2022,
  },
  {
    country_code: 'DE',
    country_name: 'Allemagne',
    category: 'Papier-Carton',
    tonnage_tonnes: 15_800_000,
    percentage: 20.1,
    data_year: 2022,
  },
  {
    country_code: 'DE',
    country_name: 'Allemagne',
    category: 'Métaux',
    tonnage_tonnes: 10_200_000,
    percentage: 15.8,
    data_year: 2022,
  },
  {
    country_code: 'DE',
    country_name: 'Allemagne',
    category: 'Verre',
    tonnage_tonnes: 3_100_000,
    percentage: 14.5,
    data_year: 2022,
  },
  {
    country_code: 'FR',
    country_name: 'France',
    category: 'Plastiques',
    tonnage_tonnes: 3_200_000,
    percentage: 8.7,
    data_year: 2022,
  },
  {
    country_code: 'FR',
    country_name: 'France',
    category: 'Papier-Carton',
    tonnage_tonnes: 7_100_000,
    percentage: 9.0,
    data_year: 2022,
  },
  {
    country_code: 'FR',
    country_name: 'France',
    category: 'Métaux',
    tonnage_tonnes: 5_800_000,
    percentage: 9.0,
    data_year: 2022,
  },
  {
    country_code: 'FR',
    country_name: 'France',
    category: 'Verre',
    tonnage_tonnes: 3_400_000,
    percentage: 15.9,
    data_year: 2022,
  },
  {
    country_code: 'IT',
    country_name: 'Italie',
    category: 'Plastiques',
    tonnage_tonnes: 3_700_000,
    percentage: 10.1,
    data_year: 2022,
  },
  {
    country_code: 'IT',
    country_name: 'Italie',
    category: 'Papier-Carton',
    tonnage_tonnes: 6_200_000,
    percentage: 7.9,
    data_year: 2022,
  },
  {
    country_code: 'IT',
    country_name: 'Italie',
    category: 'Métaux',
    tonnage_tonnes: 4_500_000,
    percentage: 7.0,
    data_year: 2022,
  },
  {
    country_code: 'ES',
    country_name: 'Espagne',
    category: 'Plastiques',
    tonnage_tonnes: 2_800_000,
    percentage: 7.6,
    data_year: 2022,
  },
  {
    country_code: 'ES',
    country_name: 'Espagne',
    category: 'Papier-Carton',
    tonnage_tonnes: 4_900_000,
    percentage: 6.2,
    data_year: 2022,
  },
  {
    country_code: 'PL',
    country_name: 'Pologne',
    category: 'Plastiques',
    tonnage_tonnes: 2_400_000,
    percentage: 6.5,
    data_year: 2022,
  },
  {
    country_code: 'NL',
    country_name: 'Pays-Bas',
    category: 'Plastiques',
    tonnage_tonnes: 1_600_000,
    percentage: 4.4,
    data_year: 2022,
  },
  {
    country_code: 'BE',
    country_name: 'Belgique',
    category: 'Plastiques',
    tonnage_tonnes: 1_100_000,
    percentage: 3.0,
    data_year: 2022,
  },
  {
    country_code: 'AT',
    country_name: 'Autriche',
    category: 'Plastiques',
    tonnage_tonnes: 900_000,
    percentage: 2.5,
    data_year: 2022,
  },
  {
    country_code: 'SE',
    country_name: 'Suède',
    category: 'Plastiques',
    tonnage_tonnes: 800_000,
    percentage: 2.2,
    data_year: 2022,
  },
  {
    country_code: 'PT',
    country_name: 'Portugal',
    category: 'Plastiques',
    tonnage_tonnes: 700_000,
    percentage: 1.9,
    data_year: 2022,
  },
  {
    country_code: 'CZ',
    country_name: 'Tchéquie',
    category: 'Plastiques',
    tonnage_tonnes: 650_000,
    percentage: 1.8,
    data_year: 2022,
  },
  {
    country_code: 'RO',
    country_name: 'Roumanie',
    category: 'Plastiques',
    tonnage_tonnes: 600_000,
    percentage: 1.6,
    data_year: 2022,
  },
  {
    country_code: 'DK',
    country_name: 'Danemark',
    category: 'Plastiques',
    tonnage_tonnes: 500_000,
    percentage: 1.4,
    data_year: 2022,
  },
  {
    country_code: 'FI',
    country_name: 'Finlande',
    category: 'Plastiques',
    tonnage_tonnes: 450_000,
    percentage: 1.2,
    data_year: 2022,
  },
  {
    country_code: 'IE',
    country_name: 'Irlande',
    category: 'Plastiques',
    tonnage_tonnes: 350_000,
    percentage: 1.0,
    data_year: 2022,
  },
  {
    country_code: 'HU',
    country_name: 'Hongrie',
    category: 'Plastiques',
    tonnage_tonnes: 500_000,
    percentage: 1.4,
    data_year: 2022,
  },
  {
    country_code: 'GR',
    country_name: 'Grèce',
    category: 'Plastiques',
    tonnage_tonnes: 550_000,
    percentage: 1.5,
    data_year: 2022,
  },
  {
    country_code: 'BG',
    country_name: 'Bulgarie',
    category: 'Plastiques',
    tonnage_tonnes: 400_000,
    percentage: 1.1,
    data_year: 2022,
  },
  {
    country_code: 'SK',
    country_name: 'Slovaquie',
    category: 'Plastiques',
    tonnage_tonnes: 300_000,
    percentage: 0.8,
    data_year: 2022,
  },
  {
    country_code: 'HR',
    country_name: 'Croatie',
    category: 'Plastiques',
    tonnage_tonnes: 200_000,
    percentage: 0.5,
    data_year: 2022,
  },
  {
    country_code: 'SI',
    country_name: 'Slovénie',
    category: 'Plastiques',
    tonnage_tonnes: 150_000,
    percentage: 0.4,
    data_year: 2022,
  },
  {
    country_code: 'LT',
    country_name: 'Lituanie',
    category: 'Plastiques',
    tonnage_tonnes: 180_000,
    percentage: 0.5,
    data_year: 2022,
  },
  {
    country_code: 'LV',
    country_name: 'Lettonie',
    category: 'Plastiques',
    tonnage_tonnes: 120_000,
    percentage: 0.3,
    data_year: 2022,
  },
  {
    country_code: 'EE',
    country_name: 'Estonie',
    category: 'Plastiques',
    tonnage_tonnes: 100_000,
    percentage: 0.3,
    data_year: 2022,
  },
  {
    country_code: 'LU',
    country_name: 'Luxembourg',
    category: 'Plastiques',
    tonnage_tonnes: 60_000,
    percentage: 0.2,
    data_year: 2022,
  },
  {
    country_code: 'CY',
    country_name: 'Chypre',
    category: 'Plastiques',
    tonnage_tonnes: 50_000,
    percentage: 0.1,
    data_year: 2022,
  },
  {
    country_code: 'MT',
    country_name: 'Malte',
    category: 'Plastiques',
    tonnage_tonnes: 30_000,
    percentage: 0.1,
    data_year: 2022,
  },
];

export const USA_STATS: NationalStat[] = [
  {
    category: 'Plastiques',
    total_volume_tonnes: 35_700_000,
    nb_regions: 50,
    nb_sources: 0,
    avg_price_min: 100,
    avg_price_max: 600,
    co2_potential_tonnes: 64_260_000,
    recycling_rate: 5.0,
    trend_12m: -1.2,
  },
  {
    category: 'Papier-Carton',
    total_volume_tonnes: 67_400_000,
    nb_regions: 50,
    nb_sources: 0,
    avg_price_min: 20,
    avg_price_max: 100,
    co2_potential_tonnes: 50_550_000,
    recycling_rate: 68.0,
    trend_12m: 0.5,
  },
  {
    category: 'Métaux',
    total_volume_tonnes: 18_900_000,
    nb_regions: 50,
    nb_sources: 0,
    avg_price_min: 150,
    avg_price_max: 1200,
    co2_potential_tonnes: 25_704_000,
    recycling_rate: 34.0,
    trend_12m: 2.1,
  },
  {
    category: 'Verre',
    total_volume_tonnes: 12_300_000,
    nb_regions: 50,
    nb_sources: 0,
    avg_price_min: 15,
    avg_price_max: 50,
    co2_potential_tonnes: 6_150_000,
    recycling_rate: 31.0,
    trend_12m: 0.8,
  },
  {
    category: 'Bois',
    total_volume_tonnes: 19_800_000,
    nb_regions: 50,
    nb_sources: 0,
    avg_price_min: 20,
    avg_price_max: 120,
    co2_potential_tonnes: 6_534_000,
    recycling_rate: 17.0,
    trend_12m: 3.0,
  },
  {
    category: 'Textiles',
    total_volume_tonnes: 17_000_000,
    nb_regions: 50,
    nb_sources: 0,
    avg_price_min: 80,
    avg_price_max: 400,
    co2_potential_tonnes: 73_100_000,
    recycling_rate: 15.0,
    trend_12m: 5.0,
  },
  {
    category: 'Biodéchets',
    total_volume_tonnes: 63_100_000,
    nb_regions: 50,
    nb_sources: 0,
    avg_price_min: 5,
    avg_price_max: 60,
    co2_potential_tonnes: 15_775_000,
    recycling_rate: 6.0,
    trend_12m: 8.0,
  },
  {
    category: 'BTP',
    total_volume_tonnes: 600_000_000,
    nb_regions: 50,
    nb_sources: 0,
    avg_price_min: 3,
    avg_price_max: 30,
    co2_potential_tonnes: 30_000_000,
    recycling_rate: 40.0,
    trend_12m: 1.5,
  },
];

export function aggregateCountryStats(rows: CountryStat[]): NationalStat[] {
  const byCategory = new Map<
    string,
    { volume: number; countries: Set<string> }
  >();

  for (const r of rows) {
    const existing = byCategory.get(r.category) ?? {
      volume: 0,
      countries: new Set<string>(),
    };
    existing.volume += r.tonnage_tonnes;
    existing.countries.add(r.country_code);
    byCategory.set(r.category, existing);
  }

  return Array.from(byCategory.entries())
    .map(([category, agg]) => ({
      category,
      total_volume_tonnes: agg.volume,
      nb_regions: agg.countries.size,
      nb_sources: 0,
      avg_price_min: 0,
      avg_price_max: 0,
      co2_potential_tonnes: 0,
      recycling_rate: 0,
      trend_12m: 0,
    }))
    .sort((a, b) => b.total_volume_tonnes - a.total_volume_tonnes);
}
