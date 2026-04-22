import Link from 'next/link';

import {
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  Download,
  FileText,
  Leaf,
  Link2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { cn } from '@kit/ui/utils';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
} from '~/components/enviro/enviro-card';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

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
] as const;

const avanceFeatures = [
  'pricingPage.featScope123',
  'pricingPage.featCsrdGri',
  'pricingPage.featUnlimitedLots',
  'pricingPage.featAiRecommendations',
  'pricingPage.featBenchmarking',
  'pricingPage.featApiAccess',
  'pricingPage.featPrioritySupport',
] as const;

const enterpriseFeatures = [
  'pricingPage.featErpIntegration',
  'pricingPage.featMultiSite',
  'pricingPage.featAuditLabel',
  'pricingPage.featAccountManager',
  'pricingPage.featSla',
] as const;

async function PersonalAccountBillingPage() {
  const user = await requireUserInServerComponent();
  const adminClient = getSupabaseServerAdminClient();
  const t = await getTranslations('billing');
  const tCommon = await getTranslations('common');
  const tAccount = await getTranslations('account');
  const tPricing = await getTranslations('pricingPage');
  const locale = await getLocale();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = adminClient as any;

  const [{ data: plans }, { data: currentSub }] = await Promise.all([
    c
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
    c
      .from('organization_subscriptions')
      .select('*, subscription_plans(name, display_name)')
      .eq('account_id', user.id)
      .in('status', ['active', 'trialing'])
      .single(),
  ]);

  const essentiel = (plans ?? []).find(
    (p: Record<string, unknown>) => p.name === 'essentiel',
  );
  const avance = (plans ?? []).find(
    (p: Record<string, unknown>) => p.name === 'avance',
  );

  const currentPlan = currentSub?.subscription_plans?.name as
    | string
    | undefined;

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(cents / 100);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.billing')}
        title={tAccount('billingTab')}
        subtitle={t('subscriptionTabSubheading')}
        actions={currentSub ? <ManageClientButton /> : undefined}
      />

      {currentSub ? (
        <div className="flex flex-col gap-3 rounded-[--radius-enviro-md] border border-[--color-enviro-lime-200] bg-[--color-enviro-lime-50] px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <BadgeCheck
              aria-hidden="true"
              className="h-6 w-6 text-[--color-enviro-lime-700]"
            />
            <div>
              <p className="font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
                {currentSub.subscription_plans?.display_name}
              </p>
              <p className="text-sm text-[--color-enviro-forest-700]">
                {currentSub.status === 'trialing'
                  ? t('trialInProgress')
                  : t('subscriptionActive')}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <PlanCard
          tone={currentPlan === 'essentiel' ? 'highlight' : 'default'}
          icon={
            <Zap
              aria-hidden="true"
              className="h-5 w-5 text-[--color-enviro-lime-700]"
            />
          }
          name={essentiel?.display_name ?? t('planEssentielDefault')}
          price={
            essentiel
              ? formatPrice(essentiel.monthly_price)
              : formatPrice(14900)
          }
          priceSuffix={t('perMonthSuffix')}
          features={[...essentielFeatures]}
          tPricing={tPricing}
          isCurrent={currentPlan === 'essentiel'}
          currentLabel={t('currentPlan')}
          ctaSlot={
            currentPlan !== 'essentiel' ? (
              <SubscribeButton
                planId={essentiel?.id}
                disabled={!!currentPlan}
                variant="outline"
                fallbackLabel={tPricing('startTrial')}
              />
            ) : null
          }
        />

        <PlanCard
          tone={currentPlan === 'avance' ? 'highlight' : 'featured'}
          icon={
            <BarChart3
              aria-hidden="true"
              className="h-5 w-5 text-[--color-enviro-cta]"
            />
          }
          name={avance?.display_name ?? t('planAvanceDefault')}
          price={
            avance ? formatPrice(avance.monthly_price) : formatPrice(44900)
          }
          priceSuffix={t('perMonthSuffix')}
          intro={tPricing('everythingEssentiel')}
          features={[...avanceFeatures]}
          tPricing={tPricing}
          isCurrent={currentPlan === 'avance'}
          currentLabel={t('currentPlan')}
          popularLabel={!currentPlan ? tPricing('popular') : undefined}
          ctaSlot={
            currentPlan !== 'avance' ? (
              <SubscribeButton
                planId={avance?.id}
                disabled={false}
                variant="default"
                fallbackLabel={tPricing('startTrial')}
              />
            ) : null
          }
        />

        <PlanCard
          tone="default"
          icon={
            <Building2
              aria-hidden="true"
              className="h-5 w-5 text-[--color-enviro-forest-700]"
            />
          }
          name="Enterprise"
          priceDisplay={tPricing('onQuote')}
          intro={tPricing('everythingAvance')}
          features={[...enterpriseFeatures]}
          tPricing={tPricing}
          ctaSlot={
            <EnviroButton
              variant="secondary"
              size="md"
              className="mt-6 w-full"
              render={(buttonProps) => (
                <Link
                  {...buttonProps}
                  href="mailto:contact@greenecogenius.tech"
                >
                  {tPricing('contactSales')}
                </Link>
              )}
            />
          }
        />
      </div>

      <EnviroCard variant="cream" hover="none" padding="md">
        <EnviroCardHeader>
          <h3 className="text-center text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
            {t('includedEachTransactionTitle')}
          </h3>
        </EnviroCardHeader>
        <EnviroCardBody className="flex flex-col gap-5 pt-4">
          <p className="text-center text-sm text-[--color-enviro-forest-700]">
            {t('includedEachTransactionDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              {
                key: 'tagBlockchainTraceability',
                icon: <Link2 aria-hidden="true" className="h-3.5 w-3.5" />,
              },
              {
                key: 'tagAutoCO2',
                icon: <Leaf aria-hidden="true" className="h-3.5 w-3.5" />,
              },
              {
                key: 'tagPdfCertificate',
                icon: <FileText aria-hidden="true" className="h-3.5 w-3.5" />,
              },
              {
                key: 'tagCarbonDashboard',
                icon: <BarChart3 aria-hidden="true" className="h-3.5 w-3.5" />,
              },
              {
                key: 'tagExportPdfCsv',
                icon: <Download aria-hidden="true" className="h-3.5 w-3.5" />,
              },
            ].map((tag) => (
              <span
                key={tag.key}
                className="inline-flex items-center gap-1.5 rounded-[--radius-enviro-pill] border border-[--color-enviro-lime-200] bg-[--color-enviro-bg-elevated] px-3 py-1 text-xs font-medium text-[--color-enviro-forest-900]"
              >
                <span className="text-[--color-enviro-lime-700]">
                  {tag.icon}
                </span>
                {t(tag.key)}
              </span>
            ))}
          </div>
        </EnviroCardBody>
      </EnviroCard>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
          {t('faqTitle')}
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { q: 'faqIncludedQ', a: 'faqIncludedA' },
            { q: 'faqTrialQ', a: 'faqTrialA' },
            { q: 'faqChangePlanQ', a: 'faqChangePlanA' },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-[--radius-enviro-md] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] open:bg-[--color-enviro-cream-50]"
            >
              <summary className="flex cursor-pointer items-center justify-between px-5 py-3 text-sm font-medium text-[--color-enviro-forest-900] marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60">
                {t(item.q)}
                <span
                  aria-hidden="true"
                  className="ml-3 text-[--color-enviro-forest-700] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-[--color-enviro-forest-700]">
                {t(item.a)}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

interface PlanCardProps {
  tone: 'default' | 'highlight' | 'featured';
  icon: React.ReactNode;
  name: React.ReactNode;
  price?: string;
  priceDisplay?: React.ReactNode;
  priceSuffix?: string;
  intro?: React.ReactNode;
  features: string[];
  tPricing: (key: string) => string;
  isCurrent?: boolean;
  currentLabel?: string;
  popularLabel?: string;
  ctaSlot?: React.ReactNode;
}

function PlanCard({
  tone,
  icon,
  name,
  price,
  priceDisplay,
  priceSuffix,
  intro,
  features,
  tPricing,
  isCurrent,
  currentLabel,
  popularLabel,
  ctaSlot,
}: PlanCardProps) {
  const ringClass =
    tone === 'highlight'
      ? 'ring-2 ring-[--color-enviro-lime-400] border-[--color-enviro-lime-400]'
      : tone === 'featured'
        ? 'border-[--color-enviro-cta] shadow-[--shadow-enviro-lg]'
        : '';

  return (
    <EnviroCard
      variant="cream"
      hover="none"
      padding="md"
      className={cn('flex flex-col', ringClass)}
    >
      <EnviroCardHeader>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center justify-center gap-2">
            {icon}
            <h3 className="text-base font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
              {name}
            </h3>
          </div>

          {isCurrent && currentLabel ? (
            <span className="inline-flex items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-300] px-2.5 py-0.5 text-[11px] font-semibold text-[--color-enviro-forest-900]">
              {currentLabel}
            </span>
          ) : popularLabel ? (
            <span className="inline-flex items-center gap-1 rounded-[--radius-enviro-pill] bg-[--color-enviro-cta] px-2.5 py-0.5 text-[11px] font-semibold text-[--color-enviro-cta-fg]">
              <Sparkles aria-hidden="true" className="h-3 w-3" />
              {popularLabel}
            </span>
          ) : null}

          <div className="mt-2">
            {priceDisplay ? (
              <span className="text-2xl font-bold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
                {priceDisplay}
              </span>
            ) : (
              <>
                <span className="text-3xl font-bold text-[--color-enviro-forest-900] tabular-nums font-[family-name:var(--font-enviro-display)]">
                  {price}
                </span>
                {priceSuffix ? (
                  <span className="text-sm text-[--color-enviro-forest-700]">
                    {priceSuffix}
                  </span>
                ) : null}
              </>
            )}
          </div>
        </div>
      </EnviroCardHeader>
      <EnviroCardBody className="flex flex-1 flex-col pt-5">
        {intro ? (
          <p className="mb-3 text-xs italic text-[--color-enviro-forest-700]">
            {intro}
          </p>
        ) : null}
        <ul className="flex flex-1 flex-col gap-2">
          {features.map((feat) => (
            <li
              key={feat}
              className="flex items-start gap-2 text-sm text-[--color-enviro-forest-900]"
            >
              <Check
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-[--color-enviro-lime-700]"
              />
              <span>{tPricing(feat.replace('pricingPage.', ''))}</span>
            </li>
          ))}
        </ul>
        {ctaSlot}
      </EnviroCardBody>
    </EnviroCard>
  );
}

function SubscribeButton({
  planId,
  disabled,
  variant,
  fallbackLabel,
}: {
  planId?: string;
  disabled: boolean;
  variant: 'default' | 'outline';
  fallbackLabel: string;
}) {
  if (!planId || disabled) {
    return (
      <EnviroButton
        type="button"
        variant={variant === 'default' ? 'primary' : 'secondary'}
        size="md"
        className="mt-6 w-full"
        disabled
      >
        {fallbackLabel}
      </EnviroButton>
    );
  }

  return <SubscribeClientButton planId={planId} variant={variant} />;
}

export default PersonalAccountBillingPage;
