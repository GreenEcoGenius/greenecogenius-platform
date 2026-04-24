'use client';

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import type { DemoData } from '~/lib/demo/demo-data';

function getBarColor(pct: number): string {
  if (pct >= 80) return 'bg-[#E6F7EF]0';
  if (pct >= 50) return 'bg-[#E6F7EF]0';
  return 'bg-slate-400';
}

function getTextColor(pct: number): string {
  if (pct >= 80) return 'text-[#00A86B]';
  if (pct >= 50) return 'text-[#00A86B]';
  return 'text-slate-500';
}

export function CsrdComplianceChart({
  indicators,
}: {
  indicators: DemoData['esg']['csrdIndicators'][number][];
}) {
  const t = useTranslations('esg');
  let lastCategory = '';

  const getCategoryLabel = (cat: string): string => {
    switch (cat) {
      case 'environment':
        return t('csrdCategoryEnvironment');
      case 'social':
        return t('csrdCategorySocial');
      case 'governance':
        return t('csrdCategoryGovernance');
      default:
        return cat;
    }
  };

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold">{t('csrdTitle')}</h3>
        <p className="text-muted-foreground mb-4 text-xs">
          {t('csrdEsrsStandards')}
        </p>

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
                {t('csrdViewFullTable')}
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
