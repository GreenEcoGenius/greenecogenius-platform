'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavigationMenuItem } from '@kit/ui/navigation-menu';
import { cn, isRouteActive } from '@kit/ui/utils';

const getClassName = (path: string, currentPathName: string) => {
  const isActive = isRouteActive(path, currentPathName);

  return cn(
    `text-metal-700 hover:text-primary inline-flex w-max text-sm font-medium transition-colors duration-300`,
    {
      'dark:text-metal-400 dark:hover:text-white': !isActive,
      'text-primary dark:text-white': isActive,
    },
  );
};

export function SiteNavigationItem({
  path,
  children,
}: React.PropsWithChildren<{
  path: string;
}>) {
  const currentPathName = usePathname();
  const className = getClassName(path, currentPathName);

  return (
    <NavigationMenuItem key={path}>
      <Link className={className} href={path} as={path} prefetch={true}>
        {children}
      </Link>
    </NavigationMenuItem>
  );
}
