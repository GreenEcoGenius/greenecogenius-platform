'use client';

import { useEffect, useRef } from 'react';

/**
 * Wraps the hero section and applies a Revolut-style scroll effect:
 * - Hero scales down and fades as the user scrolls
 * - Creates a "pinned then shrinks away" feel
 */
export function HeroScrollEffect({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disable scroll-driven transforms on mobile to avoid scroll jank
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const progress = Math.min(scrollY / windowHeight, 1);

        const scale = 1 - progress * 0.15;
        const opacity = 1 - progress * 1.2;
        const translateY = progress * -30;
        const borderRadius = progress * 24;

        el.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        el.style.opacity = `${Math.max(opacity, 0)}`;
        el.style.borderRadius = `${borderRadius}px`;

        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="will-change-transform"
      style={{ transformOrigin: 'center top' }}
    >
      {children}
    </div>
  );
}
