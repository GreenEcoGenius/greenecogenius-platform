'use client';

import { Car, Home, Plane, TreePine } from 'lucide-react';

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
      id: 'car',
      icon: <Car size={24} strokeWidth={1.5} color="#00A86B" />,
      value: eq.carKm.toLocaleString('fr-FR'),
      label: <Trans i18nKey="blockchain:carKm" />,
      color:
        'from-[#E6F7EF] to-[#8FDAB5]/50 dark:from-[#00A86B]/30 dark:to-[#00A86B]/20',
    },
    {
      id: 'tree',
      icon: <TreePine size={24} strokeWidth={1.5} color="#00A86B" />,
      value: eq.trees.toLocaleString('fr-FR'),
      label: <Trans i18nKey="blockchain:treesPlanted" />,
      color:
        'from-[#E6F7EF] to-[#8FDAB5]/50 dark:from-[#004428]/30 dark:to-[#004428]/20',
    },
    {
      id: 'home',
      icon: <Home size={24} strokeWidth={1.5} color="#00A86B" />,
      value: eq.heatingYears.toLocaleString('fr-FR'),
      label: <Trans i18nKey="blockchain:heatingYears" />,
      color:
        'from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20',
    },
    {
      id: 'plane',
      icon: <Plane size={24} strokeWidth={1.5} color="#00A86B" />,
      value: eq.flights.toLocaleString('fr-FR'),
      label: <Trans i18nKey="blockchain:flightsParis" />,
      color:
        'from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/20',
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
            key={item.id}
            className={`overflow-hidden border-0 bg-gradient-to-br ${item.color}`}
          >
            <CardContent className="flex flex-col items-center px-4 py-5 text-center">
              <div className="mb-1">{item.icon}</div>
              <span className="text-2xl font-bold tracking-tight">
                {item.value}
              </span>
              <span className="text-[#B8D4E3] mt-0.5 text-xs">
                {item.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
