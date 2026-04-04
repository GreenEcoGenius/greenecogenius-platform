export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft, BookOpen } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from '../../_components/animate-on-scroll';
import { CategoryKpis } from '../_components/category-kpis';
import { DataSourceBadge } from '../_components/data-source-badge';
import {
  CATEGORY_META,
  categoryFromSlug,
  cleanSource,
  formatVolume,
  type NationalStat,
  type RegionStat,
} from '../_components/explorer-data';
import { MaterialsMap } from '../_components/materials-map';
import { DualCTA } from '../_components/public-cta';
import { RegionTable } from '../_components/region-table';
import { SourcesDisclaimer } from '../_components/sources-disclaimer';
import { getPublicSupabaseClient } from '../_lib/public-client';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { category: slug } = await params;
  const t = await getTranslations('marketing');
  const categoryName = categoryFromSlug(slug);

  if (!categoryName) return { title: '404' };

  return {
    title: `${categoryName} — ${t('explorer.metaTitle')}`,
    description: t('explorer.catMetaDesc', { category: categoryName }),
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { category: slug } = await params;
  const categoryName = categoryFromSlug(slug);

  if (!categoryName) notFound();

  const t = await getTranslations('marketing');
  const client = getPublicSupabaseClient();
  const meta = CATEGORY_META[categoryName];

  if (!meta) notFound();
  const Icon = meta.icon;

  const [{ data: natRows }, { data: regionRows }] = await Promise.all([
    client
      .from('material_stats_national')
      .select('*')
      .eq('country_code', 'FR')
      .eq('category', categoryName)
      .order('annual_volume_tonnes', { ascending: false }),
    client
      .from('material_stats_by_region')
      .select('*')
      .eq('country', 'France')
      .eq('category', categoryName)
      .order('annual_volume_tonnes', { ascending: false }),
  ]);

  const natRow = natRows?.[0];
  if (!natRow) notFound();

  const stat: NationalStat = {
    category: natRow.category,
    annual_volume_tonnes: Number(natRow.annual_volume_tonnes ?? 0),
    recycling_rate: Number(natRow.recycling_rate ?? 0),
    recovery_rate: Number(natRow.recovery_rate ?? 0),
    avg_price_per_tonne: Number(natRow.avg_price_per_tonne ?? 0),
    price_currency: (natRow.price_currency as string) ?? 'EUR',
    data_source: cleanSource(natRow.data_source ?? ''),
    year: natRow.year ?? 2024,
    country_code: 'FR',
  };

  const regionStats: RegionStat[] = (regionRows ?? []).map(
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
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${meta.bgColor} ${meta.color}`}
            >
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-metal-900 text-3xl font-bold sm:text-4xl">
                {categoryName}{' '}
                <span className="text-metal-400 text-lg font-normal">
                  {t('explorer.inFrance')}
                </span>
              </h1>
              <p className="text-metal-500 mt-1 text-sm">
                {formatVolume(stat.annual_volume_tonnes)}/an ·{' '}
                {stat.data_source} {stat.year}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="-mt-6 pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <CategoryKpis stat={stat} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Region table */}
      <section className="bg-metal-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-metal-900 mb-6 text-xl font-bold">
              {t('explorer.regionBreakdown')}
            </h2>
            <RegionTable stats={regionStats} />
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="mx-auto mt-12 max-w-2xl">
              <MaterialsMap
                regionStats={regionStats}
                singleCategory={categoryName}
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <DualCTA />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Norms + Sources */}
      <section className="border-metal-chrome border-t py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <BookOpen className="text-metal-400 h-4 w-4" />
            <span className="text-metal-500 text-xs">
              {t('explorer.normsApplicable')}: Loi AGEC · Décret 5/9 flux · REP
              · CSRD
            </span>
            <span className="text-metal-300">|</span>
            <DataSourceBadge />
          </div>
        </div>
      </section>

      <SourcesDisclaimer />
    </div>
  );
}
