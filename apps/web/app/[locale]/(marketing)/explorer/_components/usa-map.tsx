'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { formatVolume, type NationalStat } from './explorer-data';

const US_STATES: Array<{
  code: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
}> = [
  {
    code: 'AL',
    name: 'Alabama',
    path: 'M628,396 L628,440 L618,454 L610,454 L608,448 L604,446 L604,396Z',
    labelX: 616,
    labelY: 425,
  },
  {
    code: 'AK',
    name: 'Alaska',
    path: 'M161,485 L183,485 L183,510 L209,510 L209,530 L161,530Z',
    labelX: 185,
    labelY: 508,
  },
  {
    code: 'AZ',
    name: 'Arizona',
    path: 'M205,380 L262,380 L270,388 L270,440 L260,456 L205,456 L200,430Z',
    labelX: 235,
    labelY: 418,
  },
  {
    code: 'AR',
    name: 'Arkansas',
    path: 'M548,388 L600,388 L604,396 L604,436 L548,436Z',
    labelX: 576,
    labelY: 412,
  },
  {
    code: 'CA',
    name: 'California',
    path: 'M120,260 L170,240 L192,260 L200,300 L205,380 L200,430 L160,430 L140,390 L115,330 L110,290Z',
    labelX: 155,
    labelY: 340,
  },
  {
    code: 'CO',
    name: 'Colorado',
    path: 'M290,280 L380,280 L380,340 L290,340Z',
    labelX: 335,
    labelY: 310,
  },
  {
    code: 'CT',
    name: 'Connecticut',
    path: 'M770,210 L790,204 L795,220 L778,225Z',
    labelX: 783,
    labelY: 215,
  },
  {
    code: 'DE',
    name: 'Delaware',
    path: 'M752,280 L762,275 L765,295 L755,300Z',
    labelX: 758,
    labelY: 288,
  },
  {
    code: 'FL',
    name: 'Florida',
    path: 'M618,454 L680,440 L710,450 L720,470 L700,510 L675,520 L660,500 L640,490 L618,475 L610,454Z',
    labelX: 670,
    labelY: 475,
  },
  {
    code: 'GA',
    name: 'Georgia',
    path: 'M640,380 L690,380 L695,395 L690,440 L680,440 L628,440 L628,396 L640,388Z',
    labelX: 660,
    labelY: 410,
  },
  {
    code: 'HI',
    name: 'Hawaii',
    path: 'M270,490 L295,485 L300,500 L285,505 L270,500Z',
    labelX: 285,
    labelY: 495,
  },
  {
    code: 'ID',
    name: 'Idaho',
    path: 'M220,140 L265,130 L275,160 L270,220 L245,240 L220,240 L215,200Z',
    labelX: 245,
    labelY: 185,
  },
  {
    code: 'IL',
    name: 'Illinois',
    path: 'M570,240 L600,240 L600,260 L605,300 L598,340 L580,350 L565,340 L560,300 L565,260Z',
    labelX: 582,
    labelY: 290,
  },
  {
    code: 'IN',
    name: 'Indiana',
    path: 'M600,240 L635,240 L638,260 L635,330 L598,340 L605,300 L600,260Z',
    labelX: 618,
    labelY: 285,
  },
  {
    code: 'IA',
    name: 'Iowa',
    path: 'M490,230 L560,225 L570,240 L565,260 L560,280 L500,285 L488,270 L485,245Z',
    labelX: 525,
    labelY: 255,
  },
  {
    code: 'KS',
    name: 'Kansas',
    path: 'M400,310 L500,310 L500,365 L400,365Z',
    labelX: 450,
    labelY: 338,
  },
  {
    code: 'KY',
    name: 'Kentucky',
    path: 'M598,340 L635,330 L680,320 L700,330 L685,345 L665,355 L620,370 L580,370 L580,350Z',
    labelX: 640,
    labelY: 345,
  },
  {
    code: 'LA',
    name: 'Louisiana',
    path: 'M548,436 L604,436 L604,470 L610,485 L590,490 L570,480 L548,475Z',
    labelX: 576,
    labelY: 458,
  },
  {
    code: 'ME',
    name: 'Maine',
    path: 'M790,110 L810,100 L820,120 L815,160 L800,170 L785,155 L785,130Z',
    labelX: 802,
    labelY: 135,
  },
  {
    code: 'MD',
    name: 'Maryland',
    path: 'M710,280 L752,275 L755,290 L750,300 L720,295Z',
    labelX: 733,
    labelY: 288,
  },
  {
    code: 'MA',
    name: 'Massachusetts',
    path: 'M770,195 L800,188 L808,195 L798,205 L770,210Z',
    labelX: 790,
    labelY: 200,
  },
  {
    code: 'MI',
    name: 'Michigan',
    path: 'M580,150 L600,145 L625,155 L640,180 L645,220 L635,240 L600,240 L590,230 L585,200 L575,175Z',
    labelX: 612,
    labelY: 195,
  },
  {
    code: 'MN',
    name: 'Minnesota',
    path: 'M470,120 L540,115 L545,130 L540,200 L530,220 L490,230 L485,215 L475,170Z',
    labelX: 510,
    labelY: 170,
  },
  {
    code: 'MS',
    name: 'Mississippi',
    path: 'M580,388 L604,396 L604,446 L610,454 L590,460 L575,460 L570,436 L575,405Z',
    labelX: 588,
    labelY: 425,
  },
  {
    code: 'MO',
    name: 'Missouri',
    path: 'M500,285 L560,280 L565,340 L580,350 L580,370 L548,388 L530,380 L500,365 L500,310Z',
    labelX: 535,
    labelY: 330,
  },
  {
    code: 'MT',
    name: 'Montana',
    path: 'M250,100 L380,95 L385,160 L380,180 L275,185 L265,160 L265,130Z',
    labelX: 325,
    labelY: 140,
  },
  {
    code: 'NE',
    name: 'Nebraska',
    path: 'M380,260 L490,255 L500,285 L500,310 L400,310 L385,295 L380,275Z',
    labelX: 440,
    labelY: 283,
  },
  {
    code: 'NV',
    name: 'Nevada',
    path: 'M170,240 L220,220 L230,260 L225,340 L205,380 L165,370 L140,310Z',
    labelX: 190,
    labelY: 300,
  },
  {
    code: 'NH',
    name: 'New Hampshire',
    path: 'M785,130 L795,125 L800,170 L790,178 L782,165Z',
    labelX: 790,
    labelY: 152,
  },
  {
    code: 'NJ',
    name: 'New Jersey',
    path: 'M755,240 L765,235 L770,260 L762,280 L752,275 L750,255Z',
    labelX: 760,
    labelY: 258,
  },
  {
    code: 'NM',
    name: 'New Mexico',
    path: 'M270,370 L350,365 L360,440 L355,458 L270,456Z',
    labelX: 310,
    labelY: 412,
  },
  {
    code: 'NY',
    name: 'New York',
    path: 'M700,160 L760,155 L775,180 L780,200 L770,210 L755,230 L755,240 L735,240 L720,230 L700,210Z',
    labelX: 740,
    labelY: 195,
  },
  {
    code: 'NC',
    name: 'North Carolina',
    path: 'M640,345 L665,355 L720,340 L755,345 L740,360 L710,370 L660,375 L628,380 L640,370Z',
    labelX: 695,
    labelY: 358,
  },
  {
    code: 'ND',
    name: 'North Dakota',
    path: 'M380,100 L470,100 L475,170 L385,175 L380,160Z',
    labelX: 428,
    labelY: 135,
  },
  {
    code: 'OH',
    name: 'Ohio',
    path: 'M635,240 L680,230 L700,250 L700,310 L680,320 L635,330 L638,260Z',
    labelX: 668,
    labelY: 278,
  },
  {
    code: 'OK',
    name: 'Oklahoma',
    path: 'M380,365 L400,365 L500,365 L530,380 L548,388 L548,400 L500,400 L440,400 L400,400 L395,380Z',
    labelX: 465,
    labelY: 383,
  },
  {
    code: 'OR',
    name: 'Oregon',
    path: 'M120,140 L200,120 L220,140 L215,200 L220,240 L170,240 L130,210 L115,175Z',
    labelX: 168,
    labelY: 180,
  },
  {
    code: 'PA',
    name: 'Pennsylvania',
    path: 'M690,225 L750,218 L755,240 L735,240 L720,245 L700,250 L690,240Z',
    labelX: 722,
    labelY: 235,
  },
  {
    code: 'RI',
    name: 'Rhode Island',
    path: 'M790,208 L798,205 L800,215 L792,218Z',
    labelX: 795,
    labelY: 212,
  },
  {
    code: 'SC',
    name: 'South Carolina',
    path: 'M660,375 L710,370 L720,385 L700,405 L675,400 L650,395 L640,388Z',
    labelX: 680,
    labelY: 388,
  },
  {
    code: 'SD',
    name: 'South Dakota',
    path: 'M380,175 L475,170 L485,215 L485,245 L490,255 L380,260Z',
    labelX: 432,
    labelY: 215,
  },
  {
    code: 'TN',
    name: 'Tennessee',
    path: 'M580,350 L620,370 L640,370 L680,355 L700,352 L700,370 L640,380 L580,388 L560,385 L565,365Z',
    labelX: 635,
    labelY: 368,
  },
  {
    code: 'TX',
    name: 'Texas',
    path: 'M350,400 L440,400 L500,400 L548,400 L548,436 L548,475 L530,490 L500,500 L460,510 L420,500 L380,490 L355,458 L350,440Z',
    labelX: 450,
    labelY: 450,
  },
  {
    code: 'UT',
    name: 'Utah',
    path: 'M230,260 L290,260 L290,340 L270,370 L225,340Z',
    labelX: 260,
    labelY: 300,
  },
  {
    code: 'VT',
    name: 'Vermont',
    path: 'M770,145 L785,140 L790,170 L778,178 L770,165Z',
    labelX: 780,
    labelY: 158,
  },
  {
    code: 'VA',
    name: 'Virginia',
    path: 'M660,310 L700,310 L740,305 L755,310 L755,345 L720,340 L680,320Z',
    labelX: 710,
    labelY: 325,
  },
  {
    code: 'WA',
    name: 'Washington',
    path: 'M140,70 L220,65 L230,90 L225,130 L220,140 L120,140 L115,110Z',
    labelX: 175,
    labelY: 105,
  },
  {
    code: 'WV',
    name: 'West Virginia',
    path: 'M680,280 L710,280 L720,295 L710,310 L700,310 L685,320 L680,310 L690,295Z',
    labelX: 698,
    labelY: 298,
  },
  {
    code: 'WI',
    name: 'Wisconsin',
    path: 'M530,130 L575,125 L580,150 L590,200 L585,230 L570,240 L540,230 L530,220 L535,180Z',
    labelX: 558,
    labelY: 175,
  },
  {
    code: 'WY',
    name: 'Wyoming',
    path: 'M275,185 L380,180 L385,240 L380,260 L290,260 L280,240Z',
    labelX: 330,
    labelY: 220,
  },
  {
    code: 'DC',
    name: 'District of Columbia',
    path: 'M738,290 L742,286 L745,292 L740,295Z',
    labelX: 741,
    labelY: 291,
  },
];

