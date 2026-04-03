'use client';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

import {
  CATEGORY_META,
  formatVolume,
  type CategorySlug,
  type NationalStat,
} from './explorer-data';

export function UsaMap({ stats }: { stats: NationalStat[] }) {
  const t = useTranslations('marketing');
  const totalVolume = stats.reduce((s, r) => s + r.total_volume_tonnes, 0);

  return (
    <div className="relative">
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl">
        {/* Real USA SVG map with green tint overlay */}
        <div className="relative" style={{ aspectRatio: '1000 / 589' }}>
          <Image
            src="/images/usa-map.svg"
            alt="United States map"
            fill
            className="object-contain"
            style={{ filter: 'hue-rotate(100deg) saturate(1.5) brightness(0.85)' }}
          />

          {/* Volume overlay centered on the map */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="rounded-xl bg-white/90 px-6 py-3 text-center shadow-lg backdrop-blur-sm">
              <span className="text-primary block text-3xl font-bold sm:text-4xl">
                {formatVolume(totalVolume)} t/an
              </span>
              <span className="text-metal-500 block text-sm">
                {t('explorer.zone.usa')} — EPA 2018
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 category cards */}
      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {[...stats]
          .sort((a, b) => b.total_volume_tonnes - a.total_volume_tonnes)
          .slice(0, 4)
          .map((stat) => {
            const slug = stat.category as CategorySlug;
            const meta = CATEGORY_META[slug];
            if (!meta) return null;
            const Icon = meta.icon;

            return (
              <div
                key={stat.category}
                className="border-metal-chrome flex items-center gap-2 rounded-lg border bg-white p-3"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.bgColor} ${meta.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-metal-900 truncate text-xs font-semibold">
                    {t(`explorer.cat.${slug}`)}
                  </p>
                  <p className="text-metal-500 text-xs">
                    {formatVolume(stat.total_volume_tonnes)} t
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
