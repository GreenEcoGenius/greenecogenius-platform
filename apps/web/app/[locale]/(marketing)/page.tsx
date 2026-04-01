import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  Bot,
  Factory,
  Globe,
  Recycle,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from './_components/animate-on-scroll';
import { AnimatedCounter } from './_components/animated-counter';
import { HeroScrollEffect } from './_components/hero-scroll-effect';
import { HeroVisual } from './_components/hero-visual';
import { LogoCarousel } from './_components/logo-carousel';
import { NewsletterForm } from './_components/newsletter-form';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: t('heroHeadline'),
    description: t('heroSubtitle'),
  };
}

export default async function Home() {
  const t = await getTranslations('marketing');

  return (
    <div className="-mt-16 flex flex-col md:-mt-36">
      {/* ───── HERO ───── */}
      <HeroScrollEffect>
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
          {/* Background image */}
          <Image
            src="/images/hero-circular-economy.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/60 via-[#0a1628]/40 to-[#0a1628]/70" />

          {/* Orbital visualization */}
          <HeroVisual />

          {/* Single CTA button centered in the orbit */}
          <div className="relative z-10">
            <AnimateOnScroll animation="fade-up" delay={300}>
              <Link
                href="/auth/sign-up"
                className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-semibold text-[#1A1A2E] shadow-lg transition-all hover:shadow-xl hover:shadow-white/15 sm:px-8 sm:py-4 sm:text-sm"
              >
                {t('heroCta1')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </AnimateOnScroll>
          </div>

          <div className="from-background absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t to-transparent" />
        </section>
      </HeroScrollEffect>

      {/* ───── STATS ───── */}
      <section className="relative z-10 -mt-16 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="bg-card grid grid-cols-2 gap-6 rounded-2xl border p-8 shadow-xl md:grid-cols-4 md:gap-8">
              <StatItem
                icon={<Factory className="h-5 w-5" />}
                value={32}
                suffix="M"
                label={t('stat1Label')}
              />
              <StatItem
                icon={<Recycle className="h-5 w-5" />}
                value={10}
                label={t('stat2Label')}
              />
              <StatItem
                icon={<Globe className="h-5 w-5" />}
                value={27}
                label={t('stat3Label')}
              />
              <StatItem
                icon={<Users className="h-5 w-5" />}
                value={30}
                suffix="%"
                label={t('stat4Label')}
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ───── FEATURES (3 Pillars) ───── */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
                {t('featuresBadge')}
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t('featuresHeading')}
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                {t('featuresSubheading')}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-8 md:grid-cols-3 lg:mt-20">
            <AnimateOnScroll animation="fade-up" delay={0}>
              <FeatureCard
                image="/images/sorted-materials.png"
                imageAlt="Sorted recyclable materials warehouse"
                icon={<Recycle className="h-5 w-5" />}
                title={t('feature1Title')}
                description={t('feature1Description')}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={150}>
              <FeatureCard
                image="/images/blockchain-tablet.png"
                imageAlt="Blockchain traceability on tablet"
                icon={<Shield className="h-5 w-5" />}
                title={t('feature2Title')}
                description={t('feature2Description')}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={300}>
              <FeatureCard
                image="/images/team-csr-reporting.png"
                imageAlt="Team working on CSR reporting"
                icon={<Bot className="h-5 w-5" />}
                title={t('feature3Title')}
                description={t('feature3Description')}
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('pricingHeading')}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              {t('pricingSubheading')}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              {/* Essentiel */}
              <div className="rounded-2xl border p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm font-semibold text-emerald-600">Essentiel</p>
                <p className="mt-2 text-3xl font-bold">149€<span className="text-muted-foreground text-base font-normal">/mois</span></p>
                <p className="text-muted-foreground mt-1 text-xs">ou 1 490€/an (-17%)</p>
                <ul className="mt-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Scope 1 &amp; 2</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Rapport GHG Protocol</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />50 lots traces/mois</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Dashboard ESG</li>
                </ul>
                <Link
                  href="/auth/sign-up"
                  className="mt-6 block rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  {t('pricingCta')}
                </Link>
              </div>

              {/* Avance */}
              <div className="border-primary rounded-2xl border-2 p-6 text-left shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-emerald-600">Avance</p>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Populaire</span>
                </div>
                <p className="mt-2 text-3xl font-bold">449€<span className="text-muted-foreground text-base font-normal">/mois</span></p>
                <p className="text-muted-foreground mt-1 text-xs">ou 4 490€/an (-17%)</p>
                <ul className="mt-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Scope 1, 2 &amp; 3</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />CSRD / GRI / GHG</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Lots illimites</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />IA + Benchmarking</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />API access</li>
                </ul>
                <Link
                  href="/auth/sign-up"
                  className="bg-primary text-primary-foreground mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors hover:opacity-90"
                >
                  {t('pricingCta')}
                </Link>
              </div>

              {/* Enterprise */}
              <div className="rounded-2xl border p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm font-semibold text-gray-600">Enterprise</p>
                <p className="mt-2 text-3xl font-bold">Sur devis</p>
                <p className="text-muted-foreground mt-1 text-xs">Multi-sites, ERP, SLA</p>
                <ul className="mt-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Integration ERP</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Multi-sites</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Credits carbone</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Account manager dedie</li>
                </ul>
                <Link
                  href="/contact"
                  className="mt-6 block rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={400}>
            <p className="text-muted-foreground mt-8 text-sm">
              {t('pricingNote')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ───── NEWSLETTER ───── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Image
          src="/images/normes/circular-infinity-aerial.png"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-primary-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              {t('newsletterHeading')}
            </h2>
            <p className="text-primary-foreground/80 mt-4 text-lg">
              {t('newsletterSubheading')}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="mt-10 flex justify-center">
              <NewsletterForm />
            </div>
            <p className="text-primary-foreground/50 mt-4 text-xs">
              {t('newsletterDisclaimer')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  image,
  imageAlt,
  icon,
  title,
  description,
}: {
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-card h-full overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          width={800}
          height={500}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-8">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
          {icon}
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function StatItem({
  icon,
  value,
  suffix,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="bg-primary/10 text-primary mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="text-3xl font-bold tracking-tight">
        <AnimatedCounter target={value} />
        {suffix}
      </div>
      <p className="text-muted-foreground mt-1 text-sm">{label}</p>
    </div>
  );
}

function StepList({
  steps,
  t,
}: {
  steps: string[];
  t: (key: string) => string;
}) {
  return (
    <ul className="mt-8 space-y-4">
      {steps.map((key) => (
        <li key={key} className="flex items-start gap-3">
          <span className="bg-primary text-primary-foreground mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span className="text-muted-foreground">{t(key)}</span>
        </li>
      ))}
    </ul>
  );
}
