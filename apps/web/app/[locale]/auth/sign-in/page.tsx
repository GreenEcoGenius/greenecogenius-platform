import Link from 'next/link';

import { getTranslations } from 'next-intl/server';

import { SignInMethodsContainer } from '@kit/auth/sign-in';
import { getSafeRedirectPath } from '@kit/shared/utils';

import { EnviroAuthHeading } from '~/components/enviro/auth';
import { EnviroButton } from '~/components/enviro/enviro-button';
import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';

interface SignInPageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

export const generateMetadata = async () => {
  const t = await getTranslations('auth');

  return {
    title: t('signIn'),
  };
};

async function SignInPage({ searchParams }: SignInPageProps) {
  const { next } = await searchParams;
  const t = await getTranslations('auth');

  const paths = {
    callback: pathsConfig.auth.callback,
    returnPath: getSafeRedirectPath(next, pathsConfig.app.home),
    joinTeam: pathsConfig.app.joinTeam,
  };

  return (
    <>
      <EnviroAuthHeading
        tag={t('signIn')}
        title={t('signInHeading')}
        subtitle={t('signInSubheading')}
      />

      <SignInMethodsContainer
        paths={paths}
        providers={authConfig.providers}
        captchaSiteKey={authConfig.captchaTokenSiteKey}
      />

      <div className="flex justify-center">
        <EnviroButton
          variant="ghost"
          size="sm"
          render={
            <Link href={pathsConfig.auth.signUp} prefetch>
              {t('doNotHaveAccountYet')}
            </Link>
          }
        />
      </div>
    </>
  );
}

export default SignInPage;
