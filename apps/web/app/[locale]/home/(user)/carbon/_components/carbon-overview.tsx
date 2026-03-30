'use client';

import { Leaf, Minus, Truck, Weight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface CarbonOverviewProps {
  totalAvoided: number;
  totalTransport: number;
  totalNet: number;
  totalWeight: number;
}

function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CarbonOverview({
  totalAvoided,
  totalTransport,
  totalNet,
  totalWeight,
}: CarbonOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Trans i18nKey="carbon:totalAvoided" />
          </CardTitle>
          <Leaf className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatNumber(totalAvoided / 1000)} t
          </div>
          <p className="text-muted-foreground text-xs">
            <Trans i18nKey="carbon:totalAvoidedDesc" />
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Trans i18nKey="carbon:totalTransport" />
          </CardTitle>
          <Truck className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(totalTransport, 0)} kg
          </div>
          <p className="text-muted-foreground text-xs">
            <Trans i18nKey="carbon:totalTransportDesc" />
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Trans i18nKey="carbon:netBenefit" />
          </CardTitle>
          <Minus className="text-primary h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-primary text-2xl font-bold">
            {formatNumber(totalNet / 1000)} t
          </div>
          <p className="text-muted-foreground text-xs">
            <Trans i18nKey="carbon:netBenefitDesc" />
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Trans i18nKey="carbon:totalWeight" />
          </CardTitle>
          <Weight className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(totalWeight / 1000)} t
          </div>
          <p className="text-muted-foreground text-xs">
            <Trans i18nKey="carbon:totalWeightDesc" />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
