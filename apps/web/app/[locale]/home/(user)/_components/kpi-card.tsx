'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { cn } from '@kit/ui/utils';

export type KpiVariant = 'teal' | 'emerald' | 'green';

const VARIANT_CLASSES: Record<KpiVariant, string> = {
  teal: 'from-[#0A2F1F] to-[#12472F]',
  emerald: 'from-[#0D3A26] to-[#1A5C3E]',
  green: 'from-[#12472F] to-[#0A2F1F]',
};

const VARIANT_ACCENT: Record<KpiVariant, string> = {
  teal: 'bg-emerald-400/20',
  emerald: 'bg-emerald-400/20',
  green: 'bg-blue-400/20',
};

interface KpiMetric {
  label: string;
  value: string;
}

export interface KpiCardProps {
  variant: KpiVariant;
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  metrics?: KpiMetric[];
  actionLabel?: string;
  actionHref?: string;
}

export function KpiCard({
  variant,
  title,
  value,
  subtitle,
  icon,
  metrics,
  actionLabel,
  actionHref,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'flex min-h-[200px] flex-col gap-4 rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg',
        VARIANT_CLASSES[variant],
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-[#F5F5F0]/70">
            {title}
          </p>
          <p className="mt-2 text-3xl leading-none font-bold text-[#F5F5F0]">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-[#F5F5F0]/50">{subtitle}</p>}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', VARIANT_ACCENT[variant])}>
          {icon}
        </div>
      </div>

      {metrics && metrics.length > 0 && (
        <div className="mt-auto space-y-1">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between text-[13px] text-[#F5F5F0]/70"
            >
              <span>{m.label}</span>
              <span className="font-medium text-[#F5F5F0]">{m.value}</span>
            </div>
          ))}
        </div>
      )}

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-xl border border-[#F5F5F0]/15 bg-[#F5F5F0]/10 px-4 py-2 text-[13px] font-medium text-[#F5F5F0] transition-all hover:bg-[#F5F5F0]/20 hover:border-[#F5F5F0]/25"
        >
          {actionLabel}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

export function KpiCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
