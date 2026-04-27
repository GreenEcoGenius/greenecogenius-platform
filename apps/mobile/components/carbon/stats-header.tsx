'use client';

import { Leaf, Recycle, Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { CarbonRecordsStats } from '~/lib/queries/carbon-records';

export function StatsHeader({ stats }: { stats: CarbonRecordsStats }) {
  const t = useTranslations('carbon');

  return (
    <div className="mb-3 grid grid-cols-3 gap-2">
      <StatTile
        icon={Leaf}
        value={stats.totalCo2Avoided.toFixed(1)}
        unit={t('co2AvoidedUnit')}
        label={t('statCo2')}
      />
      <StatTile
        icon={Recycle}
        value={stats.totalTonnesRecycled.toFixed(1)}
        unit="t"
        label={t('statRecycled')}
      />
      <StatTile
        icon={Activity}
        value={String(stats.totalRecords)}
        unit=""
        label={t('statRecords')}
      />
    </div>
  );
}

function StatTile({
  icon: Icon,
  value,
  unit,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 px-2.5 py-2">
      <Icon className="h-3.5 w-3.5 text-[#B8D4E3]" />
      <div className="flex items-baseline gap-0.5">
        <span className="text-[15px] font-semibold text-[#F5F5F0]">{value}</span>
        {unit && <span className="text-[10px] text-[#F5F5F0]/60">{unit}</span>}
      </div>
      <span className="text-[10px] uppercase tracking-wide text-[#F5F5F0]/50">
        {label}
      </span>
    </div>
  );
}
