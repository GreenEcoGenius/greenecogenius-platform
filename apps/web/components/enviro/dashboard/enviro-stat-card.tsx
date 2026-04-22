'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@kit/ui/utils';

import { AnimatedCounter } from '../animations/animated-counter';

const enviroStatCardClasses = cva(
  'group/enviro-stat relative flex min-h-[200px] flex-col gap-4 overflow-hidden border p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
  {
    variants: {
      variant: {
        forest:
          'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse] border-[--color-enviro-forest-700] shadow-[--shadow-enviro-elevated]',
        cream:
          'bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900] border-[--color-enviro-cream-300] shadow-[--shadow-enviro-card]',
        lime: 'bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900] border-[--color-enviro-lime-400] shadow-[--shadow-enviro-card]',
        ember:
          'bg-[--color-enviro-ember-500] text-[--color-enviro-cta-fg] border-[--color-enviro-ember-600] shadow-[--shadow-enviro-elevated]',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-[--shadow-enviro-lg]',
      },
    },
    defaultVariants: {
      variant: 'forest',
      hover: 'lift',
    },
  },
);

type EnviroStatCardClassesProps = VariantProps<typeof enviroStatCardClasses>;

export interface EnviroStatMetric {
  /** Already-translated label. */
  label: ReactNode;
  /** Already-formatted value. */
  value: ReactNode;
}

interface EnviroStatCardProps extends EnviroStatCardClassesProps {
  /** Already-translated short label rendered above the value. */
  label: ReactNode;
  /**
   * Numeric value. When provided, an animated counter is rendered. Use
   * `valueDisplay` instead if you need to render a non-numeric value
   * (e.g. a dash placeholder, "Sur mesure"). Both can be combined with
   * `prefix` / `suffix`.
   */
  value?: number;
  /** Override the rendered value with a `ReactNode` (no animation). */
  valueDisplay?: ReactNode;
  /** Optional prefix prepended to the animated counter (e.g. "€"). */
  prefix?: string;
  /** Optional suffix appended to the animated counter (e.g. " %"). */
  suffix?: string;
  /** Decimal digits forwarded to `AnimatedCounter`. */
  fractionDigits?: number;
  /** Already-translated subtitle below the value. */
  subtitle?: ReactNode;
  /** Lucide-style icon node displayed in the top-right corner. */
  icon?: ReactNode;
  /** Optional secondary metrics rendered as label/value rows. */
  metrics?: EnviroStatMetric[];
  /** Optional action label + href rendered as a footer CTA. */
  actionLabel?: ReactNode;
  actionHref?: string;
  /** Forwarded for layout overrides. */
  className?: string;
  /** Card border radius. */
  radius?: 'md' | 'lg' | 'xl';
}

/**
 * Branded KPI card. Replaces the legacy `KpiCard` (`teal/emerald/green`
 * gradients) with the four Enviro tones (`forest`, `cream`, `lime`, `ember`)
 * and surfaces an animated counter that respects `prefers-reduced-motion`
 * via `AnimatedCounter`.
 *
 * Hydration: the `AnimatedCounter` already starts at 0 on SSR + client.
 * Nothing else here depends on client-only state, so the card markup is
 * deterministic.
 */
export function EnviroStatCard({
  variant,
  hover,
  label,
  value,
  valueDisplay,
  prefix,
  suffix,
  fractionDigits,
  subtitle,
  icon,
  metrics,
  actionLabel,
  actionHref,
  className,
  radius = 'lg',
}: EnviroStatCardProps) {
  const radiusClass = {
    md: 'rounded-[--radius-enviro-md]',
    lg: 'rounded-[--radius-enviro-xl]',
    xl: 'rounded-[--radius-enviro-3xl]',
  }[radius];

  const isInverse = variant === 'forest' || variant === 'ember';

  return (
    <div
      className={cn(
        enviroStatCardClasses({ variant, hover }),
        radiusClass,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <p
            className={cn(
              'text-[11px] font-semibold uppercase tracking-[0.08em] font-[family-name:var(--font-enviro-mono)]',
              isInverse
                ? 'text-[--color-enviro-fg-inverse-muted]'
                : 'text-[--color-enviro-forest-700]',
            )}
          >
            {label}
          </p>

          <p className="text-3xl leading-none font-semibold tabular-nums font-[family-name:var(--font-enviro-display)]">
            {valueDisplay !== undefined ? (
              valueDisplay
            ) : typeof value === 'number' ? (
              <AnimatedCounter
                value={value}
                prefix={prefix}
                suffix={suffix}
                fractionDigits={fractionDigits}
              />
            ) : null}
          </p>

          {subtitle ? (
            <p
              className={cn(
                'text-xs font-[family-name:var(--font-enviro-sans)]',
                isInverse
                  ? 'text-[--color-enviro-fg-inverse-muted]'
                  : 'text-[--color-enviro-forest-700]',
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {icon ? (
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-[--radius-enviro-md]',
              isInverse
                ? 'bg-white/10 text-[--color-enviro-lime-300]'
                : 'bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900]',
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>

      {metrics && metrics.length > 0 ? (
        <div
          className={cn(
            'mt-auto flex flex-col gap-1.5 text-sm font-[family-name:var(--font-enviro-sans)]',
            isInverse
              ? 'text-[--color-enviro-fg-inverse-muted]'
              : 'text-[--color-enviro-forest-700]',
          )}
        >
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <span>{m.label}</span>
              <span
                className={cn(
                  'font-semibold tabular-nums',
                  isInverse
                    ? 'text-[--color-enviro-fg-inverse]'
                    : 'text-[--color-enviro-forest-900]',
                )}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className={cn(
            'mt-auto inline-flex w-fit items-center gap-1.5 rounded-[--radius-enviro-pill] px-4 py-2 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60',
            isInverse
              ? 'bg-white/10 text-[--color-enviro-fg-inverse] hover:bg-white/15'
              : 'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse] hover:bg-[--color-enviro-forest-700]',
          )}
        >
          {actionLabel}
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

export function EnviroStatCardGrid({
  children,
  className,
  cols = 3,
}: {
  children: ReactNode;
  className?: string;
  cols?: 2 | 3 | 4;
}) {
  const colsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[cols];

  return (
    <div className={cn('grid grid-cols-1 gap-4 lg:gap-6', colsClass, className)}>
      {children}
    </div>
  );
}

export { enviroStatCardClasses };
