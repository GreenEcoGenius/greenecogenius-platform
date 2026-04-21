import Image from 'next/image';
import Link from 'next/link';

import {
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
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  EnviroButton,
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
  EnviroPageHero,
  EnviroSectionHeader,
  EnviroTimeline,
} from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: t('aboutPageTitle'),
    description: t('aboutPageSubtitle'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('marketing');

  const history = [
    {
      year: '2024',
      title: t('aboutHistory2024Title'),
      description: t('aboutHistory2024Description'),
    },
    {
      year: '2025',
      title: t('aboutHistory2025Title'),
      description: t('aboutHistory2025Description'),
    },
    {
      year: '2026',
      title: t('aboutHistory2026Title'),
      description: t('aboutHistory2026Description'),
    },
  ];

  const values = [
    {
      icon: Recycle,
      title: t('aboutValue1Title'),
      description: t('aboutValue1Description'),
    },
    {
      icon: Shield,
      title: t('aboutValue2Title'),
      description: t('aboutValue2Description'),
    },
    {
      icon: BarChart3,
      title: t('aboutValue3Title'),
      description: t('aboutValue3Description'),
    },
  ];

  const securityItems = [
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
  ];

  return (
    <div className="flex flex-col bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]">
      {/* ────────────────────── HERO ────────────────────── */}
      <EnviroPageHero
        tag={t('aboutTag')}
        title={t('aboutPageTitle')}
        subtitle={t('aboutPageSubtitle')}
        backgroundImage="/images/normes/reporting-esg-presentation.png"
        backgroundImageAlt={t('aboutPageTitle')}
        tone="forest"
        align="center"
      />

      {/* ────────────────── MISSION + VISION ────────────────── */}
      <section className="bg-[--color-enviro-cream-50] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('aboutMissionTag')}
              title={t('aboutMissionHeading')}
              tone="cream"
            />
          </FadeInSection>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <FadeInSection delay={0}>
              <EnviroCard variant="cream" radius="lg" hover="lift" padding="lg" className="h-full">
                <EnviroCardHeader>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
                    <Target className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <EnviroCardTitle>{t('aboutMissionHeading')}</EnviroCardTitle>
                </EnviroCardHeader>
                <EnviroCardBody className="text-base leading-relaxed text-[--color-enviro-forest-700]">
                  {t('aboutMissionText')}
                </EnviroCardBody>
              </EnviroCard>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <EnviroCard variant="dark" radius="lg" hover="glow" padding="lg" className="h-full">
                <EnviroCardHeader>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900]">
                    <Lightbulb className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <EnviroCardTitle className="text-[--color-enviro-fg-inverse]">
                    {t('aboutVisionHeading')}
                  </EnviroCardTitle>
                </EnviroCardHeader>
                <EnviroCardBody className="text-base leading-relaxed text-[--color-enviro-fg-inverse-muted]">
                  {t('aboutVisionText')}
                </EnviroCardBody>
              </EnviroCard>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ────────────────── HISTORY TIMELINE ────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('aboutHistoryTag')}
              title={t('aboutHistoryTitle')}
              subtitle={t('aboutHistorySub')}
              tone="cream"
            />
          </FadeInSection>
          <div className="mt-12">
            <EnviroTimeline items={history} tone="cream" />
          </div>
        </div>
      </section>

      {/* ────────────────── VALUES ────────────────── */}
      <section className="bg-[--color-enviro-cream-50] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('aboutValuesTag')}
              title={t('aboutValuesTitle')}
              subtitle={t('aboutValuesSub')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value, idx) => {
              const Icon = value.icon;

              return (
                <FadeInSection key={idx} delay={idx * 0.08}>
                  <EnviroCard
                    variant="cream"
                    radius="lg"
                    hover="lift"
                    padding="lg"
                    className="h-full"
                  >
                    <EnviroCardHeader>
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900]">
                        <Icon className="h-6 w-6" strokeWidth={1.5} />
                      </span>
                      <EnviroCardTitle>{value.title}</EnviroCardTitle>
                    </EnviroCardHeader>
                    <EnviroCardBody className="text-sm leading-relaxed text-[--color-enviro-forest-700]">
                      {value.description}
                    </EnviroCardBody>
                  </EnviroCard>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────────────── CLIMATE (image + text) ────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <FadeInSection>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[--radius-enviro-3xl] shadow-[--shadow-enviro-card]">
                <Image
                  src="/images/hero-recycling-facility.png"
                  alt={t('altRecyclingFacility')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <div className="flex flex-col gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
                  <Globe2 className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-enviro-display)]">
                  {t('aboutClimateHeading')}
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
                  {t('aboutClimateText')}
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ────────────────── GREENTECH (text + image, alternating) ────────────────── */}
      <section className="bg-[--color-enviro-cream-50] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <FadeInSection delay={0.1}>
              <div className="order-2 flex flex-col gap-4 lg:order-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
                  <Recycle className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-enviro-display)]">
                  {t('aboutGreentechHeading')}
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
                  {t('aboutGreentechText')}
                </p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-[--radius-enviro-3xl] shadow-[--shadow-enviro-card] lg:order-2">
                <Image
                  src="/images/greentech-energy.png"
                  alt={t('altGreentechEnergy')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ────────────────── CSR + CARBON (2 cards) ────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('aboutSectionsTag')}
              title={t('aboutCsrHeading')}
              tone="cream"
            />
          </FadeInSection>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <FadeInSection delay={0}>
              <EnviroCard variant="cream" radius="lg" hover="lift" padding="lg" className="h-full">
                <EnviroCardHeader>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
                    <BarChart3 className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <EnviroCardTitle>{t('aboutCsrHeading')}</EnviroCardTitle>
                </EnviroCardHeader>
                <EnviroCardBody className="text-base leading-relaxed text-[--color-enviro-forest-700]">
                  {t('aboutCsrText')}
                </EnviroCardBody>
              </EnviroCard>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <EnviroCard variant="cream" radius="lg" hover="lift" padding="lg" className="h-full">
                <EnviroCardHeader>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900]">
                    <Leaf className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <EnviroCardTitle>{t('aboutCarbonHeading')}</EnviroCardTitle>
                </EnviroCardHeader>
                <EnviroCardBody className="text-base leading-relaxed text-[--color-enviro-forest-700]">
                  {t('aboutCarbonText')}
                </EnviroCardBody>
              </EnviroCard>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ────────────────── TEAM (founder) ────────────────── */}
      <section className="bg-[--color-enviro-cream-50] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('aboutTeamTag')}
              title={t('aboutTeamTitle')}
              subtitle={t('aboutTeamSub')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="mx-auto mt-12 max-w-3xl">
              <EnviroCard variant="cream" radius="lg" hover="lift" padding="lg">
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                  <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-[--radius-enviro-pill] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
                    <Users className="h-10 w-10" strokeWidth={1.5} />
                  </span>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
                      <span aria-hidden="true">[ </span>
                      {t('aboutFounderRole')}
                      <span aria-hidden="true"> ]</span>
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-enviro-display)]">
                      {t('aboutFounderName')}
                    </h3>
                    <p className="text-sm leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
                      {t('aboutFounderBio')}
                    </p>
                  </div>
                </div>
              </EnviroCard>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ────────────────── STRUCTURE (2 entities) ────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('aboutStructureTag')}
              title={t('aboutStructureHeading')}
              subtitle={t('aboutStructureP1')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            <FadeInSection delay={0}>
              <EnviroCard variant="cream" radius="lg" hover="lift" padding="lg" className="h-full">
                <EnviroCardHeader>
                  <EnviroCardTitle>GreenEcoGenius OÜ</EnviroCardTitle>
                  <p className="text-sm font-semibold text-[--color-enviro-cta] font-[family-name:var(--font-enviro-mono)]">
                    Tallinn, Estonia
                  </p>
                </EnviroCardHeader>
                <EnviroCardBody className="text-sm leading-relaxed text-[--color-enviro-forest-700]">
                  {t('aboutStructureEU')}
                </EnviroCardBody>
              </EnviroCard>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <EnviroCard variant="cream" radius="lg" hover="lift" padding="lg" className="h-full">
                <EnviroCardHeader>
                  <EnviroCardTitle>GreenEcoGenius, Inc.</EnviroCardTitle>
                  <p className="text-sm font-semibold text-[--color-enviro-cta] font-[family-name:var(--font-enviro-mono)]">
                    Delaware, USA
                  </p>
                </EnviroCardHeader>
                <EnviroCardBody className="text-sm leading-relaxed text-[--color-enviro-forest-700]">
                  {t('aboutStructureUS')}
                </EnviroCardBody>
              </EnviroCard>
            </FadeInSection>
          </div>

          <FadeInSection delay={0.2}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
              {t('aboutStructureFounder')}
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ────────────────── SECURITY ────────────────── */}
      <section className="bg-[--color-enviro-cream-50] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('aboutSecurityTag')}
              title={t('aboutSecurityHeading')}
              subtitle={t('aboutSecuritySubheading')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {securityItems.map((item, idx) => {
              const Icon = item.icon;

              return (
                <FadeInSection key={idx} delay={idx * 0.05}>
                  <EnviroCard
                    variant="cream"
                    radius="lg"
                    hover="lift"
                    padding="md"
                    className="h-full"
                  >
                    <EnviroCardHeader>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-[--radius-enviro-sm] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <EnviroCardTitle className="text-lg">
                        {item.title}
                      </EnviroCardTitle>
                    </EnviroCardHeader>
                    <EnviroCardBody className="text-sm leading-relaxed text-[--color-enviro-forest-700]">
                      {item.text}
                    </EnviroCardBody>
                  </EnviroCard>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────────────── CTA → CONTACT ────────────────── */}
      <section className="bg-[--color-enviro-forest-900] py-20 lg:py-28 text-[--color-enviro-fg-inverse]">
        <div className="mx-auto w-full max-w-[--container-enviro-md] px-4 text-center lg:px-8">
          <FadeInSection>
            <span className="inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[</span>
              <span className="px-1">{t('aboutCtaTag')}</span>
              <span aria-hidden="true">]</span>
            </span>
            <h2 className="mt-4 text-balance text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-enviro-display)]">
              {t('aboutCtaTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base md:text-lg leading-relaxed text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
              {t('aboutCtaSub')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact">
                <EnviroButton variant="primary" size="lg" magnetic>
                  <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                  {t('aboutCtaLabel')}
                </EnviroButton>
              </Link>
              <Link href="/auth/sign-up">
                <EnviroButton variant="outlineCream" size="lg">
                  {t('joinPlatform')}
                </EnviroButton>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
