import { getTranslations } from 'next-intl/server';

import { PageBody } from '@kit/ui/page';

import { SectionHeader } from '../../_components/section-header';

import { CarbonWizard } from './_components/carbon-wizard';

export const generateMetadata = async () => {
  const t = await getTranslations('carbon');
  return { title: t('assessmentTitle') };
};

export default function CarbonAssessmentPage() {
  return (
    <PageBody>
      <SectionHeader titleKey="carbonTitle" descKey="carbonDesc" ns="dashboard" />
      <CarbonWizard />
    </PageBody>
  );
}
