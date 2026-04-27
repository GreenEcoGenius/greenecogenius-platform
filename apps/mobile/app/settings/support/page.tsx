'use client';

import { useTranslations } from 'next-intl';
import { CircleHelp, Sparkles } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';

function SupportContent() {
  const t = useTranslations('settings');

  return (
    <AppShell title={t('help')} subtitle={t('helpSubtitle')} showBack>
      <div className="flex flex-col items-center gap-4 py-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8D4E3]/15">
          <CircleHelp className="h-6 w-6 text-[#B8D4E3]" strokeWidth={1.5} />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#F5F5F0]/15 bg-[#F5F5F0]/[0.04] px-3 py-1">
          <Sparkles className="h-3.5 w-3.5 text-[#B8D4E3]" strokeWidth={1.5} />
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#F5F5F0]/80">
            {t('comingSoon')}
          </span>
        </div>
        <p className="max-w-xs text-center text-xs text-[#F5F5F0]/50">
          {t('comingSoonHint')}
        </p>
      </div>
    </AppShell>
  );
}

export default function SupportPage() {
  return (
    <AuthGuard>
      <SupportContent />
    </AuthGuard>
  );
}
