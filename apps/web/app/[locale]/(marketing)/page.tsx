import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  Bot,
  ChevronRight,
  Factory,
  Globe,
  Leaf,
  Quote,
  Recycle,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from './_components/animate-on-scroll';
import { AnimatedCounter } from './_components/animated-counter';
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
    <div className="flex flex-col">
      {/* ───── HERO ───── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#065f46]">
        {/* Luminous gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] left-[10%] h-[50vw] w-[50vw] rounded-full bg-emerald-400/15 blur-[120px]" />
          <div className="absolute -right-[10%] top-[20%] h-[40vw] w-[40vw] rounded-full bg-teal-300/15 blur-[100px]" />
          <div className="absolute -bottom-[15%] left-[30%] h-[35vw] w-[35vw] rounded-full bg-cyan-400/10 blur-[80px]" />
        </div>

        {/* Orbital visualization */}
        <HeroVisual />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-32 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-white/5 px-5 py-2 text-sm font-medium text-emerald-200 backdrop-blur-md">
              <Leaf className="h-4 w-4" />
              {t('heroPill')}
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <h1 className="mt-6 bg-gradient-to-b from-white to-emerald-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-7xl">
              {t('heroHeadline')}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-100/80 sm:text-xl">
              {t('heroSubtitle')}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={300}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-emerald-900 transition-all hover:shadow-xl hover:shadow-white/15"
              >
                {t('heroCta1')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#features"
                className="group inline-flex items-center gap-2 rounded-full border border-emerald-300/30 px-8 py-4 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-emerald-300/60 hover:bg-white/5"
              >
                {t('heroCta2')}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>

        <div className="from-background absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t to-transparent" />
      </section>

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

      {/* ───── BLOCKCHAIN TRACEABILITY ───── */}
      <section className="bg-secondary/30 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <AnimateOnScroll animation="fade-right" className="lg:pt-12">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/blockchain-tablet.png"
                  alt="Blockchain Traceability"
                  width={1024}
                  height={585}
                  className="h-full w-full object-cover"
                />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left">
              <p className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold">
                <Shield className="h-4 w-4" />
                {t('blockchainBadge')}
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('blockchainHeading')}
              </h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                {t('blockchainDescription')}
              </p>
              <StepList
                steps={[
                  'blockchainStep1',
                  'blockchainStep2',
                  'blockchainStep3',
                  'blockchainStep4',
                ]}
                t={t}
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── CSR REPORTING ───── */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateOnScroll
              animation="fade-right"
              className="order-2 lg:order-1"
            >
              <p className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold">
                <BarChart3 className="h-4 w-4" />
                {t('csrBadge')}
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('csrHeading')}
              </h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                {t('csrDescription')}
              </p>
              <StepList
                steps={['csrStep1', 'csrStep2', 'csrStep3', 'csrStep4']}
                t={t}
              />
            </AnimateOnScroll>

            <AnimateOnScroll
              animation="fade-left"
              className="order-1 lg:order-2"
            >
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/team-csr-reporting.png"
                  alt="CSR Reporting Dashboard"
                  width={1024}
                  height={585}
                  className="h-full w-full object-cover"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───── SECONDARY FEATURES ───── */}
      <section className="bg-secondary/30 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('secondaryHeading')}
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                {t('secondarySubheading')}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                key: 'feature4',
                icon: <Sparkles className="h-5 w-5" />,
                title: t('feature4Title'),
                desc: t('feature4Description'),
              },
              {
                key: 'feature5',
                icon: <TrendingUp className="h-5 w-5" />,
                title: t('feature5Title'),
                desc: t('feature5Description'),
              },
              {
                key: 'feature6',
                icon: <BarChart3 className="h-5 w-5" />,
                title: t('feature6Title'),
                desc: t('feature6Description'),
              },
            ].map((feat, i) => (
              <AnimateOnScroll
                key={feat.key}
                animation="fade-up"
                delay={i * 150}
              >
                <div className="bg-card h-full rounded-2xl border p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    {feat.icon}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{feat.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TRUST / LOGOS ───── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
                {t('trustHeading')}
              </p>
              <h2 className="text-muted-foreground text-lg">
                {t('trustSubheading')}
              </h2>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll animation="fade-up" delay={200}>
          <LogoCarousel className="mt-12" />
        </AnimateOnScroll>
      </section>

      {/* ───── STUDY CASE ───── */}
      <section className="bg-secondary/30 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <p className="text-primary mb-4 text-center text-sm font-semibold tracking-wider uppercase">
              {t('studyCaseLabel')}
            </p>
            <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold tracking-tight sm:text-4xl">
              {t('studyCaseHeading')}
            </h2>
          </AnimateOnScroll>

          <div className="mt-16 grid items-center gap-12 lg:grid-cols-5">
            <AnimateOnScroll animation="fade-right" className="lg:col-span-3">
              <div className="bg-card rounded-2xl border p-8 shadow-lg sm:p-10">
                <Quote className="text-primary/30 mb-6 h-10 w-10" />
                <blockquote className="text-lg leading-relaxed italic">
                  &ldquo;{t('studyCaseQuote')}&rdquo;
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full font-bold">
                    HR
                  </div>
                  <div>
                    <p className="font-semibold">{t('studyCaseAuthor')}</p>
                    <p className="text-muted-foreground text-sm">
                      {t('studyCaseRole')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left" className="lg:col-span-2">
              <div className="space-y-6">
                <StudyCaseStat
                  value={45}
                  suffix="%"
                  label={t('studyCaseStat1Label')}
                />
                <StudyCaseStat
                  value={120}
                  suffix="k€"
                  label={t('studyCaseStat2Label')}
                />
                <StudyCaseStat value={6} label={t('studyCaseStat3Label')} />
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <p className="text-muted-foreground mx-auto mt-12 max-w-3xl text-center text-lg">
              {t('studyCaseDescription')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative overflow-hidden py-32">
        <Image
          src="/images/greentech-energy.png"
          alt=""
          fill
          className="object-cover"
        />
        <div className="bg-primary/85 absolute inset-0" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center">
              <h2 className="text-primary-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t('ctaHeading')}
              </h2>
              <p className="text-primary-foreground/80 mt-6 text-lg">
                {t('ctaSubheading')}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/auth/sign-up"
                  className="group text-primary inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold transition-all hover:bg-white/90 hover:shadow-xl"
                >
                  {t('joinPlatform')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/contact"
                  className="text-primary-foreground inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-medium transition-all hover:border-white/60 hover:bg-white/10"
                >
                  {t('contact')}
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ───── NEWSLETTER ───── */}
      <section className="bg-primary py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
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

      {/* ───── FAQ ───── */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('faq')}
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                {t('contactFaq')}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {(
              [
                [
                  ['faq1Question', 'faq1Answer'],
                  ['faq2Question', 'faq2Answer'],
                  ['faq3Question', 'faq3Answer'],
                ],
                [
                  ['faq4Question', 'faq4Answer'],
                  ['faq5Question', 'faq5Answer'],
                  ['faq6Question', 'faq6Answer'],
                ],
                [
                  ['faq7Question', 'faq7Answer'],
                  ['faq8Question', 'faq8Answer'],
                  ['faq9Question', 'faq9Answer'],
                ],
              ] as [string, string][][]
            ).map((col, ci) => (
              <AnimateOnScroll key={ci} animation="fade-up" delay={ci * 150}>
                <ul role="list" className="flex flex-col gap-y-8">
                  {col.map(([q, a]) => (
                    <li key={q}>
                      <h3 className="text-lg leading-7 font-semibold">
                        {t(q)}
                      </h3>
                      <p className="text-muted-foreground mt-4 text-sm">
                        {t(a)}
                      </p>
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

function StudyCaseStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="bg-card rounded-xl border p-6 text-center shadow-sm">
      <div className="text-primary text-3xl font-bold tracking-tight">
        <AnimatedCounter target={value} />
        {suffix}
      </div>
      <p className="text-muted-foreground mt-1 text-sm">{label}</p>
    </div>
  );
}
