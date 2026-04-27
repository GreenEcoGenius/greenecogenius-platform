'use client';

import { ExternalLink, Hash, Box, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  getPolygonScanUrl,
  type CertificateWithBlockchain,
} from '~/lib/queries/traceability';

interface BlockchainInfoProps {
  cert: CertificateWithBlockchain;
}

export function BlockchainInfo({ cert }: BlockchainInfoProps) {
  const t = useTranslations('traceability');
  const block = cert.blockchain_records;

  const txHash = cert.blockchain_hash ?? block?.record_hash ?? null;
  const polygonUrl = getPolygonScanUrl(txHash);
  const verified = block?.is_verified ?? false;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ShieldCheck className={"h-4 w-4 " + (verified ? "text-[#B8D4E3]" : "text-[#F5F5F0]/40")} />
        <p className={"text-[12px] font-semibold uppercase tracking-wider " + (verified ? "text-[#B8D4E3]" : "text-[#F5F5F0]/50")}>
          {verified ? t('chainVerified') : t('chainUnverified')}
        </p>
      </div>

      <div className="space-y-1.5 rounded-2xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 p-1">
        {txHash ? (
          <InfoRow icon={Hash} label={t('txHash')} value={txHash.slice(0, 10) + "..." + txHash.slice(-8)} mono />
        ) : null}
        {block?.block_number != null ? (
          <InfoRow icon={Box} label={t('blockNumber')} value={"#" + block.block_number} mono />
        ) : null}
      </div>

      {polygonUrl ? (
        <a href={polygonUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl border border-[#B8D4E3]/30 bg-[#B8D4E3]/10 px-4 py-2.5 text-[13px] font-medium text-[#B8D4E3] transition-all active:scale-[0.99]">
          {t('viewOnPolygonScan')}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : null}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, mono = false }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B8D4E3]/15">
        <Icon className="h-4 w-4 text-[#B8D4E3]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-[#F5F5F0]/50">{label}</p>
        <p className={"truncate text-[13px] text-[#F5F5F0] " + (mono ? "font-mono" : "")}>{value}</p>
      </div>
    </div>
  );
}
