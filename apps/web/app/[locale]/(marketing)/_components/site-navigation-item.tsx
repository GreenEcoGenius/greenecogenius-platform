'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavigationMenuItem } from '@kit/ui/navigation-menu';
import { cn, isRouteActive } from '@kit/ui/utils';

const getClassName = (path: string, currentPathName: string) => {
  const isActive = isRouteActive(path, currentPathName);

  return cn(
    `text-[#F5F5F0]/70 hover:text-emerald-400 inline-flex w-max text-sm font-medium transition-colors duration-300`,
    {
      'dark:text-[#F5F5F0]/60 dark:hover:text-white': !isActive,
      'text-emerald-400 dark:text-white': isActive,
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
