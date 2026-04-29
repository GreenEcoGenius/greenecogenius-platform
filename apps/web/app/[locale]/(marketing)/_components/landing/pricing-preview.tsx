import Link from 'next/link';

import { ArrowRight, Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from '../animate-on-scroll';

const PLANS = [
  {
    nameKey: 'landing.planEssentiel',
    price: '149',
    positionKey: 'landing.planEssentielPos',
  },
  {
    nameKey: 'landing.planAvance',
    price: '449',
    positionKey: 'landing.planAvancePos',
    popular: true,
  },
  {
    nameKey: 'landing.planEnterprise',
    price: null,
    positionKey: 'landing.planEnterprisePos',
  },
];

export async function PricingPreview() {
  const t = await getTranslations('marketing');

  return (
    <section className="bg-[#0D3A26] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <h2 className="gradient-text-verdure-leaf mb-3 text-center text-3xl font-bold sm:text-4xl">
            {t('landing.pricingTitle')}
          </h2>
          <p className="text-[#B8D4E3] mx-auto mb-14 max-w-xl text-center text-lg">
            {t('landing.pricingSub')}
          </p>
        </AnimateOnScroll>

        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan, i) => (
            <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
              <div
                className={`relative rounded-2xl border bg-[#0D3A26] p-6 shadow-lg shadow-black/20 ${
                  plan.popular
                    ? 'border-primary ring-primary/20 ring-2'
                    : 'border-[#1A5C3E]'
                }`}
              >
                {plan.popular && (
                  <span className="bg-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold text-white uppercase">
                    {t('landing.popular')}
                  </span>
                )}
                <h3 className="text-[#F5F5F0] text-lg font-bold">
                  {t(plan.nameKey)}
                </h3>
                <div className="my-4">
                  {plan.price ? (
                    <p className="text-[#F5F5F0] text-3xl font-bold">
                      {plan.price}€
                      <span className="text-[#7DC4A0] text-sm font-normal">
                        /mois
                      </span>
                    </p>
                  ) : (
                    <p className="text-[#F5F5F0] text-2xl font-bold">
                      {t('landing.onQuote')}
                    </p>
                  )}
                </div>
                <p className="text-[#B8D4E3] text-sm">{t(plan.positionKey)}</p>
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
          <p className="text-[#5A9E7D] mt-2 text-xs">
            {t('landing.pricingTrial')}
          </p>
        </div>
      </div>
    </section>
  );
}
