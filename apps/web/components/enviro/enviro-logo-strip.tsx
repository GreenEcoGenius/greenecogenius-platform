'use client';

import type { ReactNode } from 'react';

import Image from 'next/image';

import { cn } from '@kit/ui/utils';

export interface EnviroLogoItem {
  /** Logo image URL (SVG or transparent PNG recommended). */
  src: string;
  /** Translated alt text. */
  alt: string;
  /** Optional href if the logo links somewhere. */
  href?: string;
  /** Display width in pixels (height auto). */
  width?: number;
  /** Display height in pixels. */
  height?: number;
}

interface EnviroLogoStripProps {
  logos: EnviroLogoItem[];
  /** Tone of the surrounding section. */
  tone?: 'forest' | 'cream';
  /** Render as a horizontally scrolling marquee. Default: false (grid). */
  marquee?: boolean;
  className?: string;
}

/**
 * Strip of partner / tech logos. Grayscale by default, color on hover. Can
 * also render as an infinite marquee for landing pages.
 */
export function EnviroLogoStrip({
  logos,
  tone = 'cream',
  marquee = false,
  className,
}: EnviroLogoStripProps) {
  const isInverse = tone === 'forest';

  if (marquee) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden',
          isInverse ? 'bg-[--color-enviro-forest-900]' : 'bg-transparent',
          className,
        )}
        aria-hidden="false"
      >
        <div className="motion-reduce:animate-none animate-[enviro-marquee_30s_linear_infinite] flex w-max gap-12 py-6">
          {[...logos, ...logos].map((logo, idx) => (
            <LogoItem
              key={`${logo.alt}-${idx}`}
              logo={logo}
              isInverse={isInverse}
            />
          ))}
        </div>
        <style>{`
          @keyframes enviro-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid w-full grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
        className,
      )}
    >
      {logos.map((logo, idx) => (
        <LogoItem key={idx} logo={logo} isInverse={isInverse} />
      ))}
    </div>
  );
}

function LogoItem({
  logo,
  isInverse,
}: {
  logo: EnviroLogoItem;
  isInverse: boolean;
}) {
  const inner: ReactNode = (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width ?? 120}
      height={logo.height ?? 40}
      className={cn(
        'opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0',
        isInverse && 'brightness-0 invert hover:invert-0 hover:brightness-100',
      )}
    />
  );

  if (logo.href) {
    return (
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={logo.alt}
      >
        {inner}
      </a>
    );
  }

  return inner;
}
