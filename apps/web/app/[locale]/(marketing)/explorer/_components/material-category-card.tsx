'use client';

import Link from 'next/link';

import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  CATEGORY_META,
  formatPrice,
  formatVolume,
  type CategorySlug,
  type NationalStat,
} from './explorer-data';

export function MaterialCategoryCard({
  stat,
  regionOverride,
}: {
  stat: NationalStat;
  regionOverride?: { volume: number; sources: number; price: number };
}) {
  const t = useTranslations('marketing');
  const slug = stat.category as CategorySlug;
  const meta = CATEGORY_META[slug];

  if (!meta) return null;

  const Icon = meta.icon;
  const volume = regionOverride?.volume ?? stat.total_volume_tonnes;
  const sources = regionOverride?.sources ?? stat.nb_sources;
  const trend = stat.trend_12m;

  const TrendIcon =
    trend > 0 ? ArrowUp : trend < 0 ? ArrowDown : Minus;

  const trendColor =
    trend > 0
      ? 'text-emerald-600'
      : trend < 0
        ? 'text-red-500'
        : 'text-gray-500';

  return (
    <Link
      href={`/explorer/${slug}`}
      className="group border-metal-silver/50 hover:border-primary/40 hover:shadow-primary/10 flex flex-col rounded-2xl border bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.bgColor} ${meta.color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-metal-900 text-lg font-semibold">
          {t(`explorer.cat.${slug}`)}
        </h3>
      </div>

      <div className="text-metal-900 mb-1 text-2xl font-bold">
        {formatVolume(volume)} <span className="text-sm font-normal">t/an</span>
      </div>

      <p className="text-metal-500 mb-3 text-sm">
        {sources.toLocaleString('fr-FR')} {t('explorer.sources')}
      </p>

      <div className="border-metal-chrome mt-auto flex items-center justify-between border-t pt-3">
        <span className="text-metal-600 text-xs">
          {formatPrice(stat.avg_price_min, stat.avg_price_max)}
        </span>
        <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          {trend > 0 ? '+' : ''}
          {trend}%
        </span>
      </div>
    </Link>
  );
}
