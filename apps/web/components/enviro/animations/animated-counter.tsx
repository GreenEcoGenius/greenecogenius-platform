'use client';

import { useEffect, useRef, useState } from 'react';

import { useInView } from 'framer-motion';
import { useLocale } from 'next-intl';

import { cn } from '@kit/ui/utils';

import { useReducedMotionSafe } from './use-reduced-motion-safe';

interface AnimatedCounterProps {
  /** Numerical value to count up to. */
  value: number;
  /**
   * Locale used for number formatting. When omitted, falls back to the
   * `next-intl` request locale so SSR and client agree on the decimal
   * separator (`,` vs `.`) and avoid React hydration mismatches.
   */
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
 *
 * Hydration safety
 * ----------------
 * - Initial state is **always** `0`, even when reduced motion is active.
 *   `useReducedMotion()` from Framer Motion can return a different value on
 *   the server (where it has no media query to read from) than on the
 *   client, so deriving the initial state from it would mismatch.
 * - Number formatting goes through an explicit locale (`useLocale()` from
 *   next-intl as a default) so the decimal separator is identical on both
 *   sides of the SSR/client boundary.
 *
 * Both effects converge after mount: the IntersectionObserver fires, and the
 * effect either snaps to `value` (reduced motion) or starts the rAF tween.
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
  const contextLocale = useLocale();
  const effectiveLocale = locale ?? contextLocale;

  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  // Always start at 0 so SSR and client initial render produce identical
  // markup. The effect below promotes to `value` (or starts the tween)
  // once the element is in view.
  const [current, setCurrent] = useState(0);

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
    (Number.isInteger(value)
      ? 0
      : Math.min(2, value.toString().split('.')[1]?.length ?? 0));

  const formatted = current.toLocaleString(effectiveLocale, {
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
