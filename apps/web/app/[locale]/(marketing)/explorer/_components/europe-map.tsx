'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import type { CountryStat } from './explorer-data';

const COUNTRY_VOLUMES: Record<
  string,
  { nameFR: string; nameEN: string; volume: number }
> = {
  DE: { nameFR: 'Allemagne', nameEN: 'Germany', volume: 127.5 },
  FR: { nameFR: 'France', nameEN: 'France', volume: 75.7 },
  IT: { nameFR: 'Italie', nameEN: 'Italy', volume: 58.3 },
  ES: { nameFR: 'Espagne', nameEN: 'Spain', volume: 48.2 },
  PL: { nameFR: 'Pologne', nameEN: 'Poland', volume: 42.8 },
  NL: { nameFR: 'Pays-Bas', nameEN: 'Netherlands', volume: 38.5 },
  BE: { nameFR: 'Belgique', nameEN: 'Belgium', volume: 28.7 },
  SE: { nameFR: 'Suède', nameEN: 'Sweden', volume: 24.1 },
  AT: { nameFR: 'Autriche', nameEN: 'Austria', volume: 22.3 },
  RO: { nameFR: 'Roumanie', nameEN: 'Romania', volume: 20.8 },
  CZ: { nameFR: 'Tchéquie', nameEN: 'Czech Republic', volume: 18.5 },
  FI: { nameFR: 'Finlande', nameEN: 'Finland', volume: 16.2 },
  DK: { nameFR: 'Danemark', nameEN: 'Denmark', volume: 14.8 },
  PT: { nameFR: 'Portugal', nameEN: 'Portugal', volume: 13.5 },
  IE: { nameFR: 'Irlande', nameEN: 'Ireland', volume: 11.2 },
  HU: { nameFR: 'Hongrie', nameEN: 'Hungary', volume: 10.8 },
  BG: { nameFR: 'Bulgarie', nameEN: 'Bulgaria', volume: 10.2 },
  SK: { nameFR: 'Slovaquie', nameEN: 'Slovakia', volume: 8.5 },
  EL: { nameFR: 'Grèce', nameEN: 'Greece', volume: 8.2 },
  HR: { nameFR: 'Croatie', nameEN: 'Croatia', volume: 5.8 },
  LT: { nameFR: 'Lituanie', nameEN: 'Lithuania', volume: 4.5 },
  SI: { nameFR: 'Slovénie', nameEN: 'Slovenia', volume: 4.2 },
  LV: { nameFR: 'Lettonie', nameEN: 'Latvia', volume: 3.8 },
  EE: { nameFR: 'Estonie', nameEN: 'Estonia', volume: 3.2 },
  CY: { nameFR: 'Chypre', nameEN: 'Cyprus', volume: 1.8 },
  LU: { nameFR: 'Luxembourg', nameEN: 'Luxembourg', volume: 1.5 },
  MT: { nameFR: 'Malte', nameEN: 'Malta', volume: 0.8 },
};

const EU_COUNTRIES: Array<{ code: string; path: string }> = [
  {
    code: 'DE',
    path: 'M420,220 L460,200 L480,210 L490,240 L500,270 L490,300 L470,310 L440,310 L420,300 L410,270 L415,245Z',
  },
  {
    code: 'FR',
    path: 'M320,260 L370,240 L410,250 L420,280 L430,310 L420,340 L400,360 L370,370 L340,360 L310,340 L300,310 L305,280Z',
  },
  {
    code: 'IT',
    path: 'M440,310 L470,310 L475,330 L460,370 L470,400 L460,430 L445,440 L435,420 L440,380 L430,350Z',
  },
  {
    code: 'ES',
    path: 'M240,340 L310,330 L340,340 L340,360 L330,390 L310,410 L270,420 L240,410 L220,390 L225,360Z',
  },
  {
    code: 'PL',
    path: 'M490,200 L550,195 L570,210 L565,250 L550,270 L520,275 L500,270 L490,240Z',
  },
  {
    code: 'NL',
    path: 'M390,200 L410,195 L420,210 L415,225 L400,225 L388,215Z',
  },
  { code: 'BE', path: 'M380,230 L410,225 L415,245 L400,250 L385,245Z' },
  {
    code: 'SE',
    path: 'M460,60 L480,55 L500,80 L510,120 L500,170 L480,185 L465,165 L455,120 L450,85Z',
  },
  {
    code: 'AT',
    path: 'M440,280 L490,275 L500,285 L490,300 L470,305 L445,300Z',
  },
  {
    code: 'RO',
    path: 'M540,280 L590,270 L610,285 L605,310 L580,320 L550,315 L535,300Z',
  },
  {
    code: 'CZ',
    path: 'M450,250 L490,240 L500,255 L490,270 L460,275 L445,265Z',
  },
  {
    code: 'FI',
    path: 'M510,40 L540,35 L560,60 L555,110 L540,140 L520,150 L510,120 L505,80Z',
  },
  {
    code: 'DK',
    path: 'M420,170 L440,160 L455,175 L445,195 L430,200 L418,190Z',
  },
  {
    code: 'PT',
    path: 'M220,350 L240,340 L245,370 L240,400 L225,405 L215,385Z',
  },
  {
    code: 'IE',
    path: 'M270,180 L300,175 L305,200 L295,215 L275,210 L265,195Z',
  },
  {
    code: 'HU',
    path: 'M500,280 L540,275 L550,290 L540,310 L510,310 L498,295Z',
  },
  {
    code: 'BG',
    path: 'M560,310 L600,305 L610,320 L595,340 L565,340 L555,325Z',
  },
  { code: 'SK', path: 'M490,255 L530,250 L540,265 L530,278 L500,278Z' },
  {
    code: 'EL',
    path: 'M520,350 L555,340 L570,355 L565,380 L555,400 L535,395 L520,380 L515,365Z',
  },
  {
    code: 'HR',
    path: 'M470,305 L500,300 L510,315 L505,330 L485,335 L465,320Z',
  },
  {
    code: 'LT',
    path: 'M530,175 L560,170 L565,190 L555,200 L535,200 L525,190Z',
  },
  { code: 'SI', path: 'M455,300 L475,295 L480,310 L468,315 L455,308Z' },
  {
    code: 'LV',
    path: 'M530,155 L565,150 L570,168 L560,178 L535,178 L525,168Z',
  },
  {
    code: 'EE',
    path: 'M530,130 L560,125 L568,145 L558,155 L535,155 L525,145Z',
  },
  { code: 'CY', path: 'M590,390 L610,385 L615,398 L600,402Z' },
  { code: 'LU', path: 'M395,245 L405,242 L408,252 L400,255Z' },
  { code: 'MT', path: 'M455,445 L465,442 L467,450 L458,452Z' },
];

