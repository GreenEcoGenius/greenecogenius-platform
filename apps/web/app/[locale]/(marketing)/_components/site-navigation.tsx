'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Link from 'next/link';

import { Globe, LogOut, Menu, X } from 'lucide-react';
import { useLocale } from 'next-intl';

import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { JWTUserData } from '@kit/supabase/types';
import { NavigationMenu, NavigationMenuList } from '@kit/ui/navigation-menu';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';

import { SiteNavigationItem } from './site-navigation-item';

const links = {
  About: { label: 'marketing.about', path: '/about' },
  Solutions: { label: 'marketing.solutions', path: '/solutions' },
  Explorer: { label: 'marketing.explorerNav', path: '/explorer' },
  Normes: { label: 'marketing.normes', path: '/normes' },
  Blog: { label: 'marketing.blog', path: '/blog' },
  Pricing: { label: 'marketing.pricing', path: '/pricing' },
  Contact: { label: 'marketing.contact', path: '/contact' },
};

export function SiteNavigation({ user }: { user: JWTUserData | null }) {
  return (
    <>
      <div className="hidden items-center justify-center md:flex">
        <NavigationMenu>
          <NavigationMenuList className="gap-x-6">
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
    setOpen(false);
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    const currentPath = window.location.pathname;
    const stripped = currentPath.replace(/^\/(fr|en)(\/|$)/, '/');
    const newPath =
      next === 'en' ? stripped : `/${next}${stripped === '/' ? '' : stripped}`;
    window.location.href = newPath || '/';
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
          borderBottom: '1px solid #C8D0D8',
          padding: '0 16px',
          backgroundColor: '#ffffff',
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fermer"
        >
          <X className="text-metal-900 h-7 w-7" />
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
              borderBottom: '1px solid #E4E8EC',
              fontSize: 16,
              fontWeight: 600,
              color: '#1BAF6A',
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
              borderBottom: '1px solid #E4E8EC',
              fontSize: 16,
              fontWeight: 500,
              color: '#1A2332',
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
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#1BAF6A',
              background: 'none',
              border: '1.5px solid #1BAF6A',
              borderRadius: 12,
              padding: '10px 18px',
              cursor: 'pointer',
            }}
          >
            <Globe size={18} />
            {locale === 'fr' ? 'English' : 'Français'}
          </button>

          {isLoggedIn ? (
            <SignOutButton onDone={() => setOpen(false)} />
          ) : (
            <>
              <Link
                href={pathsConfig.auth.signIn}
                onClick={() => setOpen(false)}
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1A2332',
                  textDecoration: 'none',
                }}
              >
                <Trans i18nKey="auth.signIn" />
              </Link>

              <Link
                href={pathsConfig.auth.signUp}
                onClick={() => setOpen(false)}
                style={{
                  backgroundColor: '#1BAF6A',
                  color: '#ffffff',
                  borderRadius: 12,
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 600,
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

function SignOutButton({ onDone }: { onDone: () => void }) {
  const signOut = useSignOut();
  const locale = useLocale();

  return (
    <button
      onClick={async () => {
        await signOut.mutateAsync();
        onDone();
      }}
      disabled={signOut.isPending}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontSize: 14,
        fontWeight: 600,
        color: '#1BAF6A',
        background: 'none',
        border: '1.5px solid #1BAF6A',
        borderRadius: 12,
        padding: '12px 16px',
        cursor: 'pointer',
        opacity: signOut.isPending ? 0.5 : 1,
      }}
    >
      <LogOut size={16} />
      {signOut.isPending
        ? locale === 'fr'
          ? 'Déconnexion...'
          : 'Signing out...'
        : locale === 'fr'
          ? 'Se déconnecter'
          : 'Sign Out'}
    </button>
  );
}
