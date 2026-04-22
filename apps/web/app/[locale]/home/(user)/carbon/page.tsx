import Link from 'next/link';

import {
  ArrowRight,
  ClipboardCheck,
  Factory,
  Flame,
  Leaf,
  Link2,
  Zap,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { cn } from '@kit/ui/utils';

import {
  EnviroChartCard,
  EnviroDashboardSectionHeader,
  EnviroStatCard,
  EnviroStatCardGrid,
} from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
} from '~/components/enviro/enviro-card';

import { CarbonAvoidedChart } from './_components/carbon-avoided-chart';
import { CarbonByMaterialChart } from './_components/carbon-by-material-chart';
import { CarbonEquivalences } from './_components/carbon-equivalences';
import { CarbonExportButton } from './_components/carbon-export-button';
import { CarbonHeroMetrics } from './_components/carbon-hero-metrics';
import { CarbonScoreCard } from './_components/carbon-score-card';
import { CarbonTransactionsTable } from './_components/carbon-transactions-table';
import { CertificatesList } from './_components/certificates-list';

export const generateMetadata = async () => {
  const t = await getTranslations('carbon');

  return { title: t('title') };
};

interface CarbonRecord {
  id: string;
  created_at: string;
  material_category: string;
  weight_kg: number;
  co2_avoided: number;
  co2_transport: number;
  co2_net: number;
  listing_title?: string;
  blockchain_hash?: string;
}

const EMPTY_MONTHLY = [
  { month: '2026-01', co2_avoided: 0, co2_transport: 0, co2_net: 0 },
  { month: '2026-02', co2_avoided: 0, co2_transport: 0, co2_net: 0 },
  { month: '2026-03', co2_avoided: 0, co2_transport: 0, co2_net: 0 },
];
const EMPTY_MATERIAL: Array<{
  category: string;
  co2_avoided: number;
  weight: number;
}> = [];

