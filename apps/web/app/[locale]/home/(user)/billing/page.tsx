import Link from 'next/link';

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  Sparkles,
  Zap,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

import { HomeLayoutPageHeader } from '../_components/home-page-header';
import {
  ManageClientButton,
  SubscribeClientButton,
} from './_components/subscribe-client-button';

export const generateMetadata = async () => {
  const t = await getTranslations('account');
  return { title: t('billingTab') };
};

const essentielFeatures = [
  'pricingPage.featScope12',
  'pricingPage.featGuidedForm',
  'pricingPage.featEsgDashboard',
  'pricingPage.featGhgReport',
  'pricingPage.featAutoFill',
  'pricingPage.feat50Lots',
  'pricingPage.featEmailSupport',
];

const avanceFeatures = [
  'pricingPage.featScope123',
  'pricingPage.featCsrdGri',
  'pricingPage.featUnlimitedLots',
  'pricingPage.featAiRecommendations',
  'pricingPage.featBenchmarking',
  'pricingPage.featApiAccess',
  'pricingPage.featPrioritySupport',
];

const enterpriseFeatures = [
  'pricingPage.featErpIntegration',
  'pricingPage.featMultiSite',
  'pricingPage.featAuditLabel',
  'pricingPage.featAccountManager',
  'pricingPage.featSla',
];

function formatPrice(cents: number): string {
  return Math.round(cents / 100).toLocaleString('fr-FR');
}

