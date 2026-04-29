'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Leaf,
  BarChart3,
  Recycle,
  Activity,
  ChevronRight,
  RefreshCw,
  Zap,
  Shield,
  ShoppingBag,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { fetchDashboardKpis, getCurrentAccountId, type DashboardKpis } from '~/lib/queries/dashboard';
import { formatCO2, formatTonnes, formatNumber, formatPercent, formatRelativeDate } from '~/lib/format';

function DashboardContent() {
  const t = useTranslations('dashboard');
  const [data, setData] = useState<DashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const accountId = await getCurrentAccountId();
      if (!accountId) return;
      const result = await fetchDashboardKpis(accountId);
      setData(result);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void load(false); }, [load]);

  const kpis = data?.kpis;
  const recentRecords = data?.recentRecords ?? [];

  return (
    <AppShell
      title={t("title")}
      subtitle="KPIs & Analytics"
      rightAction={
        <button
          onClick={() => load(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#F5F5F0]/50 active:bg-[#F5F5F0]/10 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="space-y-5 pb-4">
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#F5F5F0]/[0.04]" />
            ))}
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <KpiCard
                icon={Leaf}
                label="CO₂ évité"
                value={formatCO2(kpis?.total_co2_avoided_kg)}
                trend={kpis?.co2_trend_pct}
                color="emerald"
              />
              <KpiCard
                icon={TrendingDown}
                label={t("netEmissions")}
                value={formatCO2(kpis?.net_emissions_kg)}
                trend={kpis?.emissions_trend_pct}
                color="blue"
                invertTrend
              />
              <KpiCard
                icon={Recycle}
                label={t("recycled")}
                value={formatTonnes(kpis?.total_recycled_tonnes)}
                trend={kpis?.recycling_trend_pct}
                color="teal"
              />
              <KpiCard
                icon={Activity}
                label={t("transactions")}
                value={formatNumber(kpis?.total_transactions)}
                color="amber"
              />
            </div>

            {/* Score circulaire */}
            {kpis?.circularity_score != null && (
              <div className="rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
                    {t("circularityScore")}
                  </p>
                  <span className="text-[11px] text-[#F5F5F0]/30">
                    {kpis.period_start && kpis.period_end
                      ? `${new Date(kpis.period_start).toLocaleDateString('fr-FR', { month: 'short' })} — ${new Date(kpis.period_end).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`
                      : ''}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0">
                    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(245,245,240,0.06)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.5" fill="none"
                        stroke="#6EE7B7" strokeWidth="3"
                        strokeDasharray={`${(kpis.circularity_score / 100) * 97.4} 97.4`}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[14px] font-bold text-[#F5F5F0]">
                        {Math.round(kpis.circularity_score)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-[#F5F5F0]">
                      {kpis.circularity_score >= 80 ? 'Excellent' : kpis.circularity_score >= 60 ? 'Bon' : kpis.circularity_score >= 40 ? 'Moyen' : 'À améliorer'}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#F5F5F0]/50">
                      Votre score reflète vos pratiques d'économie circulaire
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: ShoppingBag, label: t('marketplaceLabel'), href: '/marketplace', color: 'bg-[#B8D4E3]/10 text-[#B8D4E3]' },
                { icon: Shield, label: 'Traçabilité', href: '/traceability', color: 'bg-emerald-500/10 text-emerald-400' },
                { icon: Zap, label: t('geniusLabel'), href: '/genius', color: 'bg-amber-500/10 text-amber-400' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] py-3 active:bg-[#F5F5F0]/[0.04] transition-colors"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[#F5F5F0]/60">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Recent carbon records */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
                  Activité récente
                </p>
                <Link href="/carbon" className="text-[11px] text-[#B8D4E3] active:opacity-70">
                  Tout voir
                </Link>
              </div>

              {recentRecords.length === 0 ? (
                <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-6 text-center">
                  <p className="text-[13px] text-[#F5F5F0]/40">
                    Aucune transaction carbone enregistrée
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {recentRecords.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center gap-3 rounded-xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] px-3.5 py-2.5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                        <Leaf className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[13px] font-medium text-[#F5F5F0]">
                          {r.material_category}
                          {r.material_subcategory ? ` · ${r.material_subcategory}` : ''}
                        </p>
                        <p className="text-[11px] text-[#F5F5F0]/35">
                          {formatTonnes(r.weight_tonnes)} · {formatRelativeDate(r.calculated_at ?? r.created_at)}
                        </p>
                      </div>
                      <p className="text-[12px] font-semibold text-emerald-400">
                        {r.co2_avoided != null && Number(r.co2_avoided) > 0 ? '+' : ''}
                        {formatCO2(Number(r.co2_avoided))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Blockchain status */}
            <div className="rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#F5F5F0]">Blockchain Ledger</p>
                  <p className="text-[11px] text-[#F5F5F0]/40">Réseau Polygon · Contrat actif</p>
                </div>
                <div className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  invertTrend = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend?: number | null;
  color: 'emerald' | 'blue' | 'teal' | 'amber';
  invertTrend?: boolean;
}) {
  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    blue: { bg: 'bg-[#B8D4E3]/10', text: 'text-[#B8D4E3]' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-400' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  };
  const c = colorMap[color];

  const isPositive = trend != null ? (invertTrend ? trend < 0 : trend > 0) : null;

  return (
    <div className="rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] p-3.5">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${c.bg}`}>
        <Icon className={`h-4 w-4 ${c.text}`} />
      </div>
      <p className="text-[18px] font-bold text-[#F5F5F0] leading-tight">{value}</p>
      <div className="mt-1 flex items-center gap-1.5">
        <p className="text-[11px] text-[#F5F5F0]/40">{label}</p>
        {trend != null && (
          <span className={`flex items-center gap-0.5 text-[10px] font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            {formatPercent(Math.abs(trend), 1)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
