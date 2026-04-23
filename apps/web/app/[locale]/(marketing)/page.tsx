import { Suspense } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Bot,
  Recycle,
  Shield,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  EnviroButton,
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
  EnviroComparisonTable,
  EnviroFaq,
  EnviroHero,
  EnviroLogoStrip,
  EnviroNewsletterCta,
  EnviroPricingCard,
  EnviroSectionHeader,
  EnviroStats,
  EnviroTimeline,
} from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';

import { ImpactSimulator } from './_components/landing/impact-simulator';
import { HowItWorks } from './_components/landing/how-it-works';
import { LatestArticles } from './_components/landing/latest-articles';

const SUPABASE_LOGO_BASE =
  'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image';

const TECH_LOGOS = [
  {
    src: '/images/logos/nextjs.svg',
    alt: 'Next.js',
    href: 'https://nextjs.org',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/supabase.svg`,
    alt: 'Supabase',
    href: 'https://supabase.com',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/b3ed1049-ffc5-4fc8-ab50-67af7fe74f0b.png`,
    alt: 'Vercel',
    href: 'https://vercel.com',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/Polygon_blockchain_logo.svg.png`,
    alt: 'Polygon',
    href: 'https://polygon.technology',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/Stripe_Logo,_revised_2016.svg.png`,
    alt: 'Stripe',
    href: 'https://stripe.com',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/Anthropic-Logo.wine.png`,
    alt: 'Anthropic',
    href: 'https://anthropic.com',
  },
  {
    src: '/images/logos/github.svg',
    alt: 'GitHub',
    href: 'https://github.com',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/Cursor_logo.svg.png`,
    alt: 'Cursor',
    href: 'https://cursor.com',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/a5c0742e-793f-4358-9ab5-38221f77375e.png`,
    alt: 'Alchemy',
    href: 'https://www.alchemy.com',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/Home%20Page/a31b8a42-d341-40c9-b0d8-a29ffbc45a41.png`,
    alt: 'Docusign',
    href: 'https://www.docusign.com',
  },
];

const SOURCE_LOGOS = [
  {
    src: `${SUPABASE_LOGO_BASE}/logo-ademe-removebg-preview.png.webp`,
    alt: 'ADEME',
    href: 'https://www.ademe.fr',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/77fd6085-0309-4069-8da9-af4890068fd3.png`,
    alt: 'SINOE',
    href: 'https://www.sinoe.org',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/Eurostat_Newlogo.png`,
    alt: 'Eurostat',
    href: 'https://ec.europa.eu/eurostat',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/EPA_logo.svg`,
    alt: 'EPA',
    href: 'https://www.epa.gov',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/Logo_FEDEREC.png`,
    alt: 'FEDEREC',
    href: 'https://federec.com',
  },
];

