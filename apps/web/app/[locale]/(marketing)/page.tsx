import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRightIcon,
  BarChart3,
  Bot,
  ChevronRight,
  Factory,
  Globe,
  Leaf,
  Recycle,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Trans } from '@kit/ui/trans';

import { AnimateOnScroll } from './_components/animate-on-scroll';
import { AnimatedCounter } from './_components/animated-counter';

async function Home() {
  const t = await getTranslations('marketing');

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateOnScroll animation="fade-right">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Leaf className="h-4 w-4" />
                {t('heroPill')}
              </p>

              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-foreground">Le Comptoir Circulaire</span>
                <br />
                <span className="relative text-primary">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 418 42"
                    className="absolute top-2/3 left-0 h-[0.58em] w-full fill-primary/30"
                    preserveAspectRatio="none"
                  >
                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                  </svg>
                  <span className="relative">{t('heroHighlight')}</span>
                </span>
              </h1>

              <p className="text-muted-foreground mt-8 max-w-lg text-lg tracking-tight">
                {t('heroSubtitle')}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-x-6">
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                >
                  {t('joinPlatform')}
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="#features"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground ring-1 ring-border transition-all hover:ring-primary/50 hover:shadow-md"
                >
                  {t('explore')}
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left" delay={200}>
              <Image
                src="/images/hero-circular-economy.png"
                alt="Circular Economy"
                width={1024}
                height={585}
                className="w-full rounded-2xl"
                priority
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
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

      {/* Dashboard Preview */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                {t('featuresBadge')}
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t('dashboardHeading')}
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                {t('dashboardSubheading')}
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="mt-16">
              <Image
                src="/images/dashboard-mockup.png"
                alt="GreenEcoGenius Dashboard"
                width={1920}
                height={1080}
                className="w-full rounded-2xl border shadow-2xl shadow-primary/10"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Primary Features — 3 Pillars */}
      <section
        id="features"
        className="relative overflow-hidden bg-primary py-20 sm:py-32"
      >
        <Image
          className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%] opacity-20"
          src="/images/background-features.jpg"
          alt=""
          width={2245}
          height={1636}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl text-center md:max-w-none">
              <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
                {t('featuresHeading')}
              </h2>
              <p className="mt-6 text-lg tracking-tight text-primary-foreground/80">
                {t('featuresSubheading')}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 lg:mt-20">
            <AnimateOnScroll animation="fade-up" delay={0}>
              <FeaturePillar
                icon={<Recycle className="h-6 w-6" />}
                title={t('feature1Title')}
                description={t('feature1Description')}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={150}>
              <FeaturePillar
                icon={<Shield className="h-6 w-6" />}
                title={t('feature2Title')}
                description={t('feature2Description')}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={300}>
              <FeaturePillar
                icon={<Bot className="h-6 w-6" />}
                title={t('feature3Title')}
                description={t('feature3Description')}
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Blockchain Visual */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateOnScroll animation="fade-right">
              <Image
                src="/images/blockchain-traceability.png"
                alt="Blockchain Traceability"
                width={1024}
                height={585}
                className="w-full"
              />
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                {t('blockchainBadge')}
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t('blockchainHeading')}
              </h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                {t('blockchainDescription')}
              </p>
              <ul className="mt-8 space-y-4">
                {['blockchainStep1', 'blockchainStep2', 'blockchainStep3', 'blockchainStep4'].map(
                  (key) => (
                    <li key={key} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
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
                  ),
                )}
              </ul>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Secondary Features */}
      <section className="bg-secondary/30 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t('secondaryHeading')}
              </h2>
              <p className="text-muted-foreground mt-4 text-lg tracking-tight">
                {t('secondarySubheading')}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Sparkles className="h-5 w-5" />, title: t('feature4Title'), desc: t('feature4Description') },
              { icon: <TrendingUp className="h-5 w-5" />, title: t('feature5Title'), desc: t('feature5Description') },
              { icon: <BarChart3 className="h-5 w-5" />, title: t('feature6Title'), desc: t('feature6Description') },
            ].map((feat, i) => (
              <AnimateOnScroll key={feat.title} animation="fade-up" delay={i * 150}>
                <div className="h-full rounded-2xl border bg-card p-8 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feat.icon}
                  </div>
                  <h3 className="mt-6 text-sm font-semibold text-foreground">
                    {feat.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {feat.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary py-32">
        <Image
          className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-20"
          src="/images/background-call-to-action.jpg"
          alt=""
          width={2347}
          height={1244}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-lg text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                {t('ctaHeading')}
              </h2>
              <p className="mt-4 text-lg tracking-tight text-primary-foreground/80">
                {t('ctaSubheading')}
              </p>
              <Link
                href="/auth/sign-up"
                className="mt-10 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
              >
                {t('joinPlatform')}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <Image
          className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4 opacity-10"
          src="/images/background-faqs.jpg"
          alt=""
          width={1558}
          height={946}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                <Trans i18nKey="marketing.faq" />
              </h2>
              <p className="text-muted-foreground mt-4 text-lg tracking-tight">
                <Trans i18nKey="marketing.contactFaq" />
              </p>
            </div>
          </AnimateOnScroll>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {[
              [['faq1Question', 'faq1Answer'], ['faq2Question', 'faq2Answer'], ['faq3Question', 'faq3Answer']],
              [['faq4Question', 'faq4Answer'], ['faq5Question', 'faq5Answer'], ['faq6Question', 'faq6Answer']],
              [['faq7Question', 'faq7Answer'], ['faq8Question', 'faq8Answer'], ['faq9Question', 'faq9Answer']],
            ].map((col, ci) => (
              <AnimateOnScroll key={ci} animation="fade-up" delay={ci * 150}>
                <ul role="list" className="flex flex-col gap-y-8">
                  {col.map(([q, a]) => (
                    <li key={q}>
                      <h3 className="text-lg font-semibold leading-7">{t(q!)}</h3>
                      <p className="text-muted-foreground mt-4 text-sm">{t(a!)}</p>
                    </li>
                  ))}
                </ul>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

function FeaturePillar({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-8 ring-1 ring-white/10 ring-inset backdrop-blur-sm transition-all hover:bg-white/15 hover:-translate-y-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-primary-foreground">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-primary-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm text-primary-foreground/70">{description}</p>
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
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="text-3xl font-bold tracking-tight text-foreground">
        <AnimatedCounter target={value} />
        {suffix}
      </div>
      <p className="text-muted-foreground mt-1 text-sm">{label}</p>
    </div>
  );
}
