import Link from 'next/link';

import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

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

  // Aggregate totals
  const totalAvoided = records.reduce((sum, r) => sum + (r.co2_avoided ?? 0), 0);
  const totalTransport = records.reduce((sum, r) => sum + (r.co2_transport ?? 0), 0);
  const totalNet = records.reduce((sum, r) => sum + (r.co2_net ?? 0), 0);
  const totalWeightKg = records.reduce((sum, r) => sum + (r.weight_kg ?? 0), 0);
  const totalWeightTonnes = totalWeightKg / 1000;

  // Aggregate by month for chart
  const monthlyMap = new Map<string, { co2_avoided: number; co2_transport: number; co2_net: number }>();
  for (const r of records) {
    const month = (r.created_at ?? '').slice(0, 7); // "2026-01"
    if (!month) continue;
    const existing = monthlyMap.get(month) ?? { co2_avoided: 0, co2_transport: 0, co2_net: 0 };
    monthlyMap.set(month, {
      co2_avoided: existing.co2_avoided + (r.co2_avoided ?? 0),
      co2_transport: existing.co2_transport + (r.co2_transport ?? 0),
      co2_net: existing.co2_net + (r.co2_net ?? 0),
    });
  }
  const monthlyData = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));

  // Aggregate by material for donut chart
  const materialMap = new Map<string, { co2_avoided: number; weight: number }>();
  for (const r of records) {
    const cat = r.material_category ?? 'Autre';
    const existing = materialMap.get(cat) ?? { co2_avoided: 0, weight: 0 };
    materialMap.set(cat, {
      co2_avoided: existing.co2_avoided + (r.co2_avoided ?? 0),
      weight: existing.weight + (r.weight_kg ?? 0),
    });
  }
  const materialData = Array.from(materialMap.entries()).map(([category, data]) => ({
    category,
    ...data,
  }));

  // Recent transactions for table (last 20)
  const recentTransactions = [...records]
    .reverse()
    .slice(0, 20)
    .map((r) => ({
      created_at: r.created_at,
      listing_title: r.listing_title ?? '—',
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
        diversity_score: (scoreData as Record<string, number>).diversity_score ?? 0,
        regularity_score: (scoreData as Record<string, number>).regularity_score ?? 0,
        co2_score: (scoreData as Record<string, number>).co2_score ?? 0,
        seniority_score: (scoreData as Record<string, number>).seniority_score ?? 0,
      }
    : null;

  const hasCarbonData = records.length > 0;

  return (
    <PageBody>
      <PageHeader description="">
        <div className="flex items-center justify-between">
          <Heading level={3}>
            <Trans i18nKey="carbon:heroTitle" />
          </Heading>
          {hasCarbonData && <CarbonExportButton />}
        </div>
      </PageHeader>

      {hasCarbonData ? (
        <div className="space-y-8">
          {/* Hero metrics */}
          <CarbonHeroMetrics
            co2Avoided={totalAvoided}
            co2Transport={totalTransport}
            co2Net={totalNet}
            weightTonnes={totalWeightTonnes}
            txCount={records.length}
          />

          {/* Charts row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CarbonAvoidedChart data={monthlyData} />
            </div>
            <div>
              <CarbonByMaterialChart data={materialData} />
            </div>
          </div>

          {/* Equivalences */}
          <CarbonEquivalences co2Avoided={totalAvoided} />

          {/* Score card */}
          {score && <CarbonScoreCard score={score} />}

          {/* Transactions table */}
          <CarbonTransactionsTable transactions={recentTransactions} />

          {/* Certificates */}
          <CertificatesList certificates={certs} />
        </div>
      ) : (
        <EmptyState />
      )}
    </PageBody>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="mb-4 text-6xl" role="img">
        {'\u{1F33F}'}
      </span>
      <h3 className="mb-2 text-xl font-semibold">
        <Trans i18nKey="carbon:emptyTitle" />
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md text-sm">
        <Trans i18nKey="carbon:emptyDesc" />
      </p>
      <div className="flex gap-3">
        <Button
          render={
            <Link href="/home/publish">
              <Trans i18nKey="carbon:emptyPublish" />
            </Link>
          }
          nativeButton={false}
        />
        <Button
          variant="outline"
          render={
            <Link href="/home/marketplace">
              <Trans i18nKey="carbon:emptyExplore" />
            </Link>
          }
          nativeButton={false}
        />
      </div>
    </div>
  );
}

export default CarbonPage;
