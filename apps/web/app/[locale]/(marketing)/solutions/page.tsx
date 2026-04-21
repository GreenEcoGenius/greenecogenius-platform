import Image from 'next/image';
import Link from 'next/link';

import {
  BarChart3,
  Leaf,
  Link2,
  Recycle,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { cn } from '@kit/ui/utils';

import {
  EnviroButton,
  EnviroComparisonTable,
  EnviroPageHero,
  EnviroSectionHeader,
} from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: `${t('solTitle')} | GreenEcoGenius`,
    description: t('solDesc'),
  };
}

interface Solution {
  id: string;
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  href: string;
}

export default async function SolutionsPage() {
  const t = await getTranslations('marketing');

  const solutions: Solution[] = [
    {
      id: 'marketplace',
      Icon: Recycle,
      title: t('solMarketplaceTitle'),
      subtitle: t('solMarketplaceSub'),
      description: t('solMarketplaceDesc'),
      features: [
        t('solMarketplaceF1'),
        t('solMarketplaceF2'),
        t('solMarketplaceF3'),
      ],
      image: '/images/normes/circular-zero-waste.png',
      href: '/auth/sign-up',
    },
    {
      id: 'traceability',
      Icon: Link2,
      title: t('solTraceTitle'),
      subtitle: t('solTraceSub'),
      description: t('solTraceDesc'),
      features: [t('solTraceF1'), t('solTraceF2'), t('solTraceF3')],
      image: '/images/normes/traceability-blockchain-chain.png',
      href: '/auth/sign-up',
    },
    {
      id: 'carbon',
      Icon: Leaf,
      title: t('solCarbonTitle'),
      subtitle: t('solCarbonSub'),
      description: t('solCarbonDesc'),
      features: [t('solCarbonF1'), t('solCarbonF2'), t('solCarbonF3')],
      image: '/images/normes/carbon-counter-1000t.png',
      href: '/auth/sign-up',
    },
    {
      id: 'reporting',
      Icon: BarChart3,
      title: t('solEsgTitle'),
      subtitle: t('solEsgSub'),
      description: t('solEsgDesc'),
      features: [t('solEsgF1'), t('solEsgF2'), t('solEsgF3')],
      image: '/images/normes/reporting-esg-meeting.png',
      href: '/auth/sign-up',
    },
    {
      id: 'compliance',
      Icon: Shield,
      title: t('solComplianceTitle'),
      subtitle: t('solComplianceSub'),
      description: t('solComplianceDesc'),
      features: [
        t('solComplianceF1'),
        t('solComplianceF2'),
        t('solComplianceF3'),
      ],
      image: '/images/normes/labels-globe-recycle.png',
      href: '/auth/sign-up',
    },
    {
      id: 'labels',
      Icon: Sparkles,
      title: t('solLabelsTitle'),
      subtitle: t('solLabelsSub'),
      description: t('solLabelsDesc'),
      features: [t('solLabelsF1'), t('solLabelsF2'), t('solLabelsF3')],
      image:
        'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-f30939eb-48c4-46f7-ad85-99b7f3c11c45.png',
      href: '/auth/sign-up',
    },
  ];

  const compHeaders = [
    t('landing.compHeaderFeature'),
    t('landing.compHeaderGeg'),
    t('landing.compHeaderGreenly'),
    t('landing.compHeaderSweep'),
    t('landing.compHeaderInternal'),
  ];
  const partial = t('landing.compYesPartial');
  const compRows = [
    {
      feature: t('landing.comp_marketplace'),
      cells: [true, false, false, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_blockchain'),
      cells: [true, false, false, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_carbonScopes'),
      cells: [true, true, true, partial] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_csrdReport'),
      cells: [true, true, true, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_ademeBase'),
      cells: [true, true, partial, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_agecRep'),
      cells: [true, partial, partial, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_blockchainCerts'),
      cells: [true, false, false, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_csrLabels'),
      cells: [true, false, partial, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_apiWebhooks'),
      cells: [true, true, true, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_entryPrice'),
      cells: [
        t('landing.compPriceGeg'),
        t('landing.compPriceGreenly'),
        t('landing.compPriceSweep'),
        t('landing.compPriceInternal'),
      ] as Array<boolean | string>,
    },
  ];

  return (
    <div className="flex flex-col bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]">
      {/* ────────────────── HERO ────────────────── */}
      <EnviroPageHero
        tag={t('solHeroTag')}
        title={t('solTitle')}
        subtitle={t('solDesc')}
        tone="cream"
        align="center"
      />

      {/* ────────────────── 6 SOLUTIONS (alternating) ────────────────── */}
      {solutions.map((solution, index) => {
        const isEven = index % 2 === 0;
        const altBg = !isEven;

        return (
          <section
            key={solution.id}
            id={solution.id}
            className={cn(
              'py-20 lg:py-24',
              altBg ? 'bg-white' : 'bg-[--color-enviro-cream-50]',
            )}
          >
            <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <FadeInSection>
                  <div
                    className={cn(
                      'relative aspect-[4/3] overflow-hidden rounded-[--radius-enviro-3xl] shadow-[--shadow-enviro-card]',
                      isEven ? 'lg:order-1' : 'lg:order-2',
                    )}
                  >
                    <Image
                      src={solution.image}
                      alt={solution.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized={solution.image.startsWith('http')}
                    />
                  </div>
                </FadeInSection>

                <FadeInSection delay={0.1}>
                  <div
                    className={cn(
                      'flex flex-col gap-5',
                      isEven ? 'lg:order-2' : 'lg:order-1',
                    )}
                  >
                    <span className="inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
                      <span aria-hidden="true">[</span>
                      <span className="px-1">{solution.subtitle}</span>
                      <span aria-hidden="true">]</span>
                    </span>

                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
                        <solution.Icon className="h-6 w-6" strokeWidth={1.5} />
                      </span>
                      <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-enviro-display)]">
                        {solution.title}
                      </h2>
                    </div>

                    <p className="text-base md:text-lg leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
                      {solution.description}
                    </p>

                    <ul className="mt-2 flex flex-col gap-3">
                      {solution.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 inline-flex h-2 w-2 shrink-0 items-center justify-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-400]"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-2">
                      <Link href={solution.href}>
                        <EnviroButton variant="primary" size="md">
                          {t('solStartFree')}
                        </EnviroButton>
                      </Link>
                    </div>
                  </div>
                </FadeInSection>
              </div>
            </div>
          </section>
        );
      })}

      {/* ────────────────── COMPARISON ────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('solCompTag')}
              title={t('solCompTitle')}
              subtitle={t('solCompSub')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mt-12">
            <EnviroComparisonTable
              headers={compHeaders}
              rows={compRows}
              highlightColumnIndex={0}
              tone="cream"
            />
          </div>

          <p className="mt-4 text-center text-xs text-[--color-enviro-forest-600] font-[family-name:var(--font-enviro-sans)]">
            {t('landing.compPriceDisclaimer')}
          </p>
        </div>
      </section>

      {/* ────────────────── CTA → DEMO ────────────────── */}
      <section className="bg-[--color-enviro-forest-900] py-20 lg:py-28 text-[--color-enviro-fg-inverse]">
        <div className="mx-auto w-full max-w-[--container-enviro-md] px-4 text-center lg:px-8">
          <FadeInSection>
            <span className="inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[</span>
              <span className="px-1">{t('solCtaTag')}</span>
              <span aria-hidden="true">]</span>
            </span>
            <h2 className="mt-4 text-balance text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-enviro-display)]">
              {t('solCtaTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base md:text-lg leading-relaxed text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
              {t('solCtaSub')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact">
                <EnviroButton variant="primary" size="lg" magnetic>
                  <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                  {t('solCtaLabel')}
                </EnviroButton>
              </Link>
              <Link href="/auth/sign-up">
                <EnviroButton variant="outlineCream" size="lg">
                  {t('solCtaSecondary')}
                </EnviroButton>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
