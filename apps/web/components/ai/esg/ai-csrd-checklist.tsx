'use client';

import { useEffect, useState } from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  XCircle,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { cn } from '@kit/ui/utils';

import { AIPoweredBadge } from '~/components/ai/shared/ai-powered-badge';
import { AILoadingState } from '~/components/ai/shared/ai-loading-state';
import { UpgradePrompt } from '~/home/_components/upgrade-prompt';
import { useComplianceAI } from '~/lib/hooks/use-ai';
import { useSubscription } from '~/lib/hooks/use-subscription';

type ItemStatus = 'complete' | 'partial' | 'missing';

interface ChecklistSubItem {
  label: string;
  status: ItemStatus;
  suggestion?: string;
}

interface ChecklistSection {
  code: string;
  title: string;
  percent: number;
  items: ChecklistSubItem[];
}

const COMPLIANCE_PROMPT =
  '\u00c9value la conformit\u00e9 CSRD de cette entreprise.';

const fallbackSections: ChecklistSection[] = [
  {
    code: 'E1',
    title: 'Changement climatique',
    percent: 78,
    items: [
      { label: 'Plan de transition climatique', status: 'complete' },
      { label: 'Objectifs de r\u00e9duction GES', status: 'complete' },
      {
        label: 'Analyse de r\u00e9silience climatique',
        status: 'partial',
        suggestion:
          'Compl\u00e9tez l\u2019analyse des risques physiques li\u00e9s au changement climatique (inondations, canicules).',
      },
      {
        label: 'Politique \u00e9nerg\u00e9tique',
        status: 'complete',
      },
      {
        label: 'M\u00e9triques Scope 3 compl\u00e8tes',
        status: 'missing',
        suggestion:
          'Les cat\u00e9gories 4, 6 et 9 du Scope 3 ne sont pas encore document\u00e9es. Lancez un audit fournisseurs.',
      },
    ],
  },
  {
    code: 'E5',
    title: '\u00c9conomie circulaire',
    percent: 52,
    items: [
      { label: 'Politique gestion des d\u00e9chets', status: 'complete' },
      {
        label: 'Flux de ressources entr\u00e9es/sorties',
        status: 'partial',
        suggestion:
          'Documentez les flux de mati\u00e8res premi\u00e8res et les taux de recyclage par cat\u00e9gorie.',
      },
      {
        label: 'Objectifs de circularit\u00e9',
        status: 'missing',
        suggestion:
          'D\u00e9finissez des objectifs chiffr\u00e9s de r\u00e9duction des d\u00e9chets et d\u2019augmentation du taux de recyclage.',
      },
      { label: 'Conception durable produits', status: 'partial' },
    ],
  },
  {
    code: 'S1',
    title: 'Effectifs propres',
    percent: 85,
    items: [
      { label: 'Conditions de travail', status: 'complete' },
      { label: '\u00c9galit\u00e9 de traitement', status: 'complete' },
      { label: 'Formation et d\u00e9veloppement', status: 'complete' },
      {
        label: 'Sant\u00e9 et s\u00e9curit\u00e9',
        status: 'partial',
        suggestion:
          'Ajoutez les indicateurs de taux de fr\u00e9quence et de gravit\u00e9 des accidents.',
      },
      { label: 'Dialogue social', status: 'complete' },
    ],
  },
  {
    code: 'G1',
    title: 'Conduite des affaires',
    percent: 68,
    items: [
      { label: 'Culture d\u2019entreprise et gouvernance', status: 'complete' },
      {
        label: 'Protection des lanceurs d\u2019alerte',
        status: 'partial',
        suggestion:
          'Mettez en place un canal de signalement conforme \u00e0 la directive europ\u00e9enne.',
      },
      { label: 'Gestion de la corruption', status: 'complete' },
      {
        label: 'Lobbying et influence politique',
        status: 'missing',
        suggestion:
          'Documentez les pratiques de lobbying et les positions de l\u2019entreprise sur les sujets cl\u00e9s.',
      },
    ],
  },
];

function StatusIcon({ status }: { status: ItemStatus }) {
  switch (status) {
    case 'complete':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case 'partial':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'missing':
      return <XCircle className="h-4 w-4 text-red-500" />;
  }
}

function percentColor(percent: number): string {
  if (percent >= 80) return 'text-emerald-600';
  if (percent >= 50) return 'text-amber-600';
  return 'text-red-600';
}

function barColor(percent: number): string {
  if (percent >= 80) return 'bg-emerald-500';
  if (percent >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

export function AICSRDChecklist({ className }: { className?: string }) {
  const { canAccess, requiredPlan } = useSubscription();
  const { ask, loading, error } = useComplianceAI();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const accessible = canAccess('csrd_report');

  useEffect(() => {
    if (accessible) {
      void ask(COMPLIANCE_PROMPT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessible]);

  if (!accessible) {
    return (
      <UpgradePrompt
        feature="Checklist CSRD / ESRS interactive"
        requiredPlan={requiredPlan('csrd_report')}
      />
    );
  }

  function toggleSection(code: string) {
    setExpanded((prev) => ({ ...prev, [code]: !prev[code] }));
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Conformit\u00e9 CSRD / ESRS</CardTitle>
          <AIPoweredBadge methodology="ESRS 2024" />
        </div>
        <CardDescription>
          \u00c9valuation interactive de votre conformit\u00e9 aux normes ESRS
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <AILoadingState lines={6} />
        ) : error ? (
          <div className="text-muted-foreground py-4 text-center text-sm">
            Impossible d&apos;\u00e9valuer la conformit\u00e9 CSRD. Veuillez r\u00e9essayer.
          </div>
        ) : (
          <div className="space-y-2">
            {fallbackSections.map((section) => {
              const isOpen = expanded[section.code] ?? false;
              return (
                <div
                  key={section.code}
                  className="overflow-hidden rounded-lg border"
                >
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(section.code)}
                    className="hover:bg-muted/50 flex w-full items-center gap-3 p-3 text-left transition-colors"
                    data-test={`csrd-section-${section.code}`}
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {section.code}
                    </Badge>
                    <span className="flex-1 text-sm font-medium">
                      {section.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            barColor(section.percent),
                          )}
                          style={{ width: `${section.percent}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          percentColor(section.percent),
                        )}
                      >
                        {section.percent}%
                      </span>
                    </div>
                  </button>

                  {/* Sub-items */}
                  {isOpen && (
                    <div className="border-t px-3 py-2">
                      <div className="space-y-2">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center gap-2 py-1 text-sm">
                              <StatusIcon status={item.status} />
                              <span
                                className={
                                  item.status === 'missing'
                                    ? 'text-muted-foreground'
                                    : ''
                                }
                              >
                                {item.label}
                              </span>
                            </div>
                            {item.suggestion && (
                              <div className="ml-6 flex items-start gap-1.5 rounded-md bg-violet-50 p-2 text-xs text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                                <Lightbulb className="mt-0.5 h-3 w-3 shrink-0" />
                                <span>{item.suggestion}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
