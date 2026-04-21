import Link from 'next/link';

import { Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  EnviroButton,
  EnviroPageHero,
  EnviroSectionHeader,
} from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';

import { FaqContent } from './_components/faq-content';

const QUESTION_THEMES = [
  'general',
  'product',
  'billing',
  'technical',
  'rgpd',
] as const;

const QUESTIONS_PER_THEME: Record<string, string[]> = {
  general: ['q1', 'q2', 'q3', 'q4'],
  product: ['q1', 'q2', 'q3', 'q4'],
  billing: ['q1', 'q2', 'q3', 'q4'],
  technical: ['q1', 'q2', 'q3', 'q4'],
  rgpd: ['q1', 'q2', 'q3', 'q4'],
};

export const generateMetadata = async () => {
  const t = await getTranslations('faq');

  return {
    title: `${t('metaTitle')} | GreenEcoGenius`,
    description: t('metaDescription'),
  };
};

export default async function FAQPage() {
  const t = await getTranslations('faq');

  // Build a flat schema.org FAQPage entity for SEO so search engines see
  // every question regardless of which client-side filter is active.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: QUESTION_THEMES.flatMap((theme) =>
      QUESTIONS_PER_THEME[theme]!.map((q) => ({
        '@type': 'Question',
        name: t(`${theme}.${q}.question`),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t(`${theme}.${q}.answer`),
        },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex flex-col bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]">
        <EnviroPageHero
          tag={t('heroTag')}
          title={t('heroTitle')}
          subtitle={t('heroSubtitle')}
          tone="cream"
          align="center"
        />

        <section className="bg-[--color-enviro-cream-50] py-16 lg:py-24">
          <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
            <FadeInSection>
              <EnviroSectionHeader
                tag={t('filtersTag')}
                title={t('filtersTitle')}
                tone="cream"
                align="center"
              />
            </FadeInSection>

            <FaqContent />
          </div>
        </section>

        <section className="bg-[--color-enviro-forest-900] py-20 lg:py-28 text-[--color-enviro-fg-inverse]">
          <div className="mx-auto w-full max-w-[--container-enviro-md] px-4 text-center lg:px-8">
            <FadeInSection>
              <span className="inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
                <span aria-hidden="true">[</span>
                <span className="px-1">{t('ctaTag')}</span>
                <span aria-hidden="true">]</span>
              </span>
              <h2 className="mt-4 text-balance text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-enviro-display)]">
                {t('ctaTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base md:text-lg leading-relaxed text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
                {t('ctaSubtitle')}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/contact">
                  <EnviroButton variant="primary" size="lg" magnetic>
                    <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                    {t('ctaLabel')}
                  </EnviroButton>
                </Link>
                <Link href="/solutions">
                  <EnviroButton variant="outlineCream" size="lg">
                    {t('ctaSecondary')}
                  </EnviroButton>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </section>
      </div>
    </>
  );
}
