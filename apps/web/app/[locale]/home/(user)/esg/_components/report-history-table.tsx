'use client';

import Link from 'next/link';

import { ChevronRight, Download, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import type { DemoData } from '~/lib/demo/demo-data';

function StatusBadge({ status }: { status: 'draft' | 'finalized' }) {
  const t = useTranslations('esg');
  if (status === 'finalized') {
    return (
      <Badge
        variant="outline"
        className="border-[#8FDAB5] bg-[#E6F7EF] text-[10px] text-[#008F5A] dark:border-[#008F5A] dark:bg-[#004428]/30 dark:text-[#8FDAB5]"
      >
        {t('reportStatusFinalized')}
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-[#8FDAB5] bg-[#E6F7EF] text-[10px] text-[#00A86B] dark:border-[#008F5A] dark:bg-[#00A86B]/30 dark:text-[#8FDAB5]"
    >
      {t('reportStatusDraft')}
    </Badge>
  );
}

export function ReportHistoryTable({
  reports,
}: {
  reports: DemoData['esg']['reportHistory'][number][];
}) {
  const t = useTranslations('esg');
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{t('reportsGenerated')}</h3>
            <p className="text-muted-foreground text-xs">
              {t('reportsGeneratedDesc')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            render={
              <Link href="/home/esg/reports">
                {t('reportsViewAll')}
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            }
            nativeButton={false}
          />
        </div>

        <div className="mt-4 space-y-2">
          {reports.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">
              {t('noReportGenerated')}
            </p>
          )}
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between rounded-lg border px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-muted-foreground h-4 w-4" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{report.period}</span>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    {report.format} — {report.totalEmissionsT} t CO2e —{' '}
                    {report.blockchainProofs} {t('reportProofs')}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {report.status === 'finalized' && (
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
