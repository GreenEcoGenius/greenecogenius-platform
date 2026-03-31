import { Check, Lock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

export const generateMetadata = async () => {
  const t = await getTranslations('pricing');

  return { title: t('title') };
};

const plans = [
  {
    key: 'essentiel',
    price: '199',
    annual: '1 590',
    features: [
      'pricing.feat50Lots',
      'pricing.featBasicTracing',
      'pricing.featPdfCertificates',
      'pricing.featEmailSupport',
    ],
    cta: 'pricing.comingSoon',
    highlighted: false,
  },
  {
    key: 'avance',
    price: '499',
    annual: '4 788',
    features: [
      'pricing.featUnlimitedLots',
      'pricing.featFullApi',
      'pricing.featAdvancedDashboard',
      'pricing.featDataExport',
      'pricing.featPrioritySupport',
    ],
    cta: 'pricing.comingSoon',
    highlighted: true,
  },
  {
    key: 'enterprise',
    price: null,
    annual: null,
    features: [
      'pricing.featEverythingAdvanced',
      'pricing.featErpIntegration',
      'pricing.featDedicatedSupport',
      'pricing.featSla',
      'pricing.featCustomReports',
    ],
    cta: 'pricing.contactUs',
    highlighted: false,
  },
];

async function PricingPage() {
  return (
    <PageBody>
      <PageHeader description="">
        <Heading level={3}>
          <Trans i18nKey="pricing.title" />
        </Heading>
      </PageHeader>

      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground text-lg">
            <Trans i18nKey="pricing.subtitle" />
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.key}
              className={
                plan.highlighted
                  ? 'border-primary relative shadow-lg'
                  : 'relative'
              }
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Trans i18nKey="pricing.popular" />
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle>
                  <Trans i18nKey={`pricing.plan.${plan.key}`} />
                </CardTitle>
                <div className="mt-4">
                  {plan.price ? (
                    <>
                      <span className="text-4xl font-bold">{plan.price}€</span>
                      <span className="text-muted-foreground">/mois</span>
                      <p className="text-muted-foreground mt-1 text-sm">
                        <Trans i18nKey="pricing.orAnnual" /> {plan.annual}€/an
                      </p>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">
                      <Trans i18nKey="pricing.onQuote" />
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                      <span className="text-sm">
                        <Trans i18nKey={feat} />
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  disabled
                >
                  <Lock className="mr-2 h-4 w-4" />
                  <Trans i18nKey={plan.cta} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-lg border p-6 text-center">
          <p className="text-muted-foreground text-sm">
            <Trans i18nKey="pricing.pillar2Note" />
          </p>
        </div>
      </div>
    </PageBody>
  );
}

export default PricingPage;
