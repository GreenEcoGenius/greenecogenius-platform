'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Shield,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  MapPin,
  Leaf,
  Scale,
  Hash,
  Calendar,
  Link2,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import {
  fetchCertificateByIdOrNumber,
  getPolygonScanUrl,
  parseGeolocationTrail,
  type CertificateWithBlockchain,
} from '~/lib/queries/traceability';
import { formatCO2, formatTonnes, formatRelativeDate } from '~/lib/format';

function DetailContent() {
  const t = useTranslations('traceability');
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [cert, setCert] = useState<CertificateWithBlockchain | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchCertificateByIdOrNumber(id)
      .then(setCert)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  function copyHash() {
    const hash = cert?.blockchain_hash || cert?.blockchain_records?.tx_hash;
    if (!hash) return;
    navigator.clipboard.writeText(hash).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) {
    return (
      <AppShell title={t('detailTitle')} showBack hideTabBar>
        <div className="space-y-4 animate-pulse">
          <div className="h-20 rounded-2xl bg-[#F5F5F0]/[0.04]" />
          <div className="h-40 rounded-2xl bg-[#F5F5F0]/[0.04]" />
          <div className="h-24 rounded-2xl bg-[#F5F5F0]/[0.04]" />
        </div>
      </AppShell>
    );
  }

  if (!cert) {
    return (
      <AppShell title={t('detailTitle')} showBack hideTabBar>
        <div className="flex flex-col items-center justify-center py-20">
          <Shield className="h-10 w-10 text-[#F5F5F0]/20 mb-3" />
          <p className="text-[14px] text-[#F5F5F0]/50">Certificat introuvable</p>
        </div>
      </AppShell>
    );
  }

  const bc = cert.blockchain_records;
  const txHash = cert.blockchain_hash || bc?.tx_hash;
  const polygonUrl = getPolygonScanUrl(txHash ?? null);
  const trail = parseGeolocationTrail(bc?.geolocation_trail);
  const isVerified = !!txHash;

  return (
    <AppShell title={t('detailTitle')} showBack hideTabBar>
      <div className="space-y-4 pb-6">
        {/* Status banner */}
        <div className={`rounded-2xl p-4 ${isVerified ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
          <div className="flex items-center gap-3">
            {isVerified ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
            ) : (
              <Clock className="h-6 w-6 text-amber-400 shrink-0" />
            )}
            <div>
              <p className={`text-[14px] font-semibold ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isVerified ? 'Vérifié sur la blockchain' : 'En attente de vérification'}
              </p>
              <p className="text-[11px] text-[#F5F5F0]/40 mt-0.5">
                {isVerified ? 'Ce certificat est enregistré sur Polygon' : 'La transaction blockchain est en cours de traitement'}
              </p>
            </div>
          </div>
        </div>

        {/* Certificate number */}
        <div className="rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40 mb-2">
            Certificat
          </p>
          <p className="text-[18px] font-bold text-[#F5F5F0] font-mono">
            {cert.certificate_number || cert.id.slice(0, 12)}
          </p>
          {cert.material_summary && (
            <p className="mt-1 text-[13px] text-[#F5F5F0]/60">{cert.material_summary}</p>
          )}
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={Scale}
            label="Poids"
            value={formatTonnes(cert.weight_tonnes)}
          />
          <MetricCard
            icon={Leaf}
            label="CO₂ évité"
            value={formatCO2(cert.co2_avoided)}
            accent
          />
        </div>

        {/* Details */}
        <div className="rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] divide-y divide-[#F5F5F0]/[0.06]">
          <InfoRow icon={Calendar} label="Émis le" value={
            cert.issued_at
              ? new Date(cert.issued_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
              : '—'
          } />
          {cert.expires_at && (
            <InfoRow icon={Calendar} label="Expire le" value={
              new Date(cert.expires_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
            } />
          )}
          {bc?.network && (
            <InfoRow icon={Link2} label="Réseau" value={bc.network} />
          )}
          {bc?.contract_address && (
            <InfoRow icon={Hash} label="Contrat" value={`${bc.contract_address.slice(0, 8)}...${bc.contract_address.slice(-6)}`} />
          )}
        </div>

        {/* Blockchain hash */}
        {txHash && (
          <div className="rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40 mb-2">
              Transaction Hash
            </p>
            <div className="flex items-center gap-2">
              <p className="flex-1 truncate text-[12px] font-mono text-[#B8D4E3]">
                {txHash}
              </p>
              <button
                onClick={copyHash}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F0]/[0.06] active:bg-[#F5F5F0]/10 transition-colors"
              >
                {copied ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-[#F5F5F0]/50" />
                )}
              </button>
            </div>
            {polygonUrl && (
              <a
                href={polygonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-[#F5F5F0]/[0.08] py-2.5 text-[12px] text-[#B8D4E3] active:bg-[#F5F5F0]/[0.04] transition-colors"
              >
                Voir sur PolygonScan <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Geolocation trail */}
        {trail.length > 0 && (
          <div className="rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40 mb-3">
              Parcours de traçabilité
            </p>
            <div className="space-y-0">
              {trail.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full shrink-0 ${idx === 0 ? 'bg-emerald-400' : 'bg-[#F5F5F0]/20'}`} />
                    {idx < trail.length - 1 && (
                      <div className="w-px flex-1 bg-[#F5F5F0]/10 my-1" />
                    )}
                  </div>
                  <div className="pb-4 min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-[#F5F5F0]">
                      {step.step || `Étape ${idx + 1}`}
                    </p>
                    {step.location && (
                      <p className="flex items-center gap-1 text-[11px] text-[#F5F5F0]/40 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {step.location}
                      </p>
                    )}
                    {step.actor && (
                      <p className="text-[11px] text-[#F5F5F0]/30 mt-0.5">{step.actor}</p>
                    )}
                    {step.timestamp && (
                      <p className="text-[10px] text-[#F5F5F0]/25 mt-0.5">
                        {formatRelativeDate(step.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate URL */}
        {cert.certificate_url && (
          <a
            href={cert.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#B8D4E3] py-3.5 text-[14px] font-semibold text-[#0A2F1F] active:opacity-80 transition-opacity"
          >
            Télécharger le certificat PDF
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </AppShell>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] p-3.5">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${accent ? 'bg-emerald-500/10' : 'bg-[#B8D4E3]/10'}`}>
        <Icon className={`h-4 w-4 ${accent ? 'text-emerald-400' : 'text-[#B8D4E3]'}`} />
      </div>
      <p className={`text-[18px] font-bold leading-tight ${accent ? 'text-emerald-400' : 'text-[#F5F5F0]'}`}>{value}</p>
      <p className="mt-0.5 text-[11px] text-[#F5F5F0]/40">{label}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-[#F5F5F0]/30" />
      <p className="text-[12px] text-[#F5F5F0]/50 w-24 shrink-0">{label}</p>
      <p className="flex-1 text-right text-[13px] text-[#F5F5F0] truncate">{value}</p>
    </div>
  );
}

export default function TraceabilityDetailPage() {
  return (
    <AuthGuard>
      <DetailContent />
    </AuthGuard>
  );
}
