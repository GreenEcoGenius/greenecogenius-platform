import type { ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

interface EnviroEmptyStateProps {
  /** Lucide-style icon (already coloured if needed). */
  icon?: ReactNode;
  /** Bracket tag rendered above the title. */
  tag?: ReactNode;
  /** Already-translated title. */
  title: ReactNode;
  /** Optional supporting body. */
  body?: ReactNode;
  /** Optional CTAs row (typically `EnviroButton`). */
  actions?: ReactNode;
  /** Surface tone. `cream` is the dashboard default. */
  tone?: 'cream' | 'forest';
  className?: string;
}

/**
 * Branded empty state: bracket tag + display title + optional CTA, on a
 * dashed cream surface that lives well inside an `EnviroCard`. Replaces
 * the inline empty blocks scattered across the legacy dashboard pages.
 */
export function EnviroEmptyState({
  icon,
  tag,
  title,
  body,
  actions,
  tone = 'cream',
  className,
}: EnviroEmptyStateProps) {
  const isCream = tone === 'cream';

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-[--radius-enviro-lg] border border-dashed px-6 py-12 text-center',
        isCream
          ? 'border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]'
          : 'border-[--color-enviro-forest-700] bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse]',
        className,
      )}
    >
      {icon ? (
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-[--radius-enviro-pill]',
            isCream
              ? 'bg-[--color-enviro-lime-100] text-[--color-enviro-forest-900]'
              : 'bg-white/10 text-[--color-enviro-lime-300]',
          )}
        >
          {icon}
        </div>
      ) : null}

      {tag ? (
        <span
          className={cn(
            'inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] font-[family-name:var(--font-enviro-mono)]',
            isCream
              ? 'text-[--color-enviro-forest-700]'
              : 'text-[--color-enviro-lime-300]',
          )}
        >
          <span aria-hidden="true">[</span>
          <span className="px-1">{tag}</span>
          <span aria-hidden="true">]</span>
        </span>
      ) : null}

      <h3 className="max-w-sm text-balance text-xl font-semibold leading-tight font-[family-name:var(--font-enviro-display)]">
        {title}
      </h3>

      {body ? (
        <p
          className={cn(
            'max-w-md text-sm leading-relaxed font-[family-name:var(--font-enviro-sans)]',
            isCream
              ? 'text-[--color-enviro-forest-700]'
              : 'text-[--color-enviro-fg-inverse-muted]',
          )}
        >
          {body}
        </p>
      ) : null}

      {actions ? (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
