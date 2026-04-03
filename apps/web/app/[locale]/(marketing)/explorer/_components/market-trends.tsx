import { Flame, TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import type { NationalStat } from './explorer-data';

export async function MarketTrends({ stats }: { stats: NationalStat[] }) {
  const t = await getTranslations('marketing');

  const trending = [...stats]
    .sort((a, b) => b.trend_12m - a.trend_12m)
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
        {trending.map((stat, i) => (
          <div
            key={stat.category}
            className="border-metal-chrome flex items-start gap-3 rounded-xl border bg-white p-4"
          >
            <span className="text-metal-400 text-sm font-bold">{i + 1}.</span>
            <div>
              <p className="text-metal-900 text-sm font-semibold">
                {t(`explorer.cat.${stat.category}`)}
              </p>
              <p className="text-metal-500 flex items-center gap-1 text-xs">
                +{stat.trend_12m}% {t('explorer.demandIncrease')}
                {stat.trend_12m >= 8 && (
                  <Flame className="h-3 w-3 text-orange-500" />
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
