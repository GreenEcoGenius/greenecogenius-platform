import { Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { AnimateOnScroll } from '../_components/animate-on-scroll';

import { DataSourceBadge } from './_components/data-source-badge';
import { ExplorerContent } from './_components/explorer-content';
import {
  aggregateCountryStats,
  type CountryStat,
  type NationalStat,
} from './_components/explorer-data';
import { PublicCTA } from './_components/public-cta';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: t('explorer.metaTitle'),
    description: t('explorer.metaDesc'),
  };
}

export default async function ExplorerPage() {
  const t = await getTranslations('marketing');
  const client = getSupabaseServerClient();

  const [
    { data: nationalRows },
    { data: regionRows },
    { data: countryRows },
  ] = await Promise.all([
    client
      .from('material_stats_national')
      .select('*')
      .order('total_volume_tonnes', { ascending: false }),
    client.from('material_stats_by_region').select('*'),
    client.from('material_stats_by_country').select('*'),
  ]);

  const franceStats: NationalStat[] = (nationalRows ?? []).map((s) => ({
    category: s.category,
    total_volume_tonnes: Number(s.total_volume_tonnes),
    nb_regions: s.nb_regions ?? 0,
    nb_sources: s.nb_sources ?? 0,
    avg_price_min: Number(s.avg_price_min),
    avg_price_max: Number(s.avg_price_max),
    co2_potential_tonnes: Number(s.co2_potential_tonnes),
    recycling_rate: Number(s.recycling_rate),
    trend_12m: Number(s.trend_12m),
  }));

  const allCountries: CountryStat[] = (countryRows ?? []).map((r) => ({
    country_code: r.country_code,
    country_name: r.country_name,
    category: r.category,
    tonnage_tonnes: Number(r.tonnage_tonnes),
    percentage: Number(r.percentage),
    data_year: r.data_year,
  }));

  const euRows = allCountries.filter((r) => r.country_code !== 'US');
  const usRows = allCountries.filter((r) => r.country_code === 'US');

  const europeStats = aggregateCountryStats(euRows);
  const usaStats: NationalStat[] = usRows.map((r) => ({
    category: r.category,
    total_volume_tonnes: r.tonnage_tonnes,
    nb_regions: 1,
    nb_sources: 0,
    avg_price_min: 0,
    avg_price_max: 0,
    co2_potential_tonnes: 0,
    recycling_rate: 0,
    trend_12m: 0,
  })).sort((a, b) => b.total_volume_tonnes - a.total_volume_tonnes);

  const franceRegionRows = (regionRows ?? []).map((r) => ({
    region: r.region as string,
    category: r.category as string,
    total_volume_tonnes: Number(r.total_volume_tonnes),
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

      {/* Dynamic zone content */}
      <ExplorerContent
        franceStats={franceStats}
        europeStats={europeStats}
        usaStats={usaStats}
        franceRegionRows={franceRegionRows}
        europeCountryRows={euRows}
      />

      {/* CTA */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <PublicCTA />
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
