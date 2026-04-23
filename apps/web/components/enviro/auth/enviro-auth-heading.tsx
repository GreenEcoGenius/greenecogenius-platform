import type { ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

interface EnviroAuthHeadingProps {
  /** Bracket tag rendered above the title (already-translated). */
  tag?: ReactNode;
  /** Display title rendered as the page focal point. */
  title: ReactNode;
  /** Optional subtitle below the title. */
  subtitle?: ReactNode;
  /**
   * Heading level. Use `h1` on the very first heading of an auth page,
   * `h2` for secondary states (callback error, MFA challenge).
   */
  as?: 'h1' | 'h2';
  className?: string;
}

/**
 * Compact heading group used at the top of every auth page. Pairs with
 * `EnviroAuthLayout` so the bracket tag, the display title and the optional
 * subtitle stay aligned with the rest of the form below them.
 *
 * Centred on mobile so the visual hierarchy stays clear when the hero
 * collapses into a banner-top, left-aligned on desktop where the form sits
 * in a column to the left of the hero.
 */
export function EnviroAuthHeading({
  tag,
  title,
  subtitle,
  as: Heading = 'h1',
  className,
}: EnviroAuthHeadingProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-2 text-center md:text-left',
        className,
      )}
    >
      {tag ? (
        <span className="inline-flex items-center gap-1 self-center text-[11px] font-medium uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)] md:self-start">
          <span aria-hidden="true">[</span>
          <span className="px-1">{tag}</span>
          <span aria-hidden="true">]</span>
        </span>
      ) : null}

      <Heading className="text-balance text-2xl leading-tight tracking-tight font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)] md:text-3xl">
        {title}
      </Heading>

      {subtitle ? (
        <p className="text-sm leading-relaxed text-[--color-enviro-forest-700] md:text-base">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
