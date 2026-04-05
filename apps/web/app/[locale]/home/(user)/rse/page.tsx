import Link from 'next/link';

import { ArrowRight, Award, ClipboardCheck, Target } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { LabelEligibilityService } from '~/lib/services/label-eligibility-service';

import { LabelEligibilitySection } from '../compliance/_components/label-eligibility-section';
import { SectionFooterImage } from '../_components/section-footer-image';

export const generateMetadata = async () => {
  const t = await getTranslations('rse');

  return { title: t('title') };
};

async function RSEPage() {
  const t = await getTranslations('rse');
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;
  const labels = userId
    ? await LabelEligibilityService.compute(client, userId)
    : [];
  const features = [
    {
      icon: '📊',
      title: t('featureScoreTitle'),
      desc: t('featureScoreDesc'),
    },
    {
      icon: '🏆',
      title: t('featureLabelsTitle'),
      desc: t('featureLabelsDesc'),
    },
    {
      icon: '📋',
      title: t('featureActionPlanTitle'),
      desc: t('featureActionPlanDesc'),
    },
    {
      icon: '🔗',
      title: t('featureEcosystemTitle'),
      desc: t('featureEcosystemDesc'),
    },
  ];
  return (
    <PageBody>
      <div className="space-y-6">
        {/* Empty state */}
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="bg-primary-light mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
              <Award className="text-primary h-8 w-8" />
            </div>
            <h2 className="text-metal-900 text-2xl font-bold">
              <Trans i18nKey="rse:emptyTitle" defaults="RSE & Labels" />
            </h2>
            <p className="text-metal-500 mx-auto mt-3 max-w-md text-sm leading-relaxed">
              <Trans
                i18nKey="rse:emptyDesc"
                defaults="Évaluez votre maturité RSE et votre éligibilité aux labels environnementaux. Lancez votre premier diagnostic pour obtenir un score personnalisé et un plan d'action."
              />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="default"
                size="sm"
                render={<Link href="/home/rse/diagnostic" />}
                nativeButton={false}
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                <Trans
                  i18nKey="rse:startDiagnostic"
                  defaults="Lancer un diagnostic"
                />
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/home/rse/roadmap" />}
                nativeButton={false}
              >
                <Target className="mr-2 h-4 w-4" />
                <Trans
                  i18nKey="rse:viewRoadmap"
                  defaults="Voir la feuille de route"
                />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What you'll get */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-5">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="text-metal-900 mt-2 text-sm font-semibold">
                  {f.title}
                </h3>
                <p className="text-metal-500 mt-1 text-xs">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {labels.length > 0 && <LabelEligibilitySection labels={labels} />}

        <SectionFooterImage
          src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-f30939eb-48c4-46f7-ad85-99b7f3c11c45.png"
          alt="RSE et Labels"
        />
      </div>
    </PageBody>
  );
}

export default RSEPage;
