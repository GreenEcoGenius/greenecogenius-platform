'use client';

import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { ESGFormWizard } from './_components/esg-form-wizard';

export default function ESGDataEntryPage() {
  return (
    <PageBody>
      <PageHeader description="">
        <Heading level={3}>
          <Trans i18nKey="esg:formTitle" />
        </Heading>
        <p className="text-muted-foreground text-sm">
          <Trans i18nKey="esg:subtitle" />
        </p>
      </PageHeader>

      <ESGFormWizard />
    </PageBody>
  );
}
