import Link from 'next/link';

import { getTranslations } from 'next-intl/server';

import { PasswordResetRequestContainer } from '@kit/auth/password-reset';

import { EnviroAuthHeading } from '~/components/enviro/auth';
import { EnviroButton } from '~/components/enviro/enviro-button';
import pathsConfig from '~/config/paths.config';

export const generateMetadata = async () => {
  const t = await getTranslations('auth');

  return {
    title: t('passwordResetLabel'),
  };
};

const { callback, passwordUpdate, signIn } = pathsConfig.auth;
const redirectPath = `${callback}?next=${passwordUpdate}`;

async function PasswordResetPage() {
  const t = await getTranslations('auth');

  return (
    <>
      <EnviroAuthHeading
        tag={t('passwordResetLabel')}
        title={t('passwordResetLabel')}
        subtitle={t('passwordResetSubheading')}
      />

      <PasswordResetRequestContainer redirectPath={redirectPath} />

      <div className="flex justify-center">
        <EnviroButton
          variant="ghost"
          size="sm"
          render={
            <Link href={signIn}>
              {t('passwordRecoveredQuestion')}
            </Link>
          }
        />
      </div>
    </>
  );
}

export default PasswordResetPage;
