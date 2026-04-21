import Link from 'next/link';

import { ShieldCheck, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  EnviroButton,
  EnviroPageHero,
  EnviroSectionHeader,
  EnviroStats,
} from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';
import {
  StaggerContainer,
  StaggerItem,
} from '~/components/enviro/animations/stagger-container';

import { NormsTabbedContent } from './_components/norms-tabbed-content';

const FRAMEWORK_KEYS = [
  'iso14001',
  'iso26000',
  'iso59014',
  'ghg',
  'gri',
  'csrd',
  'tcfd',
  'bcorp',
  'greentech',
  'nr',
  'lucie',
  'ademe',
  'eurostat',
  'agec',
  'ecovadis',
] as const;

export async function generateMetadata() {
  const t = await getTranslations('normes');

  return {
    title: `${t('title')} | GreenEcoGenius`,
    description: t('subDesc'),
  };
}

export default async function NormesPage() {
  const t = await getTranslations('normes');

  const stats = [
    {
      value: parseFloat(t('stat1Value')),
      label: t('stat1Label'),
      source: t('stat1Source'),
    },
    {
      value: parseFloat(t('stat2Value')),
      label: t('stat2Label'),
      source: t('stat2Source'),
    },
    {
      value: parseFloat(t('stat3Value')),
      suffix: t('stat3Suffix'),
      label: t('stat3Label'),
      source: t('stat3Source'),
    },
    {
      value: parseFloat(t('stat4Value')),
      suffix: t('stat4Suffix'),
      label: t('stat4Label'),
      source: t('stat4Source'),
    },
  ];

  return (
    <div className="flex flex-col bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]">
      {/* Hero */}
      <EnviroPageHero
        tag={t('heroTag')}
        title={t('title')}
        subtitle={t('subDesc')}
        tone="cream"
        align="center"
      />

      {/* Stats */}
      <section className="bg-[--color-enviro-cream-50] py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('statsTag')}
              title={t('desc')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mt-12">
            <EnviroStats stats={stats} tone="cream" />
          </div>

          <FadeInSection delay={0.2}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <Link href="/home">
                <EnviroButton variant="primary" size="md">
                  {t('ctaDiscover')}
                </EnviroButton>
              </Link>
              <Link href="/pricing">
                <EnviroButton variant="secondary" size="md">
                  {t('ctaPricing')}
                </EnviroButton>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Filters / pillar tabs section header */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('filtersTag')}
              title={t('filtersTitle')}
              subtitle={t('filtersSub')}
              tone="cream"
              align="center"
            />
          </FadeInSection>
        </div>
      </section>

      {/* Tabbed pillars (data + interaction preserved) */}
      <NormsTabbedContent />

      {/* Frameworks strip */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('frameworksTag')}
              title={t('frameworksTitle')}
              subtitle={t('frameworksSub')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <StaggerContainer
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
            stagger={0.04}
          >
            {FRAMEWORK_KEYS.map((key) => (
              <StaggerItem key={key}>
                <span className="inline-flex items-center rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] bg-white px-4 py-2 text-sm font-medium text-[--color-enviro-forest-900] shadow-[--shadow-enviro-sm] font-[family-name:var(--font-enviro-mono)]">
                  {t(`framework_${key}`)}
                </span>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Audit CTA */}
      <section className="bg-[--color-enviro-forest-900] py-20 lg:py-28 text-[--color-enviro-fg-inverse]">
        <div className="mx-auto w-full max-w-[--container-enviro-md] px-4 text-center lg:px-8">
          <FadeInSection>
            <span className="inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[</span>
              <span className="px-1">{t('auditTag')}</span>
              <span aria-hidden="true">]</span>
            </span>
            <h2 className="mt-4 text-balance text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-enviro-display)]">
              {t('auditTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base md:text-lg leading-relaxed text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
              {t('auditSub')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact">
                <EnviroButton variant="primary" size="lg" magnetic>
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                  {t('auditCta')}
                </EnviroButton>
              </Link>
              <Link href="/solutions">
                <EnviroButton variant="outlineCream" size="lg">
                  <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                  {t('auditSecondary')}
                </EnviroButton>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
