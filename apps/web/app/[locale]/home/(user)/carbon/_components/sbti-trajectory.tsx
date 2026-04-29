'use client';

import {
  Target,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

import { Card, CardContent } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { Trans } from '@kit/ui/trans';

interface TrajectoryPoint {
  year: number;
  target: number;
  actual: number | null;
}

const TRAJECTORY_DATA: TrajectoryPoint[] = [
  { year: 2024, target: 100, actual: 100 },
  { year: 2025, target: 93, actual: 97 },
  { year: 2026, target: 86, actual: null },
  { year: 2027, target: 79, actual: null },
  { year: 2028, target: 72, actual: null },
  { year: 2029, target: 65, actual: null },
  { year: 2030, target: 58, actual: null },
  { year: 2035, target: 30, actual: null },
  { year: 2040, target: 10, actual: null },
  { year: 2050, target: 0, actual: null },
];

const MILESTONES = [
  {
    year: 2030,
    label: '-42% vs 2024',
    desc: 'Objectif intermédiaire SBTi 1.5°C',
    status: 'upcoming' as const,
  },
  {
    year: 2040,
    label: '-90% vs 2024',
    desc: 'Trajectoire Net Zero SBTi',
    status: 'upcoming' as const,
  },
  {
    year: 2050,
    label: 'Net Zero',
    desc: 'Neutralité carbone complète',
    status: 'upcoming' as const,
  },
];

export function SbtiTrajectory() {
  const currentYear = new Date().getFullYear();
  const baselineEmissions = 100; // Normalized to 100%
  const latestActual = TRAJECTORY_DATA.filter((d) => d.actual !== null).pop();
  const latestTarget = TRAJECTORY_DATA.find((d) => d.year === currentYear);
  const deviation =
    latestActual && latestTarget
      ? ((latestActual.actual! - latestTarget.target) / latestTarget.target) *
        100
      : 0;
  const isOnTrack = deviation <= 5;

  // SVG chart dimensions
  const W = 600;
  const H = 200;
  const PAD = 40;
  const chartW = W - PAD * 2;
  const chartH = H - PAD * 2;

  const minYear = TRAJECTORY_DATA[0]!.year;
  const maxYear = TRAJECTORY_DATA[TRAJECTORY_DATA.length - 1]!.year;

  function x(year: number) {
    return PAD + ((year - minYear) / (maxYear - minYear)) * chartW;
  }
  function y(val: number) {
    return PAD + ((100 - val) / 100) * chartH;
  }

  const targetPath = TRAJECTORY_DATA.map(
    (d, i) => `${i === 0 ? 'M' : 'L'}${x(d.year)},${y(d.target)}`,
  ).join(' ');

  const actualPoints = TRAJECTORY_DATA.filter((d) => d.actual !== null);
  const actualPath = actualPoints
    .map(
      (d, i) => `${i === 0 ? 'M' : 'L'}${x(d.year)},${y(d.actual!)}`,
    )
    .join(' ');

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#1A5C3E] p-2">
              <Target className="h-5 w-5 text-[#00A86B]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                <Trans
                  i18nKey="carbon:sbtiTitle"
                  defaults="Trajectoire SBTi / Net Zero"
                />
              </h3>
              <p className="text-[#B8D4E3] text-xs">
                <Trans
                  i18nKey="carbon:sbtiSubtitle"
                  defaults="Aligné 1.5°C · Science Based Targets initiative"
                />
              </p>
            </div>
          </div>
          {isOnTrack ? (
            <Badge className="bg-[#1A5C3E] text-[#00A86B]">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              <Trans i18nKey="carbon:sbtiOnTrack" defaults="En bonne voie" />
            </Badge>
          ) : (
            <Badge className="bg-amber-900/30 text-amber-400">
              <AlertTriangle className="mr-1 h-3 w-3" />
              <Trans
                i18nKey="carbon:sbtiDeviation"
                defaults="Déviation +{pct}%"
                values={{ pct: Math.round(deviation) }}
              />
            </Badge>
          )}
        </div>

        {/* SVG Chart */}
        <div className="mb-6 overflow-hidden rounded-lg bg-[#1A5C3E]/10 p-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((val) => (
              <g key={val}>
                <line
                  x1={PAD}
                  y1={y(val)}
                  x2={W - PAD}
                  y2={y(val)}
                  stroke="rgba(245,245,240,0.06)"
                  strokeDasharray="4,4"
                />
                <text
                  x={PAD - 5}
                  y={y(val) + 3}
                  textAnchor="end"
                  fill="rgba(245,245,240,0.3)"
                  fontSize="9"
                >
                  {val}%
                </text>
              </g>
            ))}

            {/* Year labels */}
            {[2024, 2030, 2040, 2050].map((yr) => (
              <text
                key={yr}
                x={x(yr)}
                y={H - 5}
                textAnchor="middle"
                fill="rgba(245,245,240,0.3)"
                fontSize="9"
              >
                {yr}
              </text>
            ))}

            {/* Target path (dashed) */}
            <path
              d={targetPath}
              fill="none"
              stroke="#00A86B"
              strokeWidth="2"
              strokeDasharray="6,4"
              opacity="0.5"
            />

            {/* Actual path (solid) */}
            {actualPoints.length > 1 && (
              <path
                d={actualPath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
              />
            )}

            {/* Actual points */}
            {actualPoints.map((d) => (
              <circle
                key={d.year}
                cx={x(d.year)}
                cy={y(d.actual!)}
                r="4"
                fill="#F59E0B"
                stroke="#0A2F1F"
                strokeWidth="2"
              />
            ))}

            {/* 2030 milestone marker */}
            <line
              x1={x(2030)}
              y1={PAD}
              x2={x(2030)}
              y2={H - PAD}
              stroke="rgba(245,245,240,0.1)"
              strokeDasharray="3,3"
            />
            <text
              x={x(2030)}
              y={PAD - 5}
              textAnchor="middle"
              fill="#00A86B"
              fontSize="8"
              fontWeight="bold"
            >
              -42%
            </text>
          </svg>
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          {MILESTONES.map((m) => (
            <div
              key={m.year}
              className="flex items-center gap-3 rounded-lg border border-[#8FDAB5]/10 bg-[#1A5C3E]/10 p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1A5C3E]">
                <Calendar className="h-4 w-4 text-[#00A86B]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{m.label}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-[#B8D4E3]"
                  >
                    {m.year}
                  </Badge>
                </div>
                <p className="text-[#B8D4E3] text-xs">{m.desc}</p>
              </div>
              <TrendingDown className="h-4 w-4 text-[#00A86B]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
