'use client';

import { TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatRate, formatVolume, type NationalStat } from './explorer-data';

export function MarketTrends({ stats }: { stats: NationalStat[] }) {
  const t = useTranslations('marketing');

  const top = [...stats]
    .sort((a, b) => b.annual_volume_tonnes - a.annual_volume_tonnes)
    .slice(0, 4);

  return (
    <section>
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="text-primary h-5 w-5" />
        <h2 className="text-metal-900 text-xl font-bold">
          {t('explorer.trendsTitle')}
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {top.map((stat, i) => {
          const materialName =
            t.raw(`explorer.materialNames.${stat.category}`) ?? stat.category;

          return (
            <div
              key={stat.category}
              className="border-metal-chrome flex items-start gap-3 rounded-xl border bg-card p-4"
            >
              <span className="text-metal-400 text-sm font-bold">
                {i + 1}.
              </span>
              <div>
                <p className="text-metal-900 text-sm font-semibold">
                  {materialName}
                </p>
                <p className="text-metal-500 flex items-center gap-1 text-xs">
                  {formatVolume(stat.annual_volume_tonnes)}
                  {t('explorer.perYear')}
                  {stat.recycling_rate > 0 && (
                    <span className="text-[#00A86B]">
                      · {formatRate(stat.recycling_rate)}{' '}
                      {t('explorer.recycled')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-metal-400 mt-4 text-xs">
        {t('explorer.trendsDisclaimer')}
      </p>
    </section>
  );
}
