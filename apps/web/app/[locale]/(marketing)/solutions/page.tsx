import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  Leaf,
  Link2,
  Recycle,
  Shield,
  Sparkles,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from '../_components/animate-on-scroll';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: `${t('solTitle')} | GreenEcoGenius`,
    description: t('solDesc'),
  };
}

export default async function SolutionsPage() {
  const t = await getTranslations('marketing');

  const SOLUTIONS = [
    {
      id: 'marketplace',
      icon: <Recycle className="h-7 w-7" strokeWidth={1.5} />,
      title: t('solMarketplaceTitle'),
      subtitle: t('solMarketplaceSub'),
      badgeClass: 'bg-primary-light text-primary-500',
      description: t('solMarketplaceDesc'),
      features: [t('solMarketplaceF1'), t('solMarketplaceF2'), t('solMarketplaceF3')],
      image: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-691ab3f4-2772-42cc-ae8b-5f039dee20c9.png',
      href: '/auth/sign-up',
    },
    {
      id: 'traceability',
      icon: <Link2 className="h-7 w-7" strokeWidth={1.5} />,
      title: t('solTraceTitle'),
      subtitle: t('solTraceSub'),
      badgeClass: 'bg-circuit-ice text-circuit-blue',
      description: t('solTraceDesc'),
      features: [t('solTraceF1'), t('solTraceF2'), t('solTraceF3')],
      image: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-a5aace78-d0fe-4b7d-865b-181946fc2f34.png',
      href: '/auth/sign-up',
    },
    {
      id: 'carbon',
      icon: <Leaf className="h-7 w-7" strokeWidth={1.5} />,
      title: t('solCarbonTitle'),
      subtitle: t('solCarbonSub'),
      badgeClass: 'bg-tech-mint text-tech-emerald',
      description: t('solCarbonDesc'),
      features: [t('solCarbonF1'), t('solCarbonF2'), t('solCarbonF3')],
      image: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-5078cbe2-55c7-4019-bf5f-d42644debf1b.png',
      href: '/auth/sign-up',
    },
    {
      id: 'reporting',
      icon: <BarChart3 className="h-7 w-7" strokeWidth={1.5} />,
      title: t('solEsgTitle'),
      subtitle: t('solEsgSub'),
      badgeClass: 'bg-badge-purple-bg text-badge-purple-text',
      description: t('solEsgDesc'),
      features: [t('solEsgF1'), t('solEsgF2'), t('solEsgF3')],
      image: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-a5aace78-d0fe-4b7d-865b-181946fc2f34.png',
      href: '/auth/sign-up',
    },
    {
      id: 'compliance',
      icon: <Shield className="h-7 w-7" strokeWidth={1.5} />,
      title: t('solComplianceTitle'),
      subtitle: t('solComplianceSub'),
      badgeClass: 'bg-badge-amber-bg text-badge-amber-text',
      description: t('solComplianceDesc'),
      features: [t('solComplianceF1'), t('solComplianceF2'), t('solComplianceF3')],
      image: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-3ce44a5d-32c4-45eb-8b93-1c560b509a71.png',
      href: '/auth/sign-up',
    },
    {
      id: 'labels',
      icon: <Sparkles className="h-7 w-7" strokeWidth={1.5} />,
      title: t('solLabelsTitle'),
      subtitle: t('solLabelsSub'),
      badgeClass: 'bg-tech-mint text-tech-emerald',
      description: t('solLabelsDesc'),
      features: [t('solLabelsF1'), t('solLabelsF2'), t('solLabelsF3')],
      image: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-f30939eb-48c4-46f7-ad85-99b7f3c11c45.png',
      href: '/auth/sign-up',
    },
  ];

  return (
    <div>
      <section className="bg-metal-50 relative overflow-hidden py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="bg-primary-light text-primary mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              {t('solBadge')}
            </div>
            <h1 className="text-metal-900 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('solTitle')}
            </h1>
            <p className="text-metal-600 mx-auto mt-4 max-w-2xl text-lg">
              {t('solDesc')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {SOLUTIONS.map((solution, index) => {
        const isEven = index % 2 === 0;

        return (
          <section
            key={solution.id}
            className={`py-16 sm:py-24 ${index % 2 === 1 ? 'bg-metal-50' : ''}`}
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div
                className={`grid items-center gap-12 lg:grid-cols-2 ${isEven ? '' : 'lg:[direction:rtl]'}`}
              >
                <AnimateOnScroll animation={isEven ? 'fade-right' : 'fade-left'}>
                  <div className="relative overflow-hidden rounded-xl shadow-sm lg:[direction:ltr]">
                    <Image
                      src={solution.image}
                      alt={solution.title}
                      width={800}
                      height={500}
                      className="w-full object-cover"
                      unoptimized={solution.image.startsWith('http')}
                    />
                  </div>
                </AnimateOnScroll>

                <div className="lg:[direction:ltr]">
                  <AnimateOnScroll
                    animation={isEven ? 'fade-left' : 'fade-right'}
                    delay={100}
                  >
                    <div className="text-primary mb-4 inline-flex items-center gap-3">
                      <div className="bg-primary-light rounded-xl p-3">
                        {solution.icon}
                      </div>
                      <div>
                        <p
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold tracking-wider uppercase ${solution.badgeClass}`}
                        >
                          {solution.subtitle}
                        </p>
                        <h2 className="text-metal-900 text-2xl font-bold sm:text-3xl">
                          {solution.title}
                        </h2>
                      </div>
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll
                    animation={isEven ? 'fade-left' : 'fade-right'}
                    delay={200}
                  >
                    <p className="text-metal-600 text-base leading-relaxed">
                      {solution.description}
                    </p>
                  </AnimateOnScroll>

                  <AnimateOnScroll
                    animation={isEven ? 'fade-left' : 'fade-right'}
                    delay={300}
                  >
                    <ul className="mt-6 space-y-3">
                      {solution.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <div className="bg-tech-mint mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                            <div className="bg-tech-neon h-1.5 w-1.5 rounded-full" />
                          </div>
                          <span className="text-metal-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </AnimateOnScroll>

                  <AnimateOnScroll
                    animation={isEven ? 'fade-left' : 'fade-right'}
                    delay={400}
                  >
                    <Link
                      href={solution.href}
                      className="bg-primary hover:bg-primary-hover mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                    >
                      {t('solStartFree')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </AnimateOnScroll>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
