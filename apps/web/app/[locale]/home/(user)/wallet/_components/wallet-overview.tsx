'use client';

import { ArrowDownToLine, Clock, Euro, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface WalletOverviewProps {
  wallet: {
    availableBalance: number;
    pendingBalance: number;
    totalEarned: number;
    totalFeesPaid: number;
  } | null;
}

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
}

export function WalletOverview({ wallet }: WalletOverviewProps) {
  const available = wallet?.availableBalance ?? 0;
  const pending = wallet?.pendingBalance ?? 0;
  const totalEarned = wallet?.totalEarned ?? 0;
  const totalFees = wallet?.totalFeesPaid ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Trans i18nKey="wallet.availableBalance" />
          </CardTitle>
          <Euro className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCents(available)}</div>
          <p className="text-muted-foreground text-xs">
            <Trans i18nKey="wallet.availableDesc" />
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Trans i18nKey="wallet.pendingBalance" />
          </CardTitle>
          <Clock className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCents(pending)}</div>
          <p className="text-muted-foreground text-xs">
            <Trans i18nKey="wallet.pendingDesc" />
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Trans i18nKey="wallet.totalEarned" />
          </CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCents(totalEarned)}</div>
          <p className="text-muted-foreground text-xs">
            <Trans i18nKey="wallet.totalEarnedDesc" />
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Trans i18nKey="wallet.fees" />
          </CardTitle>
          <ArrowDownToLine className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCents(totalFees)}</div>
          <p className="text-muted-foreground text-xs">
            <Trans i18nKey="wallet.feesDesc" />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
