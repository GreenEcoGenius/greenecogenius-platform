'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  Blocks,
  Building2,
  Check,
  ChevronDown,
  FileBarChart,
  FileText,
  Globe,
  Leaf,
  Link2,
  Mail,
  Palette,
  Phone,
  Recycle,
  Rocket,
  Shield,
  Sparkles,
  Target,
  TrendingDown,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

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

const essentielFeatures = [
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

const avanceFeatures = [
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

const enterpriseFeatures = [
  'pricingPage.featGeniusUnlimited',
  'pricingPage.featCustomReports',
  'pricingPage.featApiAccess',
  'pricingPage.featMultiUsers',
  'pricingPage.featOnboarding',
  'pricingPage.featAccountManager',
  'pricingPage.featSla',
  'pricingPage.featPriorityVisio',
];

const faqKeys = [
  'pricingPage.faq1',
  'pricingPage.faq2',
  'pricingPage.faq3',
  'pricingPage.faq4',
  'pricingPage.faq5',
];

export function PricingContent({
  plans,
  commissionConfigs,
}: PricingContentProps) {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const essentiel = plans.find((p) => p.name === 'essentiel');
  const avance = plans.find((p) => p.name === 'avance');

  const activePromo = commissionConfigs.find(
    (c) => c.is_active && c.commission_type === 'flat' && c.valid_until,
  );

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="container mx-auto px-4 py-12 text-center lg:py-20">
        <h1 className="font-heading text-metal-900 mx-auto max-w-3xl text-4xl font-bold tracking-tight lg:text-5xl">
          <Trans i18nKey="pricingPage.heroTitle" />
        </h1>
        <p className="text-metal-600 mx-auto mt-4 max-w-2xl text-lg">
          <Trans i18nKey="pricingPage.heroSubtitle" />
        </p>
        <p className="text-primary mt-3 text-sm">
          <Trans i18nKey="pricingPage.heroNote" />
        </p>

        {/* TOGGLE */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-medium ${!annual ? 'text-metal-900' : 'text-metal-500'}`}
          >
            <Trans i18nKey="pricingPage.monthly" />
          </span>
          <button
            role="switch"
            aria-checked={annual}
            aria-label="Facturation annuelle"
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${annual ? 'bg-primary' : 'bg-metal-frost'}`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${annual ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
          <span
            className={`text-sm font-medium ${annual ? 'text-metal-900' : 'text-metal-500'}`}
          >
            <Trans i18nKey="pricingPage.annual" />
          </span>
          {annual && (
            <Badge
              variant="secondary"
              className="bg-tech-mint text-tech-emerald"
            >
              -17%
            </Badge>
          )}
        </div>
      </section>

      {/* INCLUDED BANNER */}
      <section className="border-metal-chrome bg-circuit-ice/20 border-y py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-metal-900 mb-4 text-lg font-semibold">
            <Trans i18nKey="pricingPage.includedTitle" />
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              {
                icon: <Link2 className="h-4 w-4" />,
                key: 'pricingPage.tagBlockchain',
              },
              { icon: <Leaf className="h-4 w-4" />, key: 'pricingPage.tagCO2' },
              {
                icon: <FileText className="h-4 w-4" />,
                key: 'pricingPage.tagCertificate',
              },
              {
                icon: <BarChart3 className="h-4 w-4" />,
                key: 'pricingPage.tagDashboard',
              },
              {
                icon: <ArrowRight className="h-4 w-4" />,
                key: 'pricingPage.tagExport',
              },
            ].map((tag, i) => (
              <span
                key={i}
                className="border-circuit-turquoise/30 text-circuit-blue inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-sm"
              >
                {tag.icon}
                <Trans i18nKey={tag.key} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 pt-4 md:grid-cols-3">
          {/* ESSENTIEL */}
          <Card className="border-metal-silver flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Zap className="text-primary h-5 w-5" />
                <CardTitle>{essentiel?.display_name ?? 'Essentiel'}</CardTitle>
              </div>
              <p className="text-metal-600 text-sm">
                <Trans i18nKey="pricingPage.essentielTarget" />
              </p>
              <div className="mt-4">
                <span className="text-metal-900 text-4xl font-bold">
                  {essentiel
                    ? formatPrice(
                        annual
                          ? Math.round(essentiel.annual_price! / 12)
                          : essentiel.monthly_price!,
                      )
                    : '149'}
                  €
                </span>
                <span className="text-metal-500">/mois</span>
                {annual && essentiel?.annual_price && (
                  <p className="text-metal-500 mt-1 text-sm">
                    {formatPrice(essentiel.annual_price)}€/an
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-3">
                {essentielFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className="text-tech-neon mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-metal-700 text-sm">
                      <Trans i18nKey={feat} />
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="border-metal-silver text-metal-700 hover:bg-metal-chrome mt-6 w-full rounded-xl"
                render={
                  <Link href="/home/billing">
                    <Trans i18nKey="pricingPage.startTrial" />
                  </Link>
                }
                nativeButton={false}
              />
            </CardContent>
          </Card>

          {/* AVANCE */}
          <Card className="border-circuit-cyan shadow-circuit-ice/30 flex scale-[1.02] flex-col border-2 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <BarChart3 className="text-primary h-5 w-5" />
                <CardTitle>{avance?.display_name ?? 'Avance'}</CardTitle>
                <Badge className="bg-circuit-cyan text-metal-900 font-semibold">
                  <Sparkles className="mr-1 h-3 w-3" />
                  <Trans i18nKey="pricingPage.popular" />
                </Badge>
              </div>
              <p className="text-metal-600 text-sm">
                <Trans i18nKey="pricingPage.avanceTarget" />
              </p>
              <div className="mt-4">
                <span className="text-metal-900 text-4xl font-bold">
                  {avance
                    ? formatPrice(
                        annual
                          ? Math.round(avance.annual_price! / 12)
                          : avance.monthly_price!,
                      )
                    : '449'}
                  €
                </span>
                <span className="text-metal-500">/mois</span>
                {annual && avance?.annual_price && (
                  <p className="text-metal-500 mt-1 text-sm">
                    {formatPrice(avance.annual_price)}€/an
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="text-metal-500 mb-3 text-xs italic">
                <Trans i18nKey="pricingPage.everythingEssentiel" />
              </p>
              <ul className="flex-1 space-y-3">
                {avanceFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className="text-tech-neon mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-metal-700 text-sm">
                      <Trans i18nKey={feat} />
                    </span>
                  </li>
                ))}
              </ul>
              <Button className="bg-primary hover:bg-primary-hover mt-6 w-full rounded-xl">
                <Link href="/home/billing" className="flex items-center gap-2">
                  <Trans i18nKey="pricingPage.startTrial" />
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* ENTERPRISE */}
          <Card className="border-metal-silver bg-metal-frost flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Building2 className="text-metal-700 h-5 w-5" />
                <CardTitle>Enterprise</CardTitle>
              </div>
              <p className="text-metal-600 text-sm">
                <Trans i18nKey="pricingPage.enterpriseTarget" />
              </p>
              <div className="mt-4">
                <span className="text-metal-900 text-3xl font-bold">
                  <Trans i18nKey="pricingPage.onQuote" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="text-metal-500 mb-3 text-xs italic">
                <Trans i18nKey="pricingPage.everythingAvance" />
              </p>
              <ul className="flex-1 space-y-3">
                {enterpriseFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className="text-tech-neon mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-metal-700 text-sm">
                      <Trans i18nKey={feat} />
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                variant="secondary"
                className="border-metal-silver bg-metal-frost text-metal-700 hover:bg-metal-chrome mt-6 w-full rounded-xl border"
                render={
                  <Link href="mailto:contact@greenecogenius.tech">
                    <Users className="mr-2 h-4 w-4" />
                    <Trans i18nKey="pricingPage.contactSales" />
                  </Link>
                }
                nativeButton={false}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* COMMISSION MARKETPLACE */}
      <section className="bg-metal-frost py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-metal-900 mb-2 text-center text-2xl font-bold">
            <Trans i18nKey="pricingPage.commissionTitle" />
          </h2>
          <p className="text-metal-600 mb-8 text-center">
            <Trans i18nKey="pricingPage.commissionSubtitle" />
          </p>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                rate: '8%',
                range: 'pricingPage.tier1Range',
                icon: <Recycle className="h-6 w-6" />,
              },
              {
                rate: '5%',
                range: 'pricingPage.tier2Range',
                icon: <TrendingDown className="h-6 w-6" />,
              },
              {
                rate: '3%',
                range: 'pricingPage.tier3Range',
                icon: <Globe className="h-6 w-6" />,
              },
            ].map((tier, i) => (
              <Card key={i} className="border-metal-silver text-center">
                <CardContent className="pt-6">
                  <div className="text-circuit-blue mx-auto mb-3">
                    {tier.icon}
                  </div>
                  <p className="text-circuit-cyan text-3xl font-bold">
                    {tier.rate}
                  </p>
                  <p className="text-metal-500 mt-1 text-sm">
                    <Trans i18nKey={tier.range} />
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {activePromo && (
            <div className="border-tech-neon/30 bg-tech-neon/10 mt-6 rounded-xl border p-4 text-center">
              <p className="text-tech-emerald font-semibold">
                <Sparkles className="mr-1 inline h-4 w-4" />
                <Trans i18nKey="pricingPage.promoLaunch" />
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES PREMIUM */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-metal-900 mb-2 text-center text-2xl font-bold">
          <Trans i18nKey="pricingPage.servicesTitle" />
        </h2>
        <p className="text-metal-600 mb-8 text-center">
          <Trans i18nKey="pricingPage.servicesSubtitle" />
        </p>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: <Shield className="h-8 w-8" />,
              titleKey: 'pricingPage.service1Title',
              priceKey: 'pricingPage.service1Price',
              descKey: 'pricingPage.service1Desc',
            },
            {
              icon: <BadgeCheck className="h-8 w-8" />,
              titleKey: 'pricingPage.service2Title',
              priceKey: 'pricingPage.service2Price',
              descKey: 'pricingPage.service2Desc',
            },
            {
              icon: <FileText className="h-8 w-8" />,
              titleKey: 'pricingPage.service3Title',
              priceKey: 'pricingPage.service3Price',
              descKey: 'pricingPage.service3Desc',
            },
          ].map((service, i) => (
            <Card
              key={i}
              className="border-metal-silver border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="pt-6">
                <div className="text-circuit-blue mx-auto mb-3">
                  {service.icon}
                </div>
                <h3 className="text-metal-900 font-semibold">
                  <Trans i18nKey={service.titleKey} />
                </h3>
                <p className="text-circuit-blue mt-2 text-lg font-bold">
                  <Trans i18nKey={service.priceKey} />
                </p>
                <p className="text-metal-600 mt-2 text-sm">
                  <Trans i18nKey={service.descKey} />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-metal-50 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-metal-900 mb-8 text-center text-2xl font-bold">
            <Trans i18nKey="pricingPage.faqTitle" />
          </h2>

          <div className="space-y-3">
            {faqKeys.map((key, i) => (
              <div
                key={i}
                className="border-metal-chrome rounded-xl border bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="text-metal-900 pr-4 font-medium">
                    <Trans i18nKey={`${key}Q`} />
                  </span>
                  <ChevronDown
                    className={`text-circuit-blue h-5 w-5 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-metal-chrome text-metal-600 border-t px-4 pt-3 pb-4 text-sm">
                    <Trans i18nKey={`${key}A`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMING SOON */}
      <ComingSoonSection />

      {/* FOOTER CTA */}
      <section className="relative overflow-hidden py-16 text-white">
        <img
          src="/images/normes/saas-carbon-dark.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="from-metal-900/70 via-metal-800/60 to-metal-900/80 absolute inset-0 bg-gradient-to-b" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            <Trans i18nKey="pricingPage.ctaTitle" />
          </h2>
          <p className="text-metal-silver mx-auto mt-4 max-w-xl">
            <Trans i18nKey="pricingPage.ctaSubtitle" />
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-hover mt-8 rounded-xl font-semibold text-white"
            render={
              <Link href="/home/billing">
                <Trans i18nKey="pricingPage.ctaButton" />
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            }
            nativeButton={false}
          />
          <div className="text-metal-steel mt-6 flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              contact@greenecogenius.tech
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              +33 7 83 32 42 74
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Coming Soon Section ─── */

interface ComingSoonFeature {
  icon: LucideIcon;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  timeline: string;
}

const COMING_SOON: ComingSoonFeature[] = [
  {
    icon: BarChart3,
    titleFr: 'Benchmarking sectoriel',
    titleEn: 'Industry benchmarking',
    descFr: "Comparez vos performances carbone et circulaires avec votre secteur d'activite.",
    descEn: 'Compare your carbon and circular performance with your industry peers.',
    timeline: 'Q4 2026',
  },
  {
    icon: Zap,
    titleFr: 'Matching IA acheteur-vendeur',
    titleEn: 'AI buyer-seller matching',
    descFr: 'Algorithme intelligent qui connecte automatiquement les vendeurs et acheteurs de matieres recyclables.',
    descEn: 'Smart algorithm that automatically connects recyclable material sellers and buyers.',
    timeline: 'Q4 2026',
  },
  {
    icon: Blocks,
    titleFr: 'Integration ERP native (SAP, Oracle, Sage)',
    titleEn: 'Native ERP integration (SAP, Oracle, Sage)',
    descFr: 'Connectez votre ERP pour synchroniser automatiquement les donnees de dechets et achats.',
    descEn: 'Connect your ERP to automatically sync waste and procurement data.',
    timeline: '2027',
  },
  {
    icon: Building2,
    titleFr: 'Reporting multi-sites / multi-filiales',
    titleEn: 'Multi-site / subsidiary reporting',
    descFr: 'Consolidez les donnees de tous vos sites et filiales dans un seul dashboard.',
    descEn: 'Consolidate data from all your sites and subsidiaries in one dashboard.',
    timeline: '2027',
  },
  {
    icon: Award,
    titleFr: 'Préparation aux labels reconnus',
    titleEn: 'Preparation for recognized labels',
    descFr: 'Accompagnement à la candidature aux labels reconnus : B Corp, GreenTech Innovation, Label Lucie 26000, Label Numérique Responsable, EcoVadis.',
    descEn: 'Support for applying to recognized labels: B Corp, GreenTech Innovation, Label Lucie 26000, Label Numérique Responsable, EcoVadis.',
    timeline: '2027',
  },
  {
    icon: Leaf,
    titleFr: 'Accompagnement credits carbone',
    titleEn: 'Carbon credits support',
    descFr: "Accedez aux marches de credits carbone et monetisez vos reductions d'emissions verifiees.",
    descEn: 'Access carbon credit markets and monetize your verified emission reductions.',
    timeline: '2027',
  },
  {
    icon: Palette,
    titleFr: 'Rapports white-label personnalisables',
    titleEn: 'Customizable white-label reports',
    descFr: 'Generez des rapports aux couleurs de votre entreprise pour vos clients et parties prenantes.',
    descEn: 'Generate reports in your company branding for your clients and stakeholders.',
    timeline: '2027',
  },
];

function ComingSoonSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
            <Rocket className="h-4 w-4" strokeWidth={1.5} />
            Roadmap 2026 — 2027
          </div>
          <h2 className="text-metal-900 text-3xl font-bold">
            <Trans
              i18nKey="pricingPage.comingSoonTitle"
              defaults="Prochainement sur la plateforme"
            />
          </h2>
          <p className="text-metal-500 mx-auto mt-3 max-w-2xl text-lg">
            <Trans
              i18nKey="pricingPage.comingSoonSubtitle"
              defaults="Nous construisons en continu. Voici les fonctionnalites en cours de developpement."
            />
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COMING_SOON.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.titleEn}
                className="rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:border-emerald-200"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                    <Icon
                      className="h-5 w-5 text-emerald-600"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-medium ${
                      feature.timeline.startsWith('Q')
                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    {feature.timeline}
                  </span>
                </div>
                <h3 className="text-metal-900 mb-2 font-semibold">
                  <Trans
                    i18nKey={`pricingPage.cs_${feature.titleEn.replace(/[^a-zA-Z]/g, '_').toLowerCase()}`}
                    defaults={feature.titleFr}
                  />
                </h3>
                <p className="text-metal-500 text-sm">{feature.descFr}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-metal-400 text-sm">
            <Trans
              i18nKey="pricingPage.comingSoonInterested"
              defaults="Une fonctionnalite vous interesse particulierement ?"
            />
          </p>
          <Link
            href="/contact"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            <Trans
              i18nKey="pricingPage.comingSoonContact"
              defaults="Contactez-nous pour en discuter"
            />{' '}
            <ArrowRight className="ml-1 inline h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
