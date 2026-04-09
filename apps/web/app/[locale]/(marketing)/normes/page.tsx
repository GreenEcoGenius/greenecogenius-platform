import Link from 'next/link';

import { ChevronRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@kit/ui/button';

import { AnimateOnScroll } from '../_components/animate-on-scroll';
import { AnimatedCounter } from '../_components/animated-counter';
import { NormsTabbedContent } from './_components/norms-tabbed-content';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: `${t('normesTitle')} -- 42 ${t('normesIntegrated')} | GreenEcoGenius`,
    description: t('normesSubDesc'),
  };
}

export default async function NormesPage() {
  const t = await getTranslations('marketing');

  const counters = [
    { target: 42, label: t('normesIntegrated') },
    { target: 6, label: t('normesPillars') },
    { target: 15, label: t('normesISO') },
    { target: 12, label: t('normesRegulations') },
    { target: 4, label: t('normesLabels') },
  ];

  return (
    <>
      <section className="bg-metal-50 relative overflow-hidden py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h1 className="text-metal-900 text-4xl font-bold tracking-tight sm:text-5xl">
              {t('normesTitle')}
            </h1>
            <p className="text-metal-600 mx-auto mt-4 max-w-2xl text-lg">
              {t('normesDesc')}
            </p>
            <p className="text-metal-500 mx-auto mt-3 max-w-3xl text-sm">
              {t('normesSubDesc')}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-5">
              {counters.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-primary text-3xl font-bold">
                    <AnimatedCounter target={item.target} />
                  </div>
                  <p className="text-metal-500 mt-1 text-xs">{item.label}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={400}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                render={
                  <Link href="/home">
                    {t('normesCtaDiscover')}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                }
                nativeButton={false}
              />
              <Button
                variant="outline"
                render={
                  <Link href="/home/billing">{t('normesCtaPricing')}</Link>
                }
                nativeButton={false}
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <NormsTabbedContent />
    </>
  );
}
