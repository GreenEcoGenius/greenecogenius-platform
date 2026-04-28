'use client';

import { useTranslations } from 'next-intl';
import { Leaf, TrendingUp, Recycle, Activity, AlertCircle } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { useAuth } from '~/hooks/use-auth';
import { useDashboardKpis } from '~/hooks/use-dashboard-kpis';
import { formatCO2, formatTonnes, formatNumber, formatRelativeDate } from '~/lib/format';

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  color,
  loading,
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
  delta?: string;
  color: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] p-4">
      <Icon className="mb-3 h-5 w-5" style={{ color }} />
      {loading ? (
        <div className="h-8 w-20 animate-pulse rounded bg-[#F5F5F0]/10" />
      ) : (
        <div className="text-2xl font-bold text-[#F5F5F0]">{value}</div>
      )}
      <div className="mt-0.5 flex items-center justify-between">
        <span className="text-xs text-[#F5F5F0]/60">{label}</span>
        {delta && <span className="text-xs font-medium text-[#B8D4E3]">{delta}</span>}
      </div>
    </div>
  );
}

function HomeContent() {
  const t = useTranslations('home');
  const { user } = useAuth();
  const { data, loading, error } = useDashboardKpis();

  const k = data?.kpis;
  const records = data?.recentRecords ?? [];

  return (
    <AppShell title={t('greeting')} subtitle={user?.email}>
      <div className="space-y-6">
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-400/5 p-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <div className="text-xs text-red-400">
              Impossible de charger les données. Vérifie ta connexion.
            </div>
          </div>
        )}

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            {t('overview')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Leaf}
              label={t('co2Saved')}
              value={formatCO2(k?.total_avoided_kg)}
              color="#B8D4E3"
              loading={loading}
            />
            <StatCard
              icon={TrendingUp}
              label="Émissions nettes"
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
              label="Transactions"
              value={formatNumber(k?.transactions_count)}
              color="#F5F5F0"
              loading={loading}
            />
          </div>
          {k?.period_start && k?.period_end && !loading && (
            <p className="mt-3 px-1 text-[10px] text-[#F5F5F0]/40">
              Période :{' '}
              {new Date(k.period_start).toLocaleDateString('fr-FR')} →{' '}
              {new Date(k.period_end).toLocaleDateString('fr-FR')}
            </p>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            Activité récente
          </h2>
          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03]"
                />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] p-5 text-center">
              <p className="text-sm text-[#F5F5F0]/60">
                Aucune transaction carbone enregistrée pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {records.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-[#F5F5F0]">
                      {r.material_category}
                      {r.material_subcategory ? ` · ${r.material_subcategory}` : ''}
                    </div>
                    <div className="text-xs text-[#F5F5F0]/60">
                      {formatTonnes(r.weight_tonnes)} ·{' '}
                      {formatRelativeDate(r.calculated_at ?? r.created_at)}
                    </div>
                  </div>
                  <div className="ml-3 text-right">
                    <div className="text-xs font-medium text-[#B8D4E3]">
                      {r.co2_avoided != null && r.co2_avoided > 0 ? '+' : ''}
                      {formatCO2(r.co2_avoided)}
                    </div>
                    <div className="text-[10px] text-[#F5F5F0]/40">CO₂ évité</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            {t('modules')}
          </h2>
          <div className="space-y-2">
            {[
              { name: 'Circular Economy', desc: 'Marketplace + traçabilité' },
              { name: 'Blockchain Ledger', desc: 'Polygon network' },
              { name: 'ESG Reporting', desc: 'CSRD compliant' },
            ].map((mod) => (
              <div
                key={mod.name}
                className="flex items-center justify-between rounded-xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] px-4 py-3"
              >
                <div>
                  <div className="text-sm font-semibold text-[#F5F5F0]">{mod.name}</div>
                  <div className="text-xs text-[#F5F5F0]/60">{mod.desc}</div>
                </div>
                <div className="h-2 w-2 rounded-full bg-[#B8D4E3]" />
              </div>
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
