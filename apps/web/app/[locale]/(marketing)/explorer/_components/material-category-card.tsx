'use client';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

import { AnimatedCounter } from '~/components/enviro/animations/animated-counter';

import {
  CATEGORY_META,
  formatPrice,
  formatRate,
  slugFromCategory,
  type NationalStat,
  type Zone,
} from './explorer-data';
import { SourceBadge } from './source-badge';

interface VolumeBreakdown {
  /** Numeric value to animate. */
  display: number;
  /** Number of fraction digits for the counter. */
  digits: number;
  /** Suffix appended after the counter (e.g. " Mt", " kt", " t"). */
  suffix: string;
}

/**
 * Decompose a tonnage into an animated-friendly { value, suffix } pair so we
 * can run the AnimatedCounter on the most readable magnitude.
 */
function splitVolume(tonnes: number): VolumeBreakdown {
  if (tonnes >= 1_000_000) {
    const value = tonnes / 1_000_000;
    return {
      display: Number(value.toFixed(value % 1 === 0 ? 0 : 1)),
      digits: value % 1 === 0 ? 0 : 1,
      suffix: ' Mt',
    };
  }
  if (tonnes >= 1_000) {
    return {
      display: Math.round(tonnes / 1_000),
      digits: 0,
      suffix: ' kt',
    };
  }
  return {
    display: Math.round(tonnes),
    digits: 0,
    suffix: ' t',
  };
}

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

  const volume = splitVolume(stat.annual_volume_tonnes);

  const content = (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <h3 className="text-base font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
            {materialName}
          </h3>
        </div>
        {stat.data_source ? <SourceBadge source={stat.data_source} /> : null}
      </div>

      <div className="text-3xl font-bold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
        <AnimatedCounter
          value={volume.display}
          suffix={volume.suffix}
          fractionDigits={volume.digits}
        />
        <span className="ml-2 align-middle text-sm font-normal text-[--color-enviro-forest-600] font-[family-name:var(--font-enviro-sans)]">
          {t('explorer.perYear')}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
        {stat.recycling_rate > 0 ? (
          <span>
            {t('explorer.recyclingLabel')} : {formatRate(stat.recycling_rate)}
          </span>
        ) : null}
        {stat.avg_price_per_tonne > 0 ? (
          <span>
            {formatPrice(stat.avg_price_per_tonne, stat.price_currency)}
          </span>
        ) : null}
      </div>
    </>
  );

  const className = cn(
    'group/material-card flex flex-col rounded-[--radius-enviro-xl] border border-[--color-enviro-cream-300] bg-white p-6 shadow-[--shadow-enviro-card] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[--color-enviro-forest-700] hover:shadow-[--shadow-enviro-lg]',
  );

  if (zone === 'france') {
    return (
      <Link href={`/explorer/${catSlug}`} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
