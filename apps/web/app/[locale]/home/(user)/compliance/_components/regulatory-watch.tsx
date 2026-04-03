'use client';

import { Calendar, Eye as EyeIcon } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import { DEMO_DATA } from '~/lib/demo/demo-data';

type ImpactLevel = 'low' | 'medium' | 'high' | 'strategic';

interface WatchItem {
  id: string;
  date: string;
  title: string;
  description: string;
  impact: ImpactLevel;
}

const MOCK_WATCH: WatchItem[] = DEMO_DATA.compliance.watchItems;

const IMPACT_STYLES: Record<
  ImpactLevel,
  { className: string; i18nKey: string }
> = {
  low: {
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    i18nKey: 'compliance:impactLow',
  },
  medium: {
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    i18nKey: 'compliance:impactMedium',
  },
  high: {
    className:
      'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400',
    i18nKey: 'compliance:impactHigh',
  },
  strategic: {
    className:
      'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400',
    i18nKey: 'compliance:impactStrategic',
  },
};

export function RegulatoryWatch() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <EyeIcon className="h-5 w-5 text-blue-500" />
          <Trans i18nKey="compliance:watchTitle" />
        </h3>

        <div className="space-y-4">
          {MOCK_WATCH.map((item) => {
            const impactStyle = IMPACT_STYLES[item.impact];

            return (
              <div
                key={item.id}
                className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <div className="flex shrink-0 flex-col items-center">
                  <Calendar className="text-muted-foreground mb-1 h-4 w-4" />
                  <span className="text-muted-foreground text-xs font-medium">
                    {new Date(item.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(item.date).getFullYear()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold">{item.title}</span>
                    <Badge variant="outline" className={impactStyle.className}>
                      <Trans i18nKey={impactStyle.i18nKey} />
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
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
