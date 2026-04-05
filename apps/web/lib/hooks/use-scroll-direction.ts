'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type ScrollDirection = 'up' | 'down' | null;

const SCROLL_THRESHOLD = 10;

/**
 * Returns 'down' when the user scrolls past threshold,
 * 'up' when they scroll back, null initially.
 * Only active below the given breakpoint (default 1024 = lg).
 */
export function useScrollDirection(breakpoint = 1024): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const lastY = useRef(0);
  const ticking = useRef(false);

  const update = useCallback(() => {
    const y = window.scrollY;

    if (Math.abs(y - lastY.current) < SCROLL_THRESHOLD) {
      ticking.current = false;
      return;
    }

    setDirection(y > lastY.current ? 'down' : 'up');
    lastY.current = y;
    ticking.current = false;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth >= breakpoint) {
        setDirection(null);
        return;
      }
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [breakpoint, update]);

  return direction;
}
