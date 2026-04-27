'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  ShieldCheck,
  Leaf,
  Package,
  Calendar,
  RotateCw,
  AlertCircle,
} from 'lucide-react';

import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';
import { BlockchainInfo } from '~/components/traceability/blockchain-info';
import { GeolocationTrail } from '~/components/traceability/geolocation-trail';
import {
  fetchCertificateByIdOrNumber,
  parseGeolocationTrail,
  type CertificateWithBlockchain,
} from '~/lib/queries/traceability';

export default function CertificateDetailPage() {
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <CertificateDetailContent />
      </Suspense>
    </AuthGuard>
  );
}

function CertificateDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const t = useTranslations('traceability');
  const locale = useLocale();

  const [cert, setCert] = useState<CertificateWithBlockchain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCertificateByIdOrNumber(id!);
        if (!cancelled) setCert(data);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Erreur';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <AppShell title={t('detailTitle')} showBack>
        <div className="flex flex-col items-center gap-2 py-12">
          <RotateCw className="h-5 w-5 animate-spin text-[#F5F5F0]/40" />
          <p className="text-xs text-[#F5F5F0]/50">{t('loading')}</p>
        </div>
      </AppShell>
    );
  }

  if (error || !cert) {
    return (
      <AppShell title={t('detailTitle')} showBack>
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15">
            <AlertCircle className="h-5 w-5 text-red-300" />
          </div>
          <p className="text-center text-sm text-red-200">
            {error ?? t('certNotFound')}
          </p>
          <p className="max-w-xs text-center text-[11px] text-[#F5F5F0]/40">
            {t('certNotFoundHint')}
          </p>
        </div>
      </AppShell>
    );
  }

  const issuedDate = cert.issued_at
    ? new Date(cert.issued_at).toLocaleDateString(locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const co2 = Number(cert.co2_avoided ?? 0);
  const weight = Number(cert.weight_tonnes ?? 0);
  const trail = parseGeolocationTrail(cert.blockchain_records?.geolocation_trail);

  return (
    <AppShell title={t('detailTitle')} showBack>
      {/* Cert header */}
      <div className="mb-3 rounded-2xl border border-[#B8D4E3]/20 bg-[#B8D4E3]/8 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B8D4E3]/20">
            <ShieldCheck className="h-6 w-6 text-[#B8D4E3]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#B8D4E3]">
              {t('certificate')}
            </p>
            <p className="truncate text-[15px] font-semibold text-[#F5F5F0]">
              {cert.certificate_number ?? cert.id.slice(0, 12)}
            </p>
          </div>
        </div>
      </div>

      {/* Material summary */}
      {cert.material_summary && (
        <div className="mb-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            {t('material')}
          </p>
          <p className="text-[14px] text-[#F5F5F0]">{cert.material_summary}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <StatTile
          icon={Package}
          value={weight.toFixed(2)}
          unit="t"
          label={t('weight')}
        />
        <StatTile
          icon={Leaf}
          value={co2.toFixed(0)}
          unit="kgCO₂e"
          label={t('co2Avoided')}
        />
      </div>

      {issuedDate && (
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 px-4 py-2.5">
          <Calendar className="h-4 w-4 text-[#B8D4E3]" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#F5F5F0]/50">
              {t('issuedOn')}
            </p>
            <p className="text-[13px] text-[#F5F5F0]">{issuedDate}</p>
          </div>
        </div>
      )}

      {/* Blockchain info */}
      <div className="mb-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
          {t('blockchain')}
        </p>
        <BlockchainInfo cert={cert} />
      </div>

      {/* Geolocation trail */}
      {trail.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            {t('trail')}
          </p>
          <GeolocationTrail steps={trail} />
        </div>
      )}

      <p className="pb-4 pt-2 text-center text-[10px] text-[#F5F5F0]/40">
        {t('detailFootnote')}
      </p>
    </AppShell>
  );
}

function StatTile({
  icon: Icon,
  value,
  unit,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-2xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 px-3 py-2.5">
      <Icon className="h-4 w-4 text-[#B8D4E3]" />
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-semibold text-[#F5F5F0]">{value}</span>
        <span className="text-[10px] text-[#F5F5F0]/60">{unit}</span>
      </div>
      <span className="text-[10px] uppercase tracking-wide text-[#F5F5F0]/50">
        {label}
      </span>
    </div>
  );
}
