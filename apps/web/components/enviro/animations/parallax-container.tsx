'use client';

import { type ReactNode, useRef } from 'react';

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
 */
export function ParallaxContainer({
  children,
  className,
  intensity = 80,
}: ParallaxContainerProps) {
  const reducedMotion = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [intensity, -intensity],
  );

  return (
    <div ref={ref} className={cn('relative will-change-transform', className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
