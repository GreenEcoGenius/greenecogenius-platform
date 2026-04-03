import Link from 'next/link';

import {
  ArrowRight,
  Factory,
  Flame,
  Leaf,
  Link2,
  Shield,
  Zap,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { SectionFooterImage } from '../_components/section-footer-image';
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
  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  // Fetch carbon records
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: carbonRecords } = await (client as any)
    .from('carbon_records')
    .select('*')
    .eq('account_id', userId)
    .order('created_at', { ascending: true });

  // Fetch traceability certificates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: certificates } = await (client as any)
    .from('traceability_certificates')
    .select('*')
    .eq('account_id', userId)
    .order('issued_at', { ascending: false });

  // Fetch circularity score
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: scoreData } = await (client as any)
    .from('circularity_scores')
    .select('*')
    .eq('account_id', userId)
    .order('computed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const records: CarbonRecord[] = (carbonRecords ?? []) as CarbonRecord[];
  const certs = certificates ?? [];
  const hasCarbonData = records.length > 0;

  // Aggregate totals (use real data or mock fallbacks)
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

  // Aggregate by month for chart
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

  // Aggregate by material for donut chart
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

  // Recent transactions for table (last 20)
  const recentTransactions = [...records]
    .reverse()
    .slice(0, 20)
    .map((r) => ({
      created_at: r.created_at,
      listing_title: r.listing_title ?? '\u2014',
      material_category: r.material_category,
      weight_tonnes: (r.weight_kg ?? 0) / 1000,
      co2_avoided: r.co2_avoided ?? 0,
      co2_transport: r.co2_transport ?? 0,
      co2_net_benefit: r.co2_net ?? 0,
      blockchain_hash: r.blockchain_hash,
    }));

  // Default score
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
    <PageBody>
      <div className="space-y-8">
        {/* Section 1 - Banner */}
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  <Trans i18nKey="carbon:bannerTitle" />
                </h2>
                <p className="mt-1 text-emerald-100">
                  <Trans i18nKey="carbon:bannerSubtitle" />
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-200" />
                <Badge className="border-emerald-400 bg-emerald-500/30 text-white">
                  <Trans i18nKey="carbon:bannerBlockchain" />
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 - 5 KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-teal-50 p-2 dark:bg-teal-950/30">
                  <Flame className="h-5 w-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">
                    <Trans i18nKey="carbon:scope1" />
                  </p>
                  <p className="text-2xl font-bold text-teal-600">
                    {mockScope1}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                      t
                    </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <Trans i18nKey="carbon:scope1Desc" />
                  </p>
                </div>
              </div>
              <div className="mt-3 border-t pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-0 text-xs"
                  render={
                    <Link href="/home/esg/data-entry">
                      <Trans i18nKey="carbon:completeNow" />
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  }
                  nativeButton={false}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-950/30">
                  <Zap className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">
                    <Trans i18nKey="carbon:scope2" />
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {mockScope2}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                      t
                    </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <Trans i18nKey="carbon:scope2Desc" />
                  </p>
                </div>
              </div>
              <div className="mt-3 border-t pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-0 text-xs"
                  render={
                    <Link href="/home/esg/data-entry">
                      <Trans i18nKey="carbon:completeNow" />
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  }
                  nativeButton={false}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200 dark:border-teal-800">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950/30">
                  <Link2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">
                    <Trans i18nKey="carbon:scope3" />
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockScope3}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                      t
                    </span>
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-muted-foreground text-xs">
                      <Trans i18nKey="carbon:scope3Desc" />
                    </p>
                    <Badge
                      variant="outline"
                      className="border-teal-300 text-[10px] text-green-600"
                    >
                      73% <Trans i18nKey="carbon:scope3Auto" />
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-3 border-t pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-0 text-xs"
                  render={
                    <Link href="/home/traceability">
                      <Trans i18nKey="carbon:scope3Desc" />
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  }
                  nativeButton={false}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-300 dark:border-gray-600">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <Factory className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">
                    <Trans i18nKey="carbon:totalEmissions" />
                  </p>
                  <p className="text-2xl font-bold">
                    {mockTotal.toFixed(1)}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                      t
                    </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Scope 1 + 2 + 3
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">
                    <Trans i18nKey="carbon:totalAvoided" />
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {(totalAvoided / 1000).toFixed(1)}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                      t
                    </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <Trans i18nKey="carbon:totalAvoidedDesc" />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3 - Hero metrics (existing) */}
        {hasCarbonData && (
          <CarbonHeroMetrics
            co2Avoided={totalAvoided}
            co2Transport={totalTransport}
            co2Net={totalNet}
            weightTonnes={totalWeightTonnes}
            txCount={records.length}
          />
        )}

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CarbonAvoidedChart data={monthlyData} />
          </div>
          <div>
            <CarbonByMaterialChart data={materialData} />
          </div>
        </div>

        {/* Section 4 - Scope Progress */}
        <ScopeProgressSection />

        {/* Section 5 - Equivalences */}
        <CarbonEquivalences co2Avoided={totalAvoided} />

        {/* Score card */}
        {score && <CarbonScoreCard score={score} />}

        {/* Transactions table */}
        {hasCarbonData && (
          <CarbonTransactionsTable transactions={recentTransactions} />
        )}

        {/* Section 6 - Certificates */}
        <CertificatesList certificates={certs} />

        <SectionFooterImage
          src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-5078cbe2-55c7-4019-bf5f-d42644debf1b.png"
          alt="Impact Carbone"
        />
      </div>
    </PageBody>
  );
}

function ScopeProgressSection() {
  const scopes = [
    {
      name: 'Scope 1',
      labelKey: 'carbon:scope1Desc',
      progress: 0,
      status: 'partial' as const,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-100 dark:bg-teal-950/30',
    },
    {
      name: 'Scope 2',
      labelKey: 'carbon:scope2Desc',
      progress: 0,
      status: 'partial' as const,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-950/30',
    },
    {
      name: 'Scope 3',
      labelKey: 'carbon:scope3Desc',
      progress: 0,
      status: 'auto' as const,
      color: 'bg-green-500',
      bgColor: 'bg-green-100 dark:bg-green-950/30',
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            <Trans i18nKey="carbon:scopeProgress" />
          </h3>
          <Button
            size="sm"
            render={
              <Link href="/home/esg/data-entry">
                <Trans i18nKey="carbon:completeNow" />
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            }
            nativeButton={false}
          />
        </div>

        <div className="space-y-5">
          {scopes.map((scope) => (
            <div key={scope.name}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{scope.name}</span>
                  <span className="text-muted-foreground text-xs">
                    <Trans i18nKey={scope.labelKey} />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {scope.status === 'auto' ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-300 text-xs text-emerald-600"
                    >
                      <Trans i18nKey="carbon:autoFilled" />
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-teal-300 text-xs text-teal-600"
                    >
                      <Trans i18nKey="carbon:toComplete" />
                    </Badge>
                  )}
                  <span className="text-sm font-semibold">
                    {scope.progress}%
                  </span>
                </div>
              </div>
              <div className="bg-muted h-2.5 overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full ${scope.color} transition-all duration-700`}
                  style={{ width: `${scope.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CarbonPage;
