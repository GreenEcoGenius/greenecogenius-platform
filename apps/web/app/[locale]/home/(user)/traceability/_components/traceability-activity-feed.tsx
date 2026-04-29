'use client';

import {
  Award,
  Blocks,
  Calculator,
  FileBarChart,
  Package,
  Truck,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import type { MockActivity } from '~/lib/mock/traceability-mock-data';

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  lot_created: <Package className="h-4 w-4 text-blue-500" />,
  lot_sold: <Package className="h-4 w-4 text-[#E6F7EF]0" />,
  lot_in_transit: <Truck className="h-4 w-4 text-[#E6F7EF]0" />,
  lot_delivered: <Truck className="h-4 w-4 text-[#E6F7EF]0" />,
  certificate_issued: <Award className="h-4 w-4 text-verdure-600" />,
  blockchain_recorded: <Blocks className="h-4 w-4 text-[#E6F7EF]0" />,
  co2_calculated: <Calculator className="h-4 w-4 text-verdure-500" />,
  esg_synced: <FileBarChart className="h-4 w-4 text-blue-500" />,
  lot_certified: <Award className="h-4 w-4 text-verdure-600" />,
};

const SECTION_COLORS: Record<string, string> = {
  marketplace:
    'bg-[#8FDAB5] text-[#00A86B] dark:bg-[#00A86B]/40 dark:text-[#8FDAB5]',
  inventaire:
    'bg-blue-900/30 text-blue-400',
  transport: 'bg-[#8FDAB5] text-[#00A86B] dark:bg-[#00A86B]/40 dark:text-[#8FDAB5]',
  suivi: 'bg-[#8FDAB5] text-[#00A86B] dark:bg-[#00A86B]/40 dark:text-[#8FDAB5]',
  certification:
    'bg-verdure-900/30 text-verdure-400',
  blockchain:
    'bg-[#8FDAB5] text-[#00A86B] dark:bg-[#00A86B]/40 dark:text-[#8FDAB5]',
  dashboard: 'bg-[#12472F] text-[#B8D4E3] dark:bg-gray-800 dark:text-[#7DC4A0]',
};

function formatTimeAgo(isoDate: string): string {
  const now = new Date('2026-03-30T12:00:00Z').getTime();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 60) return `il y a ${diffMin}min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays === 1) return 'hier';
  return `il y a ${diffDays}j`;
}

interface TraceabilityActivityFeedProps {
  activities: MockActivity[];
}

export function TraceabilityActivityFeed({
  activities,
}: TraceabilityActivityFeedProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          <Trans i18nKey="blockchain:activity" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {activities.map((activity, idx) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 px-5 py-4 ${
              idx < activities.length - 1 ? 'border-b' : ''
            }`}
          >
            {/* Green dot + icon */}
            <div className="relative mt-0.5 flex-shrink-0">
              <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                {ACTIVITY_ICONS[activity.type] ?? (
                  <Package className="h-4 w-4 text-[#7DC4A0]" />
                )}
              </div>
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#1A5C3E]0 dark:border-gray-900" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug">{activity.description}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {activity.affectedSections
                  .filter((s) => s !== 'dashboard')
                  .map((section) => (
                    <Badge
                      key={section}
                      variant="outline"
                      className={`text-[10px] ${SECTION_COLORS[section] ?? SECTION_COLORS.dashboard}`}
                    >
                      {section}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Timestamp */}
            <span className="text-[#B8D4E3] flex-shrink-0 text-xs">
              {formatTimeAgo(activity.timestamp)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
