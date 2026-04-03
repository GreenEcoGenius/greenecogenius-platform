'use client';

import { useTranslations } from 'next-intl';

import {
  CATEGORY_META,
  formatVolume,
  type CategorySlug,
  type NationalStat,
} from './explorer-data';

const USA_OUTLINE =
  'M 50 120 L 80 100 L 130 90 L 180 85 L 230 80 L 280 82 L 330 88 L 370 95 L 400 110 L 420 130 L 430 160 L 425 190 L 410 210 L 380 225 L 340 230 L 300 228 L 260 225 L 220 220 L 180 218 L 140 215 L 100 210 L 70 195 L 55 170 L 45 145 Z';

export function UsaMap({ stats }: { stats: NationalStat[] }) {
  const t = useTranslations('marketing');
  const totalVolume = stats.reduce((s, r) => s + r.total_volume_tonnes, 0);

  return (
    <div className="relative">
      <svg
        viewBox="30 60 420 200"
        className="mx-auto w-full max-w-2xl"
        role="img"
        aria-label="USA recyclable materials"
      >
        <path
          d={USA_OUTLINE}
          fill="#059669"
          stroke="#ffffff"
          strokeWidth="2"
          opacity={0.85}
        />
        <text
          x="235"
          y="155"
          textAnchor="middle"
          className="fill-white text-sm font-bold"
          fontSize="14"
        >
          {formatVolume(totalVolume)} t/an
        </text>
        <text
          x="235"
          y="172"
          textAnchor="middle"
          className="fill-white/80 text-xs"
          fontSize="10"
        >
          {t('explorer.zone.usa')} — EPA 2018
        </text>
      </svg>

      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {stats
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
