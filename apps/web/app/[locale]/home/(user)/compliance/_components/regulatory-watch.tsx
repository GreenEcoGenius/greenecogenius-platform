'use client';

import { Calendar, Eye as EyeIcon } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import { NORMS_DATABASE } from '~/lib/data/norms-database';

type ImpactLevel = 'low' | 'medium' | 'high' | 'strategic';

const IMPACT_STYLES: Record<
  ImpactLevel,
  { className: string; i18nKey: string }
> = {
  low: {
    className: 'bg-gray-100 text-gray-700',
    i18nKey: 'compliance:impactLow',
  },
  medium: {
    className: 'bg-blue-100 text-blue-700',
    i18nKey: 'compliance:impactMedium',
  },
  high: {
    className: 'bg-[#A8E6C8] text-[#1BAF6A]',
    i18nKey: 'compliance:impactHigh',
  },
  strategic: {
    className: 'bg-[#A8E6C8] text-[#1BAF6A]',
    i18nKey: 'compliance:impactStrategic',
  },
};

function getImpactFromPriority(priority: string): ImpactLevel {
  switch (priority) {
    case 'fundamental':
      return 'strategic';
    case 'strategic':
      return 'strategic';
    case 'mandatory':
      return 'high';
    case 'essential':
      return 'high';
    case 'upcoming':
      return 'medium';
    default:
      return 'low';
  }
}

export function RegulatoryWatch() {
  const upcomingNorms = NORMS_DATABASE.filter(
    (n) =>
      n.status === 'in_development' ||
      n.status === 'planned' ||
      n.platformIntegration === 'anticipated',
  ).slice(0, 4);

  if (upcomingNorms.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <EyeIcon className="h-5 w-5 text-blue-500" />
          <Trans
            i18nKey="compliance:watchTitle"
            defaults="Veille réglementaire"
          />
        </h3>

        <div className="space-y-4">
          {upcomingNorms.map((norm) => {
            const impact = getImpactFromPriority(norm.priority);
            const impactStyle = IMPACT_STYLES[impact];

            return (
              <div
                key={norm.id}
                className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex shrink-0 flex-col items-center">
                  <Calendar className="text-muted-foreground mb-1 h-4 w-4" />
                  <span className="text-muted-foreground text-xs font-medium">
                    {norm.year}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold">{norm.title}</span>
                    <Badge variant="outline" className={impactStyle.className}>
                      <Trans i18nKey={impactStyle.i18nKey} />
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {norm.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
