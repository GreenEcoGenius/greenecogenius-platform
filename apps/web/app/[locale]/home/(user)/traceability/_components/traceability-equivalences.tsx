'use client';

import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import { calculateEquivalences } from '~/lib/services/carbon-calculator-shared';

interface TraceabilityEquivalencesProps {
  co2AvoidedKg: number;
}

export function TraceabilityEquivalences({
  co2AvoidedKg,
}: TraceabilityEquivalencesProps) {
  const eq = calculateEquivalences(co2AvoidedKg);

  const items = [
    {
      emoji: '\uD83D\uDE97',
      value: eq.carKm.toLocaleString('fr-FR'),
      label: <Trans i18nKey="blockchain:carKm" />,
      color:
        'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
    },
    {
      emoji: '\uD83C\uDF33',
      value: eq.trees.toLocaleString('fr-FR'),
      label: <Trans i18nKey="blockchain:treesPlanted" />,
      color:
        'from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20',
    },
    {
      emoji: '\uD83C\uDFE0',
      value: eq.heatingYears.toLocaleString('fr-FR'),
      label: <Trans i18nKey="blockchain:heatingYears" />,
      color:
        'from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20',
    },
    {
      emoji: '\u2708\uFE0F',
      value: eq.flights.toLocaleString('fr-FR'),
      label: <Trans i18nKey="blockchain:flightsParis" />,
      color:
        'from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20',
    },
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">
        <Trans i18nKey="blockchain:equivalencesTitle" />
      </h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((item) => (
          <Card
            key={item.emoji}
            className={`overflow-hidden border-0 bg-gradient-to-br ${item.color}`}
          >
            <CardContent className="flex flex-col items-center px-4 py-5 text-center">
              <span className="mb-1 text-3xl" role="img">
                {item.emoji}
              </span>
              <span className="text-2xl font-bold tracking-tight">
                {item.value}
              </span>
              <span className="text-muted-foreground mt-0.5 text-xs">
                {item.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
