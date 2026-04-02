import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Bot,
  Factory,
  Globe,
  Recycle,
  Shield,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from './_components/animate-on-scroll';
import { AnimatedCounter } from './_components/animated-counter';
import { HeroScrollEffect } from './_components/hero-scroll-effect';
import { HeroVisual } from './_components/hero-visual';
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
    <div className="-mt-16 flex flex-col overflow-x-hidden md:-mt-36">
      {/* ───── HERO ───── */}
      <HeroScrollEffect>
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
          {/* Background image */}
          <Image
            src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-e4ead825-db44-49ce-97a4-7c6463762133.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Dark overlay for text readability */}
          <div className="from-metal-900/60 via-metal-900/40 to-metal-900/70 absolute inset-0 bg-gradient-to-b" />

          {/* Orbital visualization */}
          <HeroVisual />

          {/* Single CTA button centered in the orbit */}
          <div className="relative z-10">
            <AnimateOnScroll animation="fade-up" delay={300}>
              <Link
                href="/auth/sign-up"
                className="group text-metal-900 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-semibold shadow-lg transition-all hover:shadow-xl hover:shadow-white/15 sm:px-8 sm:py-4 sm:text-sm"
              >
                {t('heroCta1')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </AnimateOnScroll>
          </div>

          <div className="from-metal-50 absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t to-transparent" />
        </section>
      </HeroScrollEffect>

      {/* ───── STATS ───── */}
      <section className="relative z-10 -mt-16 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="border-metal-chrome grid grid-cols-2 gap-6 rounded-2xl border bg-white p-8 shadow-xl md:grid-cols-4 md:gap-8">
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

      {/* ───── NEWSLETTER ───── */}
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
              {t('newsletterHeading')}
            </h2>
            <p className="text-metal-silver mt-4 text-lg">
              {t('newsletterSubheading')}
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
        <div className="bg-circuit-ice/30 text-circuit-blue flex h-10 w-10 items-center justify-center rounded-xl">
          {icon}
        </div>
        <h3 className="text-metal-900 mt-4 text-lg font-semibold">{title}</h3>
        <p className="text-metal-600 mt-2 text-sm leading-relaxed">
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
      <div className="bg-circuit-ice/30 text-circuit-blue mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="text-primary text-3xl font-bold tracking-tight">
        <AnimatedCounter target={value} />
        {suffix}
      </div>
      <p className="text-metal-500 mt-1 text-sm">{label}</p>
    </div>
  );
}