const FRAMEWORK_LOGOS = [
  {
    src: `${SUPABASE_LOGO_BASE}/29ba5962-b575-4db3-92d0-c092399d843b.png`,
    alt: 'ISO 14001',
    href: 'https://www.iso.org',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/ghg_protocol_logo_clear_1_2.png`,
    alt: 'GHG Protocol',
    href: 'https://ghgprotocol.org',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/8eddffa9-ea2d-4c20-bbb1-20bb0e0a20e5.png`,
    alt: 'GRI',
    href: 'https://www.globalreporting.org',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/esrsicon1.png`,
    alt: 'CSRD / ESRS',
    href: 'https://finance.ec.europa.eu',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/Certified_B_Corporation_B_Corp_Logo_2022_Black_RGB.svg.png`,
    alt: 'B Corp',
    href: 'https://www.bcorporation.net',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/17dc64b5-7ac4-46cb-93f2-a074804f05ea.png`,
    alt: 'GreenTech Innovation',
    href: 'https://greentechinnovation.fr',
  },
  {
    src: `${SUPABASE_LOGO_BASE}/a22d5f61-e78e-459b-8839-efe5f1f833ae.png`,
    alt: 'NR (INR)',
    href: 'https://institutnr.org',
  },
];

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title:
      'GreenEcoGenius : Plateforme B2B Économie Circulaire | CSRD & Blockchain',
    description: t('heroSubtitle'),
  };
}

export default async function Home() {
  const t = await getTranslations('marketing');

  const stats = [
    {
      value: parseFloat(t('landing.stat1Value')),
      suffix: t('landing.stat1Suffix'),
      label: t('landing.stat1Label'),
      source: t('landing.stat1Source'),
    },
    {
      value: parseFloat(t('landing.stat2Value')),
      suffix: t('landing.stat2Suffix'),
      label: t('landing.stat2Label'),
      source: t('landing.stat2Source'),
    },
    {
      value: parseFloat(t('landing.stat3Value')),
      suffix: t('landing.stat3Suffix'),
      label: t('landing.stat3Label'),
      source: t('landing.stat3Source'),
    },
    {
      value: parseFloat(t('landing.stat4Value')),
      suffix: t('landing.stat4Suffix'),
      label: t('landing.stat4Label'),
      source: t('landing.stat4Source'),
      fractionDigits: 1,
    },
  ];

  const timeline = [
    {
      year: '2024',
      title: t('landing.milestone1'),
      description: t('landing.milestone1'),
    },
    {
      year: '2025',
      title: t('landing.milestone2'),
      description: t('landing.milestone2'),
      badge: 'Urgent',
    },
    {
      year: '2026',
      title: t('landing.milestone3'),
      description: t('landing.milestone3'),
      badge: 'Urgent',
    },
    {
      year: '2026',
      title: t('landing.milestone4'),
      description: t('landing.milestone4'),
      badge: 'Urgent',
    },
    {
      year: '2030',
      title: t('landing.milestone5'),
      description: t('landing.milestone5'),
    },
  ];

  const compHeaders = [
    t('landing.compHeaderFeature'),
    t('landing.compHeaderGeg'),
    t('landing.compHeaderGreenly'),
    t('landing.compHeaderSweep'),
    t('landing.compHeaderInternal'),
  ];
  const partial = t('landing.compYesPartial');
  const compRows = [
    {
      feature: t('landing.comp_marketplace'),
      cells: [true, false, false, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_blockchain'),
      cells: [true, false, false, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_carbonScopes'),
      cells: [true, true, true, partial] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_csrdReport'),
      cells: [true, true, true, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_ademeBase'),
      cells: [true, true, partial, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_agecRep'),
      cells: [true, partial, partial, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_blockchainCerts'),
      cells: [true, false, false, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_csrLabels'),
      cells: [true, false, partial, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_apiWebhooks'),
      cells: [true, true, true, false] as Array<boolean | string>,
    },
    {
      feature: t('landing.comp_entryPrice'),
      cells: [
        t('landing.compPriceGeg'),
        t('landing.compPriceGreenly'),
        t('landing.compPriceSweep'),
        t('landing.compPriceInternal'),
      ] as Array<boolean | string>,
    },
  ];

  const faqItems = [
    {
      value: 'q1',
      question: t('landing.faq1Q'),
      answer: t('landing.faq1A'),
    },
    {
      value: 'q2',
      question: t('landing.faq2Q'),
      answer: t('landing.faq2A'),
    },
    {
      value: 'q3',
      question: t('landing.faq3Q'),
      answer: t('landing.faq3A'),
    },
    {
      value: 'q4',
      question: t('landing.faq4Q'),
      answer: t('landing.faq4A'),
    },
  ];

  return (
    <div className="flex flex-col bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]">
      {/* ────────────────────────── 1. HERO ────────────────────────── */}
      <EnviroHero
        tag={t('landing.heroTag')}
        title={t('heroTitle')}
        subtitle={t('heroBadge')}
        description={t('heroDescription')}
        backgroundImage="/enviro/images/BG-image-1_1BG-image-1.avif"
        backgroundImageAlt={t('heroTitle')}
        ctas={
          <>
            <Link href="/auth/sign-up">
              <EnviroButton variant="primary" size="lg">
                {t('heroCtaPrimary')}
              </EnviroButton>
            </Link>
            <Link href="/auth/sign-up">
              <EnviroButton variant="outlineCream" size="lg">
                {t('heroCtaSecondary')}
              </EnviroButton>
            </Link>
          </>
        }
      />

      {/* ────────────────── 2. PRODUCT SHOWCASE ────────────────────── */}
      <section className="relative bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('landing.productShowcaseTag')}
              title={t('landing.productShowcaseTitle')}
              subtitle={t('landing.productShowcaseSub')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="mt-12 overflow-hidden rounded-[--radius-enviro-3xl] shadow-[--shadow-enviro-elevated]">
              <Image
                src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Home%20Page/GEG.png"
                alt={t('landing.productShowcaseAlt')}
                width={2800}
                height={1800}
                className="h-auto w-full"
                priority
                unoptimized
              />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ────────────────── 3. STATS MARKET ────────────────────────── */}
      <section className="bg-[--color-enviro-cream-50] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('landing.statsTag')}
              title={t('landing.statsTitle')}
              subtitle={t('landing.statsSub')}
              tone="cream"
            />
          </FadeInSection>
          <div className="mt-14">
            <EnviroStats stats={stats} tone="cream" />
          </div>
        </div>
      </section>

      {/* ────────────────── 4. TECH LOGOS ──────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <p className="mb-10 text-center text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[ </span>
              {t('landing.techTag')}
              <span aria-hidden="true"> ]</span>
            </p>
          </FadeInSection>
          <EnviroLogoStrip logos={TECH_LOGOS} tone="cream" />
        </div>
      </section>

      {/* ────────────────── 5. REGULATORY TIMELINE ─────────────────── */}
      <section className="bg-[--color-enviro-cream-50] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('landing.timelineTag')}
              title={t('landing.timelineTitle')}
              subtitle={t('landing.timelineSub')}
              tone="cream"
            />
          </FadeInSection>
          <div className="mt-12">
            <EnviroTimeline items={timeline} tone="cream" />
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/home/compliance">
              <EnviroButton variant="primary" size="md">
                {t('landing.timelineCta')}
              </EnviroButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────── 6. SOURCES LOGOS ───────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <p className="mb-10 text-center text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[ </span>
              {t('landing.sourcesTag')}
              <span aria-hidden="true"> ]</span>
            </p>
          </FadeInSection>
          <EnviroLogoStrip logos={SOURCE_LOGOS} tone="cream" />
        </div>
      </section>

      {/* ────────────────── 7. THREE PILLARS ───────────────────────── */}
      <section
        id="features"
        className="bg-[--color-enviro-cream-50] py-20 lg:py-28"
      >
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('landing.pillarsTag')}
              title={t('featuresHeading')}
              subtitle={t('featuresSubheading')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <EnviroCard variant="cream" radius="lg" hover="lift" padding="none">
              <PillarCardImage
                src="/images/sorted-materials.png"
                alt={t('altSortedMaterials')}
              />
              <PillarCardBody
                icon={<Recycle className="h-5 w-5" strokeWidth={1.5} />}
                badge={t('landing.pillar1Badge')}
                title={t('feature1Title')}
                description={t('feature1Description')}
                extra={t('landing.pillar1Extra')}
                stat={t('landing.pillar1Stat')}
              />
            </EnviroCard>

            <EnviroCard variant="cream" radius="lg" hover="lift" padding="none">
              <PillarCardImage
                src="/images/blockchain-tablet.png"
                alt={t('altBlockchainTablet')}
              />
              <PillarCardBody
                icon={<Shield className="h-5 w-5" strokeWidth={1.5} />}
                badge={t('landing.pillar2Badge')}
                title={t('feature2Title')}
                description={t('feature2Description')}
                extra={t('landing.pillar2Extra')}
                stat={t('landing.pillar2Stat')}
              />
            </EnviroCard>

            <EnviroCard variant="cream" radius="lg" hover="lift" padding="none">
              <PillarCardImage
                src="/images/team-csr-reporting.png"
                alt={t('altCsrReporting')}
              />
              <PillarCardBody
                icon={<Bot className="h-5 w-5" strokeWidth={1.5} />}
                badge={t('landing.pillar3Badge')}
                title={t('feature3Title')}
                description={t('feature3Description')}
                extra={t('landing.pillar3Extra')}
                stat={t('landing.pillar3Stat')}
              />
            </EnviroCard>
          </div>
        </div>
      </section>

      {/* ────────────────── 8. HOW IT WORKS ────────────────────────── */}
      <HowItWorks />

      {/* ────────────────── 9. IMPACT SIMULATOR ────────────────────── */}
      <Suspense fallback={<div className="py-28" />}>
        <ImpactSimulator />
      </Suspense>

      {/* ────────────────── 10. FRAMEWORKS LOGOS ───────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <p className="mb-3 text-center text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[ </span>
              {t('landing.frameworksTag')}
              <span aria-hidden="true"> ]</span>
            </p>
            <p className="mb-10 text-center text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
              {t('landing.foundationsFrameworksSub')}
            </p>
          </FadeInSection>
          <EnviroLogoStrip logos={FRAMEWORK_LOGOS} tone="cream" />
        </div>
      </section>

      {/* ────────────────── 11. COMPARISON TABLE ───────────────────── */}
      <section className="bg-[--color-enviro-cream-50] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('landing.compTag')}
              title={t('landing.compTitle')}
              subtitle={t('landing.compSub')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mt-12">
            <EnviroComparisonTable
              headers={compHeaders}
              rows={compRows}
              highlightColumnIndex={0}
              tone="cream"
            />
          </div>

          <FadeInSection delay={0.1}>
            <EnviroCard
              variant="lime"
              radius="lg"
              hover="none"
              padding="md"
              className="mt-10"
            >
              <EnviroCardBody className="text-[--color-enviro-forest-900]">
                {t('landing.compCallout')}
              </EnviroCardBody>
            </EnviroCard>
          </FadeInSection>

          <p className="mt-4 text-center text-xs text-[--color-enviro-forest-600] font-[family-name:var(--font-enviro-sans)]">
            {t('landing.compPriceDisclaimer')}
          </p>

          <div className="mt-8 text-center">
            <Link
              href="/solutions"
              className="text-sm font-semibold text-[--color-enviro-forest-900] underline underline-offset-4 hover:text-[--color-enviro-cta] font-[family-name:var(--font-enviro-sans)]"
            >
              {t('landing.compCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────── 12. PRICING ────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('landing.pricingTag')}
              title={t('landing.pricingTitle')}
              subtitle={t('landing.pricingSub')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <EnviroPricingCard
              name={t('landing.planEssentiel')}
              price="149 €"
              period="/mois"
              description={t('landing.planEssentielPos')}
              features={[
                t('landing.pillar1Badge'),
                t('feature1Description'),
              ]}
              cta={
                <Link href="/auth/sign-up" className="block">
                  <EnviroButton variant="secondary" size="md" className="w-full">
                    {t('landing.planEssentielCta')}
                  </EnviroButton>
                </Link>
              }
              variant="default"
            />
            <EnviroPricingCard
              name={t('landing.planAvance')}
              price="449 €"
              period="/mois"
              description={t('landing.planAvancePos')}
              features={[
                t('landing.pillar2Badge'),
                t('landing.pillar3Badge'),
                t('feature2Description'),
                t('feature3Description'),
              ]}
              cta={
                <Link href="/auth/sign-up" className="block">
                  <EnviroButton variant="primary" size="md" className="w-full">
                    {t('landing.planAvanceCta')}
                  </EnviroButton>
                </Link>
              }
              badge={t('landing.popular')}
              variant="popular"
            />
            <EnviroPricingCard
              name={t('landing.planEnterprise')}
              price={t('landing.onQuote')}
              description={t('landing.planEnterprisePos')}
              features={[
                t('landing.pillar1Badge'),
                t('landing.pillar2Badge'),
                t('landing.pillar3Badge'),
                t('feature4Description'),
              ]}
              cta={
                <Link href="/contact" className="block">
                  <EnviroButton variant="primary" size="md" className="w-full">
                    {t('landing.planEnterpriseCta')}
                  </EnviroButton>
                </Link>
              }
              variant="enterprise"
            />
          </div>

          <p className="mt-8 text-center text-xs text-[--color-enviro-forest-600] font-[family-name:var(--font-enviro-sans)]">
            {t('landing.pricingTrial')}
          </p>

          <div className="mt-3 text-center">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-[--color-enviro-forest-900] underline underline-offset-4 hover:text-[--color-enviro-cta] font-[family-name:var(--font-enviro-sans)]"
            >
              {t('landing.pricingCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────── 13. FAQ ────────────────────────────────── */}
      <section className="bg-[--color-enviro-cream-50] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-md] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('landing.faqTag')}
              title={t('landing.faqTitle')}
              subtitle={t('landing.faqSub')}
              tone="cream"
              align="center"
            />
          </FadeInSection>
          <div className="mt-12">
            <EnviroFaq items={faqItems} tone="cream" />
          </div>
          <p className="mt-8 text-center text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
            <Link
              href="/contact"
              className="underline underline-offset-4 hover:text-[--color-enviro-cta]"
            >
              {t('contactFaq')}
            </Link>
          </p>
        </div>
      </section>

      {/* ────────────────── 14. LATEST ARTICLES ────────────────────── */}
      <Suspense fallback={<div className="py-28" />}>
        <LatestArticlesEnviroWrapper />
      </Suspense>

      {/* ────────────────── 15. NEWSLETTER ─────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <EnviroNewsletterCta
            title={t('landing.newsletterTitle')}
            subtitle={t('landing.newsletterSub')}
            placeholder={t('landing.newsletterPlaceholder')}
            ctaLabel={t('landing.newsletterCtaLabel')}
            consent={t('landing.newsletterConsent')}
            tone="forest"
          />
        </div>
      </section>
    </div>
  );
}

/**
 * Wraps the existing `LatestArticles` (Server Component with @kit/cms data
 * fetching) inside an Enviro section header. The CMS query and the Article
 * card markup remain unchanged, only the surrounding chrome adopts Enviro
 * styling. We do not migrate `_components/landing/latest-articles.tsx`
 * itself in this commit to keep the data fetching surface untouched.
 */
async function LatestArticlesEnviroWrapper() {
  const t = await getTranslations('marketing');

  return (
    <section className="bg-[--color-enviro-cream-50] py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
        <FadeInSection>
          <EnviroSectionHeader
            tag={t('landing.blogTag')}
            title={t('blog')}
            tone="cream"
          />
        </FadeInSection>
        <div className="mt-10">
          <LatestArticles />
        </div>
      </div>
    </section>
  );
}

interface PillarCardImageProps {
  src: string;
  alt: string;
}

function PillarCardImage({ src, alt }: PillarCardImageProps) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={500}
        className="h-full w-full object-cover transition-transform duration-500 group-hover/enviro-card:scale-[1.04]"
      />
    </div>
  );
}

interface PillarCardBodyProps {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  extra: string;
  stat: string;
}

function PillarCardBody({
  icon,
  badge,
  title,
  description,
  extra,
  stat,
}: PillarCardBodyProps) {
  return (
    <div className="flex flex-col gap-3 p-6 lg:p-7">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-[--radius-enviro-sm] bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900]">
          {icon}
        </span>
        <span className="rounded-[--radius-enviro-pill] bg-[--color-enviro-forest-900] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-mono)]">
          {badge}
        </span>
      </div>
      <EnviroCardHeader>
        <EnviroCardTitle>{title}</EnviroCardTitle>
      </EnviroCardHeader>
      <EnviroCardBody className="text-sm leading-relaxed text-[--color-enviro-forest-700]">
        {description}
      </EnviroCardBody>
      <p className="text-xs italic text-[--color-enviro-forest-600] font-[family-name:var(--font-enviro-sans)]">
        {extra}
      </p>
      <p className="text-xs font-semibold text-[--color-enviro-cta] font-[family-name:var(--font-enviro-sans)]">
        {stat}
      </p>
    </div>
  );
}
