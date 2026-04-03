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

import { DEMO_DATA } from '~/lib/demo/demo-data';

import { SectionFooterImage } from '../_components/section-footer-image';
import { LabelEligibilityCards } from './_components/label-eligibility-cards';
import { RSEActionsList } from './_components/rse-actions-list';
import { RSEPillarCards } from './_components/rse-pillar-cards';
import { RSEScoreGauge } from './_components/rse-score-gauge';

export const generateMetadata = async () => {
  const t = await getTranslations('rse');

  return { title: t('title') };
};

const DEMO_RSE = DEMO_DATA.rse;

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
            <RSEScoreGauge score={DEMO_RSE.score} level={DEMO_RSE.level} />
            <div className="space-y-3 text-center sm:text-left">
              <h2 className="text-xl font-bold">
                <Trans i18nKey="rse:scoreTitle" />
              </h2>
              <p className="text-muted-foreground text-sm">
                <Trans i18nKey="rse:subtitle" />
              </p>
              <p className="text-muted-foreground text-xs">
                <Trans i18nKey="rse:lastEval" /> : {DEMO_RSE.lastEval}
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
          <RSEPillarCards pillars={DEMO_RSE.pillars} />
        </div>

        {/* Label Eligibility */}
        <div className="space-y-4">
          <Heading level={4}>
            <Trans i18nKey="rse:labelsTitle" />
          </Heading>
          <LabelEligibilityCards labels={DEMO_RSE.labels} />
        </div>

        {/* Priority Actions */}
        <RSEActionsList actions={DEMO_RSE.actions} />

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
              {DEMO_RSE.ecosystem.map((item) => (
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
          src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-f30939eb-48c4-46f7-ad85-99b7f3c11c45.png"
          alt="RSE et Labels"
        />
      </div>
    </PageBody>
  );
}

export default RSEPage;
