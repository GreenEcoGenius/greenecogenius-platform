import type { ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

interface EnviroDashboardSectionHeaderProps {
  /** Bracket tag rendered above the title (e.g. "[ Carbon ]"). */
  tag?: ReactNode;
  /** Already-translated title. */
  title: ReactNode;
  /** Optional supporting paragraph. */
  subtitle?: ReactNode;
  /** Optional CTAs slot rendered to the right (desktop) or below (mobile). */
  actions?: ReactNode;
  /** Heading level for the title. */
  as?: 'h1' | 'h2';
  className?: string;
}

/**
 * Section header tuned for inside the dashboard shell. Smaller display size
 * than `EnviroSectionHeader` (used in marketing) because dashboard pages have
 * far less vertical breathing room. Single tone: cream background assumed.
 */
export function EnviroDashboardSectionHeader({
  tag,
  title,
  subtitle,
  actions,
  as: Heading = 'h1',
  className,
}: EnviroDashboardSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="flex max-w-3xl flex-col gap-2">
        {tag ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
            <span aria-hidden="true">[</span>
            <span className="px-1">{tag}</span>
            <span aria-hidden="true">]</span>
          </span>
        ) : null}

        <Heading className="text-balance text-2xl leading-tight tracking-tight font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)] md:text-3xl">
          {title}
        </Heading>

        {subtitle ? (
          <p className="max-w-2xl text-sm leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)] md:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
