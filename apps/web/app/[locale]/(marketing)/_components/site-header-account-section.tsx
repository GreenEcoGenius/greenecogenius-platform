'use client';

import Link from 'next/link';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';

import { JWTUserData } from '@kit/supabase/types';
import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';

export function SiteHeaderAccountSection({
  user,
}: {
  user: JWTUserData | null;
}) {
  if (user) {
    return (
      <div className="hidden items-center gap-x-2 md:flex">
        <LocaleToggle />

        <Button
          nativeButton={false}
          render={<Link href={pathsConfig.app.home}>Dashboard</Link>}
          variant="default"
          size="sm"
          className="text-sm"
        />
      </div>
    );
  }

  return <AuthButtons />;
}

function LocaleToggle() {
  const locale = useLocale();

  const toggle = () => {
    const next = locale === 'fr' ? 'en' : 'fr';
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    const currentPath = window.location.pathname;
    const stripped = currentPath.replace(/^\/(fr|en)(\/|$)/, '/');
    const newPath =
      next === 'en' ? stripped : `/${next}${stripped === '/' ? '' : stripped}`;
    window.location.href = newPath || '/';
  };

  return (
    <button
      onClick={toggle}
      className="text-metal-600 hover:bg-metal-frost hover:text-primary flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors"
      aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <Globe className="h-4 w-4" />
      {locale === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}

function AuthButtons() {
  return (
    <div className="animate-in fade-in hidden items-center gap-x-2 duration-500 md:flex">
      <LocaleToggle />

      <Button
        nativeButton={false}
        className="px-5 py-2.5 text-sm font-semibold"
        render={
          <Link href={pathsConfig.auth.signIn}>
            <Trans i18nKey="auth.signIn" />
          </Link>
        }
        variant="outline"
      />

      <Button
        nativeButton={false}
        render={
          <Link href={pathsConfig.auth.signUp}>
            <Trans i18nKey="auth.signUp" />
          </Link>
        }
        className="px-5 py-2.5 text-sm font-semibold"
        variant="default"
      />
    </div>
  );
}
