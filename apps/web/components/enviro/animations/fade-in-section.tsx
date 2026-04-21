'use client';

import type { ReactNode } from 'react';

import { motion, type Variants } from 'framer-motion';

import { cn } from '@kit/ui/utils';

import {
  enviroDurations,
  enviroEasesFramer,
} from '~/lib/enviro-tokens';

import { useReducedMotionSafe } from './use-reduced-motion-safe';

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  /** Initial vertical translation in pixels. Default: 24. */
  offset?: number;
  /** Animation delay in seconds. */
  delay?: number;
  /** Trigger every time it enters the viewport, or only the first time. */
  once?: boolean;
  /** Tag of the wrapping element. */
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
}

/**
 * Reveals its children with a soft fade + slight vertical slide when the
 * section enters the viewport. Falls back to a static render when the user
 * has enabled `prefers-reduced-motion`.
 */
export function FadeInSection({
  children,
  className,
  offset = 24,
  delay = 0,
  once = true,
  as = 'div',
}: FadeInSectionProps) {
  const reducedMotion = useReducedMotionSafe();

  const variants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : offset },
    visible: { opacity: 1, y: 0 },
  };

  const MotionTag =
    as === 'section'
      ? motion.section
      : as === 'article'
        ? motion.article
        : as === 'header'
          ? motion.header
          : as === 'footer'
            ? motion.footer
            : motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '0px 0px -10% 0px' }}
      variants={variants}
      transition={{
        duration: reducedMotion ? 0 : enviroDurations.slow,
        ease: enviroEasesFramer.out,
        delay: reducedMotion ? 0 : delay,
      }}
    >
      {children}
    </MotionTag>
  );
}
