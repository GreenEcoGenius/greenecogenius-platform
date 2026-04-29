'use client';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import {
  CATEGORY_META,
  formatPrice,
  formatRate,
  formatVolume,
  slugFromCategory,
  type NationalStat,
  type Zone,
} from './explorer-data';
import { SourceBadge } from './source-badge';

export function MaterialCategoryCard({
  stat,
  zone = 'france',
}: {
  stat: NationalStat;
  zone?: Zone;
}) {
  const t = useTranslations('marketing');
  const meta = CATEGORY_META[stat.category];

  if (!meta) return null;

  const Icon = meta.icon;
  const catSlug = slugFromCategory(stat.category);
  const materialName =
    t.raw(`explorer.materialNames.${stat.category}`) ?? stat.category;

  const content = (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.bgColor} ${meta.color}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-metal-900 text-base font-semibold">
            {materialName}
          </h3>
        </div>
        {stat.data_source && <SourceBadge source={stat.data_source} />}
      </div>

      <div className="text-metal-900 mb-1 text-2xl font-bold">
        {formatVolume(stat.annual_volume_tonnes)}
        <span className="text-metal-400 text-sm font-normal">
          {t('explorer.perYear')}
        </span>
      </div>

      <div className="text-metal-500 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {stat.recycling_rate > 0 && (
          <span>
            {t('explorer.recyclingLabel')} : {formatRate(stat.recycling_rate)}
          </span>
        )}
        {stat.avg_price_per_tonne > 0 && (
          <span>
            {formatPrice(stat.avg_price_per_tonne, stat.price_currency)}
          </span>
        )}
      </div>
    </>
  );

  const className =
    'group border-metal-silver/50 hover:border-primary/40 hover:shadow-primary/10 flex flex-col rounded-2xl border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg';

  if (zone === 'france') {
    return (
      <Link href={`/explorer/${catSlug}`} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
