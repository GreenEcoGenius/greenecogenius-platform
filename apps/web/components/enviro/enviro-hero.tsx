'use client';

import type { ReactNode } from 'react';

import Image from 'next/image';

import { cn } from '@kit/ui/utils';

import { FadeInSection } from './animations/fade-in-section';
import { TextReveal } from './animations/text-reveal';

interface EnviroHeroProps {
  /** Already-translated bracket tag, e.g. "[ Hero ]". */
  tag?: ReactNode;
  /** Display title (passed as plain string for TextReveal animation). */
  title: string;
  /** Optional subtitle (small line above the title). */
  subtitle?: ReactNode;
  /** Long supporting paragraph below the title. */
  description?: ReactNode;
  /** CTA cluster (typically two `EnviroButton`). */
  ctas?: ReactNode;
  /** Background image URL (AVIF preferred). */
  backgroundImage?: string;
  /** Alt text for the background image (translated by caller). */
  backgroundImageAlt?: string;
  /** Hero height. Default: full screen on desktop, ~80vh on mobile. */
  fullBleed?: boolean;
  className?: string;
  /** Children below the description (e.g. badges / proofs). */
  children?: ReactNode;
}

/**
 * Full-bleed hero with fluid display title, optional AVIF background, dark
 * gradient overlay and optional CTAs. Title appears word by word via
 * `TextReveal` (disabled under reduced motion).
 */
export function EnviroHero({
  tag,
  title,
  subtitle,
  description,
  ctas,
  backgroundImage,
  backgroundImageAlt,
  fullBleed = true,
  className,
  children,
}: EnviroHeroProps) {
  return (
    <section
      className={cn(
        'relative isolate w-full overflow-hidden bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse]',
        fullBleed ? 'min-h-[80vh] lg:min-h-screen' : 'min-h-[60vh]',
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
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[--gradient-enviro-hero-overlay]"
          />
        </>
      ) : null}

      <div className="relative z-[--z-enviro-raised] mx-auto flex h-full w-full max-w-[--container-enviro-xl] flex-col items-start justify-end gap-6 px-4 py-20 lg:gap-8 lg:px-8 lg:py-32 min-h-[inherit]">
        {tag ? (
          <FadeInSection delay={0}>
            <span className="inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[</span>
              <span className="px-1">{tag}</span>
              <span aria-hidden="true">]</span>
            </span>
          </FadeInSection>
        ) : null}

        {subtitle ? (
          <FadeInSection delay={0.05}>
            <p className="text-base md:text-lg text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
              {subtitle}
            </p>
          </FadeInSection>
        ) : null}

        <TextReveal
          text={title}
          as="h1"
          className="text-[length:var(--text-enviro-display-xl)] leading-[0.95] tracking-[-0.02em] font-bold text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-display)]"
        />

        {description ? (
          <FadeInSection delay={0.15}>
            <p className="max-w-2xl text-base md:text-lg leading-relaxed text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
              {description}
            </p>
          </FadeInSection>
        ) : null}

        {ctas ? (
          <FadeInSection delay={0.25}>
            <div className="flex flex-wrap items-center gap-3">{ctas}</div>
          </FadeInSection>
        ) : null}

        {children}
      </div>
    </section>
  );
}
