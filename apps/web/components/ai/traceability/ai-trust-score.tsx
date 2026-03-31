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
  if (score > 80) return { stroke: '#22c55e', text: 'text-green-600', label: 'Excellent' };
  if (score >= 50) return { stroke: '#eab308', text: 'text-yellow-600', label: 'Moyen' };
  return { stroke: '#ef4444', text: 'text-red-600', label: 'Critique' };
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
          className="text-gray-100 dark:text-gray-800"
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
        <span className="text-muted-foreground text-xs">/100</span>
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
            <ShieldCheck className="h-5 w-5 text-green-600" />
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
                ? 'border-green-200 text-green-700 dark:border-green-800 dark:text-green-400'
                : score >= 50
                  ? 'border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400'
                  : 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-400'
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
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
              )}
              <div className="min-w-0">
                <span className="font-medium">{check.label}</span>
                {check.detail && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
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
            className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            ISO 59014
          </Badge>
          <Badge
            variant="outline"
            className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Decret tracabilite
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
