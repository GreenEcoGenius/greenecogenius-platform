'use client';

import { useState } from 'react';

import { CheckCircle2, Loader2, Square } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

type ActionStatus = 'todo' | 'in_progress' | 'done';
type ActionPriority = 'quick_win' | 'urgent' | 'important';

interface RoadmapAction {
  id: string;
  title: string;
  pillar: string;
  impact: number;
  effort: string;
  priority: ActionPriority;
  status: ActionStatus;
  dueDate: string;
  norms: string[];
  quarter: string;
}

const STATUS_CYCLE: ActionStatus[] = ['todo', 'in_progress', 'done'];

const STATUS_ICONS: Record<ActionStatus, React.ReactNode> = {
  done: (
    <CheckCircle2 size={16} strokeWidth={1.5} className="text-[#E6F7EF]0" />
  ),
  in_progress: (
    <Loader2 size={16} strokeWidth={1.5} className="text-[#E6F7EF]0" />
  ),
  todo: <Square size={16} strokeWidth={1.5} className="text-slate-400" />,
};

const PILLAR_COLORS: Record<string, string> = {
  governance: 'bg-[#8FDAB5] text-[#008F5A] dark:bg-[#00A86B] dark:text-[#8FDAB5]',
  environment:
    'bg-[#8FDAB5] text-[#008F5A] dark:bg-[#004428] dark:text-[#8FDAB5]',
  social: 'bg-verdure-100 text-verdure-800 dark:bg-verdure-900 dark:text-verdure-300',
  ethics: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  stakeholders: 'bg-[#E6F7EF] text-[#00A86B] dark:bg-[#00A86B] dark:text-[#8FDAB5]',
};

const PRIORITY_STYLES: Record<ActionPriority, string> = {
  urgent: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  important: 'bg-[#8FDAB5] text-[#008F5A] dark:bg-[#00A86B] dark:text-[#8FDAB5]',
  quick_win: 'bg-[#8FDAB5] text-[#008F5A] dark:bg-[#00A86B] dark:text-[#8FDAB5]',
};

const PILLAR_LABELS: Record<string, string> = {
  governance: 'Gouvernance',
  environment: 'Environnement',
  social: 'Social',
  ethics: 'Ethique',
  stakeholders: 'Parties prenantes',
};

const PRIORITY_LABELS: Record<ActionPriority, string> = {
  urgent: 'Urgent',
  important: 'Important',
  quick_win: 'Quick win',
};

export function RoadmapTimeline({
  actions: initialActions,
}: {
  actions: RoadmapAction[];
}) {
  const [actions, setActions] = useState<RoadmapAction[]>(initialActions);

  const toggleStatus = (id: string) => {
    setActions((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const currentIdx = STATUS_CYCLE.indexOf(a.status);
        const nextIdx = (currentIdx + 1) % STATUS_CYCLE.length;
        return { ...a, status: STATUS_CYCLE[nextIdx]! };
      }),
    );
  };

  // Group by quarter
  const quarters = Array.from(new Set(actions.map((a) => a.quarter)));

  return (
    <div className="space-y-8">
      {quarters.map((quarter) => {
        const quarterActions = actions.filter((a) => a.quarter === quarter);
        return (
          <div key={quarter} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span className="text-sm font-bold">{quarter}</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="space-y-3">
              {quarterActions.map((action) => (
                <Card
                  key={action.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      {/* Status toggle */}
                      <button
                        onClick={() => toggleStatus(action.id)}
                        className="mt-0.5 cursor-pointer text-xl leading-none"
                        title="Changer le statut"
                      >
                        {STATUS_ICONS[action.status]}
                      </button>

                      {/* Content */}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-sm font-medium ${action.status === 'done' ? 'text-muted-foreground line-through' : ''}`}
                          >
                            {action.title}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={PILLAR_COLORS[action.pillar] ?? ''}
                          >
                            {PILLAR_LABELS[action.pillar] ?? action.pillar}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={PRIORITY_STYLES[action.priority] ?? ''}
                          >
                            {PRIORITY_LABELS[action.priority] ??
                              action.priority}
                          </Badge>
                          {action.norms.map((norm) => (
                            <Badge
                              key={norm}
                              variant="outline"
                              className="text-xs"
                            >
                              {norm}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-muted-foreground flex items-center gap-4 text-xs">
                          <span>
                            <Trans i18nKey="rse:impact" />: +{action.impact}{' '}
                            <Trans i18nKey="rse:points" />
                          </span>
                          <span>
                            <Trans i18nKey="rse:effort" />: {action.effort}
                          </span>
                          <span>
                            <Trans i18nKey="rse:dueDate" />: {action.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
