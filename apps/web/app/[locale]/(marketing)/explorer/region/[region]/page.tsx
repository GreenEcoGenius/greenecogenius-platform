import Link from 'next/link';

import { ArrowLeft, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { AnimateOnScroll } from '../../../_components/animate-on-scroll';

import { DataSourceBadge } from '../../_components/data-source-badge';
import {
  REGIONS,
  formatVolume,
  regionToSlug,
  type NationalStat,
} from '../../_components/explorer-data';
import { MaterialCategoryCard } from '../../_components/material-category-card';
import { PublicCTA } from '../../_components/public-cta';

interface PageProps {
  params: Promise<{ region: string }>;
}

function findRegionBySlug(slug: string): string | undefined {
  return REGIONS.find((r) => regionToSlug(r) === slug);
}

export async function generateMetadata({ params }: PageProps) {
  const { region: regionSlug } = await params;
  const regionName = findRegionBySlug(regionSlug);

  if (!regionName) return { title: '404' };

  const t = await getTranslations('marketing');

  return {
    title: `${t('explorer.materialsIn')} ${regionName} | GreenEcoGenius`,
    description: t('explorer.regionMetaDesc', { region: regionName }),
  };
}

export default async function RegionDetailPage({ params }: PageProps) {
  const { region: regionSlug } = await params;
  const regionName = findRegionBySlug(regionSlug);

  if (!regionName) notFound();

  const t = await getTranslations('marketing');
  const client = getSupabaseServerClient();

  const [{ data: regionRows }, { data: nationalRows }] = await Promise.all([
    client
      .from('material_stats_by_region')
      .select('*')
      .eq('region', regionName)
      .order('total_volume_tonnes', { ascending: false }),
    client.from('material_stats_national').select('*'),
  ]);

  const totalVolume = (regionRows ?? []).reduce(
    (sum, r) => sum + Number(r.total_volume_tonnes),
    0,
  );

  const totalSources = (regionRows ?? []).reduce(
    (sum, r) => sum + (r.nb_sources ?? 0),
    0,
  );

  const nationalMap = new Map(
    (nationalRows ?? []).map((n) => [n.category, n]),
  );

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
                {formatVolume(totalVolume)} t/an ·{' '}
                {totalSources.toLocaleString('fr-FR')} {t('explorer.sourcesIdentified')}
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(regionRows ?? []).map((row) => {
              const nat = nationalMap.get(row.category);
              if (!nat) return null;

              const stat: NationalStat = {
                category: nat.category,
                total_volume_tonnes: Number(nat.total_volume_tonnes),
                nb_regions: nat.nb_regions ?? 0,
                nb_sources: nat.nb_sources ?? 0,
                avg_price_min: Number(nat.avg_price_min),
                avg_price_max: Number(nat.avg_price_max),
                co2_potential_tonnes: Number(nat.co2_potential_tonnes),
                recycling_rate: Number(nat.recycling_rate),
                trend_12m: Number(nat.trend_12m),
              };

              return (
                <AnimateOnScroll key={row.category} animation="fade-up">
                  <MaterialCategoryCard
                    stat={stat}
                    regionOverride={{
                      volume: Number(row.total_volume_tonnes),
                      sources: row.nb_sources ?? 0,
                      price: Number(row.avg_price_per_tonne),
                    }}
                  />
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
    </div>
  );
}
