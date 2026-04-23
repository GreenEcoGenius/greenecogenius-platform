import type { ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

interface EnviroSectionHeaderProps {
  /**
   * Short tag rendered between brackets (e.g. "[ Services ]"). Provided
   * already-translated by the caller (no hardcoded strings here).
   */
  tag?: ReactNode;
  /** Main display title. */
  title: ReactNode;
  /** Optional subtitle / supporting paragraph. */
  subtitle?: ReactNode;
  /** Color variant for the surrounding context. */
  tone?: 'forest' | 'cream';
  /** Horizontal alignment. */
  align?: 'left' | 'center';
  className?: string;
  /** Heading level (visual size stays the same). */
  as?: 'h1' | 'h2' | 'h3';
}

/**
 * Bracketed tag + display title + supporting subtitle. Used as the canonical
 * heading group across Enviro sections (hero, stats, timeline, comparison,
 * pricing, faq, etc.).
 */
export function EnviroSectionHeader({
  tag,
  title,
  subtitle,
  tone = 'forest',
  align = 'left',
  className,
  as = 'h2',
}: EnviroSectionHeaderProps) {
  const Heading = as;

  const isCream = tone === 'cream';

  return (
    <div
      className={cn(
        'flex max-w-3xl flex-col gap-4',
        align === 'center' && 'mx-auto items-center text-center',
        className,
      )}
    >
      {tag ? (
        <span
          className={cn(
            'inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] font-[family-name:var(--font-enviro-mono)]',
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

      <Heading
        className={cn(
          'text-balance leading-[1.1] tracking-[-0.02em] font-semibold font-[family-name:var(--font-enviro-display)]',
          'text-4xl md:text-5xl lg:text-6xl',
          isCream
            ? 'text-[--color-enviro-forest-900]'
            : 'text-[--color-enviro-fg-inverse]',
        )}
      >
        {title}
      </Heading>

      {subtitle ? (
        <p
          className={cn(
            'max-w-2xl text-base md:text-lg leading-relaxed font-[family-name:var(--font-enviro-sans)]',
            isCream
              ? 'text-[--color-enviro-forest-700]'
              : 'text-[--color-enviro-fg-inverse-muted]',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
