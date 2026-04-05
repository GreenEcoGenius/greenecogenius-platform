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
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 100) {
        // Always show near top
        setVisible(true);
      } else if (currentY < lastScrollY.current) {
        // Scrolling up → show
        setVisible(true);
      } else {
        // Scrolling down → hide
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
        'site-header border-metal-chrome dark:border-border/30 dark:bg-background fixed top-0 z-50 w-full border-b bg-white transition-transform duration-300',
        visible ? 'translate-y-0' : '-translate-y-full',
        className,
      )}
      {...props}
    >
      <div
        className={cn({
          'container mx-auto': centered,
        })}
      >
        <div className="flex h-24 items-center gap-x-4 px-2 md:h-28 md:gap-x-8 md:px-0">
          <div className="flex items-center">{logo}</div>

          <If condition={navigation}>
            <div className="order-last flex items-center md:order-none">
              {navigation}
            </div>
          </If>

          <If condition={actions}>
            <div className="ml-auto flex items-center justify-end gap-x-2">
              {actions}
            </div>
          </If>
        </div>
      </div>
    </div>
  );
};
