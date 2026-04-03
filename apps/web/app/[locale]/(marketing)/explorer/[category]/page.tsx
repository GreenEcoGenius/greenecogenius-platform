import Link from 'next/link';

import { ArrowLeft, BookOpen } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { AnimateOnScroll } from '../../_components/animate-on-scroll';

import { CategoryKpis } from '../_components/category-kpis';
import { DataSourceBadge } from '../_components/data-source-badge';
import {
  CATEGORY_META,
  CATEGORY_SUBTYPES,
  VALID_CATEGORIES,
  formatVolume,
  type CategorySlug,
  type NationalStat,
  type RegionStat,
} from '../_components/explorer-data';
import { MaterialsMap } from '../_components/materials-map';
import { DualCTA } from '../_components/public-cta';
import { RegionTable } from '../_components/region-table';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const t = await getTranslations('marketing');

  if (!VALID_CATEGORIES.includes(category as CategorySlug)) {
    return { title: '404' };
  }

  const client = getSupabaseServerClient();
  const { data } = await client
    .from('material_stats_national')
    .select('total_volume_tonnes')
    .eq('category', category)
    .single();

  const vol = data ? formatVolume(Number(data.total_volume_tonnes)) : '';

  return {
    title: `${t(`explorer.cat.${category}`)} — ${vol} t/an | GreenEcoGenius`,
    description: t('explorer.catMetaDesc', {
      category: t(`explorer.cat.${category}`),
      volume: vol,
    }),
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { category } = await params;
  const slug = category as CategorySlug;

  if (!VALID_CATEGORIES.includes(slug)) {
    notFound();
  }

  const t = await getTranslations('marketing');
  const client = getSupabaseServerClient();
  const meta = CATEGORY_META[slug]!;
  const Icon = meta.icon;

  const [{ data: natRow }, { data: regionRows }] = await Promise.all([
    client
      .from('material_stats_national')
      .select('*')
      .eq('category', slug)
      .single(),
    client
      .from('material_stats_by_region')
      .select('*')
      .eq('category', slug)
      .order('total_volume_tonnes', { ascending: false }),
  ]);

  if (!natRow) notFound();

  const stat: NationalStat = {
    category: natRow.category,
    total_volume_tonnes: Number(natRow.total_volume_tonnes),
    nb_regions: natRow.nb_regions ?? 0,
    nb_sources: natRow.nb_sources ?? 0,
    avg_price_min: Number(natRow.avg_price_min),
    avg_price_max: Number(natRow.avg_price_max),
    co2_potential_tonnes: Number(natRow.co2_potential_tonnes),
    recycling_rate: Number(natRow.recycling_rate),
    trend_12m: Number(natRow.trend_12m),
  };

  const regionStats: RegionStat[] = (regionRows ?? []).map((r) => ({
    region: r.region,
    category: r.category,
    total_volume_tonnes: Number(r.total_volume_tonnes),
    nb_sources: r.nb_sources ?? 0,
    avg_price_per_tonne: Number(r.avg_price_per_tonne),
    co2_potential_tonnes: Number(r.co2_potential_tonnes),
    year: r.year ?? 2024,
  }));

  const subtypes = CATEGORY_SUBTYPES[slug];

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
                {t(`explorer.cat.${slug}`)}{' '}
                <span className="text-metal-400 text-lg font-normal">
                  {t('explorer.inFrance')}
                </span>
              </h1>
              <p className="text-metal-500 mt-1 text-sm">
                {formatVolume(stat.total_volume_tonnes)} t/an ·{' '}
                {stat.nb_sources.toLocaleString('fr-FR')} {t('explorer.sourcesIdentified')}
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

      {/* Subtypes */}
      {subtypes && subtypes.length > 0 && (
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll animation="fade-up">
              <h2 className="text-metal-900 mb-6 text-xl font-bold">
                {t('explorer.subtypesTitle')}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subtypes.map((sub) => (
                  <div
                    key={sub.name}
                    className="border-metal-chrome rounded-xl border bg-white p-4"
                  >
                    <p className="text-metal-900 text-sm font-semibold">{sub.name}</p>
                    <div className="text-metal-500 mt-1 flex items-center gap-3 text-xs">
                      <span>{sub.volume}</span>
                      <span className="text-metal-300">·</span>
                      <span>{sub.price}</span>
                      <span className="text-metal-300">·</span>
                      <span
                        className={
                          sub.trend.startsWith('+')
                            ? 'text-emerald-600'
                            : sub.trend.startsWith('-')
                              ? 'text-red-500'
                              : 'text-metal-400'
                        }
                      >
                        {sub.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* Region table */}
      <section className="bg-metal-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-metal-900 mb-6 text-xl font-bold">
              {t('explorer.regionBreakdown')}
            </h2>
            <RegionTable stats={regionStats} trend={stat.trend_12m} />
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="mx-auto mt-12 max-w-2xl">
              <MaterialsMap
                regionStats={regionStats}
                singleCategory={slug}
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

      {/* Norms footer */}
      <section className="border-metal-chrome border-t py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <BookOpen className="text-metal-400 h-4 w-4" />
            <span className="text-metal-500 text-xs">
              {t('explorer.normsApplicable')}: ISO 15270 · Décret 5 flux / 9 flux · Loi AGEC · REP
            </span>
            <span className="text-metal-300">|</span>
            <DataSourceBadge />
          </div>
        </div>
      </section>
    </div>
  );
}
