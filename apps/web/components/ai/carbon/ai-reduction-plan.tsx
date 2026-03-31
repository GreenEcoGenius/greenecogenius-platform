'use client';

import { useEffect } from 'react';

import {
  Building2,
  CalendarCheck,
  Car,
  Factory,
  Leaf,
  Recycle,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
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
import { useCarbonAI } from '~/lib/hooks/use-ai';
import { useSubscription } from '~/lib/hooks/use-subscription';

interface ReductionAction {
  icon: typeof Leaf;
  title: string;
  impactPercent: number;
  co2Savings: string;
  estimatedCost: string;
  norm: string;
}

const REDUCTION_PROMPT =
  'Propose un plan de r\u00e9duction carbone personnalis\u00e9 avec 5 actions concr\u00e8tes, leur impact estim\u00e9 et co\u00fbt.';

const fallbackActions: ReductionAction[] = [
  {
    icon: Car,
    title: 'Transition flotte v\u00e9hicules \u00e9lectriques',
    impactPercent: 35,
    co2Savings: '-120 tCO2e/an',
    estimatedCost: '45 000 \u20ac',
    norm: 'GHG Protocol Scope 1',
  },
  {
    icon: Building2,
    title: 'R\u00e9novation \u00e9nerg\u00e9tique b\u00e2timents',
    impactPercent: 25,
    co2Savings: '-85 tCO2e/an',
    estimatedCost: '120 000 \u20ac',
    norm: 'GHG Protocol Scope 2',
  },
  {
    icon: Factory,
    title: 'Optimisation processus industriels',
    impactPercent: 18,
    co2Savings: '-62 tCO2e/an',
    estimatedCost: '30 000 \u20ac',
    norm: 'GHG Protocol Scope 1',
  },
  {
    icon: Recycle,
    title: 'Programme \u00e9conomie circulaire fournisseurs',
    impactPercent: 15,
    co2Savings: '-51 tCO2e/an',
    estimatedCost: '15 000 \u20ac',
    norm: 'GHG Protocol Scope 3',
  },
  {
    icon: Leaf,
    title: 'Compensation carbone certifi\u00e9e',
    impactPercent: 7,
    co2Savings: '-24 tCO2e/an',
    estimatedCost: '8 000 \u20ac',
    norm: 'GHG Protocol Scope 1-3',
  },
];

export function AIReductionPlan({ className }: { className?: string }) {
  const { canAccess, requiredPlan } = useSubscription();
  const { ask, loading, error } = useCarbonAI();

  const accessible = canAccess('ai_recommendations');

  useEffect(() => {
    if (accessible) {
      void ask(REDUCTION_PROMPT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessible]);

  if (!accessible) {
    return (
      <UpgradePrompt
        feature="Plan de r\u00e9duction carbone personnalis\u00e9"
        requiredPlan={requiredPlan('ai_recommendations')}
      />
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Plan de r\u00e9duction personnalis\u00e9</CardTitle>
          <AIPoweredBadge methodology="GHG Protocol" />
        </div>
        <CardDescription>
          Actions recommand\u00e9es class\u00e9es par impact potentiel
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <AILoadingState lines={5} />
        ) : error ? (
          <div className="text-muted-foreground py-4 text-center text-sm">
            Impossible de g\u00e9n\u00e9rer le plan de r\u00e9duction. Veuillez r\u00e9essayer.
          </div>
        ) : (
          <div className="space-y-3">
            {fallbackActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="bg-muted/40 rounded-lg border p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{action.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {action.norm}
                        </Badge>
                      </div>

                      {/* Impact bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Impact potentiel
                          </span>
                          <span className="font-medium text-emerald-600">
                            -{action.impactPercent}%
                          </span>
                        </div>
                        <div className="bg-muted h-2 overflow-hidden rounded-full">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${action.impactPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex gap-4">
                          <span className="text-muted-foreground">
                            \u00c9conomie:{' '}
                            <span className="font-medium text-emerald-600">
                              {action.co2Savings}
                            </span>
                          </span>
                          <span className="text-muted-foreground">
                            Co\u00fbt estim\u00e9:{' '}
                            <span className="font-medium">
                              {action.estimatedCost}
                            </span>
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          data-test={`reduction-plan-action-${index}`}
                        >
                          <CalendarCheck className="mr-1 h-3 w-3" />
                          Planifier
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
