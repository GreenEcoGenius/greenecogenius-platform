'use client';
import { useTranslations } from 'next-intl';
import {
  Shield,
  Factory,
  Leaf,
  FileBarChart,
  Link2,
  Medal,
  Database,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { useCompliance } from '~/hooks/use-compliance';

interface PillarInfo {
  key: string;
  name: string;
  icon: typeof Factory;
  total: number;
  color: string;
}

const PILLARS: PillarInfo[] = [
  {
    key: 'circular_economy',
    name: 'Économie circulaire',
    icon: Factory,
    total: 11,
    color: '#6EE7B7',
  },
  {
    key: 'carbon',
    name: 'Carbone & Env.',
    icon: Leaf,
    total: 7,
    color: '#34D399',
  },
  {
    key: 'reporting',
    name: 'Reporting ESG',
    icon: FileBarChart,
    total: 9,
    color: '#F59E0B',
  },
  {
    key: 'traceability',
    name: 'Traçabilité',
    icon: Link2,
    total: 6,
    color: '#B8D4E3',
  },
  {
    key: 'data',
    name: 'Données & SaaS',
    icon: Database,
    total: 5,
    color: '#A78BFA',
  },
  {
    key: 'labels',
    name: 'Éligibilité labels',
    icon: Medal,
    total: 4,
    color: '#60A5FA',
  },
];

function ComplianceContent() {
  const t = useTranslations('compliance');
  const { rows, loading } = useCompliance();

  const compliantCount = rows.filter((r) => r.status === 'compliant').length;
  const partialCount = rows.filter((r) => r.status === 'partial').length;
  const totalNorms = 42;
  const score = totalNorms > 0 ? Math.round((compliantCount / totalNorms) * 100) : 0;

  return (
    <AppShell title={t('title')} subtitle={t('subtitle')} showBack>
      <div className="space-y-5 pb-4">
        {/* Score card */}
        <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(245,245,240,0.06)"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#6EE7B7"
                  strokeWidth="4"
                  strokeDasharray={`${(score / 100) * 175.9} 175.9`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[14px] font-bold text-[#F5F5F0]">
                {score}%
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#F5F5F0]">
                {t('globalScore')}
              </p>
              <div className="mt-1.5 flex gap-3">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span className="text-[10px] text-[#F5F5F0]/50">
                    {compliantCount}/{totalNorms}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-400" />
                  <span className="text-[10px] text-[#F5F5F0]/50">
                    {partialCount} {t('partial')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-[#F5F5F0]/30" />
                  <span className="text-[10px] text-[#F5F5F0]/50">
                    0 {t('alerts')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <section>
          <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
            {t('pillarsTitle')}
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {PILLARS.map((pillar) => {
              const pillarCompliant = rows.filter(
                (r) =>
                  r.status === 'compliant' &&
                  r.norm_id.startsWith(pillar.key.replace('_', '-')),
              ).length;
              const pct =
                pillar.total > 0
                  ? Math.round((pillarCompliant / pillar.total) * 100)
                  : 0;
              return (
                <div
                  key={pillar.key}
                  className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-3"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${pillar.color}15` }}
                    >
                      <pillar.icon
                        className="h-3.5 w-3.5"
                        style={{ color: pillar.color }}
                      />
                    </div>
                    <span className="text-[12px] font-bold text-[#F5F5F0]">
                      {pct}%
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] font-medium text-[#F5F5F0]">
                    {pillar.name}
                  </p>
                  <p className="text-[10px] text-[#F5F5F0]/35">
                    {pillarCompliant}/{pillar.total} {t('norms')}
                  </p>
                  {/* Progress bar */}
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#F5F5F0]/[0.06]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pillar.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Regulatory watch */}
        <section>
          <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
            {t('regulatoryWatch')}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02]">
            {[
              {
                year: '2030',
                title: 'Règlement Emballages',
                risk: 'Moyen',
              },
              {
                year: '2027',
                title: 'Passeport Numérique Produits',
                risk: 'Moyen',
              },
              {
                year: '2026',
                title: 'CSDDD — Devoir de Vigilance',
                risk: 'Moyen',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`flex items-center gap-3 px-3.5 py-2.5 ${
                  i > 0 ? 'border-t border-[#F5F5F0]/[0.05]' : ''
                }`}
              >
                <span className="shrink-0 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                  {item.year}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[12px] font-medium text-[#F5F5F0]">
                    {item.title}
                  </p>
                </div>
                <span className="rounded-md bg-[#F5F5F0]/[0.06] px-1.5 py-0.5 text-[9px] text-[#F5F5F0]/40">
                  {item.risk}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function CompliancePage() {
  return (
    <AuthGuard>
      <ComplianceContent />
    </AuthGuard>
  );
}