function getStateColor(volumeMt: number): string {
  if (volumeMt > 20) return '#064E3B';
  if (volumeMt > 15) return '#065F46';
  if (volumeMt > 10) return '#047857';
  if (volumeMt > 5) return '#1BAF6A';
  if (volumeMt > 2) return '#34D399';
  if (volumeMt > 0.5) return '#6EE7B7';
  return '#D1FAE5';
}

const STATE_VOLUMES: Record<string, number> = {
  CA: 22.5,
  TX: 20.8,
  FL: 14.2,
  NY: 13.8,
  PA: 10.5,
  IL: 10.2,
  OH: 9.8,
  GA: 8.5,
  MI: 8.1,
  NC: 7.9,
  NJ: 7.5,
  VA: 6.8,
  WA: 6.2,
  MA: 5.9,
  IN: 5.7,
  TN: 5.5,
  MO: 5.2,
  WI: 5.0,
  MN: 4.8,
  MD: 4.5,
  AZ: 4.3,
  CO: 4.1,
  AL: 3.8,
  SC: 3.5,
  LA: 3.4,
  KY: 3.2,
  OR: 3.0,
  OK: 2.8,
  CT: 2.6,
  IA: 2.5,
  MS: 2.3,
  AR: 2.1,
  KS: 2.0,
  NV: 1.8,
  UT: 1.7,
  NE: 1.5,
  NM: 1.3,
  WV: 1.2,
  ID: 1.1,
  HI: 1.0,
  ME: 0.9,
  NH: 0.8,
  RI: 0.7,
  MT: 0.7,
  DE: 0.6,
  SD: 0.6,
  ND: 0.5,
  AK: 0.5,
  VT: 0.4,
  WY: 0.4,
  DC: 0.3,
};

