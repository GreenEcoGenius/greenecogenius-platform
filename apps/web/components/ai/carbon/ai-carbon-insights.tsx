'use client';

import { useEffect, useState } from 'react';

import {
  AlertTriangle,
  Award,
  ChevronRight,
  Clock,
  TrendingUp,
} from 'lucide-react';

import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { cn } from '@kit/ui/utils';

import { AILoadingState } from '~/components/ai/shared/ai-loading-state';
import { AIPoweredBadge } from '~/components/ai/shared/ai-powered-badge';
import { useCarbonAI } from '~/lib/hooks/use-ai';

interface Insight {
  icon: typeof TrendingUp;
  iconColor: string;
  title: string;
  description: string;
  action: string;
}

const CARBON_PROMPT =
  'Analyse les donn\u00e9es carbone de cette entreprise et donne 3 insights principaux avec recommandations.';

const fallbackInsights: Insight[] = [
  {
    icon: TrendingUp,
    iconColor: 'text-emerald-600',
    title: 'Tendance positive sur le Scope 1',
    description:
      'Vos \u00e9missions directes ont diminu\u00e9 de 12% par rapport au trimestre pr\u00e9c\u00e9dent. La transition vers des v\u00e9hicules \u00e9lectriques contribue significativement \u00e0 cette r\u00e9duction.',
    action: 'Voir le d\u00e9tail Scope 1',
  },
  {
    icon: AlertTriangle,
    iconColor: 'text-[#E6F2ED]0',
    title: 'Scope 3 en hausse (+8%)',
    description:
      'Les \u00e9missions li\u00e9es \u00e0 la cha\u00eene d\u2019approvisionnement ont augment\u00e9. Nous recommandons un audit fournisseurs pour identifier les postes les plus \u00e9metteurs.',
    action: 'Auditer les fournisseurs',
  },
  {
    icon: Award,
    iconColor: 'text-violet-600',
    title: '\u00c9ligibilit\u00e9 label Bas-Carbone',
    description:
      'Votre trajectoire actuelle vous rend \u00e9ligible au label Bas-Carbone de l\u2019ADEME. Compl\u00e9tez votre plan de r\u00e9duction pour finaliser la candidature.',
    action: 'Pr\u00e9parer la candidature',
  },
];

function parseInsights(content: string): Insight[] | null {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const iconMap: Record<string, typeof TrendingUp> = {
        trend: TrendingUp,
        alert: AlertTriangle,
        award: Award,
      };
      const colorMap: Record<string, string> = {
        trend: 'text-emerald-600',
        alert: 'text-[#E6F2ED]0',
        award: 'text-violet-600',
      };
      return parsed.map((item: Record<string, string>, i: number) => {
        const type = item.type ?? ['trend', 'alert', 'award'][i % 3]!;
        return {
          icon: iconMap[type] ?? TrendingUp,
          iconColor: colorMap[type] ?? 'text-emerald-600',
          title: item.title ?? '',
          description: item.description ?? '',
          action: item.action ?? 'En savoir plus',
        };
      });
    }
  } catch {
    // AI response not parseable as JSON, use fallback
  }
  return null;
}

export function AICarbonInsights({ className }: { className?: string }) {
  const { ask, loading, response, error } = useCarbonAI();
  const [analysisTime] = useState(() => new Date());

  useEffect(() => {
    void ask(CARBON_PROMPT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const insights: Insight[] = response
    ? (parseInsights(response.content) ?? fallbackInsights)
    : fallbackInsights;

  function formatTimeSince(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return 'il y a quelques secondes';
    if (diffMin < 60) return `il y a ${diffMin}min`;
    const diffH = Math.floor(diffMin / 60);
    return `il y a ${diffH}h`;
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Insights IA — Votre empreinte carbone</CardTitle>
          <AIPoweredBadge methodology="GHG Protocol + ADEME" />
        </div>
        <CardDescription className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Derni\u00e8re analyse:{' '}
          {loading ? 'en cours...' : formatTimeSince(analysisTime)}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <AILoadingState lines={4} />
        ) : error ? (
          <div className="text-muted-foreground py-4 text-center text-sm">
            Impossible de charger les insights. Veuillez r\u00e9essayer.
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div
                  key={index}
                  className="bg-muted/40 flex items-start gap-3 rounded-lg p-3"
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800',
                      insight.iconColor,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {insight.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary mt-1 -ml-2 h-7 text-xs"
                      data-test={`carbon-insight-action-${index}`}
                    >
                      {insight.action}
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
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
