import { getTranslations } from 'next-intl/server';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';

import { ESGFormWizard } from './_components/esg-form-wizard';

export const generateMetadata = async () => {
  const t = await getTranslations('esg');
  return { title: t('dataEntry') };
};

export default async function ESGDataEntryPage() {
  const t = await getTranslations('esg');
  const tCommon = await getTranslations('common');

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.esg')}
        title={t('dataEntry')}
      />

      <ESGFormWizard />
    </div>
  );
}
