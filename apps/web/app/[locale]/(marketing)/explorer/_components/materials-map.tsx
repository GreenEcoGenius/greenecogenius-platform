'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { formatVolume, regionToSlug, type RegionStat } from './explorer-data';

const VOLUME_COLORS = [
  { max: 1_000_000, fill: '#D1FAE5' },
  { max: 5_000_000, fill: '#6EE7B7' },
  { max: 10_000_000, fill: '#34D399' },
  { max: 50_000_000, fill: '#00A86B' },
  { max: Infinity, fill: '#064E3B' },
];

function getColor(volume: number): string {
  for (const step of VOLUME_COLORS) {
    if (volume <= step.max) return step.fill;
  }
  return VOLUME_COLORS[VOLUME_COLORS.length - 1]!.fill;
}

const REGION_PATHS: Record<string, string> = {
  'Île-de-France':
    'M 280 160 L 310 150 L 330 165 L 325 185 L 295 190 L 275 175 Z',
  'Hauts-de-France':
    'M 260 60 L 320 50 L 350 80 L 340 120 L 310 140 L 270 130 L 250 100 Z',
  'Grand Est':
    'M 340 80 L 410 70 L 430 120 L 420 180 L 370 190 L 340 160 L 330 120 Z',
  Normandie:
    'M 140 100 L 200 80 L 250 100 L 260 140 L 220 160 L 160 150 L 130 130 Z',
  Bretagne:
    'M 40 130 L 100 110 L 140 130 L 150 160 L 120 180 L 60 170 L 30 150 Z',
  'Pays de la Loire':
    'M 90 190 L 150 170 L 200 180 L 220 220 L 190 260 L 130 250 L 80 220 Z',
  'Centre-Val de Loire':
    'M 210 170 L 280 160 L 310 190 L 300 240 L 250 260 L 210 240 L 200 200 Z',
  'Bourgogne-Franche-Comté':
    'M 320 180 L 390 170 L 420 210 L 400 260 L 350 270 L 310 240 L 310 200 Z',
  'Nouvelle-Aquitaine':
    'M 100 270 L 180 260 L 240 280 L 260 340 L 230 400 L 160 410 L 100 370 L 80 310 Z',
  'Auvergne-Rhône-Alpes':
    'M 300 250 L 380 240 L 420 280 L 410 340 L 360 370 L 300 350 L 280 300 Z',
  Occitanie:
    'M 140 410 L 230 400 L 290 380 L 310 420 L 280 460 L 200 470 L 140 450 Z',
  "Provence-Alpes-Côte d'Azur":
    'M 310 370 L 390 350 L 440 380 L 430 420 L 380 440 L 320 430 Z',
  Corse: 'M 440 420 L 460 410 L 475 430 L 470 470 L 455 480 L 440 460 Z',
};

export function MaterialsMap({
  regionStats,
  singleCategory,
}: {
  regionStats: RegionStat[];
  singleCategory?: string;
}) {
  const router = useRouter();
  const t = useTranslations('marketing');
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    volume: number;
  } | null>(null);

  const volumeByRegion = new Map<string, number>();

  for (const row of regionStats) {
    if (singleCategory && row.category !== singleCategory) continue;
    const current = volumeByRegion.get(row.region) ?? 0;
    volumeByRegion.set(row.region, current + row.annual_volume_tonnes);
  }

  return (
    <div className="relative">
      <svg
        viewBox="0 0 500 520"
        className="mx-auto w-full max-w-lg"
        role="img"
        aria-label={t('explorer.franceMapTitle')}
      >
        {Object.entries(REGION_PATHS).map(([name, d]) => {
          const vol = volumeByRegion.get(name) ?? 0;

          return (
            <path
              key={name}
              d={d}
              fill={vol > 0 ? getColor(vol) : '#E5E7EB'}
              stroke="#ffffff"
              strokeWidth="2"
              className="cursor-pointer transition-opacity hover:opacity-80"
              onClick={() =>
                router.push(`/explorer/region/${regionToSlug(name)}`)
              }
              onMouseEnter={(e) => {
                const bbox = e.currentTarget.getBBox();
                setTooltip({
                  x: bbox.x + bbox.width / 2,
                  y: bbox.y,
                  name,
                  volume: vol,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}

        {tooltip && (
          <foreignObject
            x={Math.max(0, tooltip.x - 80)}
            y={Math.max(0, tooltip.y - 50)}
            width="160"
            height="44"
            className="pointer-events-none"
          >
            <div className="rounded-lg bg-white px-3 py-2 text-center shadow-lg">
              <p className="text-metal-900 text-xs font-semibold">
                {t.raw(`explorer.regionNames.${tooltip.name}`) as string}
              </p>
              <p className="text-primary text-xs font-bold">
                {tooltip.volume > 0 ? formatVolume(tooltip.volume) : '—'}
              </p>
            </div>
          </foreignObject>
        )}
      </svg>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs">
        <span className="text-metal-500">{t('explorer.volumeLabel')} :</span>
        {VOLUME_COLORS.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: step.fill }}
            />
            <span className="text-metal-400">
              {i === 0
                ? '< 1 Mt'
                : i === VOLUME_COLORS.length - 1
                  ? '> 50 Mt'
                  : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
