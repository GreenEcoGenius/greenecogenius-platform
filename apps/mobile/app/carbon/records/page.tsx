'use client';

import { useTranslations } from 'next-intl';
import { Leaf, RotateCw } from 'lucide-react';

import { RecordCard } from '~/components/carbon/record-card';
import { StatsHeader } from '~/components/carbon/stats-header';
import { ListRowSkeleton, StatCardSkeleton } from '~/components/ui/skeleton';
import { useCarbonRecords } from '~/hooks/use-carbon-records';

export default function CarbonRecordsPage() {
  const t = useTranslations('carbon');
  const { records, stats, loading, refreshing, error, refetch } =
    useCarbonRecords();

  if (loading && records.length === 0) {
    return (
      <div className="space-y-6 py-2">
        <div className="grid grid-cols-2 gap-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="space-y-2">
          <ListRowSkeleton />
          <ListRowSkeleton />
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-center text-sm text-red-300">{error}</p>
        <button
          onClick={() => void refetch()}
          className="rounded-full border border-[#F5F5F0]/15 px-4 py-1.5 text-xs text-[#F5F5F0]/80 active:bg-[#F5F5F0]/10"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8D4E3]/15">
          <Leaf className="h-5 w-5 text-[#B8D4E3]" />
        </div>
        <p className="text-center text-sm text-[#F5F5F0]/60">
          {t('emptyRecords')}
        </p>
        <p className="max-w-xs text-center text-[11px] text-[#F5F5F0]/40">
          {t('emptyRecordsHint')}
        </p>
      </div>
    );
  }

  return (
    <div>
      <StatsHeader stats={stats} />

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
          {t('recentTitle')}
        </h2>
        <button
          onClick={() => void refetch()}
          disabled={refreshing}
          aria-label={t('refresh')}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#F5F5F0]/50 active:bg-[#F5F5F0]/10 disabled:opacity-30"
        >
          <RotateCw
            className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      <div className="space-y-2">
        {records.map((r) => (
          <RecordCard key={r.id} record={r} />
        ))}
      </div>
    </div>
  );
}
