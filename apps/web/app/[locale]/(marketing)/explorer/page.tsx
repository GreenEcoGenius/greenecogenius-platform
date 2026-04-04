export const dynamic = 'force-dynamic';

import { Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from '../_components/animate-on-scroll';

import { DataSourceBadge } from './_components/data-source-badge';
import { ExplorerContent } from './_components/explorer-content';
import {
  cleanSource,
  type CountryStat,
  type NationalStat,
  type RegionStat,
} from './_components/explorer-data';
import { PublicCTA } from './_components/public-cta';
import { SourcesDisclaimer } from './_components/sources-disclaimer';
import { getPublicSupabaseClient } from './_lib/public-client';

const EU_COUNTRY_NAMES: Record<string, string> = {
  AT: 'Autriche', BE: 'Belgique', BG: 'Bulgarie', CY: 'Chypre',
  CZ: 'Tchéquie', DE: 'Allemagne', DK: 'Danemark', EE: 'Estonie',
  EL: 'Grèce', ES: 'Espagne', FI: 'Finlande', FR: 'France',
  HR: 'Croatie', HU: 'Hongrie', IE: 'Irlande', IT: 'Italie',
  LT: 'Lituanie', LU: 'Luxembourg', LV: 'Lettonie', MT: 'Malte',
  NL: 'Pays-Bas', NO: 'Norvège', PL: 'Pologne', PT: 'Portugal',
  RO: 'Roumanie', SE: 'Suède', SI: 'Slovénie', SK: 'Slovaquie',
};

/**
 * Aggregate national rows by category — takes the max volume per source
 * to avoid double-counting when both ADEME and Eurostat have data.
 */
function aggregateByCategory(
  rows: NationalStat[],
): NationalStat[] {
  const byCategory = new Map<string, NationalStat>();

  for (const row of rows) {
    const existing = byCategory.get(row.category);
    if (!existing || row.annual_volume_tonnes > existing.annual_volume_tonnes) {
      byCategory.set(row.category, row);
    }
  }

  return Array.from(byCategory.values()).sort(
    (a, b) => b.annual_volume_tonnes - a.annual_volume_tonnes,
  );
}

export async function generateMetadata() {
  const t = await getTranslations('marketing');
  return {
    title: t('explorer.metaTitle'),
    description: t('explorer.metaDesc'),
  };
}

function toNationalStat(s: Record<string, unknown>): NationalStat {
  return {
    category: s.category as string,
    annual_volume_tonnes: Number(s.annual_volume_tonnes ?? 0),
    recycling_rate: Number(s.recycling_rate ?? 0),
    recovery_rate: Number(s.recovery_rate ?? 0),
    avg_price_per_tonne: Number(s.avg_price_per_tonne ?? 0),
    price_currency: (s.price_currency as string) ?? 'EUR',
    data_source: cleanSource((s.data_source as string) ?? ''),
    year: (s.year as number) ?? 2024,
    country_code: s.country_code as string,
  };
}

export default async function ExplorerPage() {
  const t = await getTranslations('marketing');
  const client = getPublicSupabaseClient();

  const [natResult, regionResult] = await Promise.all([
    client
      .from('material_stats_national')
      .select('*')
      .order('annual_volume_tonnes', { ascending: false }),
    client
      .from('material_stats_by_region')
      .select('*')
      .eq('country', 'France'),
  ]);

  if (natResult.error)
    console.error('[Explorer] national error:', natResult.error);
  if (regionResult.error)
    console.error('[Explorer] region error:', regionResult.error);

  const allNational = (natResult.data ?? []).map(toNationalStat);

  // France: aggregate duplicates (ADEME + Eurostat) → keep max per category
  const franceStats = aggregateByCategory(
    allNational.filter((s) => s.country_code === 'FR'),
  );

  // France region rows
  const franceRegionRows: RegionStat[] = (regionResult.data ?? []).map(
    (r: Record<string, unknown>) => ({
      region: r.region as string,
      category: r.category as string,
      annual_volume_tonnes: Number(r.annual_volume_tonnes ?? 0),
      recycling_rate: Number(r.recycling_rate ?? 0),
      recovery_rate: Number(r.recovery_rate ?? 0),
      avg_price_per_tonne: Number(r.avg_price_per_tonne ?? 0),
      data_source: cleanSource((r.data_source as string) ?? ''),
      year: (r.year as number) ?? 2024,
      country: 'France',
    }),
  );

  // USA: aggregate duplicates
  const usaStats = aggregateByCategory(
    allNational.filter((s) => s.country_code === 'US'),
  );

  // Europe: all non-FR, non-US → aggregate by category
  const euNational = allNational.filter(
    (s) => s.country_code !== 'US' && s.country_code !== 'FR',
  );

  const euByCategory = new Map<
    string,
    { volume: number; recyclingSum: number; priceSum: number; count: number }
  >();
  for (const s of euNational) {
    const existing = euByCategory.get(s.category) ?? {
      volume: 0, recyclingSum: 0, priceSum: 0, count: 0,
    };
    existing.volume += s.annual_volume_tonnes;
    if (s.recycling_rate > 0) {
      existing.recyclingSum += s.recycling_rate;
      existing.count += 1;
    }
    if (s.avg_price_per_tonne > 0) {
      existing.priceSum += s.avg_price_per_tonne;
    }
    euByCategory.set(s.category, existing);
  }

  const europeStats: NationalStat[] = Array.from(euByCategory.entries())
    .map(([category, agg]) => ({
      category,
      annual_volume_tonnes: agg.volume,
      recycling_rate: agg.count > 0 ? Math.round((agg.recyclingSum / agg.count) * 10) / 10 : 0,
      recovery_rate: 0,
      avg_price_per_tonne: agg.count > 0 ? Math.round(agg.priceSum / agg.count) : 0,
      price_currency: 'EUR',
      data_source: 'Eurostat',
      year: 2024,
      country_code: 'EU',
    }))
    .sort((a, b) => b.annual_volume_tonnes - a.annual_volume_tonnes);

  // Europe country rows for the map
  const europeCountryRows: CountryStat[] = euNational.map((s) => ({
    country_code: s.country_code,
    country_name: EU_COUNTRY_NAMES[s.country_code] ?? s.country_code,
    category: s.category,
    tonnage_tonnes: s.annual_volume_tonnes,
    percentage: 0,
    data_year: s.year,
  }));

  return (
    <div>
      {/* Hero */}
      <section className="bg-metal-50 relative overflow-hidden py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="bg-primary-light text-primary mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              {t('explorer.badge')}
            </div>
            <h1 className="text-metal-900 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('explorer.heroTitle')}
            </h1>
            <p className="text-metal-600 mx-auto mt-4 max-w-2xl text-lg">
              {t('explorer.heroSubtitle')}
            </p>
            <div className="mt-4">
              <DataSourceBadge />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <ExplorerContent
        franceStats={franceStats}
        europeStats={europeStats}
        usaStats={usaStats}
        franceRegionRows={franceRegionRows}
        europeCountryRows={europeCountryRows}
      />

      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <PublicCTA />
          </AnimateOnScroll>
        </div>
      </section>

      <SourcesDisclaimer />
    </div>
  );
}
