import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import { Trans } from '@kit/ui/trans';

import {
  EnviroBlogCard,
  EnviroButton,
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
  EnviroComparisonTable,
  EnviroFaq,
  EnviroFooter,
  EnviroHero,
  EnviroLogoStrip,
  EnviroNavbar,
  EnviroNewsletterCta,
  EnviroPageHero,
  EnviroPricingCard,
  EnviroSectionHeader,
  EnviroStatBlock,
  EnviroStats,
  EnviroTimeline,
} from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';
import { MagneticWrapper } from '~/components/enviro/animations/magnetic-wrapper';
import { ParallaxContainer } from '~/components/enviro/animations/parallax-container';
import {
  StaggerContainer,
  StaggerItem,
} from '~/components/enviro/animations/stagger-container';
import { TextReveal } from '~/components/enviro/animations/text-reveal';
import featuresFlagConfig from '~/config/feature-flags.config';

export const metadata: Metadata = {
  title: 'Enviro Components Preview',
  robots: { index: false, follow: false },
};

export default async function EnviroComponentsPreviewPage() {
  if (!featuresFlagConfig.enableEnviroPreview) {
    notFound();
  }

  const t = await getTranslations('enviroPreview');

  return (
    <div className="min-h-screen bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-sans)]">
      <EnviroNavbar
        brand={
          <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-enviro-display)]">
            Enviro
          </span>
        }
        links={[
          { href: '#primitives', label: t('sections.primitives') },
          { href: '#shell', label: t('sections.shell') },
          { href: '#content', label: t('sections.content') },
          { href: '#animations', label: t('sections.animations') },
        ]}
        ctaPrimary={
          <EnviroButton variant="primary" size="md">
            {t('demo.buttonPrimary')}
          </EnviroButton>
        }
        showLocaleSwitcher={true}
      />

      <main>
        <PageIntro
          title={t('page.title')}
          subtitle={t('page.subtitle')}
          description={t('page.description')}
        />

        <PrimitivesSection />
        <ShellSection />
        <ContentSection />
        <AnimationsSection />
      </main>

      <EnviroFooter
        brand={
          <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-enviro-display)]">
            Enviro
          </span>
        }
        description={t('page.description')}
        sections={[
          {
            heading: t('sections.primitives'),
            links: [
              { href: '#primitives', label: t('sections.primitives') },
              { href: '#shell', label: t('sections.shell') },
            ],
          },
          {
            heading: t('sections.content'),
            links: [{ href: '#content', label: t('sections.content') }],
          },
          {
            heading: t('sections.animations'),
            links: [{ href: '#animations', label: t('sections.animations') }],
          },
        ]}
        copyright={
          <Trans
            i18nKey="marketing.copyright"
            values={{ product: 'GreenEcoGenius', year: new Date().getFullYear() }}
          />
        }
      />
    </div>
  );
}

function PageIntro({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <EnviroPageHero
      tag={subtitle}
      title={title}
      subtitle={description}
      tone="cream"
    />
  );
}

