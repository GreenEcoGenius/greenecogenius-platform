import { getTranslations } from 'next-intl/server';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';

import { DiagnosticWizard } from './_components/diagnostic-wizard';

export const generateMetadata = async () => {
  const t = await getTranslations('rse');

  return { title: t('diagnosticTitle') };
};

async function DiagnosticPage() {
  const t = await getTranslations('rse');
  const tCommon = await getTranslations('common');

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.rse')}
        title={t('diagnosticTitle')}
        subtitle={t('diagnosticSubtitle')}
      />

      <DiagnosticWizard />
    </div>
  );
}

export default DiagnosticPage;
