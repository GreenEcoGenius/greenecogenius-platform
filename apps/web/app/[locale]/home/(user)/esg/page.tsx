import Link from 'next/link';

import { ArrowRight, BarChart3, FileText, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { SectionFooterImage } from '../_components/section-footer-image';

export const generateMetadata = async () => {
  const t = await getTranslations('esg');

  return { title: t('title') };
};

async function ESGPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  return (
    <PageBody>
      <div className="space-y-6">
        {/* Empty state */}
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="bg-primary-light mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
              <BarChart3 className="text-primary h-8 w-8" />
            </div>
            <h2 className="text-metal-900 text-2xl font-bold">
              <Trans i18nKey="esg:emptyTitle" defaults="Reporting ESG" />
            </h2>
            <p className="text-metal-500 mx-auto mt-3 max-w-md text-sm leading-relaxed">
              <Trans
                i18nKey="esg:emptyDesc"
                defaults="Générez votre rapport ESG conforme CSRD, GHG Protocol et GRI. Commencez par remplir vos données ou laissez la plateforme auto-remplir depuis vos transactions."
              />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="default"
                size="sm"
                render={<Link href="/home/esg/wizard" />}
                nativeButton={false}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                <Trans i18nKey="esg:startWizard" defaults="Commencer le rapport" />
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/home/carbon" />}
                nativeButton={false}
              >
                <FileText className="mr-2 h-4 w-4" />
                <Trans i18nKey="esg:viewCarbon" defaults="Voir l'impact carbone" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '📋', title: 'CSRD / ESRS', desc: 'Rapport conforme aux 12 normes ESRS de la directive européenne' },
            { icon: '🌍', title: 'GHG Protocol', desc: 'Bilan carbone Scopes 1, 2 et 3 auto-calculé' },
            { icon: '🤖', title: 'Auto-remplissage IA', desc: 'Champs remplis automatiquement depuis vos transactions' },
            { icon: '⛓️', title: 'Preuves blockchain', desc: 'Données vérifiables on-chain pour vos auditeurs' },
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
          src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-db261b47-d946-4d81-993d-cc45db4b6cb0.png"
          alt="Reporting ESG"
        />
      </div>
    </PageBody>
  );
}

export default ESGPage;
