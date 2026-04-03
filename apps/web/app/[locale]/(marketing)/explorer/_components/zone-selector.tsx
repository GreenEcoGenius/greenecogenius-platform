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
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? 'bg-[#059669] text-white shadow-md'
                : 'border border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            {t(`explorer.zone.${id}`)}
          </button>
        );
      })}
    </div>
  );
}
