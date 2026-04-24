'use client';

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { cn } from '@kit/ui/utils';

export type KpiVariant = 'teal' | 'emerald' | 'green';

const VARIANT_CLASSES: Record<KpiVariant, string> = {
  teal: 'from-primary-500 to-primary-600',
  emerald: 'from-primary-500 to-primary-600',
  green: 'from-tech-emerald to-primary-700',
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
        'flex min-h-[200px] flex-col gap-4 rounded-2xl bg-gradient-to-br p-6 text-white',
        VARIANT_CLASSES[variant],
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase opacity-90">
            {title}
          </p>
          <p className="mt-2 text-3xl leading-none font-bold">{value}</p>
          {subtitle && <p className="mt-1 text-xs opacity-70">{subtitle}</p>}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
          {icon}
        </div>
      </div>

      {metrics && metrics.length > 0 && (
        <div className="mt-auto space-y-1">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between text-[13px] opacity-85"
            >
              <span>{m.label}</span>
              <span className="font-medium">{m.value}</span>
            </div>
          ))}
        </div>
      )}

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/25"
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
