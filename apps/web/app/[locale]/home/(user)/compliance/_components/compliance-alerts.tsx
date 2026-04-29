'use client';

import { AlertTriangle, ShieldAlert } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface AlertItem {
  id: string;
  title: string;
  description: string;
  urgency: 'urgent' | 'warning';
}

export function ComplianceAlerts({ alerts }: { alerts: AlertItem[] }) {
  if (alerts.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <ShieldAlert className="h-5 w-5 text-slate-500" />
          <Trans i18nKey="compliance:alertsTitle" defaults="Alertes actives" />
          <Badge variant="destructive" className="ml-1">
            {alerts.length}
          </Badge>
        </h3>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border-l-4 p-4 ${
                alert.urgency === 'urgent'
                  ? 'border-l-slate-500 bg-[#E8F5EE]'
                  : 'border-l-[#E6F7EF]0 bg-[#E6F7EF]'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    alert.urgency === 'urgent'
                      ? 'text-slate-600'
                      : 'text-[#00A86B]'
                  }`}
                />
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold">{alert.title}</span>
                    <Badge
                      variant={
                        alert.urgency === 'urgent' ? 'destructive' : 'outline'
                      }
                      className={
                        alert.urgency === 'warning'
                          ? 'border-[#8FDAB5] bg-[#8FDAB5] text-[#00A86B]'
                          : ''
                      }
                    >
                      <Trans
                        i18nKey={`compliance:${alert.urgency}`}
                        defaults={
                          alert.urgency === 'urgent' ? 'Urgent' : 'Attention'
                        }
                      />
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {alert.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
