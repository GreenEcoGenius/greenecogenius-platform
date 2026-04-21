'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';

import { cn } from '@kit/ui/utils';

import { useReducedMotionSafe } from './use-reduced-motion-safe';

interface ParallaxContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * Maximum vertical offset in pixels. Positive values slow the scroll,
   * negative values accelerate it. Default: 80.
   */
  intensity?: number;
}

/**
 * Wraps its children with a scroll-driven vertical translation. The offset
 * varies from `+intensity` (when entering the viewport) to `-intensity`
 * (when leaving). Disabled under `prefers-reduced-motion`.
 *
 * The parallax range is gated by an internal `mounted` flag so the SSR
 * markup never carries an initial translate that the client would have to
 * undo, which would either flash visually for reduced-motion users or
 * cause a React hydration mismatch.
 */
export function ParallaxContainer({
  children,
  className,
  intensity = 80,
}: ParallaxContainerProps) {
  const reducedMotion = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const enabled = mounted && !reducedMotion;

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    enabled ? [intensity, -intensity] : [0, 0],
  );

  return (
    <div ref={ref} className={cn('relative will-change-transform', className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
