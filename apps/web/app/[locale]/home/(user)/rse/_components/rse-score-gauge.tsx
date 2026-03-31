'use client';

import { Trans } from '@kit/ui/trans';

interface RSEScoreGaugeProps {
  score: number;
  level: string;
}

function getScoreColor(score: number): string {
  if (score <= 40) return '#EF4444';
  if (score <= 60) return '#F97316';
  if (score <= 80) return '#EAB308';
  return '#22C55E';
}

export function RSEScoreGauge({ score, level }: RSEScoreGaugeProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            className="dark:stroke-gray-700"
          />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            className="transition-all duration-1000"
          />
          {/* Score text */}
          <text
            x="100"
            y="90"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current text-[2.5rem] font-bold"
          >
            {score}
          </text>
          <text
            x="100"
            y="115"
            textAnchor="middle"
            className="fill-gray-400 text-[0.75rem]"
          >
            / 100
          </text>
        </svg>
      </div>
      <div
        className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        <Trans i18nKey="rse:level" /> : {level}
      </div>
    </div>
  );
}
