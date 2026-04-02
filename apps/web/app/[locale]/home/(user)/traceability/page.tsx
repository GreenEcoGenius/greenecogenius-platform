import { getTranslations } from 'next-intl/server';

import { PageBody } from '@kit/ui/page';

import { AITraceabilityAlerts } from '~/components/ai/traceability/ai-traceability-alerts';
import {
  getAllLots,
  getMaterialBreakdown,
  getMonthlyData,
  getRecentActivity,
  getTotalStats,
} from '~/lib/mock/traceability-mock-data';

import { SectionFooterImage } from '../_components/section-footer-image';
import { EcosystemBanner } from './_components/ecosystem-banner';
import { TraceabilityActivityFeed } from './_components/traceability-activity-feed';
import { TraceabilityEquivalences } from './_components/traceability-equivalences';
import { TraceabilityEvolutionChart } from './_components/traceability-evolution-chart';
import { TraceabilityKpiCards } from './_components/traceability-kpi-cards';
import { TraceabilityMaterialChart } from './_components/traceability-material-chart';
import { TraceabilityTable } from './_components/traceability-table';

export const generateMetadata = async () => {
  const t = await getTranslations('blockchain');

  return { title: t('title') };
};

async function TraceabilityPage() {
  const stats = getTotalStats();
  const monthlyData = getMonthlyData();
  const materialBreakdown = getMaterialBreakdown();
  const lots = getAllLots();
  const activities = getRecentActivity(5);

  // Derive KPI values from real mock stats
  const lotsThisMonth =
    monthlyData.length > 0
      ? monthlyData[monthlyData.length - 1]!.lotsTracked
      : 0;
  const prevMonthLots =
    monthlyData.length > 1
      ? monthlyData[monthlyData.length - 2]!.lotsTracked
      : lotsThisMonth;
  const lotsTrend =
    prevMonthLots > 0
      ? Math.round(((lotsThisMonth - prevMonthLots) / prevMonthLots) * 1000) /
        10
      : 0;

  const tonnesThisMonth =
    monthlyData.length > 0
      ? monthlyData[monthlyData.length - 1]!.tonnesRecycled
      : 0;
  const prevMonthTonnes =
    monthlyData.length > 1
      ? monthlyData[monthlyData.length - 2]!.tonnesRecycled
      : tonnesThisMonth;
  const tonnesTrend =
    prevMonthTonnes > 0
      ? Math.round(
          ((tonnesThisMonth - prevMonthTonnes) / prevMonthTonnes) * 1000,
        ) / 10
      : 0;

  const co2AvoidedTonnes =
    Math.round((stats.totalCo2AvoidedKg / 1000) * 10) / 10;
  const totalTonnes = Math.round((stats.totalWeightKg / 1000) * 10) / 10;

  const certifiedCount = stats.certifiedLots;
  const certificatesThisMonth = Math.round(certifiedCount * 0.13);
  const certificatesTrend = 12.0;

  const transactionsThisMonth = lotsThisMonth;
  const blockchainHashes = stats.blockchainRecorded;
  const esgAutoPercent = 78;

  // Sort lots by date descending, take 10
  const recentLots = [...lots]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  return (
    <PageBody>
      <div className="space-y-6">
        {/* Ecosystem Banner */}
        <EcosystemBanner
          transactionsThisMonth={transactionsThisMonth}
          co2AvoidedKg={stats.totalCo2AvoidedKg}
          esgAutoPercent={esgAutoPercent}
          blockchainHashes={blockchainHashes}
        />

        {/* AI Smart Alerts */}
        <AITraceabilityAlerts />

        {/* KPI Cards */}
        <TraceabilityKpiCards
          totalLots={stats.totalLots}
          lotsThisMonth={lotsThisMonth}
          lotsTrend={lotsTrend}
          co2AvoidedTonnes={co2AvoidedTonnes}
          totalTonnes={totalTonnes}
          tonnesThisMonth={tonnesThisMonth}
          tonnesTrend={tonnesTrend}
          certificates={certifiedCount}
          certificatesThisMonth={certificatesThisMonth}
          certificatesTrend={certificatesTrend}
        />

        {/* Charts row: evolution (2/3) + material donut (1/3) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TraceabilityEvolutionChart data={monthlyData} />
          </div>
          <div>
            <TraceabilityMaterialChart data={materialBreakdown} />
          </div>
        </div>

        {/* Equivalences */}
        <TraceabilityEquivalences co2AvoidedKg={stats.totalCo2AvoidedKg} />

        {/* Recent transactions table */}
        <TraceabilityTable lots={recentLots} />

        {/* Activity feed */}
        <TraceabilityActivityFeed activities={activities} />

        <SectionFooterImage
          src="/images/normes/traceability-supply-chain.png"
          alt="Tracabilite"
        />
      </div>
    </PageBody>
  );
}

export default TraceabilityPage;
