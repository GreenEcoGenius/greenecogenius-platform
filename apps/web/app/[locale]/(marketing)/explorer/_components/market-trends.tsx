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
        {top.map((stat, i) => (
          <div
            key={stat.category}
            className="border-metal-chrome flex items-start gap-3 rounded-xl border bg-white p-4"
          >
            <span className="text-metal-400 text-sm font-bold">{i + 1}.</span>
            <div>
              <p className="text-metal-900 text-sm font-semibold">
                {stat.category}
              </p>
              <p className="text-metal-500 flex items-center gap-1 text-xs">
                {formatVolume(stat.annual_volume_tonnes)}/an
                {stat.recycling_rate > 0 && (
                  <span className="text-emerald-600">
                    · {formatRate(stat.recycling_rate)} recyclé
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-metal-400 mt-4 text-xs">
        {t('explorer.trendsDisclaimer')}
      </p>
    </section>
  );
}
