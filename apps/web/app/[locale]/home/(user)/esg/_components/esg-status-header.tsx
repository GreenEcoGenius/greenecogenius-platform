import Link from 'next/link';

import { Bot, CheckCircle2 } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import { GenerateEsgReportButton } from './generate-esg-report-button';

export function EsgStatusHeader({
  completionPct,
  autoFilled,
  totalFields,
  remaining,
}: {
  completionPct: number;
  autoFilled: number;
  totalFields: number;
  remaining: number;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Reporting ESG</h2>
              <Badge variant="outline" className="text-xs">
                T1 2026
              </Badge>
            </div>

            <p className="text-muted-foreground mt-1 text-sm">
              Bilan carbone et conformite reglementaire
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">{completionPct}%</span> complete
              </span>
              <span className="text-muted-foreground">
                {autoFilled} champs auto-remplis
              </span>
              <span className="text-muted-foreground">
                {remaining} restants
              </span>
            </div>

            <div className="mt-3 max-w-lg">
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {autoFilled}/{totalFields} champs remplis automatiquement
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <Button
              variant="outline"
              size="sm"
              render={
                <Link href="/home/esg/wizard">
                  <Bot className="mr-2 h-4 w-4" />
                  Completer les champs
                </Link>
              }
              nativeButton={false}
            />
            <GenerateEsgReportButton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
