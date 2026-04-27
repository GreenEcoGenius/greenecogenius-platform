'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShieldCheck, ScanLine, RotateCw } from 'lucide-react';

import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';
import { CertificateCard } from '~/components/traceability/certificate-card';
import { useTraceability } from '~/hooks/use-traceability';

export default function TraceabilityPage() {
  return (
    <AuthGuard>
      <TraceabilityContent />
    </AuthGuard>
  );
}

function TraceabilityContent() {
  const t = useTranslations('traceability');
  const { certificates, loading, refreshing, error, refetch } =
    useTraceability();

  return (
    <AppShell title={t('title')} subtitle={t('subtitle')} showBack>
      {/* Scan button hero */}
      <Link
        href="/traceability/scan"
        className="mb-3 flex items-center gap-3 rounded-2xl bg-[#B8D4E3] px-4 py-3 text-[#0A2F1F] transition-all active:scale-[0.99]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A2F1F]/10">
          <ScanLine className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold">{t('scanCta')}</p>
          <p className="text-[11px] opacity-70">{t('scanCtaDesc')}</p>
        </div>
      </Link>

      {/* Certificates section header */}
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
          {t('myCertificates')}
        </p>
        <button
          onClick={() => void refetch()}
          disabled={refreshing}
          aria-label={t('refresh')}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#F5F5F0]/50 active:bg-[#F5F5F0]/10 disabled:opacity-30"
        >
          <RotateCw
            className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* States */}
      {loading && certificates.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8">
          <RotateCw className="h-5 w-5 animate-spin text-[#F5F5F0]/40" />
          <p className="text-xs text-[#F5F5F0]/50">{t('loading')}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-center text-sm text-red-300">{error}</p>
          <button
            onClick={() => void refetch()}
            className="rounded-full border border-[#F5F5F0]/15 px-4 py-1.5 text-xs text-[#F5F5F0]/80 active:bg-[#F5F5F0]/10"
          >
            {t('retry')}
          </button>
        </div>
      ) : certificates.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8D4E3]/15">
            <ShieldCheck className="h-5 w-5 text-[#B8D4E3]" />
          </div>
          <p className="text-center text-sm text-[#F5F5F0]/60">
            {t('emptyCerts')}
          </p>
          <p className="max-w-xs text-center text-[11px] text-[#F5F5F0]/40">
            {t('emptyCertsHint')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {certificates.map((c) => (
            <CertificateCard key={c.id} cert={c} />
          ))}
        </div>
      )}

      <p className="pt-4 text-center text-[10px] text-[#F5F5F0]/40">
        {t('footnote')}
      </p>
    </AppShell>
  );
}
