'use client';

import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

import { AIPoweredBadge } from '~/components/ai/shared/ai-powered-badge';

interface Check {
  label: string;
  passed: boolean;
  detail?: string;
}

interface AITrustScoreProps {
  score: number;
  checks: Check[];
}

function getScoreColor(score: number) {
  if (score > 80)
    return { stroke: '#22c55e', text: 'text-verdure-600', label: 'Excellent' };
  if (score >= 50)
    return { stroke: '#00A86B', text: 'text-[#00A86B]', label: 'Moyen' };
  return { stroke: '#065f46', text: 'text-[#008F5A]', label: 'Critique' };
}

function CircularScore({ score }: { score: number }) {
  const { stroke, text } = getScoreColor(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-100 dark:text-[#F5F5F0]"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 64 64)"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${text}`}>{score}</span>
        <span className="text-[#B8D4E3] text-xs">/100</span>
      </div>
    </div>
  );
}

export function AITrustScore({ score, checks }: AITrustScoreProps) {
  const { label } = getScoreColor(score);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-5 w-5 text-verdure-600" />
            Score de confiance
          </CardTitle>
          <AIPoweredBadge />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Circular score */}
        <div className="flex flex-col items-center gap-2">
          <CircularScore score={score} />
          <Badge
            variant="outline"
            className={`text-xs ${
              score > 80
                ? 'border-[#1A5C3E] text-verdure-700 dark:border-verdure-800 dark:text-verdure-400'
                : score >= 50
                  ? 'border-[#8FDAB5] text-[#00A86B] dark:border-[#008F5A] dark:text-[#00A86B]'
                  : 'border-[#8FDAB5] text-[#008F5A] dark:border-[#008F5A] dark:text-[#00A86B]'
            }`}
          >
            {label}
          </Badge>
        </div>

        {/* Checks list */}
        <div className="space-y-2">
          {checks.map((check, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-md border p-2.5 text-sm"
            >
              {check.passed ? (
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-verdure-500" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#E6F7EF]0" />
              )}
              <div className="min-w-0">
                <span className="font-medium">{check.label}</span>
                {check.detail && (
                  <p className="text-[#B8D4E3] mt-0.5 text-xs">
                    {check.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Conformity badges */}
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Badge
            variant="outline"
            className="border-[#1A5C3E] text-verdure-700 dark:border-verdure-800 dark:text-verdure-400"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            ISO 59014
          </Badge>
          <Badge
            variant="outline"
            className="border-[#1A5C3E] text-verdure-700 dark:border-verdure-800 dark:text-verdure-400"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Decret tracabilite
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
