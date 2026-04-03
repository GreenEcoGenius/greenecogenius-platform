import { Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { AnimateOnScroll } from '../_components/animate-on-scroll';

import { DataSourceBadge } from './_components/data-source-badge';
import type { NationalStat } from './_components/explorer-data';
import { MarketTrends } from './_components/market-trends';
import { MaterialCategoryCard } from './_components/material-category-card';
import { MaterialsMap } from './_components/materials-map';
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

  const { data: stats } = await client
    .from('material_stats_national')
    .select('*')
    .order('total_volume_tonnes', { ascending: false });

  const nationalStats: NationalStat[] = (stats ?? []).map((s) => ({
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

  const { data: regionStats } = await client
    .from('material_stats_by_region')
    .select('*');

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

      {/* Category cards grid */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-metal-900 mb-2 text-2xl font-bold">
              {t('explorer.categoriesTitle')}
            </h2>
            <p className="text-metal-500 mb-10 text-sm">
              {t('explorer.categoriesSub')}
            </p>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {nationalStats.map((stat) => (
              <AnimateOnScroll key={stat.category} animation="fade-up">
                <MaterialCategoryCard stat={stat} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive France map */}
      <section className="bg-metal-50 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-metal-900 mb-2 text-center text-2xl font-bold">
              {t('explorer.mapTitle')}
            </h2>
            <p className="text-metal-500 mb-10 text-center text-sm">
              {t('explorer.mapSubtitle')}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <MaterialsMap regionStats={regionStats ?? []} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Market trends */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <MarketTrends stats={nationalStats} />
          </AnimateOnScroll>
        </div>
      </section>

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
