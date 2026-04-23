import Link from 'next/link';

import { Download, FileText } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  EnviroDashboardSectionHeader,
  EnviroEmptyState,
} from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
} from '~/components/enviro/enviro-card';

export const generateMetadata = async () => {
  const t = await getTranslations('esg');

  return { title: t('reportsTitle') };
};

interface ESGReport {
  id: string;
  reporting_year: number;
  report_type: string;
  total_emissions: number;
  status: string;
  file_url?: string;
  created_at: string;
}

async function ESGReportsPage() {
  const client = getSupabaseServerClient();
  const t = await getTranslations('esg');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();

  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reports } = await (client as any)
    .from('esg_reports')
    .select('*')
    .eq('account_id', userId)
    .order('created_at', { ascending: false });

  const reportList: ESGReport[] = (reports ?? []) as ESGReport[];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.esg')}
        title={t('reportsTitle')}
      />

      {reportList.length === 0 ? (
        <EnviroEmptyState
          icon={<FileText aria-hidden="true" className="h-7 w-7" />}
          title={t('noReports')}
          actions={
            <EnviroButton
              variant="primary"
              size="sm"
              magnetic
              render={(buttonProps) => (
                <Link {...buttonProps} href="/home/esg/data-entry">
                  {t('dataEntry')}
                </Link>
              )}
            />
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reportList.map((report) => (
            <ReportRow
              key={report.id}
              report={report}
              t={t}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportRow({
  report,
  t,
  locale,
}: {
  report: ESGReport;
  t: (key: string) => string;
  locale: string;
}) {
  return (
    <EnviroCard variant="cream" hover="lift" padding="md">
      <EnviroCardBody className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-[--radius-enviro-md] bg-[--color-enviro-lime-100]">
            <FileText
              aria-hidden="true"
              className="h-5 w-5 text-[--color-enviro-lime-700]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
                {t('reportYear')}: {report.reporting_year}
              </span>
              <span className="inline-flex items-center rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] px-2 py-0.5 text-[11px] font-semibold text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
                {report.report_type}
              </span>
            </div>
            <p className="text-xs text-[--color-enviro-forest-700]">
              {t('reportEmissions')}:{' '}
              <span className="tabular-nums font-medium text-[--color-enviro-forest-900]">
                {report.total_emissions != null
                  ? report.total_emissions.toFixed(0)
                  : '-'}{' '}
                kg CO2e
              </span>
            </p>
            <p className="text-[11px] text-[--color-enviro-forest-700]/70">
              {new Date(report.created_at).toLocaleDateString(locale)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={
              report.status === 'ready'
                ? 'inline-flex items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-100] px-2.5 py-0.5 text-[11px] font-semibold text-[--color-enviro-lime-800]'
                : 'inline-flex items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-cream-100] px-2.5 py-0.5 text-[11px] font-semibold text-[--color-enviro-forest-700]'
            }
          >
            {report.status === 'ready'
              ? t('reportReady')
              : t('reportPending')}
          </span>

          {report.file_url ? (
            <EnviroButton
              variant="secondary"
              size="sm"
              render={(buttonProps) => (
                <a
                  {...buttonProps}
                  href={report.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  {t('downloadReport')}
                </a>
              )}
            />
          ) : null}
        </div>
      </EnviroCardBody>
    </EnviroCard>
  );
}

export default ESGReportsPage;
