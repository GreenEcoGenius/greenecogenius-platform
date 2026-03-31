'use client';

import { AlertTriangle, ShieldAlert } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface Alert {
  id: string;
  title: string;
  description: string;
  risk: string;
  urgency: 'urgent' | 'warning';
}

const MOCK_ALERTS: Alert[] = [
  {
    id: 'rgpd',
    title: 'RGPD — Registre de traitements incomplet',
    description:
      'Le registre des traitements de donn\u00e9es personnelles n\u2019est pas \u00e0 jour. 3 traitements non document\u00e9s d\u00e9tect\u00e9s par l\u2019analyse IA.',
    risk: 'Risque : amende jusqu\u2019\u00e0 4% du CA annuel mondial',
    urgency: 'urgent',
  },
  {
    id: 'rep',
    title: 'REP — \u00c9ch\u00e9ance fili\u00e8re emballages',
    description:
      'La d\u00e9claration REP fili\u00e8re emballages doit \u00eatre soumise avant le 30 avril 2026. Documents manquants : attestation \u00e9co-organisme.',
    risk: 'Risque : p\u00e9nalit\u00e9s financi\u00e8res et blocage des mises en march\u00e9',
    urgency: 'warning',
  },
  {
    id: 'iso27001',
    title: 'ISO 27001 — Audit de surveillance',
    description:
      'L\u2019audit de surveillance ISO 27001 est pr\u00e9vu pour mai 2026. 2 non-conformit\u00e9s mineures de l\u2019audit pr\u00e9c\u00e9dent non encore corrig\u00e9es.',
    risk: 'Risque : perte de la certification',
    urgency: 'warning',
  },
];

export function ComplianceAlerts() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <ShieldAlert className="h-5 w-5 text-red-500" />
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
                  ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20'
                  : 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        alert.urgency === 'urgent'
                          ? 'text-red-600'
                          : 'text-amber-600'
                      }`}
                    />
                    <span className="font-semibold">{alert.title}</span>
                    <Badge
                      variant={
                        alert.urgency === 'urgent' ? 'destructive' : 'outline'
                      }
                      className={
                        alert.urgency === 'warning'
                          ? 'border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
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
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-amber-600 dark:text-amber-400'
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
