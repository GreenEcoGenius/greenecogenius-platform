'use client';

import { useEffect, useRef, useState } from 'react';

import { useInView } from 'framer-motion';

import { cn } from '@kit/ui/utils';

import { useReducedMotionSafe } from './use-reduced-motion-safe';

interface AnimatedCounterProps {
  /** Numerical value to count up to. */
  value: number;
  /** Locale used for number formatting. Defaults to user agent locale. */
  locale?: string;
  /** Number of fraction digits. Default: inferred from `value`. */
  fractionDigits?: number;
  /** Animation duration in milliseconds. Default: 1600. */
  durationMs?: number;
  /** Optional prefix (e.g. "€" or "+"). */
  prefix?: string;
  /** Optional suffix (e.g. " %", " Mt"). */
  suffix?: string;
  className?: string;
}

/**
 * Counts from 0 to `value` once the element enters the viewport. Uses
 * `requestAnimationFrame` to keep the bundle lean (no GSAP dependency for
 * this trivial tween). Honours `prefers-reduced-motion`: snaps to the final
 * value immediately when set.
 */
export function AnimatedCounter({
  value,
  locale,
  fractionDigits,
  durationMs = 1600,
  prefix = '',
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const reducedMotion = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [current, setCurrent] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;

    if (reducedMotion) {
      setCurrent(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const from = 0;
    const to = value;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      // Ease-out cubic: 1 - (1 - p)^3
      const eased = 1 - (1 - progress) ** 3;
      setCurrent(from + (to - from) * eased);

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs, reducedMotion]);

  const inferredDigits =
    fractionDigits ??
    (Number.isInteger(value) ? 0 : Math.min(2, value.toString().split('.')[1]?.length ?? 0));

  const formatted = current.toLocaleString(locale, {
    minimumFractionDigits: inferredDigits,
    maximumFractionDigits: inferredDigits,
  });

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