export function UsaMap({ stats }: { stats: NationalStat[] }) {
  const t = useTranslations('marketing');
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const hoveredState = hovered
    ? US_STATES.find((s) => s.code === hovered)
    : null;
  const hoveredVolume = hovered ? (STATE_VOLUMES[hovered] ?? 0) : 0;

  const totalVolume = stats.reduce((s, r) => s + r.annual_volume_tonnes, 0);

  return (
    <div className="relative">
      <div
        className="relative mx-auto max-w-[900px]"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 55,
          });
        }}
      >
        <svg
          viewBox="80 50 760 500"
          className="w-full"
          style={{ height: 'auto' }}
        >
          {US_STATES.map((state) => {
            const vol = STATE_VOLUMES[state.code] ?? 0;
            const isHovered = hovered === state.code;

            return (
              <path
                key={state.code}
                d={state.path}
                fill={getStateColor(vol)}
                stroke="#ffffff"
                strokeWidth={isHovered ? 2 : 1}
                opacity={hovered && !isHovered ? 0.6 : 1}
                className="cursor-pointer transition-all duration-200"
                style={{ filter: isHovered ? 'brightness(0.85)' : undefined }}
                onMouseEnter={() => setHovered(state.code)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>

        {hoveredState && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 whitespace-nowrap shadow-lg"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <p className="text-metal-900 text-[13px] font-semibold">
              {hoveredState.name}
            </p>
            <p className="text-primary text-xs font-medium">
              {hoveredVolume.toFixed(1)} {t('explorer.mtPerYear')}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-metal-500">{t('explorer.volumeLabel')} :</span>
        {[
          { color: '#D1FAE5', label: '< 1 Mt' },
          { color: '#6EE7B7', label: '' },
          { color: '#34D399', label: '' },
          { color: '#1BAF6A', label: '' },
          { color: '#047857', label: '' },
          { color: '#064E3B', label: '> 20 Mt' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label && <span className="text-metal-400">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
