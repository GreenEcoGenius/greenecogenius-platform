import Link from 'next/link';

import { ArrowRight, FileSearch, Shield, Zap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { SectionFooterImage } from '../_components/section-footer-image';

export const generateMetadata = async () => {
  const t = await getTranslations('compliance');

  return { title: t('title') };
};

async function CompliancePage() {
  return (
    <PageBody>
      <div className="space-y-6">
        {/* Empty state */}
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="bg-primary-light mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
              <Shield className="text-primary h-8 w-8" />
            </div>
            <h2 className="text-metal-900 text-2xl font-bold">
              <Trans i18nKey="compliance:emptyTitle" defaults="Conformité réglementaire" />
            </h2>
            <p className="text-metal-500 mx-auto mt-3 max-w-md text-sm leading-relaxed">
              <Trans
                i18nKey="compliance:emptyDesc"
                defaults="Vérifiez votre conformité aux 42 normes environnementales et RSE. Lancez un pré-audit IA pour obtenir votre score de conformité et identifier les actions à mener."
              />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="default"
                size="sm"
                render={<Link href="/home/compliance" />}
                nativeButton={false}
              >
                <Zap className="mr-2 h-4 w-4" />
                <Trans i18nKey="compliance:runAudit" defaults="Lancer un pré-audit IA" />
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/normes" />}
                nativeButton={false}
              >
                <FileSearch className="mr-2 h-4 w-4" />
                <Trans i18nKey="compliance:viewNorms" defaults="Voir les normes" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What you'll get */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '🔍', title: 'Pré-audit IA', desc: 'Analyse automatique de votre conformité sur 42 normes en moins de 10 secondes' },
            { icon: '📊', title: 'Score de conformité', desc: 'Score global et par pilier (Économie circulaire, Carbone, ESG, Traçabilité, Données)' },
            { icon: '⚡', title: 'Alertes et veille', desc: 'Alertes en temps réel sur les échéances réglementaires et les non-conformités' },
          ].map((f) => (
            <Card key={f.title}>
              <CardContent className="p-5">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="text-metal-900 mt-2 text-sm font-semibold">{f.title}</h3>
                <p className="text-metal-500 mt-1 text-xs">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <SectionFooterImage
          src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-3ce44a5d-32c4-45eb-8b93-1c560b509a71.png"
          alt="Conformite"
        />
      </div>
    </PageBody>
  );
}

export default CompliancePage;
