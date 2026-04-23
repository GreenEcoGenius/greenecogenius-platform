'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  ArrowRight,
  Award,
  BarChart3,
  Blocks,
  Building2,
  FileText,
  Globe,
  Leaf,
  Link2,
  Mail,
  Palette,
  Phone,
  Recycle,
  Rocket,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { Trans } from '@kit/ui/trans';
import { cn } from '@kit/ui/utils';

import {
  EnviroButton,
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
  EnviroComparisonTable,
  EnviroFaq,
  EnviroPageHero,
  EnviroPricingCard,
  EnviroSectionHeader,
} from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';
import {
  StaggerContainer,
  StaggerItem,
} from '~/components/enviro/animations/stagger-container';

interface Plan {
  id: string;
  name: string;
  display_name: string;
  monthly_price: number | null;
  annual_price: number | null;
  max_traced_lots_per_month: number | null;
  includes_api_access: boolean;
  includes_advanced_dashboard: boolean;
  includes_erp_integration: boolean;
  includes_dedicated_support: boolean;
}

interface CommissionConfig {
  name: string;
  commission_type: string;
  flat_rate: number | null;
  tiers: Array<{ min: number; max: number | null; rate: number }>;
  is_active: boolean;
  valid_until: string | null;
}

interface PricingContentProps {
  plans: Plan[];
  commissionConfigs: CommissionConfig[];
}

function formatPrice(cents: number): string {
  return Math.round(cents / 100).toLocaleString('fr-FR');
}

const ESSENTIEL_FEATURE_KEYS = [
  'pricingPage.featScope12',
  'pricingPage.featGuidedForm',
  'pricingPage.featGhgReport',
  'pricingPage.featComptoir',
  'pricingPage.featMarketPrices',
  'pricingPage.featCo2Auto',
  'pricingPage.feat50Lots',
  'pricingPage.featCertificates',
  'pricingPage.featRseBasic',
  'pricingPage.featCompliance42',
  'pricingPage.featGenius10',
  'pricingPage.featEmailSupport',
];

const AVANCE_FEATURE_KEYS = [
  'pricingPage.featScope123',
  'pricingPage.featCsrdReport',
  'pricingPage.featReductionPlan',
  'pricingPage.featSbtiTrajectory',
  'pricingPage.featEsgReport',
  'pricingPage.featUnlimitedLots',
  'pricingPage.featRseFull',
  'pricingPage.featLabels',
  'pricingPage.featPreAudit',
  'pricingPage.featRegulatoryWatch',
  'pricingPage.featAutoPopulate',
  'pricingPage.featExportAll',
  'pricingPage.featGenius100',
  'pricingPage.featPrioritySupport',
];

const ENTERPRISE_FEATURE_KEYS = [
  'pricingPage.featGeniusUnlimited',
  'pricingPage.featCustomReports',
  'pricingPage.featApiAccess',
  'pricingPage.featMultiUsers',
  'pricingPage.featOnboarding',
  'pricingPage.featAccountManager',
  'pricingPage.featSla',
  'pricingPage.featPriorityVisio',
];

const FAQ_KEYS = [
  'pricingPage.faq1',
  'pricingPage.faq2',
  'pricingPage.faq3',
  'pricingPage.faq4',
  'pricingPage.faq5',
] as const;

const INCLUDED_TAGS = [
  { icon: Link2, key: 'pricingPage.tagBlockchain' },
  { icon: Leaf, key: 'pricingPage.tagCO2' },
  { icon: FileText, key: 'pricingPage.tagCertificate' },
  { icon: BarChart3, key: 'pricingPage.tagDashboard' },
  { icon: ArrowRight, key: 'pricingPage.tagExport' },
] as const;

const COMMISSION_TIERS = [
  { rate: '8%', range: 'pricingPage.tier1Range', icon: Recycle },
  { rate: '5%', range: 'pricingPage.tier2Range', icon: Globe },
  { rate: '3%', range: 'pricingPage.tier3Range', icon: Sparkles },
] as const;

interface ComingSoonFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  timeline: string;
}

