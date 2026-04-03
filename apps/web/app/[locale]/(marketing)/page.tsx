import { Suspense } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Bot, CheckCircle, Recycle, Shield } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from './_components/animate-on-scroll';
import { HeroScrollEffect } from './_components/hero-scroll-effect';
import { HeroVisual } from './_components/hero-visual';
import { ComparisonTable } from './_components/landing/comparison-table';
import { FaqSection } from './_components/landing/faq-section';
import { HowItWorks } from './_components/landing/how-it-works';
import { ImpactSimulator } from './_components/landing/impact-simulator';
import { PricingPreview } from './_components/landing/pricing-preview';
import { RegulatoryTimeline } from './_components/landing/regulatory-timeline';
import { SocialProof } from './_components/landing/social-proof';
import { StatsSection } from './_components/landing/stats-section';
import { NewsletterForm } from './_components/newsletter-form';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title:
      'GreenEcoGenius — Plateforme B2B Économie Circulaire | CSRD & Blockchain',
    description: t('heroSubtitle'),
  };
}

export default async function Home() {
  const t = await getTranslations('marketing');

  return (
    <div className="-mt-16 flex flex-col overflow-x-hidden md:-mt-36">
      {/* ───── SECTION 1 — HERO ───── */}
      <HeroScrollEffect>
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
          <Image
            src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Photorealistic_aerial_drone_202604030010.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          <div className="from-metal-900/60 via-metal-900/40 to-metal-900/70 absolute inset-0 bg-gradient-to-b" />

          <HeroVisual />

          {/* CTAs */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <AnimateOnScroll animation="fade-up" delay={300}>
              <div className="flex items-center justify-center">
                <Link
                  href="/auth/sign-up"
                  className="group text-metal-900 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold shadow-lg transition-all hover:shadow-xl sm:px-10 sm:py-4"
                >
                  {t('heroCta1')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </AnimateOnScroll>

            {/* Credibility badges */}
            <AnimateOnScroll animation="fade-up" delay={500}>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-white/80">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />{' '}
                  {t('landing.badgeCsrd')}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />{' '}
                  {t('landing.badgeBlockchain')}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />{' '}
                  {t('landing.badgeAdeme')}
                </span>
              </div>
            </AnimateOnScroll>
          </div>

          <div className="from-metal-50 absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t to-transparent" />
        </section>
      </HeroScrollEffect>

      {/* ───── SECTION 2 — STATS MARCHÉ ───── */}
      <StatsSection />

      {/* ───── SECTION 3 — URGENCE RÉGLEMENTAIRE ───── */}
      <RegulatoryTimeline />

      {/* ───── SECTION 4 — 3 PILIERS ───── */}
      <section id="features" className="bg-metal-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
                {t('featuresBadge')}
              </p>
              <h2 className="text-metal-900 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t('featuresHeading')}
              </h2>
              <p className="text-metal-600 mt-4 text-lg">
                {t('featuresSubheading')}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-8 md:grid-cols-3 lg:mt-20">
            <AnimateOnScroll animation="fade-up" delay={0}>
              <PillarCard
                image="/images/sorted-materials.png"
                imageAlt="Sorted recyclable materials warehouse"
                icon={<Recycle className="h-5 w-5" />}
                badge={t('landing.pillar1Badge')}
                title={t('feature1Title')}
                description={t('feature1Description')}
                extra={t('landing.pillar1Extra')}
                stat={t('landing.pillar1Stat')}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={150}>
              <PillarCard
                image="/images/blockchain-tablet.png"
                imageAlt="Blockchain traceability on tablet"
                icon={<Shield className="h-5 w-5" />}
                badge={t('landing.pillar2Badge')}
                title={t('feature2Title')}
                description={t('feature2Description')}
                extra={t('landing.pillar2Extra')}
                stat={t('landing.pillar2Stat')}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={300}>
              <PillarCard
                image="/images/team-csr-reporting.png"
                imageAlt="Team working on CSR reporting"
                icon={<Bot className="h-5 w-5" />}
                badge={t('landing.pillar3Badge')}
                title={t('feature3Title')}
                description={t('feature3Description')}
                extra={t('landing.pillar3Extra')}
                stat={t('landing.pillar3Stat')}
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── SECTION 5 — COMMENT ÇA MARCHE ───── */}
      <HowItWorks />

      {/* ───── SECTION 6 — SIMULATEUR D'IMPACT ───── */}
      <Suspense fallback={<div className="py-28" />}>
        <ImpactSimulator />
      </Suspense>

      {/* ───── SECTION 7 — SOCIAL PROOF ───── */}
      <SocialProof />

      {/* ───── SECTION 7.5 — COMPARATIF CONCURRENTIEL ───── */}
      <ComparisonTable />

      {/* ───── SECTION 8 — PRICING PREVIEW ───── */}
      <PricingPreview />

      {/* ───── SECTION 9 — FAQ ───── */}
      <FaqSection />

      {/* ───── SECTION 10 — NEWSLETTER ───── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Image
          src="/images/normes/circular-infinity-aerial.png"
          alt=""
          fill
          className="object-cover"
        />
        <div className="bg-metal-900/60 absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('landing.newsletterTitle')}
            </h2>
            <p className="text-metal-silver mt-4 text-lg">
              {t('landing.newsletterSub')}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="mt-10 flex justify-center">
              <NewsletterForm />
            </div>
            <p className="text-metal-steel mt-4 text-xs">
              {t('newsletterDisclaimer')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}

function PillarCard({
  image,
  imageAlt,
  icon,
  badge,
  title,
  description,
  extra,
  stat,
}: {
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  extra: string;
  stat: string;
}) {
  return (
    <div className="group border-metal-silver/50 hover:border-circuit-turquoise hover:shadow-circuit-ice/30 h-full overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          width={800}
          height={500}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="from-circuit-ice/10 absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent" />
      </div>
      <div className="p-8">
        <div className="mb-3 flex items-center gap-2">
          <div className="bg-circuit-ice/30 text-circuit-blue flex h-10 w-10 items-center justify-center rounded-xl">
            {icon}
          </div>
          <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase">
            {badge}
          </span>
        </div>
        <h3 className="text-metal-900 text-lg font-semibold">{title}</h3>
        <p className="text-metal-600 mt-2 text-sm leading-relaxed">
          {description}
        </p>
        <p className="text-metal-500 mt-2 text-xs italic">{extra}</p>
        <p className="text-primary mt-3 text-xs font-semibold">{stat}</p>
      </div>
    </div>
  );
}
