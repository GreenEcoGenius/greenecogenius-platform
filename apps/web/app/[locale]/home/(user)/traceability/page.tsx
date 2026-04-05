import Link from 'next/link';

import { ArrowRight, Link2, PackageSearch, Shield } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';


export const generateMetadata = async () => {
  const t = await getTranslations('blockchain');

  return { title: t('title') };
};

async function TraceabilityPage() {
  return (
    <PageBody>
      <div className="space-y-6">
        {/* Empty state */}
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="bg-primary-light mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
              <Link2 className="text-primary h-8 w-8" />
            </div>
            <h2 className="text-metal-900 text-2xl font-bold">
              <Trans
                i18nKey="blockchain:emptyTitle"
                defaults="Traçabilité blockchain"
              />
            </h2>
            <p className="text-metal-500 mx-auto mt-3 max-w-md text-sm leading-relaxed">
              <Trans
                i18nKey="blockchain:emptyDesc"
                defaults="Vos transactions sur Le Comptoir Circulaire sont automatiquement tracées sur la blockchain. Publiez ou achetez un lot pour commencer à construire votre historique de traçabilité."
              />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="default"
                size="sm"
                render={<Link href="/home/marketplace/new" />}
                nativeButton={false}
              >
                <PackageSearch className="mr-2 h-4 w-4" />
                <Trans
                  i18nKey="blockchain:publishLot"
                  defaults="Publier un lot"
                />
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/home/marketplace" />}
                nativeButton={false}
              >
                <Shield className="mr-2 h-4 w-4" />
                <Trans
                  i18nKey="blockchain:browseMarketplace"
                  defaults="Le Comptoir Circulaire"
                />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What you'll see */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: '📦',
              titleKey: 'blockchain:featureLots',
              defaultTitle: 'Lots tracés',
              defaultDesc:
                'Chaque transaction est enregistrée avec un hash blockchain unique',
            },
            {
              icon: '🌱',
              titleKey: 'blockchain:featureCO2',
              defaultTitle: 'CO₂ évité',
              defaultDesc:
                "Calcul automatique de l'impact carbone de chaque lot recyclé",
            },
            {
              icon: '♻️',
              titleKey: 'blockchain:featureTonnes',
              defaultTitle: 'Tonnes recyclées',
              defaultDesc: 'Suivi précis des volumes de matières recyclées',
            },
            {
              icon: '📜',
              titleKey: 'blockchain:featureCerts',
              defaultTitle: 'Certificats',
              defaultDesc: 'Certificats de traçabilité générés automatiquement',
            },
          ].map((feature) => (
            <Card key={feature.titleKey}>
              <CardContent className="p-5">
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="text-metal-900 mt-2 text-sm font-semibold">
                  <Trans
                    i18nKey={feature.titleKey}
                    defaults={feature.defaultTitle}
                  />
                </h3>
                <p className="text-metal-500 mt-1 text-xs">
                  <Trans
                    i18nKey={`${feature.titleKey}Desc`}
                    defaults={feature.defaultDesc}
                  />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageBody>
  );
}

export default TraceabilityPage;
