import { getTranslations } from 'next-intl/server';

import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { DEMO_DATA } from '~/lib/demo/demo-data';

import { SectionFooterImage } from '../_components/section-footer-image';
import { ComplianceAlerts } from './_components/compliance-alerts';
import { CompliancePillarCards } from './_components/compliance-pillar-cards';
import { ComplianceScoreCard } from './_components/compliance-score-card';
import { NormStatusTable } from './_components/norm-status-table';
import { RegulatoryWatch } from './_components/regulatory-watch';

export const generateMetadata = async () => {
  const t = await getTranslations('compliance');

  return { title: t('title') };
};

const DEMO_COMPLIANCE = DEMO_DATA.compliance;

async function CompliancePage() {
  return (
    <PageBody>
      <div className="space-y-8">
        {/* Global score card */}
        <ComplianceScoreCard
          score={DEMO_COMPLIANCE.score}
          normsCompliant={DEMO_COMPLIANCE.normsCompliant}
          normsTotal={DEMO_COMPLIANCE.normsTotal}
          alerts={DEMO_COMPLIANCE.alerts}
        />

        {/* 6 pillar cards */}
        <CompliancePillarCards pillars={DEMO_COMPLIANCE.pillars} />

        {/* Norm status table */}
        <NormStatusTable />

        {/* Alerts */}
        <ComplianceAlerts />

        {/* Regulatory watch */}
        <RegulatoryWatch />

        <SectionFooterImage
          src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-3ce44a5d-32c4-45eb-8b93-1c560b509a71.png"
          alt="Conformite"
        />
      </div>
    </PageBody>
  );
}

export default CompliancePage;
