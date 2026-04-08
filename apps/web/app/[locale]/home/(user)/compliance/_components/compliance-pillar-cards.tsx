'use client';

import {
  Database,
  Factory,
  FileBarChart,
  Leaf,
  Link2,
  Medal,
} from 'lucide-react';

import { Card, CardContent } from '@kit/ui/card';

interface Pillar {
  name: string;
  icon: string;
  compliant: number;
  total: number;
  norms: string[];
}

interface CompliancePillarCardsProps {
  pillars: Pillar[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  circular: <Factory className="h-6 w-6" />,
  carbon: <Leaf className="h-6 w-6" />,
  reporting: <FileBarChart className="h-6 w-6" />,
  traceability: <Link2 className="h-6 w-6" />,
  data: <Database className="h-6 w-6" />,
  labels: <Medal className="h-6 w-6" />,
};

function getScoreColor(pct: number) {
  if (pct >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (pct >= 60) return 'text-[#2D8C6A] dark:text-[#2D8C6A]';
  return 'text-slate-600 dark:text-slate-400';
}

function getBarColor(pct: number) {
  if (pct >= 80) return 'bg-emerald-500';
  if (pct >= 60) return 'bg-[#E6F2ED]0';
  return 'bg-slate-500';
}

function getBgColor(pct: number) {
  if (pct >= 80)
    return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400';
  if (pct >= 60)
    return 'bg-[#E6F2ED] dark:bg-[#224E3F]/30 text-[#2D8C6A] dark:text-[#2D8C6A]';
  return 'bg-slate-50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-400';
}

export function CompliancePillarCards({ pillars }: CompliancePillarCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pillars.map((pillar) => {
        const pct = Math.round((pillar.compliant / pillar.total) * 100);
        return (
          <Card key={pillar.icon} className="transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2.5 ${getBgColor(pct)}`}>
                    {ICON_MAP[pillar.icon] ?? <Leaf className="h-6 w-6" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{pillar.name}</h4>
                    <p className="text-muted-foreground text-xs">
                      {pillar.compliant}/{pillar.total} normes
                    </p>
                  </div>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(pct)}`}>
                  {pct}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="bg-muted mb-3 h-2 overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full ${getBarColor(pct)} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Norm examples */}
              <div className="flex flex-wrap gap-1">
                {pillar.norms.slice(0, 4).map((norm) => (
                  <span
                    key={norm}
                    className="text-muted-foreground rounded bg-gray-100 px-1.5 py-0.5 text-[10px] dark:bg-gray-800"
                  >
                    {norm}
                  </span>
                ))}
                {pillar.norms.length > 4 && (
                  <span className="text-muted-foreground rounded bg-gray-100 px-1.5 py-0.5 text-[10px] dark:bg-gray-800">
                    +{pillar.norms.length - 4}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
