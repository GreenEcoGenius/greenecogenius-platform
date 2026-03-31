'use client';

import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface CarbonEquivalencesProps {
  co2Avoided: number;
}

export function CarbonEquivalences({ co2Avoided }: CarbonEquivalencesProps) {
  const co2Kg = co2Avoided;

  const equivalences = [
    {
      emoji: '\u{1F333}',
      value: Math.round(co2Kg / 25),
      labelKey: 'carbon:treesPlanted',
    },
    {
      emoji: '\u{1F697}',
      value: Math.round(co2Kg / 0.217),
      labelKey: 'carbon:carKmAvoided',
    },
    {
      emoji: '\u{2708}\u{FE0F}',
      value: parseFloat((co2Kg / 1000).toFixed(1)),
      labelKey: 'carbon:flightsAvoided',
    },
    {
      emoji: '\u{1F3E0}',
      value: parseFloat((co2Kg / 2500).toFixed(2)),
      labelKey: 'carbon:homesEquiv',
    },
    {
      emoji: '\u{1F4F1}',
      value: Math.round(co2Kg / 0.008),
      labelKey: 'carbon:smartphonesEquiv',
    },
  ];

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">
        <Trans i18nKey="carbon:equivalences" />
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {equivalences.map((eq) => (
          <Card key={eq.labelKey}>
            <CardContent className="flex flex-col items-center gap-2 p-5">
              <span className="text-4xl" role="img">
                {eq.emoji}
              </span>
              <div className="text-2xl font-bold">
                {typeof eq.value === 'number'
                  ? eq.value.toLocaleString('fr-FR')
                  : eq.value}
              </div>
              <p className="text-muted-foreground text-center text-xs leading-tight">
                <Trans i18nKey={eq.labelKey} />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
