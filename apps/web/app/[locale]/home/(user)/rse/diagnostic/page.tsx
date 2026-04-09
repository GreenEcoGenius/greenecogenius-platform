import { getTranslations } from 'next-intl/server';

import { PageBody } from '@kit/ui/page';

import { DiagnosticWizard } from './_components/diagnostic-wizard';

export const generateMetadata = async () => {
  const t = await getTranslations('rse');

  return { title: t('diagnosticTitle') };
};

async function DiagnosticPage() {
  return (
    <PageBody>
      <DiagnosticWizard />
    </PageBody>
  );
}

export default DiagnosticPage;
