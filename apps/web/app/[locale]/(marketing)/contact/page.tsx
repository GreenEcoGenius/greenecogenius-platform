import { Clock, Globe2, Headphones, Mail, MapPin, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
  EnviroPageHero,
  EnviroSectionHeader,
} from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';
import {
  StaggerContainer,
  StaggerItem,
} from '~/components/enviro/animations/stagger-container';

import { ContactForm } from './_components/contact-form';

export async function generateMetadata() {
  const t = await getTranslations('contact');

  return {
    title: `${t('metaTitle')} | GreenEcoGenius`,
    description: t('metaDescription'),
  };
}

interface ContactPageProps {
  searchParams: Promise<{ subject?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const t = await getTranslations('contact');
  const tMarketing = await getTranslations('marketing');
  const { subject } = await searchParams;

  const defaultMessage = subject ? `[${subject}]\n\n` : undefined;

  const infoCards = [
    {
      icon: Mail,
      label: t('emailLabel'),
      value: t('emailValue'),
      href: `mailto:${t('emailValue')}`,
    },
    {
      icon: Phone,
      label: t('phoneLabel'),
      value: t('phoneValue'),
      href: `tel:${t('phoneValue').replace(/\s+/g, '')}`,
    },
    {
      icon: MapPin,
      label: t('locationLabel'),
      value: t('locationValue'),
    },
    {
      icon: Clock,
      label: t('hoursLabel'),
      value: t('hoursValue'),
    },
    {
      icon: Globe2,
      label: t('responseLabel'),
      value: t('responseValue'),
    },
    {
      icon: Headphones,
      label: t('supportLabel'),
      value: t('supportValue'),
    },
  ];

  return (
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
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left column: form */}
            <div className="lg:col-span-7">
              <FadeInSection>
                <EnviroSectionHeader
                  tag={t('formTag')}
                  title={t('formTitle')}
                  subtitle={t('formSubtitle')}
                  tone="cream"
                />
              </FadeInSection>

              <FadeInSection delay={0.1}>
                <div className="mt-10 rounded-[--radius-enviro-3xl] border border-[--color-enviro-cream-300] bg-white p-6 shadow-[--shadow-enviro-card] sm:p-8 lg:p-10">
                  <ContactForm defaultMessage={defaultMessage} />
                </div>
              </FadeInSection>
            </div>

            {/* Right column: info cards */}
            <aside className="lg:col-span-5">
              <FadeInSection>
                <EnviroSectionHeader
                  tag={t('infoTag')}
                  title={t('infoTitle')}
                  tone="cream"
                />
              </FadeInSection>

              <StaggerContainer
                className="mt-10 grid gap-4"
                stagger={0.06}
              >
                {infoCards.map((info) => {
                  const Icon = info.icon;
                  const inner = (
                    <>
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
                          {info.label}
                        </p>
                        <p className="text-sm leading-relaxed text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-sans)]">
                          {info.value}
                        </p>
                      </div>
                    </>
                  );

                  return (
                    <StaggerItem key={info.label}>
                      <EnviroCard
                        variant="cream"
                        radius="md"
                        hover="lift"
                        padding="md"
                      >
                        {info.href ? (
                          <a
                            href={info.href}
                            className="flex items-start gap-4"
                            target={
                              info.href.startsWith('http') ? '_blank' : undefined
                            }
                            rel={
                              info.href.startsWith('http')
                                ? 'noopener noreferrer'
                                : undefined
                            }
                          >
                            {inner}
                          </a>
                        ) : (
                          <div className="flex items-start gap-4">{inner}</div>
                        )}
                      </EnviroCard>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>

              <FadeInSection delay={0.2}>
                <EnviroCard
                  variant="dark"
                  radius="lg"
                  hover="none"
                  padding="lg"
                  className="mt-6"
                >
                  <EnviroCardHeader>
                    <EnviroCardTitle className="text-[--color-enviro-fg-inverse]">
                      {tMarketing('footerSecurityBadge')}
                    </EnviroCardTitle>
                  </EnviroCardHeader>
                  <EnviroCardBody className="text-sm text-[--color-enviro-fg-inverse-muted]">
                    {t('salesValue')}
                  </EnviroCardBody>
                </EnviroCard>
              </FadeInSection>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
