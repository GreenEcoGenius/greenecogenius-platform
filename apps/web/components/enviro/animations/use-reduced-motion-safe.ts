'use client';

import { useEffect, useState } from 'react';

import { useReducedMotion } from 'framer-motion';

/**
 * SSR + hydration-safe wrapper around Framer Motion's `useReducedMotion`.
 *
 * Returns `false` during SSR **and during the first client render**. After
 * mount, returns the actual `prefers-reduced-motion` value, which may
 * trigger a single re-render. This is the recommended pattern when the
 * value would otherwise differ between server and client and produce
 * mismatched markup (transform / opacity / element type).
 *
 * Use this hook in every Enviro animation helper instead of
 * `useReducedMotion` directly so:
 *   - The initial markup is identical on the server and on the client
 *     (no React hydration error).
 *   - The accessibility default is honoured on the very next render once
 *     the component is interactive.
 *   - We avoid scattering `typeof window` checks across components.
 */
export function useReducedMotionSafe(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const prefers = useReducedMotion();

  if (!mounted) return false;

  return prefers ?? false;
}
