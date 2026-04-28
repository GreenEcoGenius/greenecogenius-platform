'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Leaf, Truck, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import type { CarbonRecord } from '~/lib/queries/carbon-records';

interface RecordCardProps {
  record: CarbonRecord;
}

export const RecordCard = memo(function RecordCard({ record }: RecordCardProps) {
  const t = useTranslations('carbon');
  const locale = useLocale();

  const co2Avoided = Number(record.co2_avoided ?? 0);
  const weightTonnes = Number(record.weight_tonnes ?? 0);
  const date = record.calculated_at
    ? new Date(record.calculated_at).toLocaleDateString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const materialLabel = record.material_subcategory
    ? `${record.material_category} · ${record.material_subcategory}`
    : record.material_category;

  return (
    <Link
      href={`/carbon/records/${record.id}`}
      className="block rounded-2xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 px-4 py-3 transition-all active:scale-[0.99] active:bg-[#F5F5F0]/8"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#B8D4E3]">
            <Leaf className="h-3 w-3" />
            <span className="truncate">{materialLabel}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-[#F5F5F0]">
              {co2Avoided.toFixed(1)}
            </span>
            <span className="text-xs text-[#F5F5F0]/60">
              {t('co2AvoidedUnit')}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-[#F5F5F0]/50">
            <span>{weightTonnes.toFixed(2)}t</span>
            {record.transport_mode && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  {record.transport_mode}
                </span>
              </>
            )}
            {date && (
              <>
                <span>·</span>
                <span>{date}</span>
              </>
            )}
          </div>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#F5F5F0]/30" />
      </div>
    </Link>
  );
});
