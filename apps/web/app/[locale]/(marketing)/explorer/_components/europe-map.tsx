'use client';

import { useState } from 'react';

import type { CountryStat } from './explorer-data';
import { formatVolume } from './explorer-data';

const VOLUME_COLORS = [
  { max: 5_000_000, fill: '#D1FAE5' },
  { max: 20_000_000, fill: '#6EE7B7' },
  { max: 50_000_000, fill: '#34D399' },
  { max: 150_000_000, fill: '#059669' },
  { max: Infinity, fill: '#064E3B' },
];

function getColor(volume: number): string {
  for (const step of VOLUME_COLORS) {
    if (volume <= step.max) return step.fill;
  }
  return VOLUME_COLORS[VOLUME_COLORS.length - 1]!.fill;
}

const EU_PATHS: Record<string, { d: string; name: string }> = {
  DE: { d: 'M 290 200 L 310 180 L 340 185 L 345 210 L 335 240 L 305 245 L 285 230 Z', name: 'Allemagne' },
  FR: { d: 'M 220 240 L 260 220 L 290 240 L 285 280 L 260 300 L 225 290 L 210 265 Z', name: 'France' },
  IT: { d: 'M 305 260 L 320 250 L 335 270 L 325 310 L 310 330 L 295 310 L 300 280 Z', name: 'Italie' },
  ES: { d: 'M 160 290 L 210 275 L 225 295 L 215 330 L 175 340 L 150 320 Z', name: 'Espagne' },
  PL: { d: 'M 345 185 L 390 175 L 400 200 L 395 225 L 365 230 L 345 215 Z', name: 'Pologne' },
  NL: { d: 'M 270 180 L 285 175 L 290 190 L 280 195 L 268 192 Z', name: 'Pays-Bas' },
  BE: { d: 'M 260 195 L 278 192 L 280 205 L 265 210 Z', name: 'Belgique' },
  SE: { d: 'M 330 80 L 345 70 L 355 100 L 350 150 L 335 160 L 325 130 L 320 100 Z', name: 'Suède' },
  AT: { d: 'M 310 235 L 340 228 L 355 240 L 340 250 L 310 248 Z', name: 'Autriche' },
  RO: { d: 'M 390 245 L 420 235 L 435 255 L 420 270 L 395 265 Z', name: 'Roumanie' },
  CZ: { d: 'M 320 215 L 345 210 L 355 225 L 340 232 L 318 228 Z', name: 'Tchéquie' },
  PT: { d: 'M 140 300 L 155 290 L 160 315 L 148 325 L 138 318 Z', name: 'Portugal' },
  HU: { d: 'M 355 240 L 385 232 L 392 252 L 375 260 L 355 255 Z', name: 'Hongrie' },
  FI: { d: 'M 370 50 L 390 40 L 400 80 L 395 130 L 375 140 L 365 100 Z', name: 'Finlande' },
  DK: { d: 'M 295 155 L 310 148 L 315 165 L 305 172 L 292 168 Z', name: 'Danemark' },
  IE: { d: 'M 185 165 L 200 158 L 208 175 L 198 185 L 183 180 Z', name: 'Irlande' },
  BG: { d: 'M 405 265 L 430 258 L 440 275 L 425 285 L 405 280 Z', name: 'Bulgarie' },
  EL: { d: 'M 385 290 L 405 280 L 415 300 L 405 320 L 388 310 Z', name: 'Grèce' },
  SK: { d: 'M 355 225 L 380 218 L 388 235 L 370 240 L 355 238 Z', name: 'Slovaquie' },
  HR: { d: 'M 340 255 L 360 250 L 368 265 L 355 275 L 338 268 Z', name: 'Croatie' },
  LT: { d: 'M 380 155 L 400 148 L 405 165 L 395 172 L 378 168 Z', name: 'Lituanie' },
  SI: { d: 'M 322 248 L 338 245 L 342 255 L 332 260 L 320 256 Z', name: 'Slovénie' },
  LV: { d: 'M 385 140 L 405 135 L 410 150 L 400 158 L 383 153 Z', name: 'Lettonie' },
  EE: { d: 'M 388 120 L 405 115 L 410 132 L 400 138 L 386 133 Z', name: 'Estonie' },
  LU: { d: 'M 264 208 L 272 205 L 275 215 L 268 218 Z', name: 'Luxembourg' },
  CY: { d: 'M 450 310 L 462 306 L 466 315 L 456 320 Z', name: 'Chypre' },
  MT: { d: 'M 318 340 L 324 337 L 326 343 L 320 346 Z', name: 'Malte' },
};

export function EuropeMap({
  countryStats,
}: {
  countryStats: CountryStat[];
}) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    volume: number;
  } | null>(null);

  const volumeByCountry = new Map<string, number>();
  for (const row of countryStats) {
    const current = volumeByCountry.get(row.country_code) ?? 0;
    volumeByCountry.set(row.country_code, current + row.tonnage_tonnes);
  }

  return (
    <div className="relative">
      <svg
        viewBox="120 30 370 320"
        className="mx-auto w-full max-w-2xl"
        role="img"
        aria-label="Carte des matières recyclables en Europe"
      >
        {Object.entries(EU_PATHS).map(([code, { d, name }]) => {
          const vol = volumeByCountry.get(code) ?? 0;

          return (
            <path
              key={code}
              d={d}
              fill={vol > 0 ? getColor(vol) : '#E5E7EB'}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="cursor-default transition-opacity hover:opacity-80"
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
            x={Math.max(120, Math.min(tooltip.x - 80, 410))}
            y={Math.max(30, tooltip.y - 50)}
            width="160"
            height="44"
            className="pointer-events-none"
          >
            <div className="rounded-lg bg-white px-3 py-2 text-center shadow-lg">
              <p className="text-metal-900 text-xs font-semibold">{tooltip.name}</p>
              <p className="text-primary text-xs font-bold">
                {tooltip.volume > 0 ? `${formatVolume(tooltip.volume)} t` : '—'}
              </p>
            </div>
          </foreignObject>
        )}
      </svg>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs">
        <span className="text-metal-500">Volume :</span>
        {VOLUME_COLORS.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: step.fill }}
            />
            <span className="text-metal-400">
              {i === 0
                ? '< 5 Mt'
                : i === VOLUME_COLORS.length - 1
                  ? '> 150 Mt'
                  : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
