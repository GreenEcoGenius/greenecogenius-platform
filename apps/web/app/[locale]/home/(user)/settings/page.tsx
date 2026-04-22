import { use } from 'react';

import { getTranslations } from 'next-intl/server';

import { PersonalAccountSettingsContainer } from '@kit/accounts/personal-account-settings';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import authConfig from '~/config/auth.config';
import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

import { ProfileActions } from './_components/profile-actions';

const showEmailOption =
  authConfig.providers.password ||
  authConfig.providers.magicLink ||
  authConfig.providers.otp;

const features = {
  showLinkEmailOption: showEmailOption,
  enablePasswordUpdate: authConfig.providers.password,
  enableAccountDeletion: featureFlagsConfig.enableAccountDeletion,
  enableAccountLinking: authConfig.enableIdentityLinking,
};

const providers = authConfig.providers.oAuth;

const callbackPath = pathsConfig.auth.callback;
const accountSettingsPath = pathsConfig.app.accountSettings;

const paths = {
  callback: callbackPath + `?next=${accountSettingsPath}`,
};

export const generateMetadata = async () => {
  const t = await getTranslations('account');
  const title = t('settingsTab');

  return {
    title,
  };
};

async function PersonalAccountSettingsPage() {
  const tAccount = await getTranslations('account');
  const tCommon = await getTranslations('common');

  const user = await requireUserInServerComponent();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.profile')}
        title={tAccount('settingsTab')}
        subtitle={tAccount('accountTabDescription')}
      />

      <div className="flex w-full flex-1 flex-col gap-8">
        <PersonalAccountSettingsContainer
          userId={user.id}
          features={features}
          paths={paths}
          providers={providers}
        />

        <ProfileActions
          enableThemeToggle={featureFlagsConfig.enableThemeToggle}
        />
      </div>
    </div>
  );
}

export default PersonalAccountSettingsPage;
