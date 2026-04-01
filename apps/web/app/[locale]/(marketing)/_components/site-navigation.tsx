'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Link from 'next/link';

import { Menu, X } from 'lucide-react';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@kit/i18n/navigation';
import { JWTUserData } from '@kit/supabase/types';
import { NavigationMenu, NavigationMenuList } from '@kit/ui/navigation-menu';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';

import { SiteNavigationItem } from './site-navigation-item';

const links = {
  About: { label: 'marketing.about', path: '/about' },
  Solutions: { label: 'marketing.solutions', path: '/solutions' },
  Pricing: { label: 'marketing.pricing', path: '/pricing' },
  Normes: { label: 'marketing.normes', path: '/normes' },
  Contact: { label: 'marketing.contact', path: '/contact' },
};

export function SiteNavigation({ user }: { user: JWTUserData | null }) {
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
        <MobileMenu user={user} />
      </div>
    </>
  );
}

function MobileMenu({ user }: { user: JWTUserData | null }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const toggleLocale = () => {
    const next = locale === 'fr' ? 'en' : 'fr';
    router.replace(pathname, { locale: next });
    setOpen(false);
  };

  const isLoggedIn = !!user;

  const menuContent = open ? (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          borderBottom: '1px solid #e5e7eb',
          padding: '0 16px',
          backgroundColor: '#ffffff',
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fermer"
        >
          <X className="h-7 w-7 text-gray-900" />
        </button>
      </div>

      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '8px 24px',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Dashboard link when logged in */}
        {isLoggedIn && (
          <Link
            href={pathsConfig.app.home}
            onClick={() => setOpen(false)}
            style={{
              padding: '16px 0',
              borderBottom: '1px solid #f3f4f6',
              fontSize: 16,
              fontWeight: 600,
              color: '#059669',
              textDecoration: 'none',
            }}
          >
            Dashboard
          </Link>
        )}

        {Object.values(links).map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setOpen(false)}
            style={{
              padding: '16px 0',
              borderBottom: '1px solid #f3f4f6',
              fontSize: 16,
              fontWeight: 500,
              color: '#111827',
              textDecoration: 'none',
            }}
          >
            <Trans i18nKey={item.label} />
          </Link>
        ))}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            paddingTop: 32,
          }}
        >
          <button
            onClick={toggleLocale}
            style={{
              alignSelf: 'flex-start',
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#059669',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {locale === 'fr' ? 'English' : 'Francais'}
          </button>

          {!isLoggedIn && (
            <>
              <Link
                href={pathsConfig.auth.signIn}
                onClick={() => setOpen(false)}
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#111827',
                  textDecoration: 'none',
                }}
              >
                <Trans i18nKey="auth.signIn" />
              </Link>

              <Link
                href={pathsConfig.auth.signUp}
                onClick={() => setOpen(false)}
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  borderRadius: 8,
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                <Trans i18nKey="auth.signUp" />
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  ) : null;

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

      {mounted && menuContent && createPortal(menuContent, document.body)}
    </>
  );
}
