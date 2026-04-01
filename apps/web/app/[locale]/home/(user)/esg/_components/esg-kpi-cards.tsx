'use client';

import Link from 'next/link';

import { ArrowUpRight, Cloud, FileCheck, Leaf, LinkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@kit/ui/card';

import type { EsgKpiData } from '../_lib/esg-mock-data';

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  href?: string;
  iconBgClass: string;
}

function KpiCard({ icon, label, value, sub, href, iconBgClass }: KpiCardProps) {
  const content = (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={`rounded-lg p-2 ${iconBgClass}`}>{icon}</div>
          {href && (
            <ArrowUpRight className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
        <div className="mt-3">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export function EsgKpiCards({ data }: { data: EsgKpiData }) {
  const t = useTranslations('esg');
  const autoPct = Math.round((data.autoFilledFields / data.totalFields) * 100);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        icon={<Cloud className="h-5 w-5 text-slate-600" />}
        label={t('totalEmissionsLabel')}
        value={`${data.totalEmissionsT} t`}
        sub={t('co2eScopesAll')}
        href="/home/carbon"
        iconBgClass="bg-slate-50 dark:bg-slate-950/30"
      />
      <KpiCard
        icon={<Leaf className="h-5 w-5 text-emerald-600" />}
        label={t('co2Avoided')}
        value={`${data.co2AvoidedT} t`}
        sub={t('viaRecycling')}
        href="/home/traceability"
        iconBgClass="bg-emerald-50 dark:bg-emerald-950/30"
      />
      <KpiCard
        icon={<FileCheck className="h-5 w-5 text-blue-600" />}
        label={t('autoFieldsLabel')}
        value={`${data.autoFilledFields} / ${data.totalFields}`}
        sub={`${autoPct}% ${t('autoFilled')}`}
        iconBgClass="bg-blue-50 dark:bg-blue-950/30"
      />
      <KpiCard
        icon={<LinkIcon className="h-5 w-5 text-teal-600" />}
        label={t('blockchainProofs')}
        value={`${data.blockchainProofs} hash`}
        sub={t('verifiedOnChain')}
        href="https://polygonscan.com"
        iconBgClass="bg-teal-50 dark:bg-teal-950/30"
      />
    </div>
  );
}
