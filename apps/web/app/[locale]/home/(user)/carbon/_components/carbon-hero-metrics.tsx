'use client';

import { ArrowUpDown, Leaf, Package, TrendingUp } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface CarbonHeroMetricsProps {
  co2Avoided: number;
  co2Transport: number;
  co2Net: number;
  weightTonnes: number;
  txCount: number;
  prevCo2Avoided?: number;
  prevWeightTonnes?: number;
  prevTxCount?: number;
}

function fmt(value: number, decimals = 2): string {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function VariationBadge({
  current,
  previous,
}: {
  current: number;
  previous?: number;
}) {
  if (previous === undefined || previous === 0) return null;

  const pct = ((current - previous) / previous) * 100;
  const isUp = pct >= 0;

  return (
    <Badge
      variant={isUp ? 'default' : 'destructive'}
      className="text-xs font-medium"
    >
      {isUp ? '+' : ''}
      {pct.toFixed(1)}%
    </Badge>
  );
}

export function CarbonHeroMetrics({
  co2Avoided,
  co2Transport,
  co2Net,
  weightTonnes,
  txCount,
  prevCo2Avoided,
  prevWeightTonnes,
  prevTxCount,
}: CarbonHeroMetricsProps) {
  const cards = [
    {
      icon: <Leaf className="h-5 w-5 text-teal-600" />,
      value: fmt(co2Avoided / 1000),
      unit: 't CO₂',
      labelKey: 'carbon:totalAvoided',
      descKey: 'carbon:totalAvoidedDesc',
      color: 'text-teal-600',
      current: co2Avoided,
      previous: prevCo2Avoided,
    },
    {
      icon: <Package className="h-5 w-5 text-emerald-600" />,
      value: fmt(weightTonnes, 2),
      unit: 't',
      labelKey: 'carbon:totalWeight',
      descKey: 'carbon:totalWeightDesc',
      color: 'text-emerald-600',
      current: weightTonnes,
      previous: prevWeightTonnes,
    },
    {
      icon: <ArrowUpDown className="h-5 w-5 text-green-600" />,
      value: txCount.toLocaleString('fr-FR'),
      unit: '',
      labelKey: 'carbon:txCount',
      descKey: 'carbon:txCountDesc',
      color: 'text-green-600',
      current: txCount,
      previous: prevTxCount,
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
      value: fmt(co2Net / 1000),
      unit: 't CO₂',
      labelKey: 'carbon:netBenefit',
      descKey: 'carbon:netBenefitDesc',
      color: 'text-emerald-600',
      current: co2Net,
      previous: undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.labelKey} className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                {card.icon}
              </div>
              <VariationBadge current={card.current} previous={card.previous} />
            </div>
            <div className="mt-4">
              <div className={`text-3xl font-bold ${card.color}`}>
                {card.value}
                {card.unit ? (
                  <span className="ml-1 text-base font-normal text-gray-500">
                    {card.unit}
                  </span>
                ) : null}
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                <Trans i18nKey={card.labelKey} />
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
