'use client';

import { ArrowDownToLine, Clock, Euro, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  EnviroStatCard,
  EnviroStatCardGrid,
} from '~/components/enviro/dashboard';

interface WalletOverviewProps {
  wallet: {
    availableBalance: number;
    pendingBalance: number;
    totalEarned: number;
    totalFeesPaid: number;
  } | null;
}

export function WalletOverview({ wallet }: WalletOverviewProps) {
  const t = useTranslations('wallet');

  // Cents to euros (the underlying field is stored in cents). Counters
  // animate from 0 to value via the existing AnimatedCounter helper.
  const available = (wallet?.availableBalance ?? 0) / 100;
  const pending = (wallet?.pendingBalance ?? 0) / 100;
  const totalEarned = (wallet?.totalEarned ?? 0) / 100;
  const totalFees = (wallet?.totalFeesPaid ?? 0) / 100;

  return (
    <EnviroStatCardGrid cols={4}>
      <EnviroStatCard
        variant="forest"
        label={t('availableBalance')}
        value={available}
        fractionDigits={2}
        suffix=" €"
        subtitle={t('availableDesc')}
        icon={<Euro aria-hidden="true" className="h-5 w-5" />}
      />

      <EnviroStatCard
        variant="cream"
        label={t('pendingBalance')}
        value={pending}
        fractionDigits={2}
        suffix=" €"
        subtitle={t('pendingDesc')}
        icon={<Clock aria-hidden="true" className="h-5 w-5" />}
      />

      <EnviroStatCard
        variant="lime"
        label={t('totalEarned')}
        value={totalEarned}
        fractionDigits={2}
        suffix=" €"
        subtitle={t('totalEarnedDesc')}
        icon={<TrendingUp aria-hidden="true" className="h-5 w-5" />}
      />

      <EnviroStatCard
        variant="cream"
        label={t('fees')}
        value={totalFees}
        fractionDigits={2}
        suffix=" €"
        subtitle={t('feesDesc')}
        icon={<ArrowDownToLine aria-hidden="true" className="h-5 w-5" />}
      />
    </EnviroStatCardGrid>
  );
}
