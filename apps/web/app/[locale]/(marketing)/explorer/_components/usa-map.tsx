'use client';

import { useTranslations } from 'next-intl';

import {
  CATEGORY_META,
  formatVolume,
  type CategorySlug,
  type NationalStat,
} from './explorer-data';

const US_CONTINENTAL =
  'M 161.1,453.7 L 160.3,442.1 L 162.5,429.5 L 163.4,416.2 L 152.1,413.4 L 141.2,410.9 ' +
  'L 130.4,407.4 L 119.9,403.4 L 110.1,398.3 L 101.8,393.2 L 94.9,389.1 L 85.4,383.7 ' +
  'L 78.8,378.6 L 73.5,374.9 L 70.2,371.5 L 62.7,362.6 L 57.1,356.1 L 50.7,348.5 ' +
  'L 45.8,341.6 L 42.4,336.6 L 38.2,328.8 L 35.7,322.1 L 34.1,316.7 L 32.7,309.1 ' +
  'L 32.1,301.1 L 32.7,293.5 L 34.1,287.4 L 37.5,278.2 L 43.2,268.6 L 50.3,259.4 ' +
  'L 56.9,252.9 L 64.4,247.8 L 72.1,244.2 L 78.8,242.4 L 87.5,241.3 L 95.1,241.3 ' +
  'L 102.8,241.9 L 110.8,244.2 L 117.7,246.8 L 125.4,251.1 L 131.8,255.9 L 137.9,262.4 ' +
  'L 141.2,267.2 L 144.7,274.2 L 147.7,282.4 L 149.5,290.1 L 149.5,296.7 L 148.8,305.4 ' +
  'L 148.1,312.3 L 148.1,312.3 L 153.5,314.9 L 159.9,317.5 L 168.6,320.9 L 177.3,323.5 ' +
  'L 186.4,324.9 L 194.5,325.3 L 204.5,324.9 L 213.5,323.5 L 221.6,321.6 L 229.6,319.1 ' +
  'L 239.6,314.9 L 249.3,309.8 L 257.3,304.7 L 264.5,299.3 L 271.4,292.4 L 278.2,284.4 ' +
  'L 283.6,277.5 L 288.4,270.2 L 293.2,261.2 L 296.6,253.6 L 299.2,245.6 L 301.4,236.6 ' +
  'L 302.8,227.6 L 303.5,219.2 L 303.5,211.2 L 302.4,200.8 L 300.6,192.4 L 297.7,183.8 ' +
  'L 293.5,174.5 L 289.3,167.2 L 283.9,159.9 L 277.5,152.8 L 270.2,146.5 L 262.2,140.9 ' +
  'L 253.6,136.5 L 244.6,133.1 L 235.6,130.9 L 225.9,129.5 L 216.9,129.5 L 209.5,130.2 ' +
  'L 201.9,131.6 L 192.9,134.5 L 185.2,137.8 L 178.2,141.9 L 171.6,146.5 L 165.9,151.6 ' +
  'L 160.9,157.9 L 157.1,164.2 L 154.2,170.5 L 151.9,177.9 L 150.5,184.5 L 149.9,191.2 ' +
  'L 149.9,199.5 L 150.5,207.2 L 151.9,215.5 L 154.5,225.2 L 157.5,233.9 L 160.1,240.9 ' +
  'L 160.1,240.9 L 157.1,250.2 L 154.2,260.5 L 152.8,270.2 L 151.9,278.9 L 151.9,289.2 ' +
  'L 152.5,297.9 L 153.5,306.5 L 155.1,316.2 L 157.1,324.5 L 159.5,332.9 L 161.5,340.9 ' +
  'L 163.1,349.5 L 163.8,358.9 L 163.4,367.5 L 162.5,377.5 L 161.1,387.9 L 159.5,399.5 ' +
  'L 158.8,409.5 L 158.8,420.2 L 159.1,430.9 L 159.5,441.5 L 161.1,453.7 Z';

const ALASKA =
  'M 39.8,493.2 L 32.1,489.5 L 28.1,483.2 L 27.4,476.5 L 30.8,470.5 L 36.4,467.2 ' +
  'L 43.1,466.8 L 49.8,469.2 L 54.4,473.8 L 56.4,479.5 L 55.8,485.8 L 52.4,491.2 ' +
  'L 46.4,494.2 L 39.8,493.2 Z';

const HAWAII =
  'M 108.2,488.4 L 104.8,485.1 L 103.2,480.7 L 104.2,476.4 L 107.2,473.4 L 111.2,472.1 ' +
  'L 115.2,473.1 L 118.2,476.1 L 119.5,480.1 L 118.5,484.4 L 115.5,487.7 L 111.5,489.1 ' +
  'L 108.2,488.4 Z';

export function UsaMap({ stats }: { stats: NationalStat[] }) {
  const t = useTranslations('marketing');
  const totalVolume = stats.reduce((s, r) => s + r.total_volume_tonnes, 0);

  return (
    <div className="relative">
      <svg
        viewBox="20 120 300 400"
        className="mx-auto w-full max-w-2xl"
        role="img"
        aria-label="USA recyclable materials"
      >
        <path
          d={US_CONTINENTAL}
          fill="#059669"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity={0.9}
        />
        <path
          d={ALASKA}
          fill="#059669"
          stroke="#ffffff"
          strokeWidth="1"
          opacity={0.9}
        />
        <path
          d={HAWAII}
          fill="#059669"
          stroke="#ffffff"
          strokeWidth="1"
          opacity={0.9}
        />

        <text
          x="200"
          y="290"
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="16"
        >
          {formatVolume(totalVolume)} t/an
        </text>
        <text
          x="200"
          y="308"
          textAnchor="middle"
          fill="white"
          opacity={0.8}
          fontSize="10"
        >
          {t('explorer.zone.usa')} — EPA 2018
        </text>
      </svg>

      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {[...stats]
          .sort((a, b) => b.total_volume_tonnes - a.total_volume_tonnes)
          .slice(0, 4)
          .map((stat) => {
            const slug = stat.category as CategorySlug;
            const meta = CATEGORY_META[slug];
            if (!meta) return null;
            const Icon = meta.icon;

            return (
              <div
                key={stat.category}
                className="border-metal-chrome flex items-center gap-2 rounded-lg border bg-white p-3"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.bgColor} ${meta.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-metal-900 truncate text-xs font-semibold">
                    {t(`explorer.cat.${slug}`)}
                  </p>
                  <p className="text-metal-500 text-xs">
                    {formatVolume(stat.total_volume_tonnes)} t
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
