import Link from 'next/link';

import { ArrowRight, Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from '../animate-on-scroll';

const PLANS = [
  { nameKey: 'landing.planEssentiel', price: '149', positionKey: 'landing.planEssentielPos' },
  { nameKey: 'landing.planAvance', price: '449', positionKey: 'landing.planAvancePos', popular: true },
  { nameKey: 'landing.planEnterprise', price: null, positionKey: 'landing.planEnterprisePos' },
];

export async function PricingPreview() {
  const t = await getTranslations('marketing');

  return (
    <section className="bg-metal-50 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <h2 className="text-metal-900 mb-3 text-center text-3xl font-bold sm:text-4xl">
            {t('landing.pricingTitle')}
          </h2>
          <p className="text-metal-600 mx-auto mb-14 max-w-xl text-center text-lg">
            {t('landing.pricingSub')}
          </p>
        </AnimateOnScroll>

        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan, i) => (
            <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
              <div
                className={`relative rounded-2xl border bg-white p-6 shadow-sm ${
                  plan.popular ? 'border-primary ring-primary/20 ring-2' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="bg-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold text-white uppercase">
                    {t('landing.popular')}
                  </span>
                )}
                <h3 className="text-metal-900 text-lg font-bold">{t(plan.nameKey)}</h3>
                <div className="my-4">
                  {plan.price ? (
                    <p className="text-metal-900 text-3xl font-bold">
                      {plan.price}€<span className="text-metal-500 text-sm font-normal">/mois</span>
                    </p>
                  ) : (
                    <p className="text-metal-900 text-2xl font-bold">{t('landing.onQuote')}</p>
                  )}
                </div>
                <p className="text-metal-600 text-sm">{t(plan.positionKey)}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="text-primary hover:text-primary-hover inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4"
          >
            {t('landing.pricingCta')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-metal-400 mt-2 text-xs">
            {t('landing.pricingTrial')}
          </p>
        </div>
      </div>
    </section>
  );
}
