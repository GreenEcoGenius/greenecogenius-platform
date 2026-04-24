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
    color: 'text-[#00A86B]',
    bgColor: 'bg-[#E6F7EF]',
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
    color: 'text-verdure-700',
    bgColor: 'bg-verdure-50',
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

/* ── Source label cleanup ── */

export function cleanSource(raw: string): string {
  if (!raw) return 'ADEME';
  if (raw.startsWith('ADEME')) return 'ADEME/SINOE';
  if (raw.startsWith('Eurostat')) return 'Eurostat';
  if (raw.startsWith('EPA')) return 'EPA';
  if (raw.startsWith('Federec') || raw.startsWith('FEDEREC')) return 'FEDEREC';
  return raw;
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

export function formatPrice(value: number | null, currency?: string): string {
  if (!value) return '—';
  const symbol = currency === 'USD' ? '$' : '€';
  return `${value.toLocaleString('fr-FR')} ${symbol}/t`;
}

export function formatRate(value: number | null): string {
  if (value === null || value === undefined) return '—';
  return `${Number(value).toFixed(1)}%`;
}

/* ── Types matching PRODUCTION Supabase schema ── */

/** material_stats_national row */
export interface NationalStat {
  category: string;
  annual_volume_tonnes: number;
  recycling_rate: number;
  recovery_rate: number;
  avg_price_per_tonne: number;
  price_currency: string;
  data_source: string;
  year: number;
  country_code: string;
}

/** material_stats_by_region row */
export interface RegionStat {
  region: string;
  category: string;
  annual_volume_tonnes: number;
  recycling_rate: number;
  recovery_rate: number;
  avg_price_per_tonne: number;
  data_source: string;
  year: number;
  country: string;
}

/** material_stats_by_country row */
export interface CountryStat {
  country_code: string;
  country_name: string;
  category: string;
  tonnage_tonnes: number;
  percentage: number;
  data_year: number;
}

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
      annual_volume_tonnes: agg.volume,
      recycling_rate: 0,
      recovery_rate: 0,
      avg_price_per_tonne: 0,
      price_currency: 'EUR',
      data_source: 'Eurostat',
      year: 2022,
      country_code: 'EU',
    }))
    .sort((a, b) => b.annual_volume_tonnes - a.annual_volume_tonnes);
}
