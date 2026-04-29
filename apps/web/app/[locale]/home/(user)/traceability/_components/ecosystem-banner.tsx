'use client';

import Link from 'next/link';

import {
  ArrowRightLeft,
  Blocks,
  FileBarChart,
  Leaf,
  ShoppingCart,
} from 'lucide-react';

import { Trans } from '@kit/ui/trans';

interface EcosystemBannerProps {
  transactionsThisMonth: number;
  co2AvoidedKg: number;
  esgAutoPercent: number;
  blockchainHashes: number;
}

export function EcosystemBanner({
  transactionsThisMonth,
  co2AvoidedKg,
  esgAutoPercent,
  blockchainHashes,
}: EcosystemBannerProps) {
  const co2Tonnes = Math.round((co2AvoidedKg / 1000) * 10) / 10;

  const items = [
    {
      icon: ShoppingCart,
      value: transactionsThisMonth,
      labelKey: 'blockchain:ecosystemComptoir' as const,
      href: '/home/marketplace',
      color: 'text-[#00A86B] dark:text-[#00A86B]',
    },
    {
      icon: Leaf,
      value: `${co2Tonnes}t`,
      labelKey: 'blockchain:ecosystemCarbon' as const,
      href: '/home/carbon',
      color: 'text-verdure-700 dark:text-verdure-400',
    },
    {
      icon: FileBarChart,
      value: `${esgAutoPercent}%`,
      labelKey: 'blockchain:ecosystemESG' as const,
      href: '/home/esg',
      color: 'text-blue-400 dark:text-blue-400',
    },
    {
      icon: Blocks,
      value: blockchainHashes,
      labelKey: 'blockchain:ecosystemBlockchain' as const,
      href: '/home/traceability',
      color: 'text-[#00A86B] dark:text-[#00A86B]',
    },
  ];

  return (
    <div className="rounded-xl border border-[#8FDAB5] bg-gradient-to-r from-[#E6F7EF]/80 to-[#E6F7EF]/80 px-6 py-4 dark:border-[#008F5A]/40 dark:from-[#004428]/30 dark:to-[#00A86B]/30">
      <div className="mb-2 flex items-center gap-2">
        <ArrowRightLeft className="h-4 w-4 text-[#00A86B] dark:text-[#00A86B]" />
        <span className="text-xs font-semibold tracking-wider text-[#008F5A] uppercase dark:text-[#00A86B]">
          <Trans i18nKey="blockchain:ecosystemBanner" />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.labelKey}
            href={item.href}
            className="group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-white/60 dark:hover:bg-white/5"
          >
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <div className="flex items-baseline gap-1.5">
              <span className={`text-sm font-bold ${item.color}`}>
                {item.value}
              </span>
              <span className="text-[#B8D4E3] text-xs">
                <Trans i18nKey={item.labelKey} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
