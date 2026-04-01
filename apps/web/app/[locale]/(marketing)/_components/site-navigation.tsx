'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Menu, X } from 'lucide-react';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@kit/i18n/navigation';
import { NavigationMenu, NavigationMenuList } from '@kit/ui/navigation-menu';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';

import { SiteNavigationItem } from './site-navigation-item';

const links = {
  About: { label: 'marketing.about', path: '/about' },
  Pricing: { label: 'marketing.pricing', path: '/home/billing' },
  Normes: { label: 'marketing.normes', path: '/normes' },
  FAQ: { label: 'marketing.faq', path: '/faq' },
  Contact: { label: 'marketing.contact', path: '/contact' },
};

export function SiteNavigation() {
  return (
    <>
      <div className="hidden items-center justify-center md:flex">
        <NavigationMenu>
          <NavigationMenuList className="gap-x-2.5">
            {Object.values(links).map((item) => (
              <SiteNavigationItem key={item.path} path={item.path}>
                <Trans i18nKey={item.label} />
              </SiteNavigationItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex justify-start sm:items-center md:hidden">
        <MobileMenu />
      </div>
    </>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const next = locale === 'fr' ? 'en' : 'fr';
    router.replace(pathname, { locale: next });
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-1"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-7 w-7" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] bg-white dark:bg-gray-950">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
            >
              <X className="h-7 w-7 text-gray-900 dark:text-white" />
            </button>
          </div>

          <nav className="flex flex-col px-6 pt-2">
            {Object.values(links).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className="border-b border-gray-100 py-4 text-base font-medium text-gray-900 dark:text-white"
              >
                <Trans i18nKey={item.label} />
              </Link>
            ))}

            <div className="flex flex-col gap-4 pt-8">
              <button
                onClick={toggleLocale}
                className="self-start text-sm font-semibold text-emerald-600 uppercase"
              >
                {locale === 'fr' ? 'English' : 'Francais'}
              </button>

              <Link
                href={pathsConfig.auth.signIn}
                onClick={() => setOpen(false)}
                className="text-center text-sm font-medium text-gray-900 dark:text-white"
              >
                <Trans i18nKey="auth.signIn" />
              </Link>

              <Link
                href={pathsConfig.auth.signUp}
                onClick={() => setOpen(false)}
                className="bg-primary text-primary-foreground rounded-lg px-4 py-3 text-center text-sm font-medium"
              >
                <Trans i18nKey="auth.signUp" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
