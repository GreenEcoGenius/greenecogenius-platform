'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface BenchmarkData {
  company: {
    emissions_per_employee: number;
    sector: string;
    nb_employees: number;
  };
  sector_average: number;
  comparison_pct: number;
  rating: string;
  all_sectors: Array<{ sector: string; average: number }>;
}

export function BenchmarkCard() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBenchmark() {
      try {
        const response = await fetch('/api/esg/benchmarking?year=2026');

        if (!response.ok) {
          setError('no_data');
          return;
        }

        const json = (await response.json()) as BenchmarkData;
        setData(json);
      } catch {
        setError('fetch_error');
      } finally {
        setLoading(false);
      }
    }

    void fetchBenchmark();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="bg-muted h-4 w-48 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return null;
  }

  const maxValue = Math.max(
    data.company.emissions_per_employee,
    data.sector_average,
    1,
  );

  const companyPct = (data.company.emissions_per_employee / maxValue) * 100;
  const sectorPct = (data.sector_average / maxValue) * 100;

  const ratingConfig: Record<
    string,
    {
      variant: 'default' | 'secondary' | 'outline' | 'destructive';
      i18nKey: string;
    }
  > = {
    excellent: { variant: 'default', i18nKey: 'esg:benchmarkExcellent' },
    good: { variant: 'secondary', i18nKey: 'esg:benchmarkGood' },
    average: { variant: 'outline', i18nKey: 'esg:benchmarkAverage' },
    needs_improvement: {
      variant: 'destructive',
      i18nKey: 'esg:benchmarkNeedsImprovement',
    },
  };

  const ratingInfo = ratingConfig[data.rating] ?? ratingConfig['average']!;

  const isBelow = data.comparison_pct < 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            <Trans i18nKey="esg:benchmarkTitle" />
          </h3>
          <Badge variant={ratingInfo.variant}>
            <Trans i18nKey={ratingInfo.i18nKey} />
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Company bar */}
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">
                <Trans i18nKey="esg:benchmarkYourCompany" />
              </span>
              <span className="text-muted-foreground">
                {data.company.emissions_per_employee.toFixed(1)}{' '}
                <Trans i18nKey="esg:benchmarkPerEmployee" />
              </span>
            </div>
            <div className="bg-muted h-3 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-[#E8F8F0]0 transition-all duration-700"
                style={{ width: `${companyPct}%` }}
              />
            </div>
          </div>

          {/* Sector average bar */}
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">
                <Trans i18nKey="esg:benchmarkSectorAvg" />
              </span>
              <span className="text-muted-foreground">
                {data.sector_average.toFixed(1)}{' '}
                <Trans i18nKey="esg:benchmarkPerEmployee" />
              </span>
            </div>
            <div className="bg-muted h-3 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-[#1BAF6A] transition-all duration-700"
                style={{ width: `${sectorPct}%` }}
              />
            </div>
          </div>

          {/* Comparison text */}
          <div className="border-t pt-3 text-center">
            <span
              className={`text-lg font-bold ${isBelow ? 'text-[#1BAF6A]' : 'text-slate-600'}`}
            >
              {Math.abs(data.comparison_pct)}%
            </span>{' '}
            <span className="text-muted-foreground text-sm">
              {isBelow ? (
                <Trans i18nKey="esg:benchmarkBelowAvg" />
              ) : (
                <Trans i18nKey="esg:benchmarkAboveAvg" />
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
