'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '../../lib/utils';
import { If } from '../if';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
  centered?: boolean;
}

export const Header: React.FC<HeaderProps> = function ({
  className,
  logo,
  navigation,
  actions,
  centered = true,
  ...props
}) {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      setScrolled(currentY > 10);

      if (currentY < 100) {
        setVisible(true);
      } else if (delta < -5) {
        setVisible(true);
      } else if (delta > 10) {
        setVisible(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'site-header dark:border-border/30 dark:bg-background fixed top-0 z-50 w-full transition-all duration-300 md:!translate-y-0',
        visible ? 'translate-y-0' : '-translate-y-full',
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50'
          : 'bg-white border-b border-metal-chrome',
        className,
      )}
      {...props}
    >
      <div
        className={cn({
          'container mx-auto': centered,
        })}
      >
        <div className="flex h-20 items-center gap-x-4 overflow-visible px-2 md:h-24 md:gap-x-8 md:px-0">
          <div className="flex items-center">{logo}</div>

          <If condition={navigation}>
            <div className="order-last flex items-center md:order-none">
              {navigation}
            </div>
          </If>

          <If condition={actions}>
            <div className="ml-auto -mr-1 flex items-center justify-end gap-x-2 md:mr-0">
              {actions}
            </div>
          </If>
        </div>
      </div>
    </div>
  );
};
