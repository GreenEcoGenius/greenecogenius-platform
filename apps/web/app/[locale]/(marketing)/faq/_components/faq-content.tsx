'use client';

import { useCallback, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

import { EnviroFaq } from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';

const THEMES = ['all', 'general', 'product', 'billing', 'technical', 'rgpd'] as const;

type Theme = (typeof THEMES)[number];

const QUESTION_THEMES = [
  'general',
  'product',
  'billing',
  'technical',
  'rgpd',
] as const;
type QuestionTheme = (typeof QUESTION_THEMES)[number];

const QUESTIONS_PER_THEME: Record<QuestionTheme, string[]> = {
  general: ['q1', 'q2', 'q3', 'q4'],
  product: ['q1', 'q2', 'q3', 'q4'],
  billing: ['q1', 'q2', 'q3', 'q4'],
  technical: ['q1', 'q2', 'q3', 'q4'],
  rgpd: ['q1', 'q2', 'q3', 'q4'],
};

const THEME_LABEL_KEYS: Record<Theme, string> = {
  all: 'themeAll',
  general: 'themeGeneral',
  product: 'themeProduct',
  billing: 'themeBilling',
  technical: 'themeTechnical',
  rgpd: 'themeRgpd',
};

const THEME_DESCRIPTION_KEYS: Record<Theme, string> = {
  all: 'themeAllDescription',
  general: 'themeGeneralDescription',
  product: 'themeProductDescription',
  billing: 'themeBillingDescription',
  technical: 'themeTechnicalDescription',
  rgpd: 'themeRgpdDescription',
};

export function FaqContent() {
  const t = useTranslations('faq');
  const [active, setActive] = useState<Theme>('all');

  // Deep-link via URL hash on mount: #general, #product, #billing,
  // #technical, #rgpd. Only affects the very first render after
  // hydration so the SSR markup stays deterministic.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as Theme;
    if (hash && (THEMES as readonly string[]).includes(hash)) {
      setActive(hash);
    }
  }, []);

  const handleThemeChange = useCallback((theme: Theme) => {
    setActive(theme);
    if (theme === 'all') {
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      window.history.replaceState(null, '', `#${theme}`);
    }
  }, []);

  const visibleThemes: QuestionTheme[] =
    active === 'all' ? [...QUESTION_THEMES] : [active as QuestionTheme];

  return (
    <>
      <div
        className="mt-10 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
      >
        {THEMES.map((theme) => {
          const isActive = active === theme;

          return (
            <button
              key={theme}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleThemeChange(theme)}
              className={cn(
                'inline-flex items-center gap-2 rounded-[--radius-enviro-pill] border px-4 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] font-[family-name:var(--font-enviro-sans)]',
                isActive
                  ? 'border-[--color-enviro-forest-900] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300] shadow-[--shadow-enviro-md]'
                  : 'border-[--color-enviro-cream-300] bg-white text-[--color-enviro-forest-700] hover:border-[--color-enviro-forest-700] hover:bg-[--color-enviro-cream-100]',
              )}
            >
              {t(THEME_LABEL_KEYS[theme])}
            </button>
          );
        })}
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
        {t(THEME_DESCRIPTION_KEYS[active])}
      </p>

      <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-12">
        {visibleThemes.map((theme) => (
          <FadeInSection key={theme}>
            <section id={theme}>
              <h2 className="mb-6 text-2xl font-semibold leading-tight tracking-tight text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
                <span className="mr-3 text-xs uppercase tracking-[0.08em] text-[--color-enviro-cta] font-[family-name:var(--font-enviro-mono)]">
                  <span aria-hidden="true">[ </span>
                  {t(THEME_LABEL_KEYS[theme])}
                  <span aria-hidden="true"> ]</span>
                </span>
              </h2>

              <EnviroFaq
                tone="cream"
                items={QUESTIONS_PER_THEME[theme].map((qKey) => ({
                  value: `${theme}-${qKey}`,
                  question: t(`${theme}.${qKey}.question`),
                  answer: t(`${theme}.${qKey}.answer`),
                }))}
              />
            </section>
          </FadeInSection>
        ))}
      </div>
    </>
  );
}
