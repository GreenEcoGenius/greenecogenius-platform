'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  FileText,
  Globe,
  Leaf,
  Link2,
  Lock,
  Mail,
  Phone,
  Recycle,
  Shield,
  Sparkles,
  TrendingDown,
  Users,
  Zap,
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
  'pricingPage.featEsgDashboard',
  'pricingPage.featGhgReport',
  'pricingPage.featAutoFill',
  'pricingPage.feat50Lots',
  'pricingPage.featEquivalences',
  'pricingPage.featEmailSupport',
];

const avanceFeatures = [
  'pricingPage.featScope123',
  'pricingPage.featCsrdGri',
  'pricingPage.featUnlimitedLots',
  'pricingPage.featAiRecommendations',
  'pricingPage.featBenchmarking',
  'pricingPage.featCsrdTable',
  'pricingPage.featApiAccess',
  'pricingPage.featSbti',
  'pricingPage.featPrioritySupport',
];

const enterpriseFeatures = [
  'pricingPage.featErpIntegration',
  'pricingPage.featMultiSite',
  'pricingPage.featAuditLabel',
  'pricingPage.featCarbonCredits',
  'pricingPage.featAccountManager',
  'pricingPage.featSla',
  'pricingPage.featOnboarding',
  'pricingPage.featWhiteLabel',
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
        <h1 className="font-heading mx-auto max-w-3xl text-4xl font-bold tracking-tight lg:text-5xl">
          <Trans i18nKey="pricingPage.heroTitle" />
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
          <Trans i18nKey="pricingPage.heroSubtitle" />
        </p>
        <p className="mt-3 text-sm text-green-600">
          <Trans i18nKey="pricingPage.heroNote" />
        </p>

        {/* TOGGLE */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-medium ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <Trans i18nKey="pricingPage.monthly" />
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${annual ? 'bg-primary' : 'bg-muted'}`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${annual ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
          <span
            className={`text-sm font-medium ${annual ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <Trans i18nKey="pricingPage.annual" />
          </span>
          {annual && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              -17%
            </Badge>
          )}
        </div>
      </section>

      {/* INCLUDED BANNER */}
      <section className="border-y bg-green-50/50 py-8 dark:bg-green-950/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-lg font-semibold">
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
                className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white px-3 py-1.5 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
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
          <Card className="flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                <CardTitle>{essentiel?.display_name ?? 'Essentiel'}</CardTitle>
              </div>
              <p className="text-muted-foreground text-sm">
                <Trans i18nKey="pricingPage.essentielTarget" />
              </p>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {essentiel
                    ? formatPrice(
                        annual
                          ? Math.round(essentiel.annual_price! / 12)
                          : essentiel.monthly_price!,
                      )
                    : '149'}
                  €
                </span>
                <span className="text-muted-foreground">/mois</span>
                {annual && essentiel?.annual_price && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {formatPrice(essentiel.annual_price)}€/an
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-3">
                {essentielFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-sm">
                      <Trans i18nKey={feat} />
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="mt-6 w-full"
                render={
                  <Link href="/home/billing">
                    <Trans i18nKey="pricingPage.startTrial" />
                  </Link>
                }
                nativeButton={false}
              />
            </CardContent>
          </Card>

          {/* AVANCÉ */}
          <Card className="border-primary flex scale-[1.02] flex-col shadow-lg shadow-green-100 transition-all hover:-translate-y-1 hover:shadow-xl dark:shadow-green-900/20">
            <CardHeader className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <BarChart3 className="text-primary h-5 w-5" />
                <CardTitle>{avance?.display_name ?? 'Avancé'}</CardTitle>
                <Badge className="animate-pulse bg-green-600 text-white">
                  <Sparkles className="mr-1 h-3 w-3" />
                  <Trans i18nKey="pricingPage.popular" />
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                <Trans i18nKey="pricingPage.avanceTarget" />
              </p>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {avance
                    ? formatPrice(
                        annual
                          ? Math.round(avance.annual_price! / 12)
                          : avance.monthly_price!,
                      )
                    : '449'}
                  €
                </span>
                <span className="text-muted-foreground">/mois</span>
                {annual && avance?.annual_price && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {formatPrice(avance.annual_price)}€/an
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="text-muted-foreground mb-3 text-xs italic">
                <Trans i18nKey="pricingPage.everythingEssentiel" />
              </p>
              <ul className="flex-1 space-y-3">
                {avanceFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-sm">
                      <Trans i18nKey={feat} />
                    </span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full bg-green-600 hover:bg-green-700">
                <Link href="/home/billing" className="flex items-center gap-2">
                  <Trans i18nKey="pricingPage.startTrial" />
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* ENTERPRISE */}
          <Card className="flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Building2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <CardTitle>Enterprise</CardTitle>
              </div>
              <p className="text-muted-foreground text-sm">
                <Trans i18nKey="pricingPage.enterpriseTarget" />
              </p>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  <Trans i18nKey="pricingPage.onQuote" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="text-muted-foreground mb-3 text-xs italic">
                <Trans i18nKey="pricingPage.everythingAvance" />
              </p>
              <ul className="flex-1 space-y-3">
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
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center text-2xl font-bold">
            <Trans i18nKey="pricingPage.commissionTitle" />
          </h2>
          <p className="text-muted-foreground mb-8 text-center">
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
              <Card key={i} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-primary mx-auto mb-3">{tier.icon}</div>
                  <p className="text-primary text-3xl font-bold">{tier.rate}</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    <Trans i18nKey={tier.range} />
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {activePromo && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950">
              <p className="font-semibold text-green-700 dark:text-green-300">
                <Sparkles className="mr-1 inline h-4 w-4" />
                <Trans i18nKey="pricingPage.promoLaunch" />
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES PREMIUM */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-2 text-center text-2xl font-bold">
          <Trans i18nKey="pricingPage.servicesTitle" />
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
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
            <Card key={i} className="text-center">
              <CardContent className="pt-6">
                <div className="text-primary mx-auto mb-3">{service.icon}</div>
                <h3 className="font-semibold">
                  <Trans i18nKey={service.titleKey} />
                </h3>
                <p className="text-primary mt-2 text-lg font-bold">
                  <Trans i18nKey={service.priceKey} />
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  <Trans i18nKey={service.descKey} />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            <Trans i18nKey="pricingPage.faqTitle" />
          </h2>

          <div className="space-y-3">
            {faqKeys.map((key, i) => (
              <div
                key={i}
                className="rounded-lg border bg-white dark:bg-gray-950"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="pr-4 font-medium">
                    <Trans i18nKey={`${key}Q`} />
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="text-muted-foreground border-t px-4 pt-3 pb-4 text-sm">
                    <Trans i18nKey={`${key}A`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">
            <Trans i18nKey="pricingPage.ctaTitle" />
          </h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            <Trans i18nKey="pricingPage.ctaSubtitle" />
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            render={
              <Link href="/home/billing">
                <Trans i18nKey="pricingPage.ctaButton" />
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            }
            nativeButton={false}
          />
          <div className="mt-6 flex items-center justify-center gap-6 text-sm opacity-80">
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              contact@greenecogenius.fr
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
