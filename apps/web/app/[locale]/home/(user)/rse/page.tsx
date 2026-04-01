import Link from 'next/link';

import {
  ArrowRight,
  Database,
  FileCheck,
  LinkIcon,
  Recycle,
  Shield,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Heading } from '@kit/ui/heading';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { AIAssistant } from '~/components/ai/ai-assistant';

import { SectionFooterImage } from '../_components/section-footer-image';
import { LabelEligibilityCards } from './_components/label-eligibility-cards';
import { RSEActionsList } from './_components/rse-actions-list';
import { RSEPillarCards } from './_components/rse-pillar-cards';
import { RSEScoreGauge } from './_components/rse-score-gauge';

export const generateMetadata = async () => {
  const t = await getTranslations('rse');

  return { title: t('title') };
};

// --- Mock Data ---

const MOCK_SCORE = 62;
const MOCK_LEVEL = 'Interm\u00e9diaire';
const MOCK_LAST_EVAL = '2026-03-15';

const MOCK_PILLARS = [
  {
    name: 'governance',
    score: 68,
    norm: 'ISO 26000 \u00a76',
    color: '#0D9488',
  },
  { name: 'environment', score: 89, norm: 'ISO 14001', color: '#059669' },
  { name: 'social', score: 52, norm: 'SA8000', color: '#94A3B8' },
  { name: 'ethics', score: 76, norm: 'ISO 37001', color: '#16A34A' },
  { name: 'stakeholders', score: 48, norm: 'AA1000', color: '#0F766E' },
];

const MOCK_LABELS = [
  {
    name: 'GreenTech',
    score: 85,
    threshold: 70,
    status: 'eligible',
    color: '#10B981',
  },
  {
    name: 'B Corp',
    score: 62,
    threshold: 80,
    status: 'in_progress',
    color: '#3B82F6',
  },
  {
    name: 'Label NR',
    score: 71,
    threshold: 75,
    status: 'in_progress',
    color: '#8B5CF6',
  },
  {
    name: 'GEG Label',
    score: 74,
    threshold: 80,
    status: 'in_progress',
    color: '#0D9488',
  },
];

const MOCK_ACTIONS = [
  {
    title:
      'Mettre en place une charte \u00e9thique fournisseurs avec audit annuel',
    impact: 12,
    effort: '15 jours',
    priority: 'urgent',
    pillar: 'ethics',
    norms: ['ISO 37001', 'B Corp'],
    status: 'todo',
  },
  {
    title:
      'D\u00e9ployer un plan de formation RSE pour tous les collaborateurs',
    impact: 8,
    effort: '10 jours',
    priority: 'important',
    pillar: 'social',
    norms: ['SA8000', 'GRI 404'],
    status: 'todo',
  },
  {
    title: 'Cartographier et consulter les parties prenantes cl\u00e9s',
    impact: 15,
    effort: '20 jours',
    priority: 'urgent',
    pillar: 'stakeholders',
    norms: ['AA1000', 'ISO 26000'],
    status: 'todo',
  },
  {
    title: 'Int\u00e9grer les crit\u00e8res ESG dans le reporting trimestriel',
    impact: 6,
    effort: '5 jours',
    priority: 'quick_win',
    pillar: 'governance',
    norms: ['CSRD', 'GRI'],
    status: 'todo',
  },
];

const MOCK_ECOSYSTEM = [
  { icon: 'carbon', value: '12.4 tCO\u2082', i18nKey: 'rse:ecosystemCarbon' },
  { icon: 'blockchain', value: '47', i18nKey: 'rse:ecosystemBlockchain' },
  { icon: 'recycled', value: '2.8 tonnes', i18nKey: 'rse:ecosystemRecycled' },
  { icon: 'esg', value: '1', i18nKey: 'rse:ecosystemESG' },
];

function getEcosystemIcon(icon: string) {
  switch (icon) {
    case 'carbon':
      return <Recycle className="h-5 w-5 text-green-500" />;
    case 'blockchain':
      return <Shield className="h-5 w-5 text-teal-500" />;
    case 'recycled':
      return <LinkIcon className="h-5 w-5 text-teal-500" />;
    case 'esg':
      return <FileCheck className="h-5 w-5 text-blue-500" />;
    default:
      return <Database className="h-5 w-5 text-gray-500" />;
  }
}

async function RSEPage() {
  return (
    <PageBody>
      <div className="space-y-8">
        {/* Score + subtitle */}
        <Card>
          <CardContent className="flex flex-col items-center gap-6 py-8 sm:flex-row sm:items-center sm:justify-around">
            <RSEScoreGauge score={MOCK_SCORE} level={MOCK_LEVEL} />
            <div className="space-y-3 text-center sm:text-left">
              <h2 className="text-xl font-bold">
                <Trans i18nKey="rse:scoreTitle" />
              </h2>
              <p className="text-muted-foreground text-sm">
                <Trans i18nKey="rse:subtitle" />
              </p>
              <p className="text-muted-foreground text-xs">
                <Trans i18nKey="rse:lastEval" /> : {MOCK_LAST_EVAL}
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <Button
                  size="sm"
                  render={<Link href="/home/rse/diagnostic" />}
                  nativeButton={false}
                >
                  <Trans i18nKey="rse:newDiagnostic" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/home/rse/roadmap" />}
                  nativeButton={false}
                >
                  <ArrowRight className="mr-1.5 h-3.5 w-3.5" />
                  <Trans i18nKey="rse:viewRoadmap" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pillar Cards */}
        <div className="space-y-4">
          <Heading level={4}>
            <Trans i18nKey="rse:pillarsTitle" />
          </Heading>
          <RSEPillarCards pillars={MOCK_PILLARS} />
        </div>

        {/* Label Eligibility */}
        <div className="space-y-4">
          <Heading level={4}>
            <Trans i18nKey="rse:labelsTitle" />
          </Heading>
          <LabelEligibilityCards labels={MOCK_LABELS} />
        </div>

        {/* Priority Actions */}
        <RSEActionsList actions={MOCK_ACTIONS} />

        {/* Ecosystem Data Interconnection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-teal-500" />
              <Trans i18nKey="rse:ecosystemTitle" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MOCK_ECOSYSTEM.map((item) => (
                <div
                  key={item.icon}
                  className="flex items-center gap-3 rounded-lg border p-4"
                >
                  <div className="rounded-full bg-gray-50 p-2.5 dark:bg-gray-800">
                    {getEcosystemIcon(item.icon)}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-muted-foreground text-xs">
                      <Trans i18nKey={item.i18nKey} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-xs text-green-800 dark:bg-green-950/30 dark:text-green-300">
              <Shield className="h-4 w-4 shrink-0" />
              <Trans i18nKey="rse:boostedByBlockchain" />
            </div>
          </CardContent>
        </Card>

        <SectionFooterImage
          src="/images/normes/labels-globe-recycle.png"
          alt="RSE et Labels"
        />
      </div>

      {/* AI Assistant */}
      <AIAssistant section="rse" />
    </PageBody>
  );
}

export default RSEPage;
