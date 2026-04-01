import { getTranslations } from 'next-intl/server';

import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { AIAssistant } from '~/components/ai/ai-assistant';

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

const MOCK_PILLARS = [
  {
    name: '\u00c9conomie circulaire',
    icon: 'circular',
    compliant: 9,
    total: 11,
    norms: [
      'Loi AGEC',
      'REP',
      'Indice r\u00e9parabilit\u00e9',
      '\u00c9co-conception',
      'Affichage env.',
      'Tri 5 flux',
      'D\u00e9cret tertiaire',
      'AFNOR z\u00e9ro d\u00e9chet',
      'PPWR',
      'Taxonomie UE',
      'DPP',
    ],
  },
  {
    name: 'Carbone & Env.',
    icon: 'carbon',
    compliant: 6,
    total: 7,
    norms: [
      'Bilan GES',
      'ISO 14064',
      'SBTi',
      'CDP Climate',
      'EU ETS',
      'CBAM',
      'Plan transition',
    ],
  },
  {
    name: 'Reporting ESG',
    icon: 'reporting',
    compliant: 6,
    total: 9,
    norms: [
      'CSRD',
      'ESRS',
      'GRI',
      'Taxonomie verte',
      'SFDR',
      'Devoir vigilance',
      'DPEF',
      'Art. 29 LEC',
      'CS3D',
    ],
  },
  {
    name: 'Tra\u00e7abilit\u00e9',
    icon: 'traceability',
    compliant: 5,
    total: 6,
    norms: [
      'Blockchain',
      'Vigilance cha\u00eene',
      'ISO 22095',
      'EUDR',
      '3TG',
      'Passeport batterie',
    ],
  },
  {
    name: 'Donn\u00e9es & SaaS',
    icon: 'data',
    compliant: 3,
    total: 5,
    norms: ['RGPD', 'ISO 27001', 'SOC 2', 'HDS', 'NIS2'],
  },
  {
    name: 'Labels',
    icon: 'labels',
    compliant: 1,
    total: 4,
    norms: [
      'B Corp',
      'Num\u00e9rique Responsable',
      'Lucie 26000',
      'Engag\u00e9 RSE',
    ],
  },
];

async function CompliancePage() {
  return (
    <PageBody>
      <div className="space-y-8">
        {/* Global score card */}
        <ComplianceScoreCard
          score={78}
          normsCompliant={28}
          normsTotal={42}
          alerts={3}
        />

        {/* 6 pillar cards */}
        <CompliancePillarCards pillars={MOCK_PILLARS} />

        {/* Norm status table */}
        <NormStatusTable />

        {/* Alerts */}
        <ComplianceAlerts />

        {/* Regulatory watch */}
        <RegulatoryWatch />

        <SectionFooterImage
          src="/images/normes/reporting-hologram-data.png"
          alt="Conformite"
        />
      </div>

      {/* AI Assistant */}
      <AIAssistant section="compliance" />
    </PageBody>
  );
}

export default CompliancePage;
