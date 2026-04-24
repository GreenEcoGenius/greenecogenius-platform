'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@kit/ui/utils';

const animations = {
  'fade-up': 'translate-y-8 opacity-0',
  'fade-down': '-translate-y-8 opacity-0',
  'fade-left': 'translate-x-6 opacity-0',
  'fade-right': '-translate-x-6 opacity-0',
  'zoom-in': 'scale-95 opacity-0',
};

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation?: keyof typeof animations;
  delay?: number;
  className?: string;
}

export function AnimateOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  className,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-1000 ease-out',
        isVisible
          ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
          : animations[animation],
        className,
      )}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
