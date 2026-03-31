'use client';

import Link from 'next/link';

import { ChevronRight, Download, FileText } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import type { ReportHistoryItem } from '../_lib/esg-mock-data';

function StatusBadge({ status }: { status: 'draft' | 'finalized' }) {
  if (status === 'finalized') {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
      >
        Finalise
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-amber-200 bg-amber-50 text-[10px] text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
    >
      Brouillon
    </Badge>
  );
}

export function ReportHistoryTable({
  reports,
}: {
  reports: ReportHistoryItem[];
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Rapports generes</h3>
            <p className="text-muted-foreground text-xs">
              Historique de vos rapports ESG
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            render={
              <Link href="/home/esg/reports">
                Tout voir
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            }
            nativeButton={false}
          />
        </div>

        <div className="mt-4 space-y-2">
          {reports.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">
              Aucun rapport genere
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
                    {report.format} -- {report.totalEmissionsT} t CO2e --{' '}
                    {report.blockchainProofs} preuves
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
