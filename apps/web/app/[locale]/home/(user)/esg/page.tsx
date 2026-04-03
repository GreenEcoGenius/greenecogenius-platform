import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageBody } from '@kit/ui/page';

import { DEMO_DATA } from '~/lib/demo/demo-data';

import { SectionFooterImage } from '../_components/section-footer-image';
import { AiInsightsPanel } from './_components/ai-insights-panel';
import { BenchmarkCard } from './_components/benchmark-card';
import { CsrdComplianceChart } from './_components/csrd-compliance-chart';
import { EsgKpiCards } from './_components/esg-kpi-cards';
import { ESGReportAccordion } from './_components/esg-report-accordion';
import { EsgStatusHeader } from './_components/esg-status-header';
import { FormatSelectorWrapper } from './_components/format-selector-wrapper';
import { ReportHistoryTable } from './_components/report-history-table';

export const generateMetadata = async () => {
  const t = await getTranslations('esg');

  return { title: t('title') };
};

async function ESGPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  const kpi = { totalEmissionsT: 0, co2AvoidedT: 0, autoFilledFields: 0, totalFields: 48, csrdCompliancePct: 0, blockchainProofs: 0 };
  const remaining = kpi.totalFields - kpi.autoFilledFields;
  const completionPct = Math.round(
    (kpi.autoFilledFields / kpi.totalFields) * 100,
  );

  return (
    <PageBody>
      <div className="space-y-6">
        {/* Header with progress */}
        <EsgStatusHeader
          completionPct={completionPct}
          autoFilled={kpi.autoFilledFields}
          totalFields={kpi.totalFields}
          remaining={remaining}
        />

        {/* KPI cards */}
        <EsgKpiCards data={kpi} />

        {/* Accordion + CSRD chart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ESGReportAccordion sections={DEMO_DATA.esg.sections} />
          </div>
          <div>
            <CsrdComplianceChart indicators={DEMO_DATA.esg.csrdIndicators} />
          </div>
        </div>

        {/* Format selector */}
        <FormatSelectorWrapper />

        {/* Report history + AI insights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ReportHistoryTable reports={DEMO_DATA.esg.reportHistory} />
          <AiInsightsPanel insights={DEMO_DATA.esg.aiInsights} />
        </div>

        {/* Benchmark */}
        <BenchmarkCard />

        <SectionFooterImage
          src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-db261b47-d946-4d81-993d-cc45db4b6cb0.png"
          alt="Reporting ESG"
        />
      </div>
    </PageBody>
  );
}

export default ESGPage;
