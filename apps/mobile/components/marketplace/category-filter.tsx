'use client';

import { useLocale, useTranslations } from 'next-intl';

import type { MaterialCategory } from '~/lib/queries/listings';

interface CategoryFilterProps {
  categories: MaterialCategory[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const t = useTranslations('marketplace');
  const locale = useLocale();

  return (
    <div className="-mx-4 mb-3 overflow-x-auto pb-1">
      <div className="flex gap-1.5 px-4">
        <Pill
          label={t('categoryAll')}
          active={selected === null}
          onClick={() => onSelect(null)}
        />
        {categories.map((cat) => {
          const label = locale === 'fr' ? cat.name_fr ?? cat.name : cat.name;
          return (
            <Pill
              key={cat.id}
              label={label}
              active={selected === cat.slug}
              onClick={() => onSelect(cat.slug)}
            />
          );
        })}
      </div>
    </div>
  );
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all ${
        active
          ? 'bg-[#B8D4E3] text-[#0A2F1F] shadow-sm'
          : 'bg-[#F5F5F0]/8 text-[#F5F5F0]/70 active:bg-[#F5F5F0]/12'
      }`}
    >
      {label}
    </button>
  );
}
