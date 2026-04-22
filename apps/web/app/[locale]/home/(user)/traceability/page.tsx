import Link from 'next/link';

import {
  ArrowRight,
  Leaf,
  Link2,
  PackageSearch,
  Recycle,
  ScrollText,
  Shield,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
} from '~/components/enviro/enviro-card';

export const generateMetadata = async () => {
  const t = await getTranslations('blockchain');

  return { title: t('title') };
};

async function TraceabilityPage() {
  const t = await getTranslations('blockchain');
  const tDashboard = await getTranslations('dashboard');
  const tCommon = await getTranslations('common');

  const features = [
    {
      key: 'lots',
      icon: <PackageSearch aria-hidden="true" className="h-5 w-5" />,
      titleKey: 'featureLots',
      title: t('featureLots'),
      desc: t('featureLotsDesc'),
    },
    {
      key: 'co2',
      icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
      title: t('featureCO2'),
      desc: t('featureCO2Desc'),
    },
    {
      key: 'tonnes',
      icon: <Recycle aria-hidden="true" className="h-5 w-5" />,
      title: t('featureTonnes'),
      desc: t('featureTonnesDesc'),
    },
    {
      key: 'certs',
      icon: <ScrollText aria-hidden="true" className="h-5 w-5" />,
      title: t('featureCerts'),
      desc: t('featureCertsDesc'),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.traceability')}
        title={tDashboard('traceabilityTitle')}
        subtitle={tDashboard('traceabilityDesc')}
      />

      <EnviroCard variant="dark" hover="none" padding="lg">
        <EnviroCardBody className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-300]/15 text-[--color-enviro-lime-300]">
            <Link2 aria-hidden="true" className="h-8 w-8" />
          </div>
          <h2 className="text-balance text-2xl leading-tight font-semibold text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-display)]">
            {t('emptyTitle')}
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-[--color-enviro-fg-inverse-muted]">
            {t('emptyDesc')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <EnviroButton
              variant="lime"
              size="md"
              magnetic
              render={(buttonProps) => (
                <Link {...buttonProps} href="/home/marketplace/new">
                  <PackageSearch aria-hidden="true" className="h-4 w-4" />
                  {t('publishLot')}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              )}
            />
            <EnviroButton
              variant="outlineCream"
              size="md"
              render={(buttonProps) => (
                <Link {...buttonProps} href="/home/marketplace">
                  <Shield aria-hidden="true" className="h-4 w-4" />
                  {t('browseMarketplace')}
                </Link>
              )}
            />
          </div>
        </EnviroCardBody>
      </EnviroCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <EnviroCard key={f.key} variant="cream" hover="lift" padding="md">
            <EnviroCardBody className="flex flex-col gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-lime-100] text-[--color-enviro-lime-700]">
                {f.icon}
              </span>
              <h3 className="text-sm font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
                {f.title}
              </h3>
              <p className="text-xs text-[--color-enviro-forest-700]">
                {f.desc}
              </p>
            </EnviroCardBody>
          </EnviroCard>
        ))}
      </div>
    </div>
  );
}

export default TraceabilityPage;
