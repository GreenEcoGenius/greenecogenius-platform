'use client';

import type { ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

export interface EnviroFilterChipItem<T extends string = string> {
  /** Stable identifier used for selection comparison. */
  value: T;
  /** Already-translated label rendered inside the chip. */
  label: ReactNode;
  /** Optional count displayed as a small bubble. */
  count?: number;
}

interface EnviroFilterChipsProps<T extends string = string> {
  items: EnviroFilterChipItem<T>[];
  /** Currently active value. Pass `null` to render no active chip. */
  value: T | null;
  onChange: (next: T) => void;
  /** Background context. `cream` is the dashboard default. */
  tone?: 'cream' | 'forest';
  className?: string;
  /** Already-translated aria-label for the group. */
  ariaLabel?: string;
}

/**
 * Pill-style filter chips used across the Enviro dashboard. Re-implements
 * the same pattern Phase 4 introduced on `/faq`, `/changelog`, `/explorer`
 * and `/normes`, but in a reusable component so the four pages can converge
 * incrementally during Phase 6.
 *
 * Active state always uses the brand lime accent on a forest background to
 * keep colour semantics consistent with the sidebar active state.
 */
export function EnviroFilterChips<T extends string = string>({
  items,
  value,
  onChange,
  tone = 'cream',
  className,
  ariaLabel,
}: EnviroFilterChipsProps<T>) {
  const isCream = tone === 'cream';

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'flex flex-wrap gap-2 font-[family-name:var(--font-enviro-sans)]',
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            aria-pressed={active}
            className={cn(
              'inline-flex items-center gap-2 rounded-[--radius-enviro-pill] px-4 py-1.5 text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60',
              active
                ? 'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse] shadow-[--shadow-enviro-sm]'
                : isCream
                  ? 'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700] hover:bg-[--color-enviro-cream-200]'
                  : 'bg-white/10 text-[--color-enviro-fg-inverse-muted] hover:bg-white/15',
            )}
          >
            {item.label}
            {typeof item.count === 'number' ? (
              <span
                className={cn(
                  'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums font-[family-name:var(--font-enviro-mono)]',
                  active
                    ? 'bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900]'
                    : 'bg-[--color-enviro-cream-300]/70 text-[--color-enviro-forest-700]',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
