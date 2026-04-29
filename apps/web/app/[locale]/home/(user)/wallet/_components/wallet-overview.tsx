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

const cards = [
  {
    key: 'available',
    titleKey: 'wallet.availableBalance',
    descKey: 'wallet.availableDesc',
    icon: Euro,
    iconColor: 'text-emerald-400 dark:text-emerald-400',
    iconBg: 'bg-emerald-900/20',
    getValue: (w: any) => w?.availableBalance ?? 0,
  },
  {
    key: 'pending',
    titleKey: 'wallet.pendingBalance',
    descKey: 'wallet.pendingDesc',
    icon: Clock,
    iconColor: 'text-amber-400 dark:text-amber-400',
    iconBg: 'bg-amber-900/20',
    getValue: (w: any) => w?.pendingBalance ?? 0,
  },
  {
    key: 'earned',
    titleKey: 'wallet.totalEarned',
    descKey: 'wallet.totalEarnedDesc',
    icon: TrendingUp,
    iconColor: 'text-blue-400 dark:text-blue-400',
    iconBg: 'bg-blue-900/20',
    getValue: (w: any) => w?.totalEarned ?? 0,
  },
  {
    key: 'fees',
    titleKey: 'wallet.fees',
    descKey: 'wallet.feesDesc',
    icon: ArrowDownToLine,
    iconColor: 'text-purple-400 dark:text-purple-400',
    iconBg: 'bg-purple-900/20',
    getValue: (w: any) => w?.totalFeesPaid ?? 0,
  },
];

export function WalletOverview({ wallet }: WalletOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.key} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans i18nKey={card.titleKey} />
              </CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCents(card.getValue(wallet))}</div>
              <p className="text-[#B8D4E3] text-xs mt-1">
                <Trans i18nKey={card.descKey} />
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
