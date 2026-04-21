'use client';

import { Globe, Map, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { Zone } from './explorer-data';

const ZONES: { id: Zone; icon: typeof Map }[] = [
  { id: 'france', icon: MapPin },
  { id: 'europe', icon: Globe },
  { id: 'usa', icon: Map },
];

export function ZoneSelector({
  active,
  onChange,
}: {
  active: Zone;
  onChange: (zone: Zone) => void;
}) {
  const t = useTranslations('marketing');

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {ZONES.map(({ id, icon: Icon }) => {
        const isActive = active === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-2 rounded-[--radius-enviro-pill] border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] font-[family-name:var(--font-enviro-sans)] ${
              isActive
                ? 'border-[--color-enviro-forest-900] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300] shadow-[--shadow-enviro-md]'
                : 'border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] text-[--color-enviro-forest-700] hover:border-[--color-enviro-forest-700] hover:bg-white'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
            {t(`explorer.zone.${id}`)}
          </button>
        );
      })}
    </div>
  );
}
