'use client';

import { Car, Home, Plane, Smartphone, TreePine } from 'lucide-react';

import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface CarbonEquivalencesProps {
  co2Avoided: number;
}

export function CarbonEquivalences({ co2Avoided }: CarbonEquivalencesProps) {
  const co2Kg = co2Avoided;

  const equivalences = [
    {
      icon: <TreePine className="h-6 w-6" strokeWidth={1.5} />,
      value: Math.round(co2Kg / 25),
      labelKey: 'carbon:treesPlanted',
    },
    {
      icon: <Car className="h-6 w-6" strokeWidth={1.5} />,
      value: Math.round(co2Kg / 0.217),
      labelKey: 'carbon:carKmAvoided',
    },
    {
      icon: <Plane className="h-6 w-6" strokeWidth={1.5} />,
      value: parseFloat((co2Kg / 1000).toFixed(1)),
      labelKey: 'carbon:flightsAvoided',
    },
    {
      icon: <Home className="h-6 w-6" strokeWidth={1.5} />,
      value: parseFloat((co2Kg / 2500).toFixed(2)),
      labelKey: 'carbon:homesEquiv',
    },
    {
      icon: <Smartphone className="h-6 w-6" strokeWidth={1.5} />,
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
              <div className="text-[#0d9488]">{eq.icon}</div>
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
