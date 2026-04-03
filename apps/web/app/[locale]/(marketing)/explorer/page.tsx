export const dynamic = 'force-dynamic';

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
  type RegionStat,
} from './_components/explorer-data';
import { PublicCTA } from './_components/public-cta';
import { SourcesDisclaimer } from './_components/sources-disclaimer';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: t('explorer.metaTitle'),
    description: t('explorer.metaDesc'),
  };
}

export default async function ExplorerPage() {
  const t = await getTranslations('marketing');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = getSupabaseServerClient() as any;

  const [natResult, regionResult, countryResult] = await Promise.all([
    client
      .from('material_stats_national')
      .select('*')
      .eq('country_code', 'FR')
      .order('annual_volume_tonnes', { ascending: false }),
    client.from('material_stats_by_region').select('*').eq('country', 'FR'),
    client.from('material_stats_by_country').select('*'),
  ]);

  if (natResult.error) console.error('[Explorer] national error:', natResult.error);
  if (regionResult.error) console.error('[Explorer] region error:', regionResult.error);
  if (countryResult.error) console.error('[Explorer] country error:', countryResult.error);

  const nationalRows = natResult.data;
  const regionRows = regionResult.data;
  const countryRows = countryResult.data;

  const franceStats: NationalStat[] = (nationalRows ?? []).map(
    (s: Record<string, unknown>) => ({
      category: s.category as string,
      annual_volume_tonnes: Number(s.annual_volume_tonnes ?? 0),
      recycling_rate: Number(s.recycling_rate ?? 0),
      recovery_rate: Number(s.recovery_rate ?? 0),
      avg_price_per_tonne: Number(s.avg_price_per_tonne ?? 0),
      data_source: (s.data_source as string) ?? 'ADEME',
      year: (s.year as number) ?? 2024,
      country_code: 'FR',
    }),
  );

  const franceRegionRows: RegionStat[] = (regionRows ?? []).map(
    (r: Record<string, unknown>) => ({
      region: r.region as string,
      category: r.category as string,
      annual_volume_tonnes: Number(r.annual_volume_tonnes ?? 0),
      recycling_rate: Number(r.recycling_rate ?? 0),
      recovery_rate: Number(r.recovery_rate ?? 0),
      avg_price_per_tonne: Number(r.avg_price_per_tonne ?? 0),
      data_source: (r.data_source as string) ?? 'ADEME',
      year: (r.year as number) ?? 2024,
      country: 'FR',
    }),
  );

  const allCountries: CountryStat[] = (countryRows ?? []).map(
    (r: Record<string, unknown>) => ({
      country_code: r.country_code as string,
      country_name: r.country_name as string,
      category: r.category as string,
      tonnage_tonnes: Number(r.tonnage_tonnes ?? 0),
      percentage: Number(r.percentage ?? 0),
      data_year: (r.data_year as number) ?? 2022,
    }),
  );

  const euRows = allCountries.filter((r) => r.country_code !== 'US');
  const usRows = allCountries.filter((r) => r.country_code === 'US');

  const europeStats = aggregateCountryStats(euRows);
  const usaStats: NationalStat[] = usRows
    .map((r) => ({
      category: r.category,
      annual_volume_tonnes: r.tonnage_tonnes,
      recycling_rate: 0,
      recovery_rate: 0,
      avg_price_per_tonne: 0,
      data_source: 'EPA',
      year: r.data_year,
      country_code: 'US',
    }))
    .sort((a, b) => b.annual_volume_tonnes - a.annual_volume_tonnes);

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
      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <PublicCTA />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Sources disclaimer */}
      <SourcesDisclaimer />
    </div>
  );
}
