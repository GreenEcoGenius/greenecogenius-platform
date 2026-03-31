'use client';

import { AlertTriangle, CheckCircle2 } from 'lucide-react';

import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import { PreAuditButton } from './pre-audit-button';

interface ComplianceScoreCardProps {
  score: number;
  normsCompliant: number;
  normsTotal: number;
  alerts: number;
}

export function ComplianceScoreCard({
  score,
  normsCompliant,
  normsTotal,
  alerts,
}: ComplianceScoreCardProps) {
  const scoreColor =
    score >= 80
      ? 'text-emerald-600'
      : score >= 60
        ? 'text-amber-600'
        : 'text-red-600';

  const ringColor =
    score >= 80
      ? 'stroke-emerald-500'
      : score >= 60
        ? 'stroke-amber-500'
        : 'stroke-red-500';

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {/* Circular score */}
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
            <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-100 dark:text-gray-800"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={ringColor}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>
                {score}%
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">
                <Trans i18nKey="compliance:scoreTitle" />
              </h3>
              <p className="text-muted-foreground text-sm">
                <Trans i18nKey="compliance:lastUpdate" />: 28 mars 2026
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {normsCompliant}/{normsTotal}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    <Trans i18nKey="compliance:normsVerified" />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-lg font-bold text-red-700 dark:text-red-400">
                    {alerts}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    <Trans i18nKey="compliance:activeAlerts" />
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <PreAuditButton />
              <button className="text-muted-foreground rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900">
                <Trans i18nKey="compliance:exportReport" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
