'use client';

import Link from 'next/link';

import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@kit/i18n/navigation';
import { JWTUserData } from '@kit/supabase/types';
import { Button } from '@kit/ui/button';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import featuresFlagConfig from '~/config/feature-flags.config';
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
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    const next = locale === 'fr' ? 'en' : 'fr';
    router.push(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggle}
      className="text-metal-600 hover:bg-metal-frost hover:text-primary rounded-xl px-2.5 py-1.5 text-sm font-semibold tracking-wider uppercase transition-colors"
      aria-label="Change language"
    >
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
        className="text-sm"
        render={
          <Link href={pathsConfig.auth.signIn}>
            <Trans i18nKey="auth.signIn" />
          </Link>
        }
        variant="outline"
        size="sm"
      />

      <Button
        nativeButton={false}
        render={
          <Link href={pathsConfig.auth.signUp}>
            <Trans i18nKey="auth.signUp" />
          </Link>
        }
        className="text-sm"
        variant="default"
        size="sm"
      />
    </div>
  );
}
