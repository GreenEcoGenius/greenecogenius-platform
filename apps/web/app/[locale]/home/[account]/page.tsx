import { use } from 'react';

import { getTranslations } from 'next-intl/server';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';

import { DashboardDemo } from './_components/dashboard-demo';

interface TeamAccountHomePageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const t = await getTranslations('teams');
  const title = t('home.pageTitle');

  return {
    title,
  };
};

function TeamAccountHomePage({ params }: TeamAccountHomePageProps) {
  const account = use(params).account;
  void account;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <PageHeader />
      <DashboardDemo />
    </div>
  );
}

async function PageHeader() {
  const tCommon = await getTranslations('common');

  return (
    <EnviroDashboardSectionHeader
      tag={tCommon('routes.application')}
      title={tCommon('routes.dashboard')}
    />
  );
}

export default TeamAccountHomePage;
