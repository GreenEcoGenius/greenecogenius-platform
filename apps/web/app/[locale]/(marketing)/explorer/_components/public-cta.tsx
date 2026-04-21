import Link from 'next/link';

import { ArrowRight, Lock, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { EnviroButton } from '~/components/enviro/enviro-button';

export async function PublicCTA() {
  const t = await getTranslations('marketing');

  const features = [
    { icon: Lock, text: t('explorer.ctaFeature1') },
    { icon: Sparkles, text: t('explorer.ctaFeature2') },
    { icon: Shield, text: t('explorer.ctaFeature3') },
    { icon: TrendingUp, text: t('explorer.ctaFeature4') },
  ];

  return (
    <section className="rounded-[--radius-enviro-3xl] bg-[--color-enviro-forest-900] p-8 text-[--color-enviro-fg-inverse] sm:p-12">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-enviro-display)] text-[--color-enviro-fg-inverse]">
          {t('explorer.ctaHeading')}
        </h2>
        <p className="mt-3 text-base text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
          {t('explorer.ctaSubheading')}
        </p>

        <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
          {features.map((f) => {
            const Icon = f.icon;

            return (
              <li
                key={f.text}
                className="flex items-start gap-2 text-sm text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]"
              >
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-[--color-enviro-lime-300]"
                  strokeWidth={1.5}
                />
                <span>{f.text}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/auth/sign-up">
            <EnviroButton variant="primary" size="md" magnetic>
              {t('explorer.ctaSignUp')}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </EnviroButton>
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-[--color-enviro-lime-300] underline underline-offset-4 hover:text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-sans)]"
          >
            {t('explorer.ctaPricing')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export async function DualCTA() {
  const t = await getTranslations('marketing');

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-[--radius-enviro-xl] border border-[--color-enviro-cream-300] bg-white p-6 shadow-[--shadow-enviro-card]">
        <h3 className="text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
          {t('explorer.ctaBuyerTitle')}
        </h3>
        <p className="mt-2 text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
          {t('explorer.ctaBuyerDesc')}
        </p>
        <Link href="/auth/sign-up" className="mt-4 inline-block">
          <EnviroButton variant="primary" size="sm">
            {t('explorer.ctaSignUp')}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </EnviroButton>
        </Link>
      </div>
      <div className="rounded-[--radius-enviro-xl] border border-[--color-enviro-cream-300] bg-white p-6 shadow-[--shadow-enviro-card]">
        <h3 className="text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
          {t('explorer.ctaSellerTitle')}
        </h3>
        <p className="mt-2 text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
          {t('explorer.ctaSellerDesc')}
        </p>
        <Link href="/auth/sign-up" className="mt-4 inline-block">
          <EnviroButton variant="secondary" size="sm">
            {t('explorer.ctaPublishLot')}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </EnviroButton>
        </Link>
      </div>
    </div>
  );
}
