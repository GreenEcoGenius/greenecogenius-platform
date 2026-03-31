'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  XCircle,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import { AIPoweredBadge } from '~/components/ai/shared/ai-powered-badge';

interface Alert {
  type: 'error' | 'warning' | 'info';
  lotId?: string;
  message: string;
  actions: string[];
}

const mockAlerts: Alert[] = [
  {
    type: 'error',
    lotId: 'LOT-0234',
    message: 'Ecart de poids detecte: 2.5t declare vs 2.1t recu',
    actions: ['Corriger', 'Signaler'],
  },
  {
    type: 'warning',
    lotId: 'LOT-0241',
    message: 'En transit depuis 5 jours (moyenne: 2 jours)',
    actions: ['Contacter transporteur', 'Marquer retarde'],
  },
  {
    type: 'info',
    message:
      '3 certificats prets a emettre (LOT-0238, 0239, 0240)',
    actions: ['Emettre les certificats'],
  },
];

const alertConfig = {
  error: {
    border: 'border-l-4 border-l-red-500',
    bg: 'bg-red-50 dark:bg-red-950/20',
    icon: XCircle,
    iconColor: 'text-red-500',
    badgeVariant: 'destructive' as const,
    label: 'Critique',
  },
  warning: {
    border: 'border-l-4 border-l-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    badgeVariant: 'outline' as const,
    label: 'Attention',
  },
  info: {
    border: 'border-l-4 border-l-green-500',
    bg: 'bg-green-50 dark:bg-green-950/20',
    icon: CheckCircle,
    iconColor: 'text-green-500',
    badgeVariant: 'outline' as const,
    label: 'Info',
  },
};

export function AITraceabilityAlerts({
  className,
}: {
  className?: string;
}) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  const visibleAlerts = mockAlerts.filter((_, i) => !dismissed.has(i));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-medium">
            Alertes intelligentes
          </span>
          <AIPoweredBadge />
        </div>
        <Badge variant="outline" className="text-xs">
          {visibleAlerts.length} alerte{visibleAlerts.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-3">
        {mockAlerts.map((alert, index) => {
          if (dismissed.has(index)) return null;

          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <Card
              key={index}
              className={`${config.border} ${config.bg} overflow-hidden`}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`} />

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={config.badgeVariant} className="text-[10px]">
                      {config.label}
                    </Badge>
                    {alert.lotId && (
                      <span className="text-muted-foreground text-xs font-mono">
                        {alert.lotId}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed">{alert.message}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {alert.actions.map((action) => (
                      <Button
                        key={action}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setDismissed((prev) => new Set([...prev, index]))
                  }
                  className="text-muted-foreground hover:text-foreground shrink-0"
                  aria-label="Masquer cette alerte"
                >
                  <X className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
