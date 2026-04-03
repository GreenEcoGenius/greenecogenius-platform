import {
  BarChart3,
  Beaker,
  Boxes,
  Factory,
  Leaf,
  Recycle,
  Shirt,
  Wine,
} from 'lucide-react';

export type Zone = 'france' | 'europe' | 'usa';

export type CategorySlug =
  | 'plastique'
  | 'metal'
  | 'papier'
  | 'verre'
  | 'bois'
  | 'textile'
  | 'organique'
  | 'mineral';

export const CATEGORY_META: Record<
  CategorySlug,
  { icon: typeof Recycle; color: string; bgColor: string }
> = {
  plastique: {
    icon: Boxes,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  metal: {
    icon: Factory,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
  },
  papier: {
    icon: BarChart3,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
  verre: {
    icon: Wine,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  bois: {
    icon: Leaf,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
  },
  textile: {
    icon: Shirt,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  organique: {
    icon: Recycle,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
  },
  mineral: {
    icon: Beaker,
    color: 'text-stone-600',
    bgColor: 'bg-stone-50',
  },
};

export const VALID_CATEGORIES = Object.keys(CATEGORY_META) as CategorySlug[];

export const REGIONS = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Hauts-de-France',
  'Grand Est',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Provence-Alpes-Côte d\'Azur',
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

export function formatVolume(tonnes: number): string {
  if (tonnes >= 1_000_000) {
    const m = tonnes / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)} M`;
  }
  if (tonnes >= 1_000) {
    const k = tonnes / 1_000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)} K`;
  }
  return tonnes.toFixed(0);
}

export function formatPrice(min: number, max: number): string {
  return `${min.toLocaleString('fr-FR')}–${max.toLocaleString('fr-FR')} €/t`;
}

export interface NationalStat {
  category: string;
  total_volume_tonnes: number;
  nb_regions: number;
  nb_sources: number;
  avg_price_min: number;
  avg_price_max: number;
  co2_potential_tonnes: number;
  recycling_rate: number;
  trend_12m: number;
}

export interface RegionStat {
  region: string;
  category: string;
  total_volume_tonnes: number;
  nb_sources: number;
  avg_price_per_tonne: number;
  co2_potential_tonnes: number;
  year: number;
}

export interface CountryStat {
  country_code: string;
  country_name: string;
  category: string;
  tonnage_tonnes: number;
  percentage: number;
  data_year: number;
}

export function aggregateCountryStats(
  rows: CountryStat[],
): NationalStat[] {
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

export const CATEGORY_SUBTYPES: Partial<
  Record<CategorySlug, { name: string; volume: string; price: string; trend: string }[]>
> = {
  plastique: [
    { name: 'PET (bouteilles)', volume: '850 Kt/an', price: '350–600 €/t', trend: '+12%' },
    { name: 'PEHD (flacons)', volume: '420 Kt/an', price: '300–500 €/t', trend: '+5%' },
    { name: 'PP (emballages)', volume: '380 Kt/an', price: '200–400 €/t', trend: 'stable' },
    { name: 'PS (polystyrène)', volume: '210 Kt/an', price: '150–300 €/t', trend: '-3%' },
    { name: 'ABS (technique)', volume: '95 Kt/an', price: '400–800 €/t', trend: '+8%' },
  ],
  metal: [
    { name: 'Fer et acier', volume: '3.8 Mt/an', price: '200–400 €/t', trend: '+1%' },
    { name: 'Aluminium', volume: '780 Kt/an', price: '800–2 000 €/t', trend: '+3%' },
    { name: 'Cuivre', volume: '320 Kt/an', price: '4 000–8 000 €/t', trend: '+2%' },
    { name: 'Inox', volume: '210 Kt/an', price: '600–1 200 €/t', trend: '+4%' },
  ],
  papier: [
    { name: 'Carton ondulé', volume: '3.2 Mt/an', price: '50–100 €/t', trend: '-1%' },
    { name: 'Papier bureau', volume: '1.4 Mt/an', price: '80–120 €/t', trend: '-2%' },
    { name: 'Journaux/magazines', volume: '1.1 Mt/an', price: '30–60 €/t', trend: '-5%' },
    { name: 'Emballages mixtes', volume: '1.4 Mt/an', price: '40–80 €/t', trend: '+1%' },
  ],
  verre: [
    { name: 'Verre creux (bouteilles)', volume: '2.5 Mt/an', price: '25–50 €/t', trend: '+1%' },
    { name: 'Verre plat (vitrage)', volume: '600 Kt/an', price: '30–60 €/t', trend: '+2%' },
    { name: 'Verre technique', volume: '300 Kt/an', price: '40–80 €/t', trend: 'stable' },
  ],
  textile: [
    { name: 'Vêtements', volume: '400 Kt/an', price: '150–400 €/t', trend: '+10%' },
    { name: 'Linge de maison', volume: '120 Kt/an', price: '100–300 €/t', trend: '+6%' },
    { name: 'Textiles industriels', volume: '180 Kt/an', price: '80–250 €/t', trend: '+8%' },
    { name: 'Chaussures', volume: '100 Kt/an', price: '50–150 €/t', trend: '+5%' },
  ],
};
