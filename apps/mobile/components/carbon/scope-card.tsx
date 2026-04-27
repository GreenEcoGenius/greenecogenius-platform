'use client';

import { Flame, Zap, TrendingDown } from 'lucide-react';

interface ScopeCardProps {
  scope: 1 | 2 | 3;
  value: number;
  label: string;
  description: string;
}

const SCOPE_CONFIG = {
  1: { icon: Flame, color: '#FF8A65' },
  2: { icon: Zap, color: '#FFD54F' },
  3: { icon: TrendingDown, color: '#B8D4E3' },
} as const;

export function ScopeCard({ scope, value, label, description }: ScopeCardProps) {
  const { icon: Icon, color } = SCOPE_CONFIG[scope];
  const valueKg = value;
  const valueT = valueKg / 1000;

  return (
    <div className="rounded-2xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div
            className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color }}
          >
            <Icon className="h-3 w-3" />
            <span>Scope {scope}</span>
          </div>
          <p className="text-[13px] font-semibold text-[#F5F5F0]">{label}</p>
          <p className="mt-0.5 text-[11px] text-[#F5F5F0]/50">{description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-lg font-semibold text-[#F5F5F0]">
              {valueT >= 1 ? valueT.toFixed(1) : valueKg.toFixed(0)}
            </span>
            <span className="text-[10px] text-[#F5F5F0]/60">
              {valueT >= 1 ? 'tCO₂e' : 'kgCO₂e'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
