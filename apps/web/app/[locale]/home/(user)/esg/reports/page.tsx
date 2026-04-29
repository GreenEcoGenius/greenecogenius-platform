import Link from 'next/link';

import { Download, FileText } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

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
  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  const { data: reports } = await client
    .from('esg_reports')
    .select('*')
    .eq('account_id', userId)
    .order('created_at', { ascending: false });

  const reportList: ESGReport[] = (reports ?? []) as ESGReport[];

  return (
    <PageBody>
      {reportList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="bg-muted rounded-full p-4">
              <FileText className="text-[#B8D4E3] h-8 w-8" />
            </div>
            <p className="text-[#B8D4E3] max-w-md text-sm">
              <Trans i18nKey="esg:noReports" />
            </p>
            <Button
              render={
                <Link href="/home/esg/data-entry">
                  <Trans i18nKey="esg:dataEntry" />
                </Link>
              }
              nativeButton={false}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reportList.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </PageBody>
  );
}

function ReportCard({ report }: { report: ESGReport }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-[#1A5C3E] p-3 dark:bg-[#004428]/30">
            <FileText className="h-6 w-6 text-[#00A86B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                <Trans i18nKey="esg:reportYear" />: {report.reporting_year}
              </span>
              <Badge variant={'outline'}>{report.report_type}</Badge>
            </div>
            <div className="text-[#B8D4E3] mt-1 text-sm">
              <Trans i18nKey="esg:reportEmissions" />:{' '}
              {report.total_emissions?.toFixed(0) ?? '—'} kg CO2e
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={report.status === 'ready' ? 'default' : 'outline'}>
            {report.status === 'ready' ? (
              <Trans i18nKey="esg:reportReady" />
            ) : (
              <Trans i18nKey="esg:reportPending" />
            )}
          </Badge>

          {report.file_url && (
            <Button
              variant="outline"
              size="sm"
              render={
                <a
                  href={report.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-1 h-4 w-4" />
                  <Trans i18nKey="esg:downloadReport" />
                </a>
              }
              nativeButton={false}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ESGReportsPage;
