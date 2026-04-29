'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface Pillar {
  name: string;
  score: number;
  norm: string;
  color: string;
}

interface RSEPillarCardsProps {
  pillars: Pillar[];
}

export function RSEPillarCards({ pillars }: RSEPillarCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {pillars.map((pillar) => (
        <Card key={pillar.name} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans i18nKey={`rse:${pillar.name}`} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-1">
              <span
                className="text-3xl font-bold"
                style={{ color: pillar.color }}
              >
                {pillar.score}
              </span>
              <span className="text-[#B8D4E3] text-sm">%</span>
            </div>
            {/* Progress bar */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#12472F] dark:bg-gray-800">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pillar.score}%`,
                  backgroundColor: pillar.color,
                }}
              />
            </div>
            <p className="text-[#B8D4E3] text-xs">
              <Trans i18nKey="rse:normRef" /> {pillar.norm}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
