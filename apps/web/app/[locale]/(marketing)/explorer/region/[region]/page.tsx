export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from '../../../_components/animate-on-scroll';
import { DataSourceBadge } from '../../_components/data-source-badge';
import {
  cleanSource,
  formatVolume,
  regionFromSlug,
  type NationalStat,
  type RegionStat,
} from '../../_components/explorer-data';
import { MaterialCategoryCard } from '../../_components/material-category-card';
import { PublicCTA } from '../../_components/public-cta';
import { SourcesDisclaimer } from '../../_components/sources-disclaimer';
import { getPublicSupabaseClient } from '../../_lib/public-client';

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
  const client = getPublicSupabaseClient();

  const [{ data: regionRows }, { data: nationalRows }] = await Promise.all([
    client
      .from('material_stats_by_region')
      .select('*')
      .eq('region', regionName)
      .eq('country', 'France')
      .order('annual_volume_tonnes', { ascending: false }),
    client
      .from('material_stats_national')
      .select('category, recycling_rate, recovery_rate, avg_price_per_tonne, data_source')
      .eq('country_code', 'FR'),
  ]);

  // Build a lookup of national stats by category for fallback
  const nationalByCategory = new Map<string, { recycling_rate: number; recovery_rate: number; avg_price_per_tonne: number; data_source: string }>();
  for (const n of (nationalRows ?? []) as Record<string, unknown>[]) {
    const cat = n.category as string;
    const existing = nationalByCategory.get(cat);
    // Keep the one with the highest volume (best data)
    if (!existing || Number(n.recycling_rate ?? 0) > existing.recycling_rate) {
      nationalByCategory.set(cat, {
        recycling_rate: Number(n.recycling_rate ?? 0),
        recovery_rate: Number(n.recovery_rate ?? 0),
        avg_price_per_tonne: Number(n.avg_price_per_tonne ?? 0),
        data_source: cleanSource((n.data_source as string) ?? ''),
      });
    }
  }

  const stats: RegionStat[] = (regionRows ?? []).map(
    (r: Record<string, unknown>) => {
      const cat = r.category as string;
      const national = nationalByCategory.get(cat);
      return {
        region: r.region as string,
        category: cat,
        annual_volume_tonnes: Number(r.annual_volume_tonnes ?? 0),
        recycling_rate: Number(r.recycling_rate ?? 0) || (national?.recycling_rate ?? 0),
        recovery_rate: Number(r.recovery_rate ?? 0) || (national?.recovery_rate ?? 0),
        avg_price_per_tonne: Number(r.avg_price_per_tonne ?? 0) || (national?.avg_price_per_tonne ?? 0),
        data_source: cleanSource((r.data_source as string) ?? '') || (national?.data_source ?? 'ADEME/SINOE'),
        year: (r.year as number) ?? 2024,
        country: 'France',
      };
    },
  );

  const totalVolume = stats.reduce((s, r) => s + r.annual_volume_tonnes, 0);

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
                annual_volume_tonnes: row.annual_volume_tonnes,
                recycling_rate: row.recycling_rate,
                recovery_rate: row.recovery_rate,
                avg_price_per_tonne: row.avg_price_per_tonne,
                price_currency: 'EUR',
                data_source: row.data_source,
                year: row.year,
                country_code: 'FR',
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