async function CarbonPage() {
  const client = getSupabaseServerClient();
  const t = await getTranslations('carbon');
  const tDashboard = await getTranslations('dashboard');
  const tCommon = await getTranslations('common');

  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = client as any;

  const [carbonRes, certsRes, scoreRes] = await Promise.all([
    c
      .from('carbon_records')
      .select('*')
      .eq('account_id', userId)
      .order('created_at', { ascending: true }),
    c
      .from('traceability_certificates')
      .select('*')
      .eq('account_id', userId)
      .order('issued_at', { ascending: false }),
    c
      .from('circularity_scores')
      .select('*')
      .eq('account_id', userId)
      .order('computed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const records: CarbonRecord[] = (carbonRes.data ?? []) as CarbonRecord[];
  const certs = certsRes.data ?? [];
  const scoreData = scoreRes.data;
  const hasCarbonData = records.length > 0;

  const totalAvoided = hasCarbonData
    ? records.reduce((sum, r) => sum + (r.co2_avoided ?? 0), 0)
    : 0;
  const totalTransport = hasCarbonData
    ? records.reduce((sum, r) => sum + (r.co2_transport ?? 0), 0)
    : 0;
  const totalNet = hasCarbonData
    ? records.reduce((sum, r) => sum + (r.co2_net ?? 0), 0)
    : 0;
  const totalWeightKg = hasCarbonData
    ? records.reduce((sum, r) => sum + (r.weight_kg ?? 0), 0)
    : 0;
  const totalWeightTonnes = totalWeightKg / 1000;

  let monthlyData: Array<{
    month: string;
    co2_avoided: number;
    co2_transport: number;
    co2_net: number;
  }>;

  if (hasCarbonData) {
    const monthlyMap = new Map<
      string,
      { co2_avoided: number; co2_transport: number; co2_net: number }
    >();
    for (const r of records) {
      const month = (r.created_at ?? '').slice(0, 7);
      if (!month) continue;
      const existing = monthlyMap.get(month) ?? {
        co2_avoided: 0,
        co2_transport: 0,
        co2_net: 0,
      };
      monthlyMap.set(month, {
        co2_avoided: existing.co2_avoided + (r.co2_avoided ?? 0),
        co2_transport: existing.co2_transport + (r.co2_transport ?? 0),
        co2_net: existing.co2_net + (r.co2_net ?? 0),
      });
    }
    monthlyData = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));
  } else {
    monthlyData = EMPTY_MONTHLY;
  }

  let materialData: Array<{
    category: string;
    co2_avoided: number;
    weight: number;
  }>;

  if (hasCarbonData) {
    const materialMap = new Map<
      string,
      { co2_avoided: number; weight: number }
    >();
    for (const r of records) {
      const cat = r.material_category ?? 'Autre';
      const existing = materialMap.get(cat) ?? { co2_avoided: 0, weight: 0 };
      materialMap.set(cat, {
        co2_avoided: existing.co2_avoided + (r.co2_avoided ?? 0),
        weight: existing.weight + (r.weight_kg ?? 0),
      });
    }
    materialData = Array.from(materialMap.entries()).map(
      ([category, data]) => ({
        category,
        ...data,
      }),
    );
  } else {
    materialData = EMPTY_MATERIAL;
  }

  const recentTransactions = [...records]
    .reverse()
    .slice(0, 20)
    .map((r) => ({
      created_at: r.created_at,
      listing_title: r.listing_title ?? '-',
      material_category: r.material_category,
      weight_tonnes: (r.weight_kg ?? 0) / 1000,
      co2_avoided: r.co2_avoided ?? 0,
      co2_transport: r.co2_transport ?? 0,
      co2_net_benefit: r.co2_net ?? 0,
      blockchain_hash: r.blockchain_hash,
    }));

  const score = scoreData
    ? {
        total: (scoreData as Record<string, number>).total_score ?? 0,
        level: (scoreData as Record<string, string>).level ?? 'bronze',
        volume_score: (scoreData as Record<string, number>).volume_score ?? 0,
        diversity_score:
          (scoreData as Record<string, number>).diversity_score ?? 0,
        regularity_score:
          (scoreData as Record<string, number>).regularity_score ?? 0,
        co2_score: (scoreData as Record<string, number>).co2_score ?? 0,
        seniority_score:
          (scoreData as Record<string, number>).seniority_score ?? 0,
      }
    : null;

  // Mock scope data (will be real when ESG data entry is connected)
  const mockScope1 = 0;
  const mockScope2 = 0;
  const mockScope3 = 0;
  const mockTotal = mockScope1 + mockScope2 + mockScope3;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.carbon')}
        title={tDashboard('carbonTitle')}
        subtitle={tDashboard('carbonDesc')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <CarbonExportButton />
            <EnviroButton
              variant="primary"
              size="sm"
              magnetic
              render={(buttonProps) => (
                <Link {...buttonProps} href="/home/carbon/assessment">
                  <ClipboardCheck aria-hidden="true" className="h-4 w-4" />
                  {t('startAssessment')}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              )}
            />
          </div>
        }
      />

      <EnviroStatCardGrid cols={4}>
        <EnviroStatCard
          variant="cream"
          label={t('scope1')}
          value={mockScope1}
          fractionDigits={1}
          suffix=" t"
          subtitle={t('scope1Desc')}
          icon={<Flame aria-hidden="true" className="h-5 w-5" />}
          actionLabel={t('completeNow')}
          actionHref="/home/esg/data-entry"
        />
        <EnviroStatCard
          variant="cream"
          label={t('scope2')}
          value={mockScope2}
          fractionDigits={1}
          suffix=" t"
          subtitle={t('scope2Desc')}
          icon={<Zap aria-hidden="true" className="h-5 w-5" />}
          actionLabel={t('completeNow')}
          actionHref="/home/esg/data-entry"
        />
        <EnviroStatCard
          variant="cream"
          label={t('scope3')}
          value={mockScope3}
          fractionDigits={1}
          suffix=" t"
          subtitle={t('scope3Desc')}
          icon={<Link2 aria-hidden="true" className="h-5 w-5" />}
        />
        <EnviroStatCard
          variant="forest"
          label={t('totalEmissions')}
          value={mockTotal}
          fractionDigits={1}
          suffix=" t"
          subtitle={t('scopesAll')}
          icon={<Factory aria-hidden="true" className="h-5 w-5" />}
        />
      </EnviroStatCardGrid>

      <EnviroStatCard
        variant="lime"
        label={t('totalAvoided')}
        value={totalAvoided / 1000}
        fractionDigits={1}
        suffix=" t"
        subtitle={t('totalAvoidedDesc')}
        icon={<Leaf aria-hidden="true" className="h-5 w-5" />}
      />

      {hasCarbonData ? (
        <CarbonHeroMetrics
          co2Avoided={totalAvoided}
          co2Transport={totalTransport}
          co2Net={totalNet}
          weightTonnes={totalWeightTonnes}
          txCount={records.length}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EnviroChartCard
            tag={tCommon('routes.carbon')}
            title={t('chartTitle')}
            height={300}
          >
            <CarbonAvoidedChart data={monthlyData} />
          </EnviroChartCard>
        </div>
        <div>
          <EnviroChartCard
            tag={tCommon('routes.carbon')}
            title={t('byMaterial')}
            height={280}
          >
            <CarbonByMaterialChart data={materialData} />
          </EnviroChartCard>
        </div>
      </div>

      <ScopeProgressSection t={t} />

      <CarbonEquivalences co2Avoided={totalAvoided} />

      {score ? <CarbonScoreCard score={score} /> : null}

      {hasCarbonData ? (
        <CarbonTransactionsTable transactions={recentTransactions} />
      ) : null}

      <CertificatesList certificates={certs} />
    </div>
  );
}

function ScopeProgressSection({
  t,
}: {
  t: (key: string) => string;
}) {
  const scopes = [
    {
      key: 'scope1',
      name: 'Scope 1',
      labelKey: 'scope1Desc',
      progress: 0,
      status: 'partial' as const,
    },
    {
      key: 'scope2',
      name: 'Scope 2',
      labelKey: 'scope2Desc',
      progress: 0,
      status: 'partial' as const,
    },
    {
      key: 'scope3',
      name: 'Scope 3',
      labelKey: 'scope3Desc',
      progress: 0,
      status: 'auto' as const,
    },
  ];

  return (
    <EnviroCard variant="cream" hover="none" padding="md">
      <EnviroCardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
            {t('scopeProgress')}
          </h3>
          <EnviroButton
            variant="secondary"
            size="sm"
            render={(buttonProps) => (
              <Link {...buttonProps} href="/home/esg/data-entry">
                {t('completeNow')}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            )}
          />
        </div>
      </EnviroCardHeader>
      <EnviroCardBody className="flex flex-col gap-5 pt-5">
        {scopes.map((scope) => (
          <div key={scope.key} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[--color-enviro-forest-900]">
                  {scope.name}
                </span>
                <span className="text-xs text-[--color-enviro-forest-700]">
                  {t(scope.labelKey)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-[--radius-enviro-pill] px-2 py-0.5 text-[11px] font-semibold',
                    scope.status === 'auto'
                      ? 'bg-[--color-enviro-lime-100] text-[--color-enviro-lime-800]'
                      : 'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]',
                  )}
                >
                  {scope.status === 'auto'
                    ? t('autoFilled')
                    : t('toComplete')}
                </span>
                <span className="text-sm font-semibold tabular-nums text-[--color-enviro-forest-900]">
                  {scope.progress}%
                </span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-[--radius-enviro-pill] bg-[--color-enviro-cream-200]">
              <div
                className="h-full rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-500] transition-all duration-700"
                style={{ width: `${scope.progress}%` }}
              />
            </div>
          </div>
        ))}
      </EnviroCardBody>
    </EnviroCard>
  );
}

export default CarbonPage;
