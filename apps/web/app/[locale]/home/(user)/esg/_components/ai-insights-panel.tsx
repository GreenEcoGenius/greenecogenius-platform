'use client';

import Link from 'next/link';

import {
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Trophy,
  TriangleAlert,
} from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import type { DemoData } from '~/lib/demo/demo-data';

function getIcon(type: DemoData['esg']['aiInsights'][number]['type']) {
  switch (type) {
    case 'strength':
      return <Trophy className="h-4 w-4 text-[#E6F7EF]0" />;
    case 'warning':
      return <TriangleAlert className="h-4 w-4 text-[#E6F7EF]0" />;
    case 'trend':
      return <TrendingUp className="h-4 w-4 text-blue-500" />;
    case 'tip':
      return <Lightbulb className="h-4 w-4 text-[#E6F7EF]0" />;
  }
}

export function AiInsightsPanel({
  insights,
}: {
  insights: DemoData['esg']['aiInsights'][number][];
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold">Insights IA</h3>
        <p className="text-muted-foreground mb-4 text-xs">
          Recommandations du reporting
        </p>

        <div className="space-y-3">
          {insights.map((insight) => (
            <div key={insight.id} className="flex gap-3 rounded-lg border p-3">
              <div className="mt-0.5 shrink-0">{getIcon(insight.type)}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {insight.description}
                </p>
                {insight.actionLabel && insight.actionHref && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-6 px-0 text-xs"
                    render={
                      <Link href={insight.actionHref}>
                        {insight.actionLabel}
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    }
                    nativeButton={false}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