const COMING_SOON: ComingSoonFeature[] = [
  {
    icon: BarChart3,
    title: 'Benchmarking sectoriel',
    description:
      "Comparez vos performances carbone et circulaires avec votre secteur d'activité.",
    timeline: 'Q4 2026',
  },
  {
    icon: Zap,
    title: 'Matching IA acheteur-vendeur',
    description:
      "Algorithme intelligent qui connecte automatiquement les vendeurs et acheteurs de matières recyclables.",
    timeline: 'Q4 2026',
  },
  {
    icon: Blocks,
    title: 'Intégration ERP native (SAP, Oracle, Sage)',
    description:
      "Connectez votre ERP pour synchroniser automatiquement les données de déchets et achats.",
    timeline: '2027',
  },
  {
    icon: Building2,
    title: 'Reporting multi-sites et multi-filiales',
    description:
      "Consolidez les données de tous vos sites et filiales dans un seul dashboard.",
    timeline: '2027',
  },
  {
    icon: Award,
    title: 'Préparation aux labels reconnus',
    description:
      "Accompagnement à la candidature aux labels reconnus : B Corp, GreenTech Innovation, Lucie 26000, NR, EcoVadis.",
    timeline: '2027',
  },
  {
    icon: Leaf,
    title: 'Accompagnement crédits carbone',
    description:
      "Accédez aux marchés de crédits carbone et monétisez vos réductions d'émissions vérifiées.",
    timeline: '2027',
  },
  {
    icon: Palette,
    title: 'Rapports white-label personnalisables',
    description:
      'Générez des rapports aux couleurs de votre entreprise pour vos clients et parties prenantes.',
    timeline: '2027',
  },
];

