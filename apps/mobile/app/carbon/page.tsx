'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Leaf,
  BarChart3,
  FileText,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  RotateCw,
  Activity,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { useCarbonRecords } from '~/hooks/use-carbon-records';
import { useEsgData } from '~/hooks/use-esg-data';
import { formatCO2, formatTonnes, formatRelativeDate } from '~/lib/format';
import { computeEsgScopeTotals } from '~/lib/queries/esg-data';

type Tab = 'records' | 'esg';

function CarbonContent() {
  const t = useTranslations('carbon');
  const [activeTab, setActiveTab] = useState<Tab>('records');
  const { records, loading: loadingRecords } = useCarbonRecords();
  const { esg: esgData, loading: loadingEsg } = useEsgData();

  const scopes = esgData ? computeEsgScopeTotals(esgData) : null;

  return (
    <AppShell title={t('title')} subtitle={t('subtitle')}>
      <div className="space-y-4 pb-4">
        {/* Tab switcher */}
        <div className="flex rounded-xl bg-[#F5F5F0]/[0.04] p-0.5">
          {(['records', 'esg'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2 text-[12px] font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#F5F5F0]/[0.08] text-[#F5F5F0] shadow-sm'
                  : 'text-[#F5F5F0]/40'
              }`}
            >
              {tab === 'records' ? t('tabComptoir') : t('tabBilan')}
            </button>
          ))}
        </div>

        {activeTab === 'records' ? (
          /* ── Carbon Records ── */
          <div className="space-y-4">
            {/* Summary stats */}
            {records.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-[15px] font-bold text-emerald-400">
                    {formatCO2(records.reduce((sum, r) => sum + Number(r.co2_avoided ?? 0), 0))}
                  </p>
                  <p className="mt-0.5 text-[9px] text-[#F5F5F0]/40 uppercase tracking-wider">CO₂ évité</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-[15px] font-bold text-[#B8D4E3]">
                    {formatTonnes(records.reduce((sum, r) => sum + Number(r.weight_tonnes ?? 0), 0))}
                  </p>
                  <p className="mt-0.5 text-[9px] text-[#F5F5F0]/40 uppercase tracking-wider">Recyclé</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-[15px] font-bold text-[#F5F5F0]">{records.length}</p>
                  <p className="mt-0.5 text-[9px] text-[#F5F5F0]/40 uppercase tracking-wider">Records</p>
                </div>
              </div>
            )}

            {/* Records list */}
            {loadingRecords ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl glass-card" />
                ))}
              </div>
            ) : records.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <Leaf className="h-6 w-6 text-emerald-400/50" />
                </div>
                <p className="text-[14px] font-medium text-[#F5F5F0]/60">
                  Aucune transaction carbone
                </p>
                <p className="mt-1 text-[12px] text-[#F5F5F0]/35 max-w-[240px] mx-auto">
                  {t('comingSoonRecords')}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {records.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-xl glass-card px-3.5 py-2.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Leaf className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#F5F5F0]">
                        {r.material_category}
                        {r.material_subcategory ? ` · ${r.material_subcategory}` : ''}
                      </p>
                      <p className="text-[11px] text-[#F5F5F0]/40">
                        {formatTonnes(r.weight_tonnes)} · {formatRelativeDate(r.calculated_at ?? r.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-semibold text-emerald-400">
                        {r.co2_avoided != null && r.co2_avoided > 0 ? '+' : ''}
                        {formatCO2(r.co2_avoided)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/carbon/records"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#F5F5F0]/[0.06] py-2.5 text-[12px] text-[#B8D4E3] active:bg-[#F5F5F0]/[0.03] transition-colors"
            >
              Voir tous les enregistrements <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          /* ── ESG / CSRD ── */
          <div className="space-y-4">
            {loadingEsg ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl glass-card" />
                ))}
              </div>
            ) : !scopes || !scopes.hasData ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                  <BarChart3 className="h-6 w-6 text-amber-400/50" />
                </div>
                <p className="text-[14px] font-medium text-[#F5F5F0]/60">
                  Aucun bilan ESG
                </p>
                <p className="mt-1 text-[12px] text-[#F5F5F0]/35 max-w-[240px] mx-auto">
                  {t('comingSoonEsg')}
                </p>
                <Link
                  href="/carbon/esg"
                  className="mt-4 inline-block rounded-xl bg-[#B8D4E3] px-5 py-2.5 text-[13px] font-medium text-[#0A2F1F] active:opacity-80 transition-opacity"
                >
                  Commencer le bilan
                </Link>
              </div>
            ) : (
              <>
                {/* Total emissions */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
                      Émissions totales
                    </p>
                    <span className="text-[10px] text-[#F5F5F0]/30">
                      {esgData?.reporting_year}
                    </span>
                  </div>
                  <p className="text-[24px] font-bold text-[#F5F5F0]">
                    {formatCO2(scopes.total)}
                  </p>
                  <p className="text-[11px] text-[#F5F5F0]/40">kgCO₂e / an</p>
                </div>

                {/* Scopes breakdown */}
                <div className="space-y-2">
                  {[
                    { label: 'Scope 1 — Émissions directes', value: scopes.scope1, color: '#EF4444' },
                    { label: 'Scope 2 — Énergie', value: scopes.scope2, color: '#F59E0B' },
                    { label: 'Scope 3 — Chaîne de valeur', value: scopes.scope3, color: '#6EE7B7' },
                  ].map((scope) => {
                    const pct = scopes.total > 0 ? (scope.value / scopes.total) * 100 : 0;
                    return (
                      <div key={scope.label} className="glass-card rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[12px] text-[#F5F5F0]/70">{scope.label}</p>
                          <p className="text-[13px] font-semibold text-[#F5F5F0]">
                            {formatCO2(scope.value)}
                          </p>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#F5F5F0]/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor: scope.color,
                            }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-[#F5F5F0]/30 text-right">
                          {pct.toFixed(1)}%
                        </p>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/carbon/esg"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[#F5F5F0]/[0.06] py-2.5 text-[12px] text-[#B8D4E3] active:bg-[#F5F5F0]/[0.03] transition-colors"
                >
                  Détails ESG / CSRD <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function CarbonPage() {
  return (
    <AuthGuard>
      <CarbonContent />
    </AuthGuard>
  );
}