async function PrimitivesSection() {
  const t = await getTranslations('enviroPreview');

  return (
    <section
      id="primitives"
      className="mx-auto w-full max-w-[--container-enviro-xl] px-4 py-20 lg:px-8"
    >
      <FadeInSection>
        <EnviroSectionHeader
          tag={t('sections.primitives')}
          title={t('demo.sectionTitle')}
          subtitle={t('demo.sectionSubtitle')}
          tone="cream"
        />
      </FadeInSection>

      <div className="mt-12 flex flex-wrap items-center gap-4">
        <EnviroButton variant="primary" size="md">
          {t('demo.buttonPrimary')}
        </EnviroButton>
        <EnviroButton variant="secondary" size="md">
          {t('demo.buttonSecondary')}
        </EnviroButton>
        <EnviroButton variant="ghost" size="md">
          {t('demo.buttonGhost')}
        </EnviroButton>
        <EnviroButton variant="lime" size="md">
          {t('demo.buttonPrimary')}
        </EnviroButton>
        <EnviroButton variant="primary" size="pill" magnetic>
          {t('demo.buttonMagnetic')}
        </EnviroButton>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <EnviroCard variant="cream" hover="lift">
          <EnviroCardHeader>
            <EnviroCardTitle>{t('demo.cardCreamTitle')}</EnviroCardTitle>
          </EnviroCardHeader>
          <EnviroCardBody>{t('demo.cardCreamBody')}</EnviroCardBody>
        </EnviroCard>

        <EnviroCard variant="dark" hover="glow">
          <EnviroCardHeader>
            <EnviroCardTitle>{t('demo.cardDarkTitle')}</EnviroCardTitle>
          </EnviroCardHeader>
          <EnviroCardBody className="text-[--color-enviro-fg-inverse-muted]">
            {t('demo.cardDarkBody')}
          </EnviroCardBody>
        </EnviroCard>

        <EnviroCard variant="lime" hover="lift">
          <EnviroCardHeader>
            <EnviroCardTitle>{t('demo.cardLimeTitle')}</EnviroCardTitle>
          </EnviroCardHeader>
          <EnviroCardBody>{t('demo.cardLimeBody')}</EnviroCardBody>
        </EnviroCard>

        <div className="relative overflow-hidden rounded-[--radius-enviro-xl] bg-[--color-enviro-forest-900] p-1">
          <EnviroCard
            variant="glass"
            hover="lift"
            className="border-white/15 backdrop-blur-md"
          >
            <EnviroCardHeader>
              <EnviroCardTitle className="text-[--color-enviro-fg-inverse]">
                {t('demo.cardGlassTitle')}
              </EnviroCardTitle>
            </EnviroCardHeader>
            <EnviroCardBody className="text-[--color-enviro-fg-inverse-muted]">
              {t('demo.cardGlassBody')}
            </EnviroCardBody>
          </EnviroCard>
        </div>
      </div>
    </section>
  );
}

async function ShellSection() {
  const t = await getTranslations('enviroPreview');

  return (
    <section id="shell" className="space-y-20 py-12">
      <EnviroHero
        tag={t('demo.heroTag')}
        title={t('demo.heroTitle')}
        subtitle={t('demo.heroSubtitle')}
        description={t('demo.heroDescription')}
        ctas={
          <>
            <EnviroButton variant="primary" size="lg">
              {t('demo.heroCtaPrimary')}
            </EnviroButton>
            <EnviroButton variant="outlineCream" size="lg">
              {t('demo.heroCtaSecondary')}
            </EnviroButton>
          </>
        }
        backgroundImage="/enviro/images/BG-image-1_1BG-image-1.avif"
        backgroundImageAlt={t('demo.heroSubtitle')}
        fullBleed={false}
      />

      <EnviroPageHero
        tag={t('demo.pageHeroTag')}
        title={t('demo.pageHeroTitle')}
        subtitle={t('demo.pageHeroSubtitle')}
        tone="forest"
        ctas={
          <EnviroButton variant="primary" size="md">
            {t('demo.heroCtaPrimary')}
          </EnviroButton>
        }
      />
    </section>
  );
}

