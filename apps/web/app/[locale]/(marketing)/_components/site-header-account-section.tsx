'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useLocale } from 'next-intl';

import { PersonalAccountDropdown } from '@kit/accounts/personal-account-dropdown';
import { usePathname, useRouter } from '@kit/i18n/navigation';
import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { JWTUserData } from '@kit/supabase/types';
import { Button } from '@kit/ui/button';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import featuresFlagConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const ModeToggle = dynamic(
  () =>
    import('@kit/ui/mode-toggle').then((mod) => ({
      default: mod.ModeToggle,
    })),
  { ssr: false },
);

const paths = {
  home: pathsConfig.app.home,
  profileSettings: pathsConfig.app.personalAccountSettings,
};

const features = {
  enableThemeToggle: featuresFlagConfig.enableThemeToggle,
};

export function SiteHeaderAccountSection({
  user,
}: {
  user: JWTUserData | null;
}) {
  const signOut = useSignOut();

  if (user) {
    return (
      <div className="flex items-center gap-x-2">
        <LocaleToggle />
        <PersonalAccountDropdown
          showProfileName={false}
          paths={paths}
          features={features}
          user={user}
          signOutRequested={() => signOut.mutateAsync()}
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
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggle}
      className="text-muted-foreground hover:text-foreground rounded-md px-2 py-1 text-xs font-semibold tracking-wider uppercase transition-colors"
      aria-label="Change language"
    >
      {locale === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}

function AuthButtons() {
  return (
    <div
      className={'animate-in fade-in flex items-center gap-x-2 duration-500'}
    >
      <LocaleToggle />

      <div className={'hidden md:flex'}>
        <If condition={features.enableThemeToggle}>
          <ModeToggle />
        </If>
      </div>

      <div className={'flex items-center gap-x-2'}>
        <Button
          nativeButton={false}
          className={'hidden md:flex md:text-sm'}
          render={
            <Link href={pathsConfig.auth.signIn}>
              <Trans i18nKey={'auth.signIn'} />
            </Link>
          }
          variant={'outline'}
          size={'sm'}
        />

        <Button
          nativeButton={false}
          render={
            <Link href={pathsConfig.auth.signUp}>
              <Trans i18nKey={'auth.signUp'} />
            </Link>
          }
          className="text-xs md:text-sm"
          variant={'default'}
          size={'sm'}
        />
      </div>
    </div>
  );
}
