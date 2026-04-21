'use client';

import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useRef,
} from 'react';

import { motion, useMotionValue, useSpring } from 'framer-motion';

import { cn } from '@kit/ui/utils';

import { useReducedMotionSafe } from './use-reduced-motion-safe';

interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  /** Maximum displacement in pixels when the cursor is at the edge. */
  strength?: number;
  /** Spring stiffness. Higher = snappier. */
  stiffness?: number;
  /** Spring damping. Higher = less oscillation. */
  damping?: number;
}

/**
 * Adds a magnetic effect to its children: the wrapper translates towards the
 * cursor while it hovers. Smooth, lightweight, no GSAP dependency.
 *
 * Honours `prefers-reduced-motion` by becoming a no-op when set.
 */
export function MagneticWrapper({
  children,
  className,
  strength = 18,
  stiffness = 300,
  damping = 22,
}: MagneticWrapperProps) {
  const reducedMotion = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness, damping });
  const springY = useSpring(y, { stiffness, damping });

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;

    const ratioX = Math.max(-1, Math.min(1, relX / (rect.width / 2)));
    const ratioY = Math.max(-1, Math.min(1, relY / (rect.height / 2)));

    x.set(ratioX * strength);
    y.set(ratioY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('inline-flex', className)}
    >
      <motion.div style={{ x: springX, y: springY }}>{children}</motion.div>
    </div>
  );
}
