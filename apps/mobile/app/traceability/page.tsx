'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  QrCode,
  Shield,
  RotateCw,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { useTraceability } from '~/hooks/use-traceability';
import { formatRelativeDate } from '~/lib/format';

function TraceabilityContent() {
  const t = useTranslations('traceability');
  const { certificates, loading, error, refetch } = useTraceability();

  return (
    <AppShell
      title="Traçabilité"
      subtitle="Certificats blockchain"
      rightAction={
        <Link
          href="/traceability/scan"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6EE7B7]/15 text-[#6EE7B7] active:opacity-80 transition-opacity"
        >
          <QrCode className="h-4 w-4" />
        </Link>
      }
    >
      <div className="space-y-4 pb-4">
        {/* Scan CTA */}
        <Link
          href="/traceability/scan"
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#0f3d28] to-[#0A2F1F] border border-[#6EE7B7]/15 p-4 active:opacity-90 transition-opacity"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6EE7B7]/15">
            <QrCode className="h-5 w-5 text-[#6EE7B7]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#F5F5F0]">Scanner un QR code</p>
            <p className="text-[11px] text-[#F5F5F0]/40">Vérifier un certificat de traçabilité</p>
          </div>
          <ChevronRight className="h-4 w-4 text-[#F5F5F0]/20" />
        </Link>

        {/* Certificates list */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              Vos certificats
            </h2>
            <button
              onClick={() => void refetch()}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[#F5F5F0]/30 active:bg-[#F5F5F0]/5"
            >
              <RotateCw className="h-3 w-3" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl glass-card" />
              ))}
            </div>
          ) : error ? (
            <div className="glass-card rounded-2xl p-5 text-center">
              <p className="text-[13px] text-red-300/80">{error}</p>
              <button
                onClick={() => void refetch()}
                className="mt-3 rounded-full border border-[#F5F5F0]/10 px-4 py-1.5 text-[12px] text-[#F5F5F0]/60 active:bg-[#F5F5F0]/5"
              >
                Réessayer
              </button>
            </div>
          ) : certificates.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6EE7B7]/10">
                <Shield className="h-6 w-6 text-[#6EE7B7]/50" />
              </div>
              <p className="text-[14px] font-medium text-[#F5F5F0]/60">
                Aucun certificat
              </p>
              <p className="mt-1 text-[12px] text-[#F5F5F0]/35 max-w-[240px] mx-auto">
                Les certificats de traçabilité apparaîtront ici après vos premières transactions.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {certificates.map((cert) => (
                <Link
                  key={cert.id}
                  href={`/traceability/detail?id=${cert.id}`}
                  className="flex items-center gap-3 rounded-xl glass-card px-3.5 py-3 active:bg-[#F5F5F0]/[0.06] transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6EE7B7]/10">
                    <Shield className="h-4 w-4 text-[#6EE7B7]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-medium text-[#F5F5F0]">
                      {cert.material_summary || cert.certificate_number || 'Certificat'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {cert.blockchain_hash ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                      )}
                      <span className="text-[11px] text-[#F5F5F0]/40">
                        {cert.blockchain_hash ? 'Vérifié' : 'En attente'}
                      </span>
                      <span className="text-[11px] text-[#F5F5F0]/25">·</span>
                      <span className="text-[11px] text-[#F5F5F0]/30">
                        {formatRelativeDate(cert.issued_at ?? cert.created_at)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#F5F5F0]/15" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

export default function TraceabilityPage() {
  return (
    <AuthGuard>
      <TraceabilityContent />
    </AuthGuard>
  );
}
