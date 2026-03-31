'use client';

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import type { CsrdIndicator } from '../_lib/esg-mock-data';

function getBarColor(pct: number): string {
  if (pct >= 80) return 'bg-emerald-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-red-400';
}

function getTextColor(pct: number): string {
  if (pct >= 80) return 'text-emerald-600';
  if (pct >= 50) return 'text-amber-600';
  return 'text-red-500';
}

function getCategoryLabel(cat: string): string {
  switch (cat) {
    case 'environment':
      return 'Environnement';
    case 'social':
      return 'Social';
    case 'governance':
      return 'Gouvernance';
    default:
      return cat;
  }
}

export function CsrdComplianceChart({
  indicators,
}: {
  indicators: CsrdIndicator[];
}) {
  let lastCategory = '';

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold">Conformite CSRD</h3>
        <p className="text-muted-foreground mb-4 text-xs">Normes ESRS</p>

        <div className="space-y-2">
          {indicators.map((ind) => {
            const showCategory = ind.category !== lastCategory;
            lastCategory = ind.category;

            return (
              <div key={ind.code}>
                {showCategory && (
                  <p className="text-muted-foreground mt-3 mb-1 text-[10px] font-semibold tracking-wider uppercase first:mt-0">
                    {getCategoryLabel(ind.category)}
                  </p>
                )}
                <Link
                  href={`/home/esg/csrd`}
                  className="group flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <span className="w-8 text-xs font-semibold text-gray-500">
                    {ind.code}
                  </span>
                  <div className="flex-1">
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getBarColor(ind.completionPct)}`}
                        style={{ width: `${ind.completionPct}%` }}
                        role="progressbar"
                        aria-valuenow={ind.completionPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                  <span
                    className={`w-10 text-right text-xs font-semibold ${getTextColor(ind.completionPct)}`}
                  >
                    {ind.completionPct}%
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-4 border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            render={
              <Link href="/home/esg/csrd">
                Voir le tableau CSRD complet
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            }
            nativeButton={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
