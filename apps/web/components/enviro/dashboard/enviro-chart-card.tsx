import type { ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

interface EnviroChartCardProps {
  /** Bracket tag rendered above the title (already-translated). */
  tag?: ReactNode;
  /** Already-translated title. */
  title: ReactNode;
  /** Optional supporting subtitle. */
  subtitle?: ReactNode;
  /** Right-side actions (typically Export buttons). */
  actions?: ReactNode;
  /**
   * The chart itself. Pass any Recharts (or other) chart node here. The
   * wrapper does NOT touch palette: this component exists precisely to keep
   * the GEG charts intact while harmonising the surrounding container.
   */
  children: ReactNode;
  /** Additional classes for the wrapper. */
  className?: string;
  /** Inner padding for the chart area. Default: `md`. */
  padding?: 'sm' | 'md' | 'lg';
  /** Fixed height applied to the chart area (Recharts needs a parent height). */
  height?: number | string;
}

/**
 * Card surface dedicated to wrapping Recharts components without leaking
 * Enviro tokens into the chart palette. Phase 6 explicitly preserves the
 * historic GEG palette (lime / circuit / teal) inside the charts and only
 * harmonises the outer container (header bracket, surface, actions).
 *
 * Per the Phase 6 contract:
 *   - charts palette → unchanged (handled by the chart component itself);
 *   - container → forest-700 bracket tag, display title, cream surface;
 *   - actions → CSV / PDF export buttons rendered to the top-right.
 */
export function EnviroChartCard({
  tag,
  title,
  subtitle,
  actions,
  children,
  className,
  padding = 'md',
  height,
}: EnviroChartCardProps) {
  const paddingClass = {
    sm: 'p-4',
    md: 'p-5 md:p-6',
    lg: 'p-6 md:p-8',
  }[padding];

  return (
    <div
      className={cn(
        'flex flex-col gap-5 overflow-hidden rounded-[--radius-enviro-xl] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] shadow-[--shadow-enviro-card] font-[family-name:var(--font-enviro-sans)]',
        paddingClass,
        className,
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1.5">
          {tag ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[</span>
              <span className="px-1">{tag}</span>
              <span aria-hidden="true">]</span>
            </span>
          ) : null}

          <h3 className="text-base font-semibold leading-tight text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)] md:text-lg">
            {title}
          </h3>

          {subtitle ? (
            <p className="text-xs text-[--color-enviro-forest-700] md:text-sm">
              {subtitle}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>

      <div
        className="w-full"
        style={height !== undefined ? { height } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
