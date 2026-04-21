import type { ReactNode } from 'react';

import Image from 'next/image';

import { cn } from '@kit/ui/utils';

interface EnviroPageHeroProps {
  /** Already-translated bracket tag. */
  tag?: ReactNode;
  /** Display title. */
  title: ReactNode;
  /** Optional supporting paragraph. */
  subtitle?: ReactNode;
  /** Optional CTAs. */
  ctas?: ReactNode;
  /** Optional background image (subtle, never full-bleed). */
  backgroundImage?: string;
  backgroundImageAlt?: string;
  /** Tone variant. */
  tone?: 'forest' | 'cream';
  /** Horizontal alignment. */
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Compact hero used on inner marketing pages (about, pricing, contact, faq,
 * normes, blog, legal). Smaller than `EnviroHero`, no animation by default,
 * keeps perfect SSR rendering for SEO.
 */
export function EnviroPageHero({
  tag,
  title,
  subtitle,
  ctas,
  backgroundImage,
  backgroundImageAlt,
  tone = 'cream',
  align = 'left',
  className,
}: EnviroPageHeroProps) {
  const isInverse = tone === 'forest';

  return (
    <section
      className={cn(
        'relative isolate w-full overflow-hidden',
        isInverse
          ? 'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse]'
          : 'bg-[--gradient-enviro-cream] text-[--color-enviro-forest-900]',
        className,
      )}
    >
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt={backgroundImageAlt ?? ''}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0',
              isInverse
                ? 'bg-[linear-gradient(to_bottom,rgba(6,50,50,0.5),rgba(6,50,50,0.95))]'
                : 'bg-[linear-gradient(to_bottom,rgba(247,251,251,0.5),rgba(247,251,251,0.95))]',
            )}
          />
        </>
      ) : null}

      <div
        className={cn(
          'relative z-[--z-enviro-raised] mx-auto flex w-full max-w-[--container-enviro-xl] flex-col gap-5 px-4 py-20 lg:px-8 lg:py-28',
          align === 'center' && 'items-center text-center',
        )}
      >
        {tag ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] font-[family-name:var(--font-enviro-mono)]',
              isInverse
                ? 'text-[--color-enviro-lime-300]'
                : 'text-[--color-enviro-forest-700]',
            )}
          >
            <span aria-hidden="true">[</span>
            <span className="px-1">{tag}</span>
            <span aria-hidden="true">]</span>
          </span>
        ) : null}

        <h1
          className={cn(
            'max-w-3xl text-balance leading-[1.05] tracking-[-0.02em] font-bold text-[length:var(--text-enviro-display-md)] font-[family-name:var(--font-enviro-display)]',
            isInverse
              ? 'text-[--color-enviro-fg-inverse]'
              : 'text-[--color-enviro-forest-900]',
          )}
        >
          {title}
        </h1>

        {subtitle ? (
          <p
            className={cn(
              'max-w-2xl text-base md:text-lg leading-relaxed font-[family-name:var(--font-enviro-sans)]',
              isInverse
                ? 'text-[--color-enviro-fg-inverse-muted]'
                : 'text-[--color-enviro-forest-700]',
            )}
          >
            {subtitle}
          </p>
        ) : null}

        {ctas ? <div className="flex flex-wrap gap-3 pt-2">{ctas}</div> : null}
      </div>
    </section>
  );
}
