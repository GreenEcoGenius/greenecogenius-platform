'use client';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface Label {
  name: string;
  score: number;
  threshold: number;
  status: string;
  color: string;
}

interface LabelEligibilityCardsProps {
  labels: Label[];
}

const STATUS_CONFIG: Record<
  string,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    i18nKey: string;
    className: string;
  }
> = {
  eligible: {
    variant: 'default',
    i18nKey: 'rse:eligible',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200',
  },
  in_progress: {
    variant: 'secondary',
    i18nKey: 'rse:inProgress',
    className:
      'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200',
  },
  not_started: {
    variant: 'outline',
    i18nKey: 'rse:notStarted',
    className:
      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200',
  },
};

export function LabelEligibilityCards({ labels }: LabelEligibilityCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {labels.map((label) => {
        const config =
          STATUS_CONFIG[label.status] ?? STATUS_CONFIG['not_started']!;
        const percentage = Math.min((label.score / label.threshold) * 100, 100);
        const isEligible = label.score >= label.threshold;

        return (
          <Card key={label.name} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">
                {label.name}
              </CardTitle>
              <Badge variant={config.variant} className={config.className}>
                <Trans i18nKey={config.i18nKey} />
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score vs threshold */}
              <div className="flex items-baseline justify-between">
                <span
                  className="text-2xl font-bold"
                  style={{ color: isEligible ? '#22C55E' : label.color }}
                >
                  {label.score}
                </span>
                <span className="text-muted-foreground text-sm">
                  <Trans i18nKey="rse:threshold" /> {label.threshold}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: isEligible ? '#22C55E' : label.color,
                  }}
                />
              </div>
              {!isEligible && (
                <p className="text-muted-foreground text-xs">
                  {label.threshold - label.score} <Trans i18nKey="rse:points" />{' '}
                  <Trans i18nKey="rse:actionsRemaining" />
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