export function PricingContent({
  plans,
  commissionConfigs,
}: PricingContentProps) {
  const [annual, setAnnual] = useState(false);

  const essentiel = plans.find((p) => p.name === 'essentiel');
  const avance = plans.find((p) => p.name === 'avance');

  const activePromo = commissionConfigs.find(
    (c) => c.is_active && c.commission_type === 'flat' && c.valid_until,
  );

  const essentielMonthly = essentiel
    ? formatPrice(
        annual
          ? Math.round(essentiel.annual_price! / 12)
          : essentiel.monthly_price!,
      )
    : '149';
  const avanceMonthly = avance
    ? formatPrice(
        annual ? Math.round(avance.annual_price! / 12) : avance.monthly_price!,
      )
    : '449';

  const essentielAnnualHint =
    annual && essentiel?.annual_price
      ? `${formatPrice(essentiel.annual_price)} €/an`
      : undefined;
  const avanceAnnualHint =
    annual && avance?.annual_price
      ? `${formatPrice(avance.annual_price)} €/an`
      : undefined;

  return (
    <div className="flex flex-col bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]">
      {/* HERO */}
      <EnviroPageHero
        tag={<Trans i18nKey="pricingPage.heroTag" />}
        title={<Trans i18nKey="pricingPage.heroTitle" />}
        subtitle={<Trans i18nKey="pricingPage.heroSubtitle" />}
        tone="cream"
        align="center"
        ctas={
          <p className="text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
            <Trans i18nKey="pricingPage.heroNote" />
          </p>
        }
      />

      {/* TOGGLE Mensuel / Annuel */}
      <section className="bg-[--color-enviro-cream-50] py-8">
        <div className="mx-auto flex w-full max-w-[--container-enviro-md] flex-col items-center gap-4 px-4 lg:px-8">
          <div className="inline-flex items-center gap-1 rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] bg-white p-1 shadow-[--shadow-enviro-sm]">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={cn(
                'rounded-[--radius-enviro-pill] px-5 py-2 text-sm font-medium transition-colors duration-200 font-[family-name:var(--font-enviro-sans)]',
                !annual
                  ? 'bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]'
                  : 'text-[--color-enviro-forest-700] hover:bg-[--color-enviro-cream-100]',
              )}
            >
              <Trans i18nKey="pricingPage.monthly" />
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={cn(
                'inline-flex items-center gap-2 rounded-[--radius-enviro-pill] px-5 py-2 text-sm font-medium transition-colors duration-200 font-[family-name:var(--font-enviro-sans)]',
                annual
                  ? 'bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]'
                  : 'text-[--color-enviro-forest-700] hover:bg-[--color-enviro-cream-100]',
              )}
            >
              <Trans i18nKey="pricingPage.annual" />
              <span className="rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-300] px-2 py-0.5 text-[10px] font-semibold uppercase text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-mono)]">
                -17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* INCLUDED EVERYWHERE */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <p className="text-center text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[ </span>
              <Trans i18nKey="pricingPage.includedTag" />
              <span aria-hidden="true"> ]</span>
            </p>
            <h2 className="mt-3 text-center text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
              <Trans i18nKey="pricingPage.includedTitle" />
            </h2>
          </FadeInSection>

          <StaggerContainer
            className="mt-8 flex flex-wrap justify-center gap-3"
            stagger={0.05}
          >
            {INCLUDED_TAGS.map((tag) => {
              const Icon = tag.icon;

              return (
                <StaggerItem key={tag.key}>
                  <span className="inline-flex items-center gap-2 rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] px-4 py-2 text-sm text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-sans)]">
                    <Icon
                      className="h-4 w-4 text-[--color-enviro-cta]"
                      strokeWidth={1.5}
                    />
                    <Trans i18nKey={tag.key} />
                  </span>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* PLANS */}
      <section className="bg-[--color-enviro-cream-50] py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={<Trans i18nKey="pricingPage.plansTag" />}
              title={<Trans i18nKey="pricingPage.heroTitle" />}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <EnviroPricingCard
              name={essentiel?.display_name ?? 'Essentiel'}
              price={`${essentielMonthly} €`}
              period={annual ? '/mois (facturé annuellement)' : '/mois'}
              description={
                <span className="block">
                  <Trans i18nKey="pricingPage.essentielTarget" />
                  {essentielAnnualHint ? (
                    <span className="mt-1 block text-xs text-[--color-enviro-forest-600] font-[family-name:var(--font-enviro-mono)]">
                      {essentielAnnualHint}
                    </span>
                  ) : null}
                </span>
              }
              features={ESSENTIEL_FEATURE_KEYS.map((k) => (
                <Trans key={k} i18nKey={k} />
              ))}
              cta={
                <Link href="/home/billing" className="block">
                  <EnviroButton variant="secondary" size="md" className="w-full">
                    <Trans i18nKey="pricingPage.startTrial" />
                  </EnviroButton>
                </Link>
              }
              variant="default"
            />

            <EnviroPricingCard
              name={avance?.display_name ?? 'Avancé'}
              price={`${avanceMonthly} €`}
              period={annual ? '/mois (facturé annuellement)' : '/mois'}
              description={
                <span className="block">
                  <Trans i18nKey="pricingPage.avanceTarget" />
                  {avanceAnnualHint ? (
                    <span className="mt-1 block text-xs text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-mono)]">
                      {avanceAnnualHint}
                    </span>
                  ) : null}
                </span>
              }
              features={[
                <span key="hint" className="block italic">
                  <Trans i18nKey="pricingPage.everythingEssentiel" />
                </span>,
                ...AVANCE_FEATURE_KEYS.map((k) => <Trans key={k} i18nKey={k} />),
              ]}
              cta={
                <Link href="/home/billing" className="block">
                  <EnviroButton variant="primary" size="md" className="w-full">
                    <Trans i18nKey="pricingPage.startTrial" />
                  </EnviroButton>
                </Link>
              }
              badge={<Trans i18nKey="pricingPage.popular" />}
              variant="popular"
            />

            <EnviroPricingCard
              name="Enterprise"
              price={<Trans i18nKey="pricingPage.onQuote" />}
              description={<Trans i18nKey="pricingPage.enterpriseTarget" />}
              features={[
                <span key="hint" className="block italic">
                  <Trans i18nKey="pricingPage.everythingAvance" />
                </span>,
                ...ENTERPRISE_FEATURE_KEYS.map((k) => (
                  <Trans key={k} i18nKey={k} />
                )),
              ]}
              cta={
                <Link
                  href="/contact?subject=Demande+Plan+Enterprise"
                  className="block"
                >
                  <EnviroButton variant="primary" size="md" className="w-full">
                    <Users className="h-4 w-4" strokeWidth={1.5} />
                    <Trans i18nKey="pricingPage.contactSales" />
                  </EnviroButton>
                </Link>
              }
              variant="enterprise"
            />
          </div>

          <p className="mt-6 text-center text-xs text-[--color-enviro-forest-600] font-[family-name:var(--font-enviro-sans)]">
            <Trans i18nKey="pricingPage.responseTime" />
          </p>
        </div>
      </section>

      {/* CUSTOM SUPPORT */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto w-full max-w-[--container-enviro-md] px-4 lg:px-8">
          <FadeInSection>
            <EnviroCard variant="lime" radius="lg" hover="lift" padding="lg">
              <EnviroCardHeader>
                <EnviroCardTitle>
                  <Trans i18nKey="pricingPage.customSupportTitle" />
                </EnviroCardTitle>
              </EnviroCardHeader>
              <EnviroCardBody>
                <p className="text-sm leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
                  <Trans i18nKey="pricingPage.customSupportSubtitle" />
                </p>
                <div className="mt-5">
                  <Link href="/contact">
                    <EnviroButton variant="primary" size="md" magnetic>
                      <Trans i18nKey="pricingPage.customSupportButton" />
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </EnviroButton>
                  </Link>
                </div>
              </EnviroCardBody>
            </EnviroCard>
          </FadeInSection>
        </div>
      </section>

      {/* COMMISSION MARKETPLACE */}
      <section className="bg-[--color-enviro-cream-50] py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={<Trans i18nKey="pricingPage.commissionTag" />}
              title={<Trans i18nKey="pricingPage.commissionTitle" />}
              subtitle={<Trans i18nKey="pricingPage.commissionSubtitle" />}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <StaggerContainer
            className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
            stagger={0.08}
          >
            {COMMISSION_TIERS.map((tier) => {
              const Icon = tier.icon;

              return (
                <StaggerItem key={tier.range}>
                  <EnviroCard
                    variant="cream"
                    radius="lg"
                    hover="lift"
                    padding="md"
                    className="text-center"
                  >
                    <span className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <p className="text-3xl font-bold text-[--color-enviro-cta] font-[family-name:var(--font-enviro-display)]">
                      {tier.rate}
                    </p>
                    <p className="mt-1 text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
                      <Trans i18nKey={tier.range} />
                    </p>
                  </EnviroCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {activePromo ? (
            <FadeInSection delay={0.2}>
              <div className="mx-auto mt-6 max-w-3xl rounded-[--radius-enviro-xl] border border-[--color-enviro-lime-400] bg-[--color-enviro-lime-300]/40 p-4 text-center text-sm font-medium text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-sans)]">
                <Sparkles
                  className="mr-2 inline h-4 w-4"
                  strokeWidth={1.5}
                />
                <Trans i18nKey="pricingPage.promoLaunch" />
              </div>
            </FadeInSection>
          ) : null}
        </div>
      </section>

      {/* DETAILED COMPARISON */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={<Trans i18nKey="pricingPage.comparisonTag" />}
              title={<Trans i18nKey="pricingPage.comparisonTitle" />}
              subtitle={<Trans i18nKey="pricingPage.comparisonSub" />}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mt-12">
            <ComparisonTable />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[--color-enviro-cream-50] py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[--container-enviro-md] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={<Trans i18nKey="pricingPage.faqTag" />}
              title={<Trans i18nKey="pricingPage.faqTitle" />}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mt-12">
            <EnviroFaq
              tone="cream"
              items={FAQ_KEYS.map((k, idx) => ({
                value: `q${idx + 1}`,
                question: <Trans i18nKey={`${k}Q`} />,
                answer: <Trans i18nKey={`${k}A`} />,
              }))}
            />
          </div>
        </div>
      </section>

      {/* COMING SOON */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <div className="mx-auto mb-6 inline-flex w-full justify-center">
              <span className="inline-flex items-center gap-2 rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] px-3 py-1 text-xs font-medium text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
                <Rocket className="h-4 w-4" strokeWidth={1.5} />
                Roadmap 2026 - 2027
              </span>
            </div>
            <EnviroSectionHeader
              tag={<Trans i18nKey="pricingPage.comingSoonTag" />}
              title={
                <Trans
                  i18nKey="pricingPage.comingSoonTitle"
                  defaults="Prochainement sur la plateforme"
                />
              }
              subtitle={
                <Trans
                  i18nKey="pricingPage.comingSoonSubtitle"
                  defaults="Nous construisons en continu. Voici les fonctionnalités en cours de développement."
                />
              }
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <StaggerContainer
            className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            stagger={0.06}
          >
            {COMING_SOON.map((feature) => {
              const Icon = feature.icon;
              const isQuarter = feature.timeline.startsWith('Q');

              return (
                <StaggerItem key={feature.title}>
                  <EnviroCard
                    variant="cream"
                    radius="lg"
                    hover="lift"
                    padding="md"
                    className="h-full"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <span
                        className={cn(
                          'rounded-[--radius-enviro-pill] border px-2 py-1 text-xs font-medium font-[family-name:var(--font-enviro-mono)]',
                          isQuarter
                            ? 'border-[--color-enviro-cta] bg-[--color-enviro-ember-50] text-[--color-enviro-ember-700]'
                            : 'border-[--color-enviro-cream-300] bg-white text-[--color-enviro-forest-600]',
                        )}
                      >
                        {feature.timeline}
                      </span>
                    </div>
                    <EnviroCardHeader>
                      <EnviroCardTitle className="text-base">
                        {feature.title}
                      </EnviroCardTitle>
                    </EnviroCardHeader>
                    <EnviroCardBody className="text-sm leading-relaxed text-[--color-enviro-forest-700]">
                      {feature.description}
                    </EnviroCardBody>
                  </EnviroCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <FadeInSection delay={0.2}>
            <p className="mt-12 text-center text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
              <Trans
                i18nKey="pricingPage.comingSoonInterested"
                defaults="Une fonctionnalité vous intéresse particulièrement ?"
              />{' '}
              <Link
                href="/contact"
                className="font-medium text-[--color-enviro-cta] underline underline-offset-4 hover:text-[--color-enviro-cta-hover]"
              >
                <Trans
                  i18nKey="pricingPage.comingSoonContact"
                  defaults="Contactez-nous pour en discuter"
                />
              </Link>
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-[--color-enviro-forest-900] py-20 lg:py-28 text-[--color-enviro-fg-inverse]">
        <div className="mx-auto w-full max-w-[--container-enviro-md] px-4 text-center lg:px-8">
          <FadeInSection>
            <span className="inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[</span>
              <span className="px-1">
                <Trans i18nKey="pricingPage.ctaTag" />
              </span>
              <span aria-hidden="true">]</span>
            </span>
            <h2 className="mt-4 text-balance text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-enviro-display)]">
              <Trans i18nKey="pricingPage.ctaTitle" />
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base md:text-lg leading-relaxed text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
              <Trans i18nKey="pricingPage.ctaSubtitle" />
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/home/billing">
                <EnviroButton variant="primary" size="lg" magnetic>
                  <Trans i18nKey="pricingPage.ctaButton" />
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </EnviroButton>
              </Link>
              <Link href="/solutions">
                <EnviroButton variant="outlineCream" size="lg">
                  <Trans i18nKey="pricingPage.ctaSecondary" />
                </EnviroButton>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                contact@greenecogenius.tech
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                +33 7 83 32 42 74
              </span>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}

function ComparisonTable() {
  return (
    <EnviroComparisonTable
      headers={[
        <Trans key="h0" i18nKey="pricingPage.compFeature" />,
        <Trans key="h1" i18nKey="pricingPage.compEssentiel" />,
        <Trans key="h2" i18nKey="pricingPage.compAvance" />,
        <Trans key="h3" i18nKey="pricingPage.compEnterprise" />,
      ]}
      highlightColumnIndex={1}
      tone="cream"
      rows={[
        {
          feature: <Trans i18nKey="pricingPage.compRow_marketplace" />,
          cells: [
            <Trans key="e" i18nKey="pricingPage.compEssentielMarketplace" />,
            <Trans key="a" i18nKey="pricingPage.compAvanceMarketplace" />,
            <Trans key="x" i18nKey="pricingPage.compEnterpriseMarketplace" />,
          ] as Array<boolean | React.ReactNode>,
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_traceability" />,
          cells: [
            <Trans key="e" i18nKey="pricingPage.compEssentielTrace" />,
            <Trans key="a" i18nKey="pricingPage.compAvanceTrace" />,
            <Trans key="x" i18nKey="pricingPage.compEnterpriseTrace" />,
          ] as Array<boolean | React.ReactNode>,
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_carbonScope" />,
          cells: [
            <Trans key="e" i18nKey="pricingPage.compEssentielScope" />,
            <Trans key="a" i18nKey="pricingPage.compAvanceScope" />,
            <Trans key="x" i18nKey="pricingPage.compEnterpriseScope" />,
          ] as Array<boolean | React.ReactNode>,
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_csrd" />,
          cells: [false, true, true],
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_genius" />,
          cells: [
            <Trans key="e" i18nKey="pricingPage.compEssentielGenius" />,
            <Trans key="a" i18nKey="pricingPage.compAvanceGenius" />,
            <Trans key="x" i18nKey="pricingPage.compEnterpriseGenius" />,
          ] as Array<boolean | React.ReactNode>,
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_support" />,
          cells: [
            <Trans key="e" i18nKey="pricingPage.compEssentielSupport" />,
            <Trans key="a" i18nKey="pricingPage.compAvanceSupport" />,
            <Trans key="x" i18nKey="pricingPage.compEnterpriseSupport" />,
          ] as Array<boolean | React.ReactNode>,
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_labels" />,
          cells: [false, true, true],
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_api" />,
          cells: [false, false, true],
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_users" />,
          cells: [false, false, true],
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_onboarding" />,
          cells: [false, false, true],
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_accountManager" />,
          cells: [false, false, true],
        },
        {
          feature: <Trans i18nKey="pricingPage.compRow_sla" />,
          cells: [false, false, true],
        },
      ]}
    />
  );
}
