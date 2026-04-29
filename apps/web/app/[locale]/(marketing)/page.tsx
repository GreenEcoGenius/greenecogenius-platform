import { Suspense } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Bot, Recycle, Shield, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from './_components/animate-on-scroll';
import { ComparisonTable } from './_components/landing/comparison-table';
import { FaqSection } from './_components/landing/faq-section';
import { FrameworksCarousel, SourcesCarousel, TechCarousel } from './_components/landing/foundations-section';
import { HowItWorks } from './_components/landing/how-it-works';
import { ImpactSimulator } from './_components/landing/impact-simulator';
import { LatestArticles } from './_components/landing/latest-articles';
import { PricingPreview } from './_components/landing/pricing-preview';
import { RegulatoryTimeline } from './_components/landing/regulatory-timeline';
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
    <div className="flex flex-col">
      {/* ───── SECTION 1 — HERO ───── */}
      <section className="overflow-hidden bg-[#0D3A26] pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[42%_1fr] lg:gap-8">
            {/* Colonne gauche — Texte */}
            <div className="text-center lg:text-left">
              <AnimateOnScroll animation="fade-up">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
                  <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                  <span>{t('heroBadge')}</span>
                </div>

                <h1 className="text-[#F5F5F0] text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.5rem] xl:text-5xl">
                  <span className="gradient-text-verdure-leaf">
                    {t('heroTitle')}
                  </span>
                </h1>

                <p className="text-[#F5F5F0]/70 mx-auto mt-6 max-w-xl text-base leading-relaxed lg:mx-0 lg:text-lg">
                  {t('heroDescription')}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/auth/sign-up"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-[#0D3A26] transition-all hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/20 sm:w-auto"
                  >
                    {t('heroCtaPrimary')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#B8D4E3]/40 px-6 py-3.5 font-semibold text-[#B8D4E3] transition-all hover:bg-[#B8D4E3]/10 hover:border-[#B8D4E3]/60 sm:w-auto"
                  >
                    {t('heroCtaSecondary')}
                  </Link>
                </div>

                <div className="text-[#F5F5F0]/50 mt-6 flex flex-wrap items-center justify-center gap-4 text-sm lg:justify-start">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {t('heroProof1')}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {t('heroProof2')}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {t('heroProof3')}
                  </span>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Colonne droite — Screenshot débordant à droite */}
            <AnimateOnScroll animation="fade-up" delay={200}>
              {/* Mobile : image normale avec coins arrondis */}
              <div className="mx-auto max-w-md lg:hidden">
                <div className="overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/GPT%20Images%202.0/ChatGPT%20Image%2024%20avr.%202026,%2001_00_07.png"
                    alt="GreenEcoGenius Industrial Recycling Warehouse"
                    width={1672}
                    height={941}
                    className="h-auto w-full"
                    priority
                    unoptimized
                  />
                </div>
              </div>
              {/* Desktop : image agrandie, légèrement décalée à droite */}
              <div className="relative hidden lg:block">
                <div className="ml-8 w-[115%] overflow-hidden rounded-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.25)] xl:ml-12 xl:w-[118%]">
                  <Image
                    src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/GPT%20Images%202.0/ChatGPT%20Image%2024%20avr.%202026,%2001_00_07.png"
                    alt="GreenEcoGenius Industrial Recycling Warehouse"
                    width={1672}
                    height={941}
                    className="h-auto w-full object-contain"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── SECTION 2 — STATS MARCHÉ ───── */}
      <StatsSection />

      {/* ───── CARROUSEL TECHNOLOGIES ───── */}
      <TechCarousel />

      {/* ───── SECTION 3 — URGENCE RÉGLEMENTAIRE ───── */}
      <RegulatoryTimeline />

      {/* ───── CARROUSEL SOURCES OFFICIELLES ───── */}
      <SourcesCarousel />

      {/* ───── SECTION 4 — 3 PILIERS ───── */}
      <section id="features" className="bg-[#0D3A26] py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
                {t('featuresBadge')}
              </p>
              <h2 className="gradient-text-verdure-leaf text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t('featuresHeading')}
              </h2>
              <p className="text-[#B8D4E3] mt-4 text-lg">
                {t('featuresSubheading')}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-8 md:grid-cols-3 lg:mt-20">
            <AnimateOnScroll animation="fade-up" delay={0}>
              <PillarCard
                image="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/GPT%20Images%202.0/image.png"
                imageAlt="GreenEcoGenius Circular Economy Ecosystem"
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
                image="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/GPT%20Images%202.0/ChatGPT%20Image%2024%20avr.%202026,%2001_04_23.png"
                imageAlt="GreenEcoGenius Blockchain Traceability Workspace"
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
                image="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/GPT%20Images%202.0/ChatGPT%20Image%2024%20avr.%202026,%2000_57_25.png"
                imageAlt="GreenEcoGenius Carbon and ESG Reporting Platform"
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

      {/* ───── CARROUSEL RÉFÉRENTIELS ───── */}
      <FrameworksCarousel />

      {/* ───── SECTION 7.5 — COMPARATIF CONCURRENTIEL ───── */}
      <ComparisonTable />

      {/* ───── SECTION 8 — PRICING PREVIEW ───── */}
      <PricingPreview />

      {/* ───── SECTION 9 — FAQ ───── */}
      <FaqSection />

      {/* ───── SECTION 10 — ACTUALITÉS ───── */}
      <Suspense fallback={<div className="py-28" />}>
        <LatestArticles />
      </Suspense>

      {/* ───── SECTION 11 — NEWSLETTER ───── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Image
          src="/images/normes/circular-infinity-aerial.webp"
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
            <p className="text-[#B8D4E3] mt-4 text-lg">
              {t('landing.newsletterSub')}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="mt-10 flex justify-center">
              <NewsletterForm />
            </div>
            <p className="text-[#7DC4A0] mt-4 text-xs">
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
    <div className="group border-[#1A5C3E]/50 hover:border-emerald-500 hover:shadow-emerald-500/20 h-full overflow-hidden rounded-2xl border bg-[#0D3A26] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
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
          <div className="bg-[#1A5C3E]/30 text-blue-400 flex h-10 w-10 items-center justify-center rounded-xl">
            {icon}
          </div>
          <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase">
            {badge}
          </span>
        </div>
        <h3 className="text-[#F5F5F0] text-lg font-semibold">{title}</h3>
        <p className="text-[#B8D4E3] mt-2 text-sm leading-relaxed">
          {description}
        </p>
        <p className="text-[#7DC4A0] mt-2 text-xs italic">{extra}</p>
        <p className="text-primary mt-3 text-xs font-semibold">{stat}</p>
      </div>
    </div>
  );
}
