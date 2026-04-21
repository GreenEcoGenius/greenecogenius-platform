'use client';

import type { ReactNode } from 'react';

import { motion } from 'framer-motion';

import { cn } from '@kit/ui/utils';

import {
  enviroDurations,
  enviroEasesFramer,
} from '~/lib/enviro-tokens';

import { useReducedMotionSafe } from './use-reduced-motion-safe';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  /** Whether to slide vertically when entering. Default: 8 px. */
  offset?: number;
}

/**
 * Wraps a page or major section to fade and gently slide it in on mount.
 * Disabled when `prefers-reduced-motion` is set.
 *
 * In Next.js App Router, place this inside a Client Component shell that
 * remounts when the route changes (typical pattern: in a layout that wraps
 * `children` and reads the pathname as a key).
 */
export function PageTransition({
  children,
  className,
  offset = 8,
}: PageTransitionProps) {
  const reducedMotion = useReducedMotionSafe();

  return (
    <motion.div
      className={cn(className)}
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : offset,
      }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -offset }}
      transition={{
        duration: reducedMotion ? 0 : enviroDurations.base,
        ease: enviroEasesFramer.out,
      }}
    >
      {children}
    </motion.div>
  );
}
