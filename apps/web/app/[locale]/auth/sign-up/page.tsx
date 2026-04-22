import Link from 'next/link';

import { getTranslations } from 'next-intl/server';

import { SignUpMethodsContainer } from '@kit/auth/sign-up';

import { EnviroAuthHeading } from '~/components/enviro/auth';
import { EnviroButton } from '~/components/enviro/enviro-button';
import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';

export const generateMetadata = async () => {
  const t = await getTranslations('auth');

  return {
    title: t('signUp'),
  };
};

const paths = {
  callback: pathsConfig.auth.callback,
  appHome: pathsConfig.app.home,
};

async function SignUpPage() {
  const t = await getTranslations('auth');

  return (
    <>
      <EnviroAuthHeading
        tag={t('signUp')}
        title={t('signUpHeading')}
        subtitle={t('signUpSubheading')}
      />

      <SignUpMethodsContainer
        providers={authConfig.providers}
        displayTermsCheckbox={authConfig.displayTermsCheckbox}
        paths={paths}
        captchaSiteKey={authConfig.captchaTokenSiteKey}
      />

      <div className="flex justify-center">
        <EnviroButton
          variant="ghost"
          size="sm"
          render={(buttonProps) => (
            <Link {...buttonProps} href={pathsConfig.auth.signIn} prefetch>
              {t('alreadyHaveAnAccount')}
            </Link>
          )}
        />
      </div>
    </>
  );
}

export default SignUpPage;