const NON_EU_COUNTRIES: Array<{ code: string; path: string }> = [
  {
    code: 'GB',
    path: 'M300,160 L330,150 L345,170 L340,210 L325,230 L310,220 L295,195Z',
  },
  {
    code: 'NO',
    path: 'M420,40 L450,30 L465,55 L460,100 L450,140 L435,155 L425,130 L420,80Z',
  },
  { code: 'CH', path: 'M400,290 L430,285 L435,300 L420,305 L405,300Z' },
  {
    code: 'UA',
    path: 'M570,210 L640,200 L660,230 L650,270 L610,280 L580,275 L565,250Z',
  },
  {
    code: 'TR',
    path: 'M600,340 L680,330 L700,350 L690,375 L640,380 L610,370Z',
  },
  {
    code: 'RS',
    path: 'M520,305 L545,300 L555,320 L545,335 L525,335 L515,320Z',
  },
  { code: 'BA', path: 'M490,315 L515,310 L520,330 L505,340 L488,330Z' },
  { code: 'AL', path: 'M510,340 L525,335 L530,360 L520,370 L508,360Z' },
  { code: 'MK', path: 'M530,335 L550,330 L555,345 L545,355 L528,350Z' },
  { code: 'ME', path: 'M498,330 L512,325 L515,342 L505,348 L495,340Z' },
];

function getCountryColor(volumeMt: number): string {
  if (volumeMt > 100) return '#064E3B';
  if (volumeMt > 50) return '#065F46';
  if (volumeMt > 30) return '#047857';
  if (volumeMt > 15) return '#1BC454';
  if (volumeMt > 8) return '#34D399';
  if (volumeMt > 3) return '#6EE7B7';
  if (volumeMt > 0) return '#A7F3D0';
  return '#E2E8F0';
}

export function EuropeMap({ countryStats }: { countryStats: CountryStat[] }) {
  const t = useTranslations('marketing');
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const volumeByCountry = new Map<string, number>();
  for (const row of countryStats) {
    const cur = volumeByCountry.get(row.country_code) ?? 0;
    volumeByCountry.set(row.country_code, cur + row.tonnage_tonnes);
  }

  const hoveredInfo = hovered ? COUNTRY_VOLUMES[hovered] : null;
  const hoveredVol = hovered
    ? (volumeByCountry.get(hovered) ?? COUNTRY_VOLUMES[hovered]?.volume ?? 0)
    : 0;

  return (
    <div className="relative">
      <div
        className="relative mx-auto max-w-[800px]"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 55,
          });
        }}
      >
        <svg
          viewBox="200 20 520 450"
          className="w-full"
          style={{ height: 'auto' }}
        >
          {NON_EU_COUNTRIES.map((c) => (
            <path
              key={c.code}
              d={c.path}
              fill="#E2E8F0"
              stroke="#FFFFFF"
              strokeWidth={0.8}
              opacity={0.5}
            />
          ))}

          {EU_COUNTRIES.map((c) => {
            const vol = volumeByCountry.get(c.code)
              ? Number(volumeByCountry.get(c.code)) / 1_000_000
              : (COUNTRY_VOLUMES[c.code]?.volume ?? 0);
            const isHovered = hovered === c.code;

            return (
              <path
                key={c.code}
                d={c.path}
                fill={getCountryColor(vol)}
                stroke="#FFFFFF"
                strokeWidth={isHovered ? 2 : 1}
                opacity={hovered && !isHovered ? 0.6 : 1}
                className="cursor-pointer transition-all duration-200"
                style={{ filter: isHovered ? 'brightness(0.85)' : undefined }}
                onMouseEnter={() => setHovered(c.code)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>

        {hoveredInfo && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 whitespace-nowrap shadow-lg"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <p className="text-metal-900 text-[13px] font-semibold">
              {hoveredInfo.nameFR}
            </p>
            <p className="text-primary text-xs font-medium">
              {hoveredVol > 1_000_000
                ? `${(hoveredVol / 1_000_000).toFixed(1)} Mt/an`
                : `${hoveredInfo.volume.toFixed(1)} Mt/an`}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-metal-500">Volume :</span>
        {[
          { color: '#A7F3D0', label: '< 5 Mt' },
          { color: '#6EE7B7', label: '' },
          { color: '#34D399', label: '' },
          { color: '#1BC454', label: '' },
          { color: '#065F46', label: '' },
          { color: '#064E3B', label: '> 100 Mt' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label && <span className="text-metal-400">{item.label}</span>}
          </div>
        ))}
        <span className="text-metal-400 ml-3 flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-[#E2E8F0]" />
          Hors UE
        </span>
      </div>
    </div>
  );
}
