import { getTranslations } from 'next-intl/server';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import featuresFlagConfig from '~/config/feature-flags.config';

import { SettingsSubNavigation } from './_components/settings-sub-navigation';

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ account: string }>;
}

async function SettingsLayout({ children, params }: SettingsLayoutProps) {
  const { account } = await params;
  const tCommon = await getTranslations('common');
  const tTeams = await getTranslations('teams');

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.application')}
        title={tTeams('settings.pageTitle')}
      />

      {featuresFlagConfig.enableTeamsOnly ? (
        <SettingsSubNavigation account={account} />
      ) : null}

      {children}
    </div>
  );
}

export default SettingsLayout;
