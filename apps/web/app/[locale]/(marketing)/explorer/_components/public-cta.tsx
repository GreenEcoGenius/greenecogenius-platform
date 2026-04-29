import Link from 'next/link';

import { ArrowRight, Lock, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function PublicCTA() {
  const t = await getTranslations('marketing');

  const features = [
    { icon: Lock, text: t('explorer.ctaFeature1') },
    { icon: Sparkles, text: t('explorer.ctaFeature2') },
    { icon: Shield, text: t('explorer.ctaFeature3') },
    { icon: TrendingUp, text: t('explorer.ctaFeature4') },
  ];

  return (
    <section className="bg-primary/5 rounded-3xl p-8 sm:p-12">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-[#F5F5F0] text-2xl font-bold sm:text-3xl">
          {t('explorer.ctaHeading')}
        </h2>
        <p className="text-[#B8D4E3] mt-3 text-base">
          {t('explorer.ctaSubheading')}
        </p>

        <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
          {features.map((f) => (
            <li key={f.text} className="flex items-start gap-2 text-sm">
              <f.icon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-[#E0E7E3]">{f.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/sign-up"
            className="bg-primary hover:bg-primary-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
          >
            {t('explorer.ctaSignUp')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            className="text-primary hover:text-primary-hover text-sm font-medium underline underline-offset-4"
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
      <div className="border-primary/20 rounded-2xl border bg-[#0D3A26] p-6">
        <h3 className="text-[#F5F5F0] text-lg font-semibold">
          {t('explorer.ctaBuyerTitle')}
        </h3>
        <p className="text-[#B8D4E3] mt-2 text-sm">
          {t('explorer.ctaBuyerDesc')}
        </p>
        <Link
          href="/auth/sign-up"
          className="bg-primary hover:bg-primary-hover mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all"
        >
          {t('explorer.ctaSignUp')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="border-metal-silver/50 rounded-2xl border bg-[#0D3A26] p-6">
        <h3 className="text-[#F5F5F0] text-lg font-semibold">
          {t('explorer.ctaSellerTitle')}
        </h3>
        <p className="text-[#B8D4E3] mt-2 text-sm">
          {t('explorer.ctaSellerDesc')}
        </p>
        <Link
          href="/auth/sign-up"
          className="border-primary text-primary hover:bg-primary/5 mt-4 inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all"
        >
          {t('explorer.ctaPublishLot')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
