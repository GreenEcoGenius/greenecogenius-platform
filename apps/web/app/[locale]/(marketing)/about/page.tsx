import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  Eye,
  Globe2,
  Leaf,
  Lightbulb,
  Link as LinkIcon,
  Lock,
  Recycle,
  Shield,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import appConfig from '~/config/app.config';

import { AnimateOnScroll } from '../_components/animate-on-scroll';
import { ParallaxBackground } from '../_components/parallax-background';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: t('aboutPageTitle'),
    description: t('aboutPageSubtitle'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('marketing');

  return (
    <div className="flex flex-col">
      {/* ───── HERO ───── */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/normes/reporting-esg-presentation.webp"
          alt=""
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="from-metal-900/80 via-metal-900/60 to-metal-900/40 absolute inset-0 bg-gradient-to-t" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-32 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Leaf className="h-4 w-4" />
              {appConfig.name}
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('aboutPageTitle')}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <p className="text-metal-silver mx-auto mt-6 max-w-2xl text-lg">
              {t('aboutPageSubtitle')}
            </p>
          </AnimateOnScroll>
        </div>

        <div className="from-metal-50 absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t to-transparent" />
      </section>

      {/* ───── MISSION ───── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <AnimateOnScroll animation="fade-right">
              <div className="bg-primary-light text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-metal-900 mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aboutMissionHeading')}
              </h2>
              <p className="text-metal-600 mt-6 text-lg leading-relaxed">
                {t('aboutMissionText')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left">
              <div className="bg-circuit-ice text-circuit-blue flex h-16 w-16 items-center justify-center rounded-2xl">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h2 className="text-metal-900 mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aboutVisionHeading')}
              </h2>
              <p className="text-metal-600 mt-6 text-lg leading-relaxed">
                {t('aboutVisionText')}
              </p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── CLIMATE ───── */}
      <section className="bg-metal-frost py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateOnScroll animation="fade-right">
              <div className="overflow-hidden rounded-xl shadow-sm">
                <Image
                  src="/images/hero-recycling-facility.webp"
                  alt={t('altRecyclingFacility')}
                  width={1024}
                  height={585}
                  className="h-full w-full object-cover"
                />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left">
              <div className="bg-tech-mint text-tech-emerald flex h-16 w-16 items-center justify-center rounded-2xl">
                <Globe2 className="h-8 w-8" />
              </div>
              <h2 className="text-metal-900 mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aboutClimateHeading')}
              </h2>
              <p className="text-metal-600 mt-6 text-lg leading-relaxed">
                {t('aboutClimateText')}
              </p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── GREENTECH ───── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateOnScroll
              animation="fade-right"
              className="order-2 lg:order-1"
            >
              <div className="bg-primary-light text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
                <Recycle className="h-8 w-8" />
              </div>
              <h2 className="text-metal-900 mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aboutGreentechHeading')}
              </h2>
              <p className="text-metal-600 mt-6 text-lg leading-relaxed">
                {t('aboutGreentechText')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll
              animation="fade-left"
              className="order-1 lg:order-2"
            >
              <div className="overflow-hidden rounded-xl shadow-sm">
                <Image
                  src="/images/greentech-energy.webp"
                  alt={t('altSortedMaterials')}
                  width={1024}
                  height={585}
                  className="h-full w-full object-cover"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── CSR & CARBON ───── */}
      <section className="bg-metal-frost py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <AnimateOnScroll animation="fade-up">
              <div className="border-metal-chrome rounded-2xl border bg-card p-8 sm:p-10">
                <div className="bg-primary-light text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-metal-900 mt-6 text-2xl font-bold tracking-tight">
                  {t('aboutCsrHeading')}
                </h3>
                <p className="text-metal-600 mt-4 text-lg leading-relaxed">
                  {t('aboutCsrText')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={150}>
              <div className="border-metal-chrome rounded-2xl border bg-card p-8 sm:p-10">
                <div className="bg-tech-mint text-tech-emerald flex h-12 w-12 items-center justify-center rounded-xl">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="text-metal-900 mt-6 text-2xl font-bold tracking-tight">
                  {t('aboutCarbonHeading')}
                </h3>
                <p className="text-metal-600 mt-4 text-lg leading-relaxed">
                  {t('aboutCarbonText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── STRUCTURE ───── */}
      <section className="bg-metal-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <Globe2 className="text-primary mx-auto h-10 w-10" />
              <h2 className="text-metal-900 mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aboutStructureHeading')}
              </h2>
              <p className="text-metal-600 mt-4 text-lg">
                {t('aboutStructureP1')}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
            <AnimateOnScroll animation="fade-right">
              <div className="rounded-2xl border bg-card p-8">
                <h3 className="text-metal-900 text-xl font-bold">
                  GreenEcoGenius OÜ
                </h3>
                <p className="text-primary mt-1 text-sm font-semibold">
                  Tallinn, Estonia
                </p>
                <p className="text-metal-600 mt-4 leading-relaxed">
                  {t('aboutStructureEU')}
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-left">
              <div className="rounded-2xl border bg-card p-8">
                <h3 className="text-metal-900 text-xl font-bold">
                  GreenEcoGenius, Inc.
                </h3>
                <p className="text-primary mt-1 text-sm font-semibold">
                  Delaware, USA
                </p>
                <p className="text-metal-600 mt-4 leading-relaxed">
                  {t('aboutStructureUS')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <p className="text-metal-500 mx-auto mt-8 max-w-2xl text-center">
              {t('aboutStructureFounder')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ───── SECURITY & DATA PROTECTION ───── */}
      <section className="bg-[#E8F5EE] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <div className="bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                <ShieldCheck className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h2 className="text-metal-900 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aboutSecurityHeading')}
              </h2>
              <p className="text-metal-600 mt-4 text-base sm:text-lg">
                {t('aboutSecuritySubheading')}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: t('aboutSecurityHostingTitle'),
                text: t('aboutSecurityHostingText'),
              },
              {
                icon: ShieldCheck,
                title: t('aboutSecurityCertifiedTitle'),
                text: t('aboutSecurityCertifiedText'),
              },
              {
                icon: LinkIcon,
                title: t('aboutSecurityBlockchainTitle'),
                text: t('aboutSecurityBlockchainText'),
              },
              {
                icon: Lock,
                title: t('aboutSecurityEncryptionTitle'),
                text: t('aboutSecurityEncryptionText'),
              },
              {
                icon: Eye,
                title: t('aboutSecurityAccessTitle'),
                text: t('aboutSecurityAccessText'),
              },
            ].map(({ icon: Icon, title, text }) => (
              <AnimateOnScroll key={title} animation="fade-up">
                <div className="h-full rounded-2xl border border-[#C5DDD0] bg-card p-6 transition-shadow duration-200 hover:shadow-md">
                  <div className="bg-primary/10 text-primary mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-metal-900 text-base font-semibold">
                    {title}
                  </h3>
                  <p className="text-metal-600 mt-2 text-sm leading-relaxed">
                    {text}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <ParallaxBackground
        imageUrl="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/GPT%20Images%202.0/ChatGPT%20Image%2024%20avr.%202026,%2001_45_35.png"
        className="py-20 sm:py-28"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('ctaHeading')}
            </h2>
            <p className="text-metal-silver mt-4 text-lg">
              {t('ctaSubheading')}
            </p>
            <Link
              href="/auth/sign-up"
              className="group bg-primary hover:bg-primary-hover mt-10 inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl"
            >
              {t('joinPlatform')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </AnimateOnScroll>
        </div>
      </ParallaxBackground>
    </div>
  );
}
