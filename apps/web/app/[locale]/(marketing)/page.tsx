import Image from 'next/image';
import Link from 'next/link';

import { ArrowRightIcon, Recycle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  CtaButton,
  FeatureCard,
  FeatureGrid,
  FeatureShowcase,
  FeatureShowcaseIconContainer,
  Hero,
  Pill,
  PillActionButton,
  SecondaryHero,
} from '@kit/ui/marketing';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';

async function Home() {
  const t = await getTranslations('marketing');
  return (
    <div className={'mt-4 flex flex-col space-y-24 py-14'}>
      <div className={'mx-auto'}>
        <Hero
          pill={
            <Pill label={'B2B'}>
              <span>
                <Trans i18nKey={'marketing.heroPill'} />
              </span>
              <PillActionButton
                render={
                  <Link href={'/auth/sign-up'}>
                    <ArrowRightIcon className={'h-4 w-4'} />
                  </Link>
                }
              />
            </Pill>
          }
          title={
            <span className="text-secondary-foreground">
              <span>
                <Trans i18nKey={'marketing.heroTitle'} />
              </span>
            </span>
          }
          subtitle={
            <span>
              <Trans i18nKey={'marketing.heroSubtitle'} />
            </span>
          }
          cta={<MainCallToActionButton />}
          image={
            <Image
              priority
              className={
                'dark:border-primary/10 w-full rounded-lg border border-gray-200'
              }
              width={3558}
              height={2222}
              src={`/images/dashboard.webp`}
              alt={`GreenEcoGenius Dashboard`}
            />
          }
        />
      </div>

      <div className={'container mx-auto'}>
        <div className={'py-4 xl:py-8'}>
          <FeatureShowcase
            heading={
              <>
                <b className="font-medium tracking-tight dark:text-white">
                  <Trans i18nKey={'marketing.featuresHeading'} />
                </b>
                .{' '}
                <span className="text-secondary-foreground/70 block font-normal tracking-tight">
                  <Trans i18nKey={'marketing.featuresSubheading'} />
                </span>
              </>
            }
            icon={
              <FeatureShowcaseIconContainer>
                <Recycle className="h-4 w-4" />
                <span>
                  <Trans i18nKey={'marketing.featuresBadge'} />
                </span>
              </FeatureShowcaseIconContainer>
            }
          >
            <FeatureGrid>
              <FeatureCard
                className={'relative col-span-1 overflow-hidden'}
                label={t('feature1Title')}
                description={t('feature1Description')}
              />

              <FeatureCard
                className={'relative col-span-1 w-full overflow-hidden'}
                label={t('feature2Title')}
                description={t('feature2Description')}
              />

              <FeatureCard
                className={'relative col-span-1 overflow-hidden'}
                label={t('feature3Title')}
                description={t('feature3Description')}
              />

              <FeatureCard
                className={'relative col-span-1 overflow-hidden'}
                label={t('feature4Title')}
                description={t('feature4Description')}
              />

              <FeatureCard
                className={'relative col-span-1 overflow-hidden'}
                label={t('feature5Title')}
                description={t('feature5Description')}
              />

              <FeatureCard
                className={'relative col-span-1 overflow-hidden'}
                label={t('feature6Title')}
                description={t('feature6Description')}
              />
            </FeatureGrid>
          </FeatureShowcase>
        </div>
      </div>

      <div className={'container mx-auto'}>
        <div
          className={
            'flex flex-col items-center justify-center space-y-12 py-4 xl:py-8'
          }
        >
          <SecondaryHero
            pill={
              <Pill label={<Trans i18nKey={'marketing.ctaPillLabel'} />}>
                <Trans i18nKey={'marketing.ctaPillText'} />
              </Pill>
            }
            heading={<Trans i18nKey={'marketing.ctaHeading'} />}
            subheading={<Trans i18nKey={'marketing.ctaSubheading'} />}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;

function MainCallToActionButton() {
  return (
    <div className={'flex space-x-2.5'}>
      <CtaButton className="h-10 text-sm">
        <Link href={'/auth/sign-up'}>
          <span className={'flex items-center space-x-0.5'}>
            <span>
              <Trans i18nKey={'marketing.joinPlatform'} />
            </span>

            <ArrowRightIcon
              className={
                'animate-in fade-in slide-in-from-left-8 h-4' +
                ' zoom-in fill-mode-both delay-1000 duration-1000'
              }
            />
          </span>
        </Link>
      </CtaButton>

      <CtaButton variant={'link'} className="h-10 text-sm">
        <Link href={'/pricing'}>
          <Trans i18nKey={'marketing.explore'} />
        </Link>
      </CtaButton>
    </div>
  );
}
