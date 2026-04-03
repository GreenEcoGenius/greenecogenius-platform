import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { AnimateOnScroll } from '../../../_components/animate-on-scroll';
import { DataSourceBadge } from '../../_components/data-source-badge';
import {
  displayCategory,
  formatVolume,
  regionFromSlug,
  type NationalStat,
  type RegionStat,
} from '../../_components/explorer-data';
import { MaterialCategoryCard } from '../../_components/material-category-card';
import { PublicCTA } from '../../_components/public-cta';
import { SourcesDisclaimer } from '../../_components/sources-disclaimer';

interface PageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { region: regionSlug } = await params;
  const regionName = regionFromSlug(regionSlug);

  if (!regionName) return { title: '404' };

  const t = await getTranslations('marketing');
  return {
    title: `${t('explorer.materialsIn')} ${regionName} | GreenEcoGenius`,
    description: t('explorer.regionMetaDesc', { region: regionName }),
  };
}

export default async function RegionDetailPage({ params }: PageProps) {
  const { region: regionSlug } = await params;
  const regionName = regionFromSlug(regionSlug);

  if (!regionName) notFound();

  const t = await getTranslations('marketing');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = getSupabaseServerClient() as any;

  const { data: regionRows } = await client
    .from('material_stats_by_region')
    .select('*')
    .eq('region', regionName)
    .order('total_volume_tonnes', { ascending: false });

  const stats: RegionStat[] = (regionRows ?? []).map(
    (r: Record<string, unknown>) => ({
      region: r.region as string,
      category: displayCategory(r.category as string),
      total_volume_tonnes: Number(r.total_volume_tonnes ?? 0),
      nb_sources: Number(r.nb_sources ?? 0),
      avg_price_per_tonne: Number(r.avg_price_per_tonne ?? 0),
      co2_potential_tonnes: Number(r.co2_potential_tonnes ?? 0),
      year: (r.year as number) ?? 2024,
    }),
  );

  const totalVolume = stats.reduce((s, r) => s + r.total_volume_tonnes, 0);

  return (
    <div>
      {/* Header */}
      <section className="bg-metal-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/explorer"
            className="text-primary mb-6 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('explorer.backToExplorer')}
          </Link>

          <div className="flex items-center gap-4">
            <div className="bg-primary-light text-primary flex h-14 w-14 items-center justify-center rounded-2xl">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-metal-900 text-3xl font-bold sm:text-4xl">
                {regionName}
              </h1>
              <p className="text-metal-500 mt-1 text-sm">
                {formatVolume(totalVolume)}/an · {stats.length}{' '}
                {t('explorer.categoriesAvailable')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-metal-900 mb-2 text-xl font-bold">
              {t('explorer.materialsAvailable')}
            </h2>
            <p className="text-metal-500 mb-8 text-sm">
              {t('explorer.regionCategoriesSub')}
            </p>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((row) => {
              const stat: NationalStat = {
                category: row.category,
                total_volume_tonnes: row.total_volume_tonnes,
                nb_regions: 1,
                nb_sources: row.nb_sources,
                avg_price_min: row.avg_price_per_tonne,
                avg_price_max: row.avg_price_per_tonne,
                co2_potential_tonnes: row.co2_potential_tonnes,
                recycling_rate: 0,
                trend_12m: 0,
              };

              return (
                <AnimateOnScroll key={row.category} animation="fade-up">
                  <MaterialCategoryCard stat={stat} zone="france" />
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <PublicCTA />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Footer */}
      <section className="border-metal-chrome border-t py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <DataSourceBadge />
        </div>
      </section>

      <SourcesDisclaimer />
    </div>
  );
}
