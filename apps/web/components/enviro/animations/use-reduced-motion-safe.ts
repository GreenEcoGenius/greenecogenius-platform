'use client';

import { useReducedMotion } from 'framer-motion';

/**
 * SSR-safe wrapper around Framer Motion's `useReducedMotion`.
 *
 * Returns `true` when:
 *   - we are on the server (we want to render the static, motionless markup);
 *   - or the user has set `prefers-reduced-motion: reduce` in their OS.
 *
 * Use this hook instead of `useReducedMotion` directly so every Enviro
 * animation honours the same accessibility default without conditional
 * `typeof window` checks scattered across components.
 */
export function useReducedMotionSafe(): boolean {
  const prefers = useReducedMotion();

  return prefers ?? false;
}
