'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Leaf,
  TrendingUp,
  Recycle,
  Activity,
  ShoppingBag,
  QrCode,
  BarChart3,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';
import { useDashboardKpis } from '~/hooks/use-dashboard-kpis';
import { useCarbonRecords } from '~/hooks/use-carbon-records';
import { formatCO2, formatTonnes, formatNumber, formatRelativeDate } from '~/lib/format';

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  loading,
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
  trend?: string;
  color: string;
  loading: boolean;
}) {
  return (
    <div className="glass-card rounded-2xl p-3.5">
      <div className="flex items-start justify-between">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        {trend && !loading && (
          <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-400">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        {loading ? (
          <div className="h-5 w-16 animate-pulse rounded-md bg-[#F5F5F0]/10" />
        ) : (
          <p className="text-lg font-bold text-[#F5F5F0] leading-none">{value}</p>
        )}
        <p className="mt-1 text-[11px] text-[#F5F5F0]/50">{label}</p>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
  color,
}: {
  icon: typeof ShoppingBag;
  label: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 py-2 transition-transform active:scale-95"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <span className="text-[10px] font-medium text-[#F5F5F0]/70 text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}

function HomeContent() {
  const t = useTranslations('home');
  const { kpis: k, loading } = useDashboardKpis();
  const { records } = useCarbonRecords();
  const [email, setEmail] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? '');
      const name = user?.user_metadata?.display_name || user?.email?.split('@')[0] || '';
      setDisplayName(name.charAt(0).toUpperCase() + name.slice(1));
    });
  }, []);

  const recentRecords = records.slice(0, 3);

  return (
    <AppShell title="" logoUrl="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/015826bb-9659-4c7f-8823-66508eccd9b4.png">
      <div className="space-y-5 pb-4">
        {/* ── Greeting Card ── */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0f3d28] to-[#0A2F1F] border border-[#F5F5F0]/[0.06] p-4">
          <p className="text-[22px] font-bold text-[#F5F5F0]">
            {displayName ? `${t('greeting')}, ${displayName}` : t('greeting')}
          </p>
          <p className="mt-0.5 text-[12px] text-[#F5F5F0]/50">
            {t('welcomeSubtitle')}
          </p>
        </div>

        {/* ── KPI Grid ── */}
        <section>
          <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
            {t('overview')}
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard
              icon={Leaf}
              label={t('co2Saved')}
              value={formatCO2(k?.co2_avoided_kg)}
              color="#6EE7B7"
              loading={loading}
            />
            <StatCard
              icon={TrendingUp}
              label={t("netEmissions")}
              value={formatCO2(k?.net_emissions_kg)}
              color="#F5F5F0"
              loading={loading}
            />
            <StatCard
              icon={Recycle}
              label={t('recycling')}
              value={formatTonnes(k?.tonnes_recycled)}
              color="#B8D4E3"
              loading={loading}
            />
            <StatCard
              icon={Activity}
              label={t("transactions")}
              value={formatNumber(k?.transactions_count)}
              color="#F5F5F0"
              loading={loading}
            />
          </div>
        </section>

        {/* ── Quick Actions ── */}
        <section>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
            {t("quickActions")}
          </h2>
          <div className="grid grid-cols-4 gap-1">
            <QuickAction icon={ShoppingBag} label={t("marketplaceLabel")} href="/marketplace" color="#B8D4E3" />
            <QuickAction icon={QrCode} label="Scanner" href="/traceability/scan" color="#6EE7B7" />
            <QuickAction icon={BarChart3} label="Bilan ESG" href="/carbon/esg" color="#F59E0B" />
            <QuickAction icon={Sparkles} label={t("geniusLabel")} href="/genius" color="#A78BFA" />
          </div>
        </section>

        {/* ── Recent Activity ── */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              Activité récente
            </h2>
            {recentRecords.length > 0 && (
              <Link href="/carbon/records" className="text-[11px] text-[#B8D4E3] flex items-center gap-0.5">
                Tout voir <ChevronRight className="h-3 w-3" />
              </Link>
            )}
          </div>
          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl glass-card"
                />
              ))}
            </div>
          ) : recentRecords.length === 0 ? (
            <div className="glass-card rounded-2xl p-5 text-center">
              <Activity className="mx-auto mb-2 h-8 w-8 text-[#F5F5F0]/20" />
              <p className="text-[13px] text-[#F5F5F0]/50">
                {t("noActivity")}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {recentRecords.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl glass-card px-3.5 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[#F5F5F0]">
                      {r.material_category}
                      {r.material_subcategory ? ` · ${r.material_subcategory}` : ''}
                    </p>
                    <p className="text-[11px] text-[#F5F5F0]/45">
                      {formatTonnes(r.weight_tonnes)} · {formatRelativeDate(r.calculated_at ?? r.created_at)}
                    </p>
                  </div>
                  <div className="ml-3 text-right">
                    <p className="text-[12px] font-semibold text-emerald-400">
                      {r.co2_avoided != null && r.co2_avoided > 0 ? '+' : ''}
                      {formatCO2(r.co2_avoided)}
                    </p>
                    <p className="text-[9px] text-[#F5F5F0]/35">CO₂ évité</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Active Modules ── */}
        <section>
          <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
            {t('modules')}
          </h2>
          <div className="space-y-1.5">
            {[
              {
                name: t('circularEconomy'),
                desc: t('circularEconomyDesc'),
                icon: Recycle,
                color: '#6EE7B7',
                href: '/marketplace',
              },
              {
                name: 'Blockchain Ledger',
                desc: 'Polygon network',
                icon: QrCode,
                color: '#B8D4E3',
                href: '/traceability',
              },
              {
                name: t('esgReporting'),
                desc: 'CSRD compliant',
                icon: BarChart3,
                color: '#F59E0B',
                href: '/carbon/esg',
              },
            ].map((mod) => (
              <Link
                key={mod.name}
                href={mod.href}
                className="flex items-center gap-3 rounded-xl glass-card px-3.5 py-3 active:bg-[#F5F5F0]/[0.06] transition-colors"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${mod.color}12` }}
                >
                  <mod.icon className="h-4 w-4" style={{ color: mod.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#F5F5F0]">{mod.name}</p>
                  <p className="text-[11px] text-[#F5F5F0]/45">{mod.desc}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <ChevronRight className="h-4 w-4 text-[#F5F5F0]/25" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
