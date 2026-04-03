'use client';

import { AlertTriangle, ShieldAlert } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import { DEMO_DATA } from '~/lib/demo/demo-data';

interface Alert {
  id: string;
  title: string;
  description: string;
  risk: string;
  urgency: 'urgent' | 'warning';
}

const MOCK_ALERTS: Alert[] = DEMO_DATA.compliance.alertItems;

export function ComplianceAlerts() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <ShieldAlert className="h-5 w-5 text-slate-500" />
          <Trans i18nKey="compliance:alertsTitle" />
          <Badge variant="destructive" className="ml-1">
            {MOCK_ALERTS.length}
          </Badge>
        </h3>

        <div className="space-y-3">
          {MOCK_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border-l-4 p-4 ${
                alert.urgency === 'urgent'
                  ? 'border-l-slate-500 bg-slate-50 dark:bg-slate-950/20'
                  : 'border-l-teal-500 bg-teal-50 dark:bg-teal-950/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        alert.urgency === 'urgent'
                          ? 'text-slate-600'
                          : 'text-teal-600'
                      }`}
                    />
                    <span className="font-semibold">{alert.title}</span>
                    <Badge
                      variant={
                        alert.urgency === 'urgent' ? 'destructive' : 'outline'
                      }
                      className={
                        alert.urgency === 'warning'
                          ? 'border-teal-300 bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400'
                          : ''
                      }
                    >
                      <Trans
                        i18nKey={`compliance:${alert.urgency === 'urgent' ? 'urgent' : 'warning'}`}
                      />
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    {alert.description}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      alert.urgency === 'urgent'
                        ? 'text-slate-600 dark:text-slate-400'
                        : 'text-teal-600 dark:text-teal-400'
                    }`}
                  >
                    {alert.risk}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-xs"
                >
                  <Trans i18nKey="compliance:resolve" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
