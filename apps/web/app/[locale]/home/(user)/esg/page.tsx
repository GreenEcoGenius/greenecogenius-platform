import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageBody } from '@kit/ui/page';

import { SectionFooterImage } from '../_components/section-footer-image';
import { AiInsightsPanel } from './_components/ai-insights-panel';
import { BenchmarkCard } from './_components/benchmark-card';
import { CsrdComplianceChart } from './_components/csrd-compliance-chart';
import { EsgKpiCards } from './_components/esg-kpi-cards';
import { ESGReportAccordion } from './_components/esg-report-accordion';
import { EsgStatusHeader } from './_components/esg-status-header';
import { FormatSelectorWrapper } from './_components/format-selector-wrapper';
import { ReportHistoryTable } from './_components/report-history-table';
import {
  MOCK_AI_INSIGHTS,
  MOCK_CSRD_INDICATORS,
  MOCK_KPI,
  MOCK_REPORT_HISTORY,
  MOCK_SECTIONS,
} from './_lib/esg-mock-data';

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

  const kpi = MOCK_KPI;
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
            <ESGReportAccordion sections={MOCK_SECTIONS} />
          </div>
          <div>
            <CsrdComplianceChart indicators={MOCK_CSRD_INDICATORS} />
          </div>
        </div>

        {/* Format selector */}
        <FormatSelectorWrapper />

        {/* Report history + AI insights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ReportHistoryTable reports={MOCK_REPORT_HISTORY} />
          <AiInsightsPanel insights={MOCK_AI_INSIGHTS} />
        </div>

        {/* Benchmark */}
        <BenchmarkCard />

        <SectionFooterImage
          src="/images/normes/reporting-esg-presentation.png"
          alt="Reporting ESG"
        />
      </div>
    </PageBody>
  );
}

export default ESGPage;
