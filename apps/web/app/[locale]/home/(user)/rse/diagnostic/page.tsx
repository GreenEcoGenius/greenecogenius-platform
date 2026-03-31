import { getTranslations } from 'next-intl/server';

import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { DiagnosticWizard } from './_components/diagnostic-wizard';

export const generateMetadata = async () => {
  const t = await getTranslations('rse');

  return { title: t('diagnosticTitle') };
};

async function DiagnosticPage() {
  return (
    <PageBody>
      <PageHeader description="">
        <Heading level={3}>
          <Trans i18nKey="rse:diagnosticTitle" />
        </Heading>
      </PageHeader>

      <DiagnosticWizard />
    </PageBody>
  );
}

export default DiagnosticPage;
