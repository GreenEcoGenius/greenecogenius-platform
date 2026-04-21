'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuropeMap } from './europe-map';
import type {
  CountryStat,
  NationalStat,
  RegionStat,
  Zone,
} from './explorer-data';
import { MarketTrends } from './market-trends';
import { MaterialCategoryCard } from './material-category-card';
import { MaterialsMap } from './materials-map';
import { UsaMap } from './usa-map';
import { ZoneSelector } from './zone-selector';

export function ExplorerContent({
  franceStats,
  europeStats,
  usaStats,
  franceRegionRows,
  europeCountryRows,
}: {
  franceStats: NationalStat[];
  europeStats: NationalStat[];
  usaStats: NationalStat[];
  franceRegionRows: RegionStat[];
  europeCountryRows: CountryStat[];
}) {
  const [zone, setZone] = useState<Zone>('france');
  const t = useTranslations('marketing');

  const stats =
    zone === 'france'
      ? franceStats
      : zone === 'europe'
        ? europeStats
        : usaStats;

  return (
    <>
      {/* Zone selector */}
      <section className="bg-[--color-enviro-cream-50] pt-12 pb-8">
        <div className="mx-auto max-w-[--container-enviro-xl] px-4 sm:px-6 lg:px-8">
          <ZoneSelector active={zone} onChange={setZone} />
        </div>
      </section>

      {/* Category cards */}
      <section className="bg-[--color-enviro-cream-50] pb-16 lg:pb-20">
        <div className="mx-auto max-w-[--container-enviro-xl] px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag={t(`explorer.zone.${zone}`)}
            title={t('explorer.categoriesTitle')}
            subtitle={t('explorer.categoriesSub')}
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <MaterialCategoryCard
                key={stat.category}
                stat={stat}
                zone={zone}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[--container-enviro-xl] px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag={t('explorer.zone.france')}
            title={t(`explorer.${zone}MapTitle`)}
            subtitle={t(`explorer.${zone}MapSubtitle`)}
            align="center"
          />

          <div className="mt-10">
            {zone === 'france' && (
              <MaterialsMap regionStats={franceRegionRows} />
            )}
            {zone === 'europe' && (
              <EuropeMap countryStats={europeCountryRows} />
            )}
            {zone === 'usa' && <UsaMap stats={usaStats} />}
          </div>
        </div>
      </section>

      {/* Market trends */}
      {franceStats.length > 0 && (
        <section className="bg-[--color-enviro-cream-50] py-16 lg:py-24">
          <div className="mx-auto max-w-[--container-enviro-xl] px-4 sm:px-6 lg:px-8">
            <MarketTrends stats={franceStats} />
          </div>
        </section>
      )}
    </>
  );
}

function SectionHeader({
  tag,
  title,
  subtitle,
  align = 'left',
}: {
  tag: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={
        align === 'center'
          ? 'mx-auto flex max-w-3xl flex-col items-center gap-3 text-center'
          : 'flex flex-col gap-3'
      }
    >
      <span className="inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
        <span aria-hidden="true">[</span>
        <span className="px-1">{tag}</span>
        <span aria-hidden="true">]</span>
      </span>
      <h2 className="text-balance text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-sm md:text-base leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
