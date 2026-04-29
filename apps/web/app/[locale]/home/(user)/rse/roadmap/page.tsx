import Link from 'next/link';

import { ArrowRight, ClipboardCheck, Map } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

export const generateMetadata = async () => {
  const t = await getTranslations('rse');
  return { title: t('roadmapPageTitle') };
};

async function RoadmapPage() {
  return (
    <PageBody>
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="bg-[#1A5C3E] mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
              <Map className="text-primary h-8 w-8" />
            </div>
            <h2 className="text-[#F5F5F0] text-2xl font-bold">
              <Trans
                i18nKey="rse:roadmapTitle"
                defaults="Feuille de route RSE"
              />
            </h2>
            <p className="text-[#7DC4A0] mx-auto mt-3 max-w-md text-sm leading-relaxed">
              <Trans
                i18nKey="rse:roadmapEmptyDesc"
                defaults="Lancez votre premier diagnostic RSE pour générer une feuille de route personnalisée avec des actions prioritaires, un calendrier et un score projeté."
              />
            </p>
            <div className="mt-8">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </PageBody>
  );
}

export default RoadmapPage;
