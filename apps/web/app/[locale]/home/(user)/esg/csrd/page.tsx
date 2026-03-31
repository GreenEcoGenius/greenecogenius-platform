import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';

import { AICSRDChecklist } from '~/components/ai/esg/ai-csrd-checklist';

export const generateMetadata = async () => {
  const t = await getTranslations('esg');

  return { title: `${t('title')} - CSRD` };
};

export default function CSRDPage() {
  return (
    <PageBody>
      <PageHeader description="">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            render={
              <Link href="/home/esg">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            }
            nativeButton={false}
          />
          <div>
            <Heading level={3}>Conformite CSRD</Heading>
            <p className="text-muted-foreground text-sm">
              Tableau de conformite detaille par norme ESRS
            </p>
          </div>
        </div>
      </PageHeader>

      <AICSRDChecklist />
    </PageBody>
  );
}
