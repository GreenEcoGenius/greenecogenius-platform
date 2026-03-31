'use client';

import Link from 'next/link';

import {
  ArrowUpRight,
  Award,
  Boxes,
  Leaf,
  Recycle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface KpiCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: React.ReactNode;
  subtitle: React.ReactNode;
  trend: number;
  trendLabel: React.ReactNode;
  badge?: React.ReactNode;
  linkHref?: string;
  linkLabel?: React.ReactNode;
  accentColor: string;
}

function KpiCard({
  icon,
  value,
  label,
  subtitle,
  trend,
  trendLabel,
  badge,
  linkHref,
  linkLabel,
  accentColor,
}: KpiCardProps) {
  const isPositive = trend >= 0;

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 h-1 w-full ${accentColor}`} />
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-muted-foreground text-sm font-medium">
              {label}
            </span>
          </div>
          {badge}
        </div>

        <div className="mb-1 text-3xl font-bold tracking-tight">{value}</div>

        <div className="mb-3 flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{subtitle}</span>
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? '+' : ''}
            {trend}%{' '}
            <span className="text-muted-foreground font-normal">
              {trendLabel}
            </span>
          </span>
        </div>

        {linkHref && linkLabel && (
          <Link
            href={linkHref}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
          >
            {linkLabel}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

interface TraceabilityKpiCardsProps {
  totalLots: number;
  lotsThisMonth: number;
  lotsTrend: number;
  co2AvoidedTonnes: number;
  totalTonnes: number;
  tonnesThisMonth: number;
  tonnesTrend: number;
  certificates: number;
  certificatesThisMonth: number;
  certificatesTrend: number;
}

export function TraceabilityKpiCards({
  totalLots,
  lotsThisMonth,
  lotsTrend,
  co2AvoidedTonnes,
  totalTonnes,
  tonnesThisMonth,
  tonnesTrend,
  certificates,
  certificatesThisMonth,
  certificatesTrend,
}: TraceabilityKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={<Boxes className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
        value={totalLots.toLocaleString('fr-FR')}
        label={<Trans i18nKey="blockchain:lotsTracked" />}
        subtitle={
          <>
            {lotsThisMonth} <Trans i18nKey="blockchain:lotsThisMonth" />
          </>
        }
        trend={lotsTrend}
        trendLabel={<Trans i18nKey="blockchain:vsLastMonth" />}
        accentColor="bg-teal-500"
      />

      <KpiCard
        icon={<Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />}
        value={`${co2AvoidedTonnes.toLocaleString('fr-FR')}t`}
        label={<Trans i18nKey="blockchain:co2AvoidedCard" />}
        subtitle={
          <>
            <Trans i18nKey="blockchain:lotsThisMonth" />
          </>
        }
        trend={12.4}
        trendLabel={<Trans i18nKey="blockchain:vsLastMonth" />}
        linkHref="/home/carbon"
        linkLabel={<Trans i18nKey="blockchain:co2AvoidedCard" />}
        accentColor="bg-green-500"
      />

      <KpiCard
        icon={<Recycle className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        value={`${totalTonnes.toLocaleString('fr-FR')}t`}
        label={<Trans i18nKey="blockchain:tonnesRecycled" />}
        subtitle={
          <>
            {tonnesThisMonth}t <Trans i18nKey="blockchain:lotsThisMonth" />
          </>
        }
        trend={tonnesTrend}
        trendLabel={<Trans i18nKey="blockchain:vsLastMonth" />}
        linkHref="/home/marketplace"
        linkLabel={<Trans i18nKey="blockchain:tonnesRecycled" />}
        accentColor="bg-blue-500"
      />

      <KpiCard
        icon={<Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        value={certificates.toLocaleString('fr-FR')}
        label={<Trans i18nKey="blockchain:certificatesCard" />}
        subtitle={
          <>
            {certificatesThisMonth} <Trans i18nKey="blockchain:lotsThisMonth" />
          </>
        }
        trend={certificatesTrend}
        trendLabel={<Trans i18nKey="blockchain:vsLastMonth" />}
        badge={
          <Badge
            variant="outline"
            className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
          >
            <Trans i18nKey="blockchain:onChain" />
          </Badge>
        }
        accentColor="bg-amber-500"
      />
    </div>
  );
}
