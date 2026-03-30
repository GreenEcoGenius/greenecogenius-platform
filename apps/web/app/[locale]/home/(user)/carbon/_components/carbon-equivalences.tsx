'use client';

import { Car, Plane, TreePine } from 'lucide-react';

import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface CarbonEquivalencesProps {
  co2Avoided: number;
}

export function CarbonEquivalences({ co2Avoided }: CarbonEquivalencesProps) {
  const treesPlanted = Math.round(co2Avoided / 25);
  const carKmAvoided = Math.round(co2Avoided / 0.21);
  const flightsAvoided = (co2Avoided / 1000).toFixed(1);

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">
        <Trans i18nKey="carbon:equivalences" />
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-2 pt-6">
            <TreePine className="h-10 w-10 text-green-600" />
            <div className="text-3xl font-bold">
              {treesPlanted.toLocaleString('fr-FR')}
            </div>
            <p className="text-muted-foreground text-center text-sm">
              <Trans i18nKey="carbon:treesPlanted" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-2 pt-6">
            <Car className="h-10 w-10 text-blue-600" />
            <div className="text-3xl font-bold">
              {carKmAvoided.toLocaleString('fr-FR')}
            </div>
            <p className="text-muted-foreground text-center text-sm">
              <Trans i18nKey="carbon:carKmAvoided" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-2 pt-6">
            <Plane className="h-10 w-10 text-orange-600" />
            <div className="text-3xl font-bold">{flightsAvoided}</div>
            <p className="text-muted-foreground text-center text-sm">
              <Trans i18nKey="carbon:flightsAvoided" />
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
