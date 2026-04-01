'use client';

import Link from 'next/link';

import { Menu, X } from 'lucide-react';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@kit/i18n/navigation';
import { NavigationMenu, NavigationMenuList } from '@kit/ui/navigation-menu';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';

import { SiteNavigationItem } from './site-navigation-item';

const links = {
  About: {
    label: 'marketing.about',
    path: '/about',
  },
  Pricing: {
    label: 'marketing.pricing',
    path: '/home/billing',
  },
  Normes: {
    label: 'marketing.normes',
    path: '/normes',
  },
  FAQ: {
    label: 'marketing.faq',
    path: '/faq',
  },
  Contact: {
    label: 'marketing.contact',
    path: '/contact',
  },
};

export function SiteNavigation() {
  const NavItems = Object.values(links).map((item) => {
    return (
      <SiteNavigationItem key={item.path} path={item.path}>
        <Trans i18nKey={item.label} />
      </SiteNavigationItem>
    );
  });

  return (
    <>
      <div className={'hidden items-center justify-center md:flex'}>
        <NavigationMenu>
          <NavigationMenuList className={'gap-x-2.5'}>
            {NavItems}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className={'flex justify-start sm:items-center md:hidden'}>
        <MobileMenu />
      </div>
    </>
  );
}

function MobileMenu() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const next = locale === 'fr' ? 'en' : 'fr';
    router.replace(pathname, { locale: next });
  };

  return (
    <details className="group relative">
      <summary className="cursor-pointer list-none">
        <Menu className="h-7 w-7 group-open:hidden" />
        <X className="hidden h-7 w-7 group-open:block" />
      </summary>

      <div className="fixed inset-0 top-16 z-50 bg-white dark:bg-gray-950">
        <nav className="flex flex-col divide-y px-6">
          {Object.values(links).map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="py-4 text-base font-medium"
            >
              <Trans i18nKey={item.label} />
            </Link>
          ))}

          <div className="flex flex-col gap-3 py-6">
            <button
              onClick={toggleLocale}
              className="text-muted-foreground self-start text-sm font-semibold uppercase"
            >
              {locale === 'fr' ? 'English' : 'Francais'}
            </button>

            <Link
              href={pathsConfig.auth.signIn}
              className="text-center text-sm font-medium"
            >
              <Trans i18nKey="auth.signIn" />
            </Link>

            <Link
              href={pathsConfig.auth.signUp}
              className="bg-primary text-primary-foreground rounded-lg px-4 py-3 text-center text-sm font-medium"
            >
              <Trans i18nKey="auth.signUp" />
            </Link>
          </div>
        </nav>
      </div>
    </details>
  );
}
