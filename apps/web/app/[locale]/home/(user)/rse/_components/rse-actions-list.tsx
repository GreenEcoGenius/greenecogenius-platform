'use client';

import { CheckCircle2, Clock, Zap } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface Action {
  title: string;
  impact: number;
  effort: string;
  priority: string;
  pillar: string;
  norms: string[];
  status: string;
}

interface RSEActionsListProps {
  actions: Action[];
}

const PRIORITY_CONFIG: Record<
  string,
  { className: string; i18nKey: string; icon: React.ReactNode }
> = {
  urgent: {
    className:
      'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300 border-slate-200',
    i18nKey: 'rse:urgent',
    icon: <Zap className="h-3 w-3" />,
  },
  important: {
    className:
      'bg-[#C2DED1] text-[#1A3D32] dark:bg-[#224E3F]/40 dark:text-[#C2DED1] border-[#C2DED1]',
    i18nKey: 'rse:important',
    icon: <Clock className="h-3 w-3" />,
  },
  quick_win: {
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200',
    i18nKey: 'rse:quickWin',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
};

const PILLAR_COLORS: Record<string, string> = {
  governance: '#6366F1',
  environment: '#10B981',
  social: '#2D8C6A',
  ethics: '#8B5CF6',
  stakeholders: '#224E3F',
};

export function RSEActionsList({ actions }: RSEActionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-[#E6F2ED]0" />
          <Trans i18nKey="rse:actionsTitle" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, idx) => {
            const priorityConfig =
              PRIORITY_CONFIG[action.priority] ?? PRIORITY_CONFIG['important']!;
            const pillarColor = PILLAR_COLORS[action.pillar] ?? '#6B7280';

            return (
              <div
                key={idx}
                className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-gray-900/50"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={priorityConfig.className}
                    >
                      {priorityConfig.icon}
                      <span className="ml-1">
                        <Trans i18nKey={priorityConfig.i18nKey} />
                      </span>
                    </Badge>
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: pillarColor }}
                    />
                    <span className="text-muted-foreground text-xs">
                      <Trans i18nKey={`rse:${action.pillar}`} />
                    </span>
                  </div>
                  <p className="text-sm font-medium">{action.title}</p>
                  <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
                    <span>
                      <Trans i18nKey="rse:impact" /> +{action.impact}{' '}
                      <Trans i18nKey="rse:points" />
                    </span>
                    <span>
                      <Trans i18nKey="rse:effort" /> {action.effort}
                    </span>
                    {action.norms.length > 0 && (
                      <span className="flex gap-1">
                        {action.norms.map((norm) => (
                          <Badge
                            key={norm}
                            variant="outline"
                            className="px-1.5 py-0 text-[10px]"
                          >
                            {norm}
                          </Badge>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  <Trans i18nKey="rse:markDone" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
