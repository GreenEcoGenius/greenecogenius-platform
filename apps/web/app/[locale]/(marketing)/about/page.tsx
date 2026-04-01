import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  Globe2,
  Leaf,
  Lightbulb,
  Recycle,
  Target,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import appConfig from '~/config/app.config';

import { AnimateOnScroll } from '../_components/animate-on-scroll';

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
          src="/images/normes/reporting-esg-presentation.png"
          alt=""
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40" />

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
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              {t('aboutPageSubtitle')}
            </p>
          </AnimateOnScroll>
        </div>

        <div className="from-background absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t to-transparent" />
      </section>

      {/* ───── MISSION ───── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <AnimateOnScroll animation="fade-right">
              <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aboutMissionHeading')}
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                {t('aboutMissionText')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left">
              <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aboutVisionHeading')}
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                {t('aboutVisionText')}
              </p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── CLIMATE ───── */}
      <section className="bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateOnScroll animation="fade-right">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/hero-recycling-facility.png"
                  alt={t('altRecyclingFacility')}
                  width={1024}
                  height={585}
                  className="h-full w-full object-cover"
                />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left">
              <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
                <Globe2 className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aboutClimateHeading')}
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
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
              <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
                <Recycle className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aboutGreentechHeading')}
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                {t('aboutGreentechText')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll
              animation="fade-left"
              className="order-1 lg:order-2"
            >
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/sorted-materials.png"
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
      <section className="bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <AnimateOnScroll animation="fade-up">
              <div className="bg-card rounded-2xl border p-8 sm:p-10">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-bold tracking-tight">
                  {t('aboutCsrHeading')}
                </h3>
                <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                  {t('aboutCsrText')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={150}>
              <div className="bg-card rounded-2xl border p-8 sm:p-10">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-bold tracking-tight">
                  {t('aboutCarbonHeading')}
                </h3>
                <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                  {t('aboutCarbonText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="bg-primary py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-primary-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              {t('ctaHeading')}
            </h2>
            <p className="text-primary-foreground/80 mt-4 text-lg">
              {t('ctaSubheading')}
            </p>
            <Link
              href="/auth/sign-up"
              className="group text-primary mt-10 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold transition-all hover:bg-white/90 hover:shadow-xl"
            >
              {t('joinPlatform')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
