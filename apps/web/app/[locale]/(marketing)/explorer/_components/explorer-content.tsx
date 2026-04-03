'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import type { CountryStat, NationalStat, Zone } from './explorer-data';
import { EuropeMap } from './europe-map';
import { MarketTrends } from './market-trends';
import { MaterialCategoryCard } from './material-category-card';
import { MaterialsMap } from './materials-map';
import { UsaMap } from './usa-map';
import { ZoneSelector } from './zone-selector';

interface RegionRow {
  region: string;
  category?: string;
  total_volume_tonnes: number | string;
}

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
  franceRegionRows: RegionRow[];
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
      <section className="pb-8 pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ZoneSelector active={zone} onChange={setZone} />
        </div>
      </section>

      {/* Category cards */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-metal-900 mb-2 text-2xl font-bold">
            {t('explorer.categoriesTitle')}
          </h2>
          <p className="text-metal-500 mb-10 text-sm">
            {t('explorer.categoriesSub')}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <MaterialCategoryCard key={stat.category} stat={stat} zone={zone} />
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-metal-50 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-metal-900 mb-2 text-center text-2xl font-bold">
            {t(`explorer.${zone}MapTitle`)}
          </h2>
          <p className="text-metal-500 mb-10 text-center text-sm">
            {t(`explorer.${zone}MapSubtitle`)}
          </p>

          {zone === 'france' && (
            <MaterialsMap regionStats={franceRegionRows} />
          )}
          {zone === 'europe' && (
            <EuropeMap countryStats={europeCountryRows} />
          )}
          {zone === 'usa' && <UsaMap stats={usaStats} />}
        </div>
      </section>

      {/* Market trends (France only has trend data) */}
      {zone === 'france' && franceStats.some((s) => s.trend_12m !== 0) && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <MarketTrends stats={franceStats} />
          </div>
        </section>
      )}
    </>
  );
}
