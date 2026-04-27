'use client';

import Link from 'next/link';
import { ShieldCheck, Leaf, Package, Calendar } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import type { CertificateWithBlockchain } from '~/lib/queries/traceability';

interface CertificateCardProps {
  cert: CertificateWithBlockchain;
}

export function CertificateCard({ cert }: CertificateCardProps) {
  const t = useTranslations('traceability');
  const locale = useLocale();

  const issuedDate = cert.issued_at
    ? new Date(cert.issued_at).toLocaleDateString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const co2 = Number(cert.co2_avoided ?? 0);
  const weight = Number(cert.weight_tonnes ?? 0);
  const verified = cert.blockchain_records?.is_verified ?? false;

  return (
    <Link
      href={`/traceability/detail?id=${cert.id}`}
      className="block rounded-2xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 px-4 py-3 transition-all active:scale-[0.99] active:bg-[#F5F5F0]/8"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            verified ? 'bg-[#B8D4E3]/15' : 'bg-[#F5F5F0]/10'
          }`}
        >
          <ShieldCheck
            className={`h-5 w-5 ${
              verified ? 'text-[#B8D4E3]' : 'text-[#F5F5F0]/40'
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-1.5">
            <p className="truncate text-[13px] font-semibold text-[#F5F5F0]">
              {cert.certificate_number ?? cert.id.slice(0, 8)}
            </p>
            {verified && (
              <span className="rounded-full bg-[#B8D4E3]/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#B8D4E3]">
                {t('verified')}
              </span>
            )}
          </div>
          {cert.material_summary && (
            <p className="line-clamp-1 text-[11px] text-[#F5F5F0]/60">
              {cert.material_summary}
            </p>
          )}
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-[#F5F5F0]/50">
            {weight > 0 && (
              <span className="flex items-center gap-0.5">
                <Package className="h-3 w-3" />
                {weight.toFixed(2)}t
              </span>
            )}
            {co2 > 0 && (
              <span className="flex items-center gap-0.5">
                <Leaf className="h-3 w-3" />
                {co2.toFixed(0)} kg
              </span>
            )}
            {issuedDate && (
              <span className="flex items-center gap-0.5">
                <Calendar className="h-3 w-3" />
                {issuedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
