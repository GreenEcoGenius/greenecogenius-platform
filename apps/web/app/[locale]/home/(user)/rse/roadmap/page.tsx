import Link from 'next/link';

import { ArrowRight, ClipboardCheck, Map } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  EnviroDashboardSectionHeader,
  EnviroEmptyState,
} from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';

export const generateMetadata = async () => {
  const t = await getTranslations('rse');
  return { title: t('roadmapPageTitle') };
};

async function RoadmapPage() {
  const t = await getTranslations('rse');
  const tCommon = await getTranslations('common');

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.rse')}
        title={t('roadmapTitle')}
        subtitle={t('roadmapSubtitle')}
      />

      <EnviroEmptyState
        icon={<Map aria-hidden="true" className="h-7 w-7" />}
        tag={t('roadmapTitle')}
        title={t('roadmapTitle')}
        body={t('roadmapEmptyDesc')}
        actions={
          <EnviroButton
            variant="primary"
            size="md"
            magnetic
            render={(buttonProps) => (
              <Link {...buttonProps} href="/home/rse/diagnostic">
                <ClipboardCheck aria-hidden="true" className="h-4 w-4" />
                {t('startDiagnostic')}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            )}
          />
        }
      />
    </div>
  );
}

export default RoadmapPage;
