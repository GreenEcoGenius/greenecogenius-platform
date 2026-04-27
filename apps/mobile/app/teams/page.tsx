'use client';

import { useTranslations } from 'next-intl';
import { Users, Plus } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';

function TeamsContent() {
  const t = useTranslations('teams');
  return (
    <AppShell
      title={t('title')}
      subtitle={t('subtitle')}
      rightAction={
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F0] text-[#0A2F1F] active:opacity-80">
          <Plus className="h-5 w-5" />
        </button>
      }
    >
      <div className="rounded-2xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] p-5 text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-[#F5F5F0]/40" />
        <p className="text-sm text-[#F5F5F0]/60">{t('empty')}</p>
      </div>
    </AppShell>
  );
}

export default function TeamsPage() {
  return (
    <AuthGuard>
      <TeamsContent />
    </AuthGuard>
  );
}
