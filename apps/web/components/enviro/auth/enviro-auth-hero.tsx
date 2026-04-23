import type { ReactNode } from 'react';

import { Leaf, Recycle, ShieldCheck, Sparkles } from 'lucide-react';

import { cn } from '@kit/ui/utils';

interface EnviroAuthHeroBullet {
  icon: ReactNode;
  /** Already-translated label rendered next to the icon. */
  label: ReactNode;
}

interface EnviroAuthHeroProps {
  /** Already-translated brand label (e.g. "GreenEcoGenius"). */
  brand: ReactNode;
  /** Bracket tag rendered above the title (already-translated). */
  tag: ReactNode;
  /** Display title rendered as the hero focal point. */
  title: ReactNode;
  /** Optional subtitle below the title. */
  subtitle?: ReactNode;
  /** Three (or more) bullets with icons. */
  bullets: EnviroAuthHeroBullet[];
  /** Forwarded for layout overrides. */
  className?: string;
}

/**
 * Forest-gradient hero rendered on the right half of the desktop split-screen
 * auth layout, and as a compressed banner-top on mobile. Pure presentation:
 * no asset image, just SVG accents and Lucide icons so the page stays light
 * and renders identically server-side and client-side.
 */
export function EnviroAuthHero({
  brand,
  tag,
  title,
  subtitle,
  bullets,
  className,
}: EnviroAuthHeroProps) {
  return (
    <section
      aria-hidden="false"
      className={cn(
        'relative isolate flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[--color-enviro-forest-900] via-[--color-enviro-forest-800] to-[--color-enviro-forest-700] text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-sans)]',
        // Desktop: full height column. Mobile: short banner.
        'min-h-[12rem] px-6 py-8 md:p-10 lg:min-h-screen lg:px-12 lg:py-16',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[--color-enviro-lime-300]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-12 h-72 w-72 rounded-full bg-[--color-enviro-lime-500]/10 blur-3xl"
      />

      <div className="relative flex items-center gap-2">
        <Leaf
          aria-hidden="true"
          className="h-5 w-5 text-[--color-enviro-lime-300]"
        />
        <span className="text-sm font-semibold tracking-tight text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-display)]">
          {brand}
        </span>
      </div>

      <div className="relative flex flex-col gap-5 lg:gap-6">
        <span className="inline-flex w-fit items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
          <span aria-hidden="true">[</span>
          <span className="px-1">{tag}</span>
          <span aria-hidden="true">]</span>
        </span>

        <h2 className="text-balance text-2xl leading-tight tracking-tight font-semibold text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-display)] md:text-3xl lg:text-5xl">
          {title}
        </h2>

        {subtitle ? (
          <p className="max-w-md text-sm leading-relaxed text-[--color-enviro-fg-inverse-muted] md:text-base">
            {subtitle}
          </p>
        ) : null}

        <ul className="hidden flex-col gap-3 pt-2 md:flex">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-[--color-enviro-fg-inverse-muted]"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-lime-300]/15 text-[--color-enviro-lime-300]">
                {b.icon}
              </span>
              <span className="pt-0.5 leading-relaxed">{b.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden="true"
        className="relative hidden h-px bg-gradient-to-r from-transparent via-[--color-enviro-forest-500] to-transparent lg:block"
      />
    </section>
  );
}

/**
 * Convenience preset for the brand bullets (Recycle, Shield, Sparkles).
 * The labels are caller-provided so i18n stays at the page level.
 */
export function makeBrandBullets(labels: {
  recycle: ReactNode;
  shield: ReactNode;
  sparkles: ReactNode;
}): EnviroAuthHeroBullet[] {
  return [
    {
      icon: <Recycle aria-hidden="true" className="h-4 w-4" />,
      label: labels.recycle,
    },
    {
      icon: <ShieldCheck aria-hidden="true" className="h-4 w-4" />,
      label: labels.shield,
    },
    {
      icon: <Sparkles aria-hidden="true" className="h-4 w-4" />,
      label: labels.sparkles,
    },
  ];
}