async function PersonalAccountBillingPage() {
  const user = await requireUserInServerComponent();
  const adminClient = getSupabaseServerAdminClient();

  // Fetch plans
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: plans } = await (adminClient as any)
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  // Fetch current subscription
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: currentSub } = await (adminClient as any)
    .from('organization_subscriptions')
    .select('*, subscription_plans(name, display_name)')
    .eq('account_id', user.id)
    .in('status', ['active', 'trialing'])
    .single();

  const essentiel = (plans ?? []).find(
    (p: Record<string, unknown>) => p.name === 'essentiel',
  );
  const avance = (plans ?? []).find(
    (p: Record<string, unknown>) => p.name === 'avance',
  );

  const currentPlan = currentSub?.subscription_plans?.name;

  return (
    <PageBody>
      <HomeLayoutPageHeader
        title={<Trans i18nKey={'common.routes.billing'} />}
        description={<AppBreadcrumbs />}
      />

      {/* Current subscription banner */}
      {currentSub && (
        <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold">
                  Plan {currentSub.subscription_plans?.display_name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {currentSub.status === 'trialing'
                    ? 'Période d\'essai en cours'
                    : 'Abonnement actif'}
                </p>
              </div>
            </div>
            <ManageButton />
          </CardContent>
        </Card>
      )}

      {/* Plans grid */}
      <div className="mt-4 grid grid-cols-1 gap-6 pt-4 md:grid-cols-3">
        {/* ESSENTIEL */}
        <Card
          className={`flex flex-col ${currentPlan === 'essentiel' ? 'border-primary ring-primary/20 ring-2' : ''}`}
        >
          <CardHeader className="text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              <CardTitle>
                {essentiel?.display_name ?? 'Plan Essentiel'}
              </CardTitle>
            </div>
            {currentPlan === 'essentiel' && (
              <Badge className="mx-auto bg-green-600 text-white">
                Plan actuel
              </Badge>
            )}
            <div className="mt-3">
              <span className="text-3xl font-bold">
                {essentiel ? formatPrice(essentiel.monthly_price) : '149'}€
              </span>
              <span className="text-muted-foreground">/mois</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ul className="flex-1 space-y-2">
              {essentielFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <span className="text-sm">
                    <Trans i18nKey={feat} />
                  </span>
                </li>
              ))}
            </ul>
            {currentPlan !== 'essentiel' && (
              <SubscribeButton
                planId={essentiel?.id}
                disabled={!!currentPlan}
                variant="outline"
              />
            )}
          </CardContent>
        </Card>

        {/* AVANCÉ */}
        <Card
          className={`flex flex-col ${currentPlan === 'avance' ? 'border-primary ring-primary/20 ring-2' : 'border-primary shadow-lg'}`}
        >
          <CardHeader className="text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <BarChart3 className="text-primary h-5 w-5" />
              <CardTitle>{avance?.display_name ?? 'Plan Avancé'}</CardTitle>
              {!currentPlan && (
                <Badge className="animate-pulse bg-green-600 text-white">
                  <Sparkles className="mr-1 h-3 w-3" />
                  <Trans i18nKey="pricingPage.popular" />
                </Badge>
              )}
              {currentPlan === 'avance' && (
                <Badge className="bg-green-600 text-white">
                  Plan actuel
                </Badge>
              )}
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold">
                {avance ? formatPrice(avance.monthly_price) : '449'}€
              </span>
              <span className="text-muted-foreground">/mois</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <p className="text-muted-foreground mb-3 text-xs italic">
              <Trans i18nKey="pricingPage.everythingEssentiel" />
            </p>
            <ul className="flex-1 space-y-2">
              {avanceFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <span className="text-sm">
                    <Trans i18nKey={feat} />
                  </span>
                </li>
              ))}
            </ul>
            {currentPlan !== 'avance' && (
              <SubscribeButton
                planId={avance?.id}
                disabled={false}
                variant="default"
              />
            )}
          </CardContent>
        </Card>

        {/* ENTERPRISE */}
        <Card className="flex flex-col">
          <CardHeader className="text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Building2 className="h-5 w-5" />
              <CardTitle>Enterprise</CardTitle>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold">
                <Trans i18nKey="pricingPage.onQuote" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <p className="text-muted-foreground mb-3 text-xs italic">
              <Trans i18nKey="pricingPage.everythingAvance" />
            </p>
            <ul className="flex-1 space-y-2">
              {enterpriseFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <span className="text-sm">
                    <Trans i18nKey={feat} />
                  </span>
                </li>
              ))}
            </ul>
            <Button
              variant="secondary"
              className="mt-6 w-full"
              render={
                <Link href="mailto:contact@greenecogenius.fr">
                  <Trans i18nKey="pricingPage.contactSales" />
                </Link>
              }
              nativeButton={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Manage subscription */}
      {currentSub && (
        <div className="mt-6">
          <ManageButton />
        </div>
      )}

      {/* Bottom section — included with marketplace */}
      <div className="mt-10 rounded-xl border border-green-200 bg-green-50/50 p-6 dark:border-green-900 dark:bg-green-950/30">
        <h3 className="mb-3 text-center text-lg font-semibold">
          Inclus dans chaque transaction marketplace
        </h3>
        <p className="text-muted-foreground mb-4 text-center text-sm">
          Sans abonnement, vous bénéficiez déjà de ces fonctionnalités via la commission marketplace.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: '🔗', label: 'Traçabilité blockchain' },
            { icon: '🌱', label: 'Calcul CO₂ automatique' },
            { icon: '📄', label: 'Certificat PDF' },
            { icon: '📊', label: 'Dashboard carbone' },
            { icon: '📥', label: 'Export PDF/CSV' },
          ].map((tag) => (
            <span
              key={tag.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white px-3 py-1.5 text-sm dark:border-green-800 dark:bg-green-950"
            >
              {tag.icon} {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold">Questions fréquentes</h3>
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Qu&apos;est-ce qui est inclus gratuitement ?</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Chaque transaction sur Le Comptoir Circulaire inclut la traçabilité blockchain, le calcul CO₂, un certificat PDF et le dashboard carbone. Tout est compris dans la commission marketplace.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Comment fonctionne l&apos;essai gratuit ?</p>
            <p className="text-muted-foreground mt-1 text-sm">
              14 jours d&apos;accès complet à toutes les fonctionnalités de votre plan. Aucun paiement avant la fin de la période d&apos;essai. Annulable à tout moment.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Puis-je changer de plan à tout moment ?</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Oui, vous pouvez upgrader ou downgrader à tout moment. La différence est calculée au prorata.
            </p>
          </div>
        </div>
      </div>
    </PageBody>
  );
}

function SubscribeButton({
  planId,
  disabled,
  variant,
}: {
  planId?: string;
  disabled: boolean;
  variant: 'default' | 'outline';
}) {
  if (!planId || disabled) {
    return (
      <Button variant={variant} className="mt-6 w-full" disabled>
        <Trans i18nKey="pricingPage.startTrial" />
      </Button>
    );
  }

  return <SubscribeClientButton planId={planId!} variant={variant} />;
}

function ManageButton() {
  return <ManageClientButton />;
}

export default PersonalAccountBillingPage;
