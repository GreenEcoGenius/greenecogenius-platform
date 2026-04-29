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
        <h2 className="text-[#F5F5F0] text-xl font-bold">
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
              className="border-[#1A5C3E] flex items-start gap-3 rounded-xl border bg-[#0D3A26] p-4"
            >
              <span className="text-[#5A9E7D] text-sm font-bold">
                {i + 1}.
              </span>
              <div>
                <p className="text-[#F5F5F0] text-sm font-semibold">
                  {materialName}
                </p>
                <p className="text-[#7DC4A0] flex items-center gap-1 text-xs">
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

      <p className="text-[#5A9E7D] mt-4 text-xs">
        {t('explorer.trendsDisclaimer')}
      </p>
    </section>
  );
}
