'use client';

import { Fragment } from 'react';

import { motion, type Variants } from 'framer-motion';

import { cn } from '@kit/ui/utils';

import {
  enviroDurations,
  enviroEasesFramer,
} from '~/lib/enviro-tokens';

import { useReducedMotionSafe } from './use-reduced-motion-safe';

interface TextRevealProps {
  text: string;
  className?: string;
  /** Stagger between two tokens (words by default), in seconds. */
  stagger?: number;
  /** Vertical translation per token before reveal, in pixels. */
  offset?: number;
  /** Split granularity. */
  splitBy?: 'words' | 'chars';
  /** HTML tag for the wrapper. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Reveals a string token by token. Splits into words by default, can split
 * into characters via `splitBy="chars"`. Disabled if user has reduced motion.
 */
export function TextReveal({
  text,
  className,
  stagger = 0.04,
  offset = 16,
  splitBy = 'words',
  as = 'h2',
}: TextRevealProps) {
  const reducedMotion = useReducedMotionSafe();

  const tokens = splitBy === 'words' ? text.split(' ') : Array.from(text);

  // Variants are deterministic (no `reducedMotion` branching) so the
  // server-rendered tree and the client first render produce identical
  // markup. Reduced motion is honoured via `transition.duration` which
  // collapses the animation to an instant snap when set.
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reducedMotion ? 0 : stagger },
    },
  };

  const tokenVariants: Variants = {
    hidden: { opacity: 0, y: offset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : enviroDurations.base,
        ease: enviroEasesFramer.out,
      },
    },
  };

  const MotionTag =
    as === 'h1'
      ? motion.h1
      : as === 'h2'
        ? motion.h2
        : as === 'h3'
          ? motion.h3
          : as === 'p'
            ? motion.p
            : motion.span;

  return (
    <MotionTag
      className={cn('inline-block', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={containerVariants}
      aria-label={text}
    >
      {tokens.map((token, index) => (
        <Fragment key={`${token}-${index}`}>
          <motion.span
            className="inline-block will-change-transform"
            variants={tokenVariants}
            aria-hidden="true"
          >
            {token === ' ' ? '\u00A0' : token}
          </motion.span>
          {splitBy === 'words' && index < tokens.length - 1 ? (
            <span aria-hidden="true">{'\u00A0'}</span>
          ) : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}
