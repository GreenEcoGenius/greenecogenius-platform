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
  const grids = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };

  const gridAmount = [logo, navigation, actions].filter(Boolean).length;
  const gridClassName = grids[gridAmount as keyof typeof grids];

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
        <div
          className={cn(
            'flex h-14 items-center justify-between gap-x-2 px-2 md:grid md:h-16 md:gap-x-4 md:px-0',
            gridClassName,
          )}
        >
          <div className="flex items-center">{logo}</div>

          <If condition={navigation}>
            <div className="flex items-center order-last md:order-none">{navigation}</div>
          </If>

          <If condition={actions}>
            <div className="flex items-center justify-end gap-x-2">
              {actions}
            </div>
          </If>
        </div>
      </div>
    </div>
  );
};
