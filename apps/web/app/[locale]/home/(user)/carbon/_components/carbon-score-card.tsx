'use client';

import { Award, Gem, Medal, Trophy } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface ScoreData {
  total: number;
  level: string;
  volume_score: number;
  diversity_score: number;
  regularity_score: number;
  co2_score: number;
  seniority_score: number;
}

interface CarbonScoreCardProps {
  score: ScoreData;
}

const LEVEL_CONFIG: Record<
  string,
  { icon: React.ReactNode; i18nKey: string; color: string }
> = {
  bronze: {
    icon: <Medal className="h-4 w-4" strokeWidth={1.5} />,
    i18nKey: 'carbon:scoreBronze',
    color: 'text-[#00A86B]',
  },
  argent: {
    icon: <Award className="h-4 w-4" strokeWidth={1.5} />,
    i18nKey: 'carbon:scoreArgent',
    color: 'text-slate-500',
  },
  or: {
    icon: <Trophy className="h-4 w-4" strokeWidth={1.5} />,
    i18nKey: 'carbon:scoreOr',
    color: 'text-[#E6F7EF]0',
  },
  platine: {
    icon: <Gem className="h-4 w-4" strokeWidth={1.5} />,
    i18nKey: 'carbon:scorePlatine',
    color: 'text-[#E6F7EF]0',
  },
};

const LEVEL_THRESHOLDS = [
  { level: 'bronze', min: 0 },
  { level: 'argent', min: 25 },
  { level: 'or', min: 50 },
  { level: 'platine', min: 75 },
];

function getNextLevel(
  current: string,
): { name: string; threshold: number } | null {
  const idx = LEVEL_THRESHOLDS.findIndex(
    (l) => l.level === current.toLowerCase(),
  );
  if (idx === -1 || idx >= LEVEL_THRESHOLDS.length - 1) return null;
  const next = LEVEL_THRESHOLDS[idx + 1];
  return next ? { name: next.level, threshold: next.min } : null;
}

function ScoreBreakdownRow({
  labelKey,
  value,
}: {
  labelKey: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground text-sm">
        <Trans i18nKey={labelKey} />
      </span>
      <div className="flex items-center gap-2">
        <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="bg-primary h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(value, 100)}%` }}
          />
        </div>
        <span className="w-8 text-right text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}

export function CarbonScoreCard({ score }: CarbonScoreCardProps) {
  const circumference = 2 * Math.PI * 45;
  const progress = (score.total / 100) * circumference;
  const levelKey = score.level.toLowerCase();
  const config = LEVEL_CONFIG[levelKey] ?? LEVEL_CONFIG['bronze']!;
  const nextLevel = getNextLevel(score.level);

  const breakdowns = [
    { labelKey: 'carbon:scoreVolume', value: score.volume_score },
    { labelKey: 'carbon:scoreDiversity', value: score.diversity_score },
    { labelKey: 'carbon:scoreRegularity', value: score.regularity_score },
    { labelKey: 'carbon:scoreCo2', value: score.co2_score },
    { labelKey: 'carbon:scoreSeniority', value: score.seniority_score },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <Trans i18nKey="carbon:scoreTitle" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Circular gauge */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <svg width="160" height="160" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  className="text-primary transition-all duration-1000"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="46"
                  textAnchor="middle"
                  className="fill-current text-[1.75rem] font-bold"
                  dominantBaseline="middle"
                >
                  {score.total}
                </text>
                <text
                  x="50"
                  y="62"
                  textAnchor="middle"
                  className="fill-gray-400 text-[0.5rem]"
                >
                  / 100
                </text>
              </svg>
            </div>
            <div
              className={`flex items-center gap-1.5 text-sm font-semibold ${config.color}`}
            >
              <span>{config.icon}</span>
              <Trans i18nKey={config.i18nKey} />
            </div>
            {nextLevel && (
              <div className="w-full max-w-[160px]">
                <div className="mb-1 flex justify-between text-xs text-gray-500">
                  <span>{score.total}</span>
                  <span>{nextLevel.threshold}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(((score.total - (LEVEL_THRESHOLDS.find((l) => l.level === levelKey)?.min ?? 0)) / (nextLevel.threshold - (LEVEL_THRESHOLDS.find((l) => l.level === levelKey)?.min ?? 0))) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-3">
            {breakdowns.map((b) => (
              <ScoreBreakdownRow
                key={b.labelKey}
                labelKey={b.labelKey}
                value={b.value}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