async function ContentSection() {
  const t = await getTranslations('enviroPreview');

  const stats = [
    {
      value: 310,
      suffix: t('demo.stats.stat1Suffix'),
      label: t('demo.stats.stat1Label'),
      source: t('demo.stats.stat1Source'),
    },
    {
      value: 42,
      suffix: t('demo.stats.stat2Suffix'),
      label: t('demo.stats.stat2Label'),
      source: t('demo.stats.stat2Source'),
    },
    {
      value: 150,
      suffix: t('demo.stats.stat3Suffix'),
      label: t('demo.stats.stat3Label'),
      source: t('demo.stats.stat3Source'),
    },
    {
      value: 11.5,
      suffix: t('demo.stats.stat4Suffix'),
      label: t('demo.stats.stat4Label'),
      source: t('demo.stats.stat4Source'),
      fractionDigits: 1,
    },
  ];

  const timeline = [
    {
      year: t('demo.timeline.items.2024.year'),
      title: t('demo.timeline.items.2024.title'),
      description: t('demo.timeline.items.2024.description'),
    },
    {
      year: t('demo.timeline.items.2025Urgent.year'),
      title: t('demo.timeline.items.2025Urgent.title'),
      description: t('demo.timeline.items.2025Urgent.description'),
      badge: t('demo.timeline.items.2025Urgent.badge'),
    },
    {
      year: t('demo.timeline.items.2026Urgent.year'),
      title: t('demo.timeline.items.2026Urgent.title'),
      description: t('demo.timeline.items.2026Urgent.description'),
      badge: t('demo.timeline.items.2026Urgent.badge'),
    },
    {
      year: t('demo.timeline.items.2030.year'),
      title: t('demo.timeline.items.2030.title'),
      description: t('demo.timeline.items.2030.description'),
    },
  ];

  return (
    <section id="content" className="space-y-24 py-20">
      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
        <FadeInSection>
          <EnviroSectionHeader
            tag={t('demo.stats.tag')}
            title={t('demo.stats.title')}
            subtitle={t('demo.stats.subtitle')}
            tone="cream"
          />
        </FadeInSection>
        <div className="mt-10">
          <EnviroStats stats={stats} tone="cream" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
        <FadeInSection>
          <EnviroSectionHeader
            tag={t('demo.timeline.tag')}
            title={t('demo.timeline.title')}
            tone="cream"
          />
        </FadeInSection>
        <div className="mt-10">
          <EnviroTimeline items={timeline} tone="cream" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
        <FadeInSection>
          <EnviroSectionHeader
            tag={t('demo.comparison.tag')}
            title={t('demo.comparison.title')}
            subtitle={t('demo.comparison.subtitle')}
            tone="cream"
          />
        </FadeInSection>
        <div className="mt-10">
          <EnviroComparisonTable
            headers={[
              t('demo.comparison.headers.feature'),
              t('demo.comparison.headers.geg'),
              t('demo.comparison.headers.alt1'),
              t('demo.comparison.headers.alt2'),
            ]}
            rows={[
              {
                feature: t('demo.comparison.rows.marketplace'),
                cells: [true, false, false],
              },
              {
                feature: t('demo.comparison.rows.blockchain'),
                cells: [true, false, false],
              },
              {
                feature: t('demo.comparison.rows.ai'),
                cells: [true, true, false],
              },
              {
                feature: t('demo.comparison.rows.csrd'),
                cells: [true, true, true],
              },
              {
                feature: t('demo.comparison.rows.labels'),
                cells: ['42', '12', '8'],
              },
            ]}
            highlightColumnIndex={0}
            tone="cream"
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
        <FadeInSection>
          <EnviroSectionHeader
            tag={t('demo.pricing.tag')}
            title={t('demo.pricing.title')}
            subtitle={t('demo.pricing.subtitle')}
            tone="cream"
          />
        </FadeInSection>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <EnviroPricingCard
            name={t('demo.pricing.essential.name')}
            price={t('demo.pricing.essential.price')}
            period={t('demo.pricing.essential.period')}
            description={t('demo.pricing.essential.description')}
            features={[
              t('demo.pricing.essential.feature1'),
              t('demo.pricing.essential.feature2'),
              t('demo.pricing.essential.feature3'),
              t('demo.pricing.essential.feature4'),
            ]}
            cta={
              <EnviroButton variant="secondary" size="md" className="w-full">
                {t('demo.pricing.essential.cta')}
              </EnviroButton>
            }
            variant="default"
          />
          <EnviroPricingCard
            name={t('demo.pricing.advanced.name')}
            price={t('demo.pricing.advanced.price')}
            period={t('demo.pricing.advanced.period')}
            description={t('demo.pricing.advanced.description')}
            features={[
              t('demo.pricing.advanced.feature1'),
              t('demo.pricing.advanced.feature2'),
              t('demo.pricing.advanced.feature3'),
              t('demo.pricing.advanced.feature4'),
              t('demo.pricing.advanced.feature5'),
            ]}
            cta={
              <EnviroButton variant="primary" size="md" className="w-full">
                {t('demo.pricing.advanced.cta')}
              </EnviroButton>
            }
            badge={t('demo.pricing.advanced.badge')}
            variant="popular"
          />
          <EnviroPricingCard
            name={t('demo.pricing.enterprise.name')}
            price={t('demo.pricing.enterprise.price')}
            description={t('demo.pricing.enterprise.description')}
            features={[
              t('demo.pricing.enterprise.feature1'),
              t('demo.pricing.enterprise.feature2'),
              t('demo.pricing.enterprise.feature3'),
              t('demo.pricing.enterprise.feature4'),
            ]}
            cta={
              <EnviroButton variant="primary" size="md" className="w-full">
                {t('demo.pricing.enterprise.cta')}
              </EnviroButton>
            }
            variant="enterprise"
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
        <FadeInSection>
          <EnviroSectionHeader
            tag={t('demo.faq.tag')}
            title={t('demo.faq.title')}
            tone="cream"
          />
        </FadeInSection>
        <div className="mt-10">
          <EnviroFaq
            items={[
              {
                value: 'q1',
                question: t('demo.faq.items.q1.question'),
                answer: t('demo.faq.items.q1.answer'),
              },
              {
                value: 'q2',
                question: t('demo.faq.items.q2.question'),
                answer: t('demo.faq.items.q2.answer'),
              },
              {
                value: 'q3',
                question: t('demo.faq.items.q3.question'),
                answer: t('demo.faq.items.q3.answer'),
              },
              {
                value: 'q4',
                question: t('demo.faq.items.q4.question'),
                answer: t('demo.faq.items.q4.answer'),
              },
            ]}
            tone="cream"
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
        <FadeInSection>
          <EnviroSectionHeader
            tag={t('demo.blog.tag')}
            title={t('demo.blog.title')}
            tone="cream"
          />
        </FadeInSection>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <EnviroBlogCard
            href="#"
            category={t('demo.blog.post1.category')}
            title={t('demo.blog.post1.title')}
            excerpt={t('demo.blog.post1.excerpt')}
            date={t('demo.blog.post1.date')}
            image="/enviro/images/about-image.avif"
            imageAlt={t('demo.blog.post1.title')}
          />
          <EnviroBlogCard
            href="#"
            category={t('demo.blog.post2.category')}
            title={t('demo.blog.post2.title')}
            excerpt={t('demo.blog.post2.excerpt')}
            date={t('demo.blog.post2.date')}
            image="/enviro/images/about-image-1_1about-image-1.avif"
            imageAlt={t('demo.blog.post2.title')}
          />
          <EnviroBlogCard
            href="#"
            category={t('demo.blog.post3.category')}
            title={t('demo.blog.post3.title')}
            excerpt={t('demo.blog.post3.excerpt')}
            date={t('demo.blog.post3.date')}
            image="/enviro/images/about-image-2_1about-image-2.avif"
            imageAlt={t('demo.blog.post3.title')}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
        <FadeInSection>
          <EnviroSectionHeader
            tag={t('demo.logos.tag')}
            title={t('demo.logos.title')}
            tone="cream"
          />
        </FadeInSection>
        <div className="mt-10">
          <EnviroLogoStrip
            tone="cream"
            logos={[
              { src: '/enviro/images/brand-logo.svg', alt: 'Brand 1', width: 120 },
              { src: '/enviro/images/brand-logo-2.svg', alt: 'Brand 2', width: 120 },
              { src: '/enviro/images/brand-logo-3.svg', alt: 'Brand 3', width: 120 },
              { src: '/enviro/images/brand-logo-4.svg', alt: 'Brand 4', width: 120 },
              { src: '/enviro/images/brand-logo-5.svg', alt: 'Brand 5', width: 120 },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
        <EnviroNewsletterCta
          title={t('demo.newsletter.title')}
          subtitle={t('demo.newsletter.subtitle')}
          placeholder={t('demo.newsletter.placeholder')}
          ctaLabel={t('demo.newsletter.cta')}
          consent={t('demo.newsletter.consent')}
          tone="forest"
        />
      </div>
    </section>
  );
}

async function AnimationsSection() {
  const t = await getTranslations('enviroPreview');

  return (
    <section
      id="animations"
      className="mx-auto w-full max-w-[--container-enviro-xl] px-4 py-20 lg:px-8"
    >
      <FadeInSection>
        <EnviroSectionHeader
          tag={t('sections.animations')}
          title={t('animationsDemo.fadeInTitle')}
          subtitle={t('animationsDemo.fadeInBody')}
          tone="cream"
        />
      </FadeInSection>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <EnviroCard variant="cream" hover="lift">
          <EnviroCardHeader>
            <EnviroCardTitle>{t('animationsDemo.staggerTitle')}</EnviroCardTitle>
          </EnviroCardHeader>
          <EnviroCardBody>
            <StaggerContainer
              className="mt-2 flex flex-col gap-2"
              stagger={0.1}
            >
              {[1, 2, 3, 4].map((i) => (
                <StaggerItem
                  key={i}
                  className="rounded-[--radius-enviro-sm] border border-[--color-enviro-cream-300] bg-white px-4 py-3 text-sm"
                >
                  {t('animationsDemo.staggerItem')} {i}
                </StaggerItem>
              ))}
            </StaggerContainer>
          </EnviroCardBody>
        </EnviroCard>

        <EnviroCard variant="cream" hover="lift">
          <EnviroCardHeader>
            <EnviroCardTitle>
              {t('animationsDemo.parallaxTitle')}
            </EnviroCardTitle>
          </EnviroCardHeader>
          <EnviroCardBody>
            <p className="mb-4 text-sm">{t('animationsDemo.parallaxBody')}</p>
            <ParallaxContainer
              intensity={20}
              className="rounded-[--radius-enviro-md] bg-[--color-enviro-forest-900] p-6 text-[--color-enviro-fg-inverse]"
            >
              <p className="text-sm">{t('demo.heroDescription')}</p>
            </ParallaxContainer>
          </EnviroCardBody>
        </EnviroCard>

        <EnviroCard variant="cream" hover="lift">
          <EnviroCardHeader>
            <EnviroCardTitle>
              {t('animationsDemo.magneticTitle')}
            </EnviroCardTitle>
          </EnviroCardHeader>
          <EnviroCardBody>
            <p className="mb-4 text-sm">{t('animationsDemo.magneticBody')}</p>
            <MagneticWrapper strength={24}>
              <EnviroButton variant="primary" size="lg">
                {t('demo.buttonMagnetic')}
              </EnviroButton>
            </MagneticWrapper>
          </EnviroCardBody>
        </EnviroCard>

        <EnviroCard variant="cream" hover="lift">
          <EnviroCardHeader>
            <EnviroCardTitle>
              {t('animationsDemo.textRevealTitle')}
            </EnviroCardTitle>
          </EnviroCardHeader>
          <EnviroCardBody>
            <TextReveal
              text={t('animationsDemo.textRevealLine')}
              as="p"
              className="text-2xl leading-snug font-semibold font-[family-name:var(--font-enviro-display)]"
            />
          </EnviroCardBody>
        </EnviroCard>

        <EnviroCard variant="cream" hover="lift" className="md:col-span-2">
          <EnviroCardHeader>
            <EnviroCardTitle>{t('animationsDemo.counterTitle')}</EnviroCardTitle>
          </EnviroCardHeader>
          <EnviroCardBody>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <EnviroStatBlock
                value={2026}
                label={t('demo.timeline.items.2026Urgent.title')}
              />
              <EnviroStatBlock
                value={150}
                suffix=" Mds€"
                label={t('demo.stats.stat3Label')}
              />
              <EnviroStatBlock
                value={42}
                suffix=" %"
                label={t('demo.stats.stat2Label')}
              />
              <EnviroStatBlock
                value={11.5}
                suffix=" %"
                label={t('demo.stats.stat4Label')}
                fractionDigits={1}
              />
            </div>
          </EnviroCardBody>
        </EnviroCard>
      </div>
    </section>
  );
}
