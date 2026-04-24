'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@kit/ui/utils';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  imageUrl: string;
  intensity?: number;
  overlayClassName?: string;
  className?: string;
}

export function ParallaxBackground({
  children,
  imageUrl,
  intensity = 0.3,
  overlayClassName = 'bg-gradient-to-b from-black/75 via-black/65 to-black/80',
  className,
}: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const isSmallViewport = window.matchMedia('(max-width: 767px)').matches;

    if (prefersReducedMotion || isSmallViewport) {
      return;
    }

    let ticking = false;
    let rafId = 0;

    function updateOffset() {
      if (!container || !image) return;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const offset = (rect.top - viewportHeight / 2) * intensity;
      image.style.transform = `translate3d(0, ${offset}px, 0)`;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        rafId = requestAnimationFrame(updateOffset);
        ticking = true;
      }
    }

    updateOffset();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
    >
      <div
        ref={imageRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url("${imageUrl}")`,
          top: '-10%',
          bottom: '-10%',
        }}
      />
      <div className={cn('absolute inset-0', overlayClassName)} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
