'use client';

import { useTranslations } from 'next-intl';

import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';
import { CarbonTabs } from '~/components/carbon/carbon-tabs';

export default function CarbonLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('carbon');

  return (
    <AuthGuard>
      <AppShell title={t('title')} subtitle={t('subtitle')}>
        <CarbonTabs />
        {children}
      </AppShell>
    </AuthGuard>
  );
}
