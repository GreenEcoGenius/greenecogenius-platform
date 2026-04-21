'use client';

import type { ReactNode } from 'react';

import { motion, type Variants } from 'framer-motion';

import { cn } from '@kit/ui/utils';

import {
  enviroDurations,
  enviroEasesFramer,
} from '~/lib/enviro-tokens';

import { useReducedMotionSafe } from './use-reduced-motion-safe';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  /** Delay between two children, in seconds. Default: 0.08. */
  stagger?: number;
  /** Initial delay before the first child appears. */
  delayChildren?: number;
  /** Trigger only the first time the container is visible. */
  once?: boolean;
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  /** Vertical offset for the item, in pixels. */
  offset?: number;
}

/**
 * Container that orchestrates the appearance of its `<StaggerItem>` children
 * one after another. Disabled when `prefers-reduced-motion` is set.
 */
export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  once = true,
}: StaggerContainerProps) {
  const reducedMotion = useReducedMotionSafe();

  const variants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : stagger,
        delayChildren: reducedMotion ? 0 : delayChildren,
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '0px 0px -10% 0px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  offset = 16,
}: StaggerItemProps) {
  const reducedMotion = useReducedMotionSafe();

  const variants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : offset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : enviroDurations.base,
        ease: enviroEasesFramer.out,
      },
    },
  };

  return (
    <motion.div className={cn(className)} variants={variants}>
      {children}
    </motion.div>
  );
}
