'use client';

import { PageBody } from '@kit/ui/page';

import { ESGFormWizard } from './_components/esg-form-wizard';

export default function ESGDataEntryPage() {
  return (
    <PageBody>
      <ESGFormWizard />
    </PageBody>
  );
}
