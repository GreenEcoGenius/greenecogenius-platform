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
      <section className="pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ZoneSelector active={zone} onChange={setZone} />
        </div>
      </section>

      {/* Category cards */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-[#F5F5F0] mb-2 text-2xl font-bold">
            {t('explorer.categoriesTitle')}
          </h2>
          <p className="text-[#7DC4A0] mb-10 text-sm">
            {t('explorer.categoriesSub')}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      <section className="bg-[#0D3A26] py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-[#F5F5F0] mb-2 text-center text-2xl font-bold">
            {t(`explorer.${zone}MapTitle`)}
          </h2>
          <p className="text-[#7DC4A0] mb-10 text-center text-sm">
            {t(`explorer.${zone}MapSubtitle`)}
          </p>

          {zone === 'france' && <MaterialsMap regionStats={franceRegionRows} />}
          {zone === 'europe' && <EuropeMap countryStats={europeCountryRows} />}
          {zone === 'usa' && <UsaMap stats={usaStats} />}
        </div>
      </section>

      {/* Market trends */}
      {franceStats.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <MarketTrends stats={franceStats} />
          </div>
        </section>
      )}
    </>
  );
}
