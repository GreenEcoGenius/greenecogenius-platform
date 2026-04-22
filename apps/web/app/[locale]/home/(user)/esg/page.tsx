import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  FileText,
  Layers,
  Link2,
  Sparkles,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
} from '~/components/enviro/enviro-card';

export const generateMetadata = async () => {
  const t = await getTranslations('esg');

  return { title: t('title') };
};

async function ESGPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;
  const t = await getTranslations('esg');
  const tDashboard = await getTranslations('dashboard');
  const tCommon = await getTranslations('common');

  if (!userId) {
    return null;
  }

  const features = [
    {
      key: 'csrd',
      icon: <Layers aria-hidden="true" className="h-5 w-5" />,
      title: t('featureCsrdTitle'),
      desc: t('featureCsrdDesc'),
    },
    {
      key: 'ghg',
      icon: <BarChart3 aria-hidden="true" className="h-5 w-5" />,
      title: t('featureGhgTitle'),
      desc: t('featureGhgDesc'),
    },
    {
      key: 'ai',
      icon: <Sparkles aria-hidden="true" className="h-5 w-5" />,
      title: t('featureAiTitle'),
      desc: t('featureAiDesc'),
    },
    {
      key: 'blockchain',
      icon: <Link2 aria-hidden="true" className="h-5 w-5" />,
      title: t('featureBlockchainTitle'),
      desc: t('featureBlockchainDesc'),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.esg')}
        title={tDashboard('esgTitle')}
        subtitle={tDashboard('esgDesc')}
      />

      <EnviroCard variant="dark" hover="none" padding="lg">
        <EnviroCardBody className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-300]/15 text-[--color-enviro-lime-300]">
            <BarChart3 aria-hidden="true" className="h-8 w-8" />
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
                <Link {...buttonProps} href="/home/esg/wizard">
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                  {t('startWizard')}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              )}
            />
            <EnviroButton
              variant="outlineCream"
              size="md"
              render={(buttonProps) => (
                <Link {...buttonProps} href="/home/carbon">
                  <FileText aria-hidden="true" className="h-4 w-4" />
                  {t('viewCarbon')}
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

export default ESGPage;
