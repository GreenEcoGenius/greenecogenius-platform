'use client';

import { useState } from 'react';

import {
  Award,
  ChevronRight,
  Leaf,
  Monitor,
  Sparkles,
  Target,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

import { AILoadingState } from '~/components/ai/shared/ai-loading-state';
import { AIPoweredBadge } from '~/components/ai/shared/ai-powered-badge';
import { UpgradePrompt } from '~/home/_components/upgrade-prompt';
import { useRSEAI } from '~/lib/hooks/use-ai';
import { useSubscription } from '~/lib/hooks/use-subscription';

interface LabelCard {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  score?: number;
  threshold?: number;
  status: string;
  detail: string;
  simulatePrompt: string;
}

const labelCards: LabelCard[] = [
  {
    id: 'bcorp',
    name: 'B Corp',
    icon: Award,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    score: 72,
    threshold: 80,
    status: 'Ecart a combler: 8 points',
    detail:
      'Score estime 72/200. Seuil de certification: 80/200. Domaines a renforcer: Gouvernance et Communaute.',
    simulatePrompt:
      'Simule une certification B Corp detaillee pour notre entreprise. Evalue chaque domaine (Gouvernance, Employes, Communaute, Environnement, Clients) et donne le score estime avec les actions pour atteindre le seuil de 80/200.',
  },
  {
    id: 'greentech',
    name: 'GreenTech Innovation',
    icon: Leaf,
    color: 'text-verdure-600',
    bgColor: 'bg-verdure-50 dark:bg-verdure-950/30',
    status: 'Eligible',
    detail:
      "Criteres d'innovation verte satisfaits. Impact environnemental positif mesurable detecte.",
    simulatePrompt:
      "Simule une candidature GreenTech Innovation. Evalue nos criteres d'eligibilite: innovation technologique, impact environnemental, modele economique vert, et potentiel de deploiement.",
  },
  {
    id: 'labelnr',
    name: 'Label NR (INR)',
    icon: Monitor,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    status: 'Niveau NR1 atteignable',
    detail:
      "Numerique responsable: niveau NR1 accessible. Progression vers NR2 necessiterait des actions sur l'accessibilite et l'ecoconception.",
    simulatePrompt:
      'Simule une evaluation Label Numerique Responsable (INR). Evalue notre niveau (NR1/NR2) selon les axes: strategie, formation, achats, usages, fin de vie. Donne les actions prioritaires.',
  },
];

function LabelSimulatorCard({ label }: { label: LabelCard }) {
  const { ask, loading, response, error, reset } = useRSEAI();
  const [expanded, setExpanded] = useState(false);

  const Icon = label.icon;

  const handleSimulate = async () => {
    setExpanded(true);
    await ask(label.simulatePrompt);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg p-2.5 ${label.bgColor}`}>
            <Icon className={`h-5 w-5 ${label.color}`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">{label.name}</h4>
              {label.score !== undefined && label.threshold !== undefined && (
                <Badge
                  variant="outline"
                  className={
                    label.score >= label.threshold
                      ? 'border-verdure-200 text-verdure-700 dark:border-verdure-800 dark:text-verdure-400'
                      : 'border-[#8FDAB5] text-[#00A86B] dark:border-[#008F5A] dark:text-[#00A86B]'
                  }
                >
                  {label.score}/{label.threshold * 2.5}
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mt-1 text-xs">{label.detail}</p>

            {/* Score bar for B Corp */}
            {label.score !== undefined && label.threshold !== undefined && (
              <div className="mt-2">
                <div className="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{
                      width: `${(label.score / (label.threshold * 2.5)) * 100}%`,
                    }}
                  />
                  {/* Threshold marker */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-[#008F5A]"
                    style={{
                      left: `${(label.threshold / (label.threshold * 2.5)) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px]">
                  <span className="text-muted-foreground">
                    Score: {label.score}
                  </span>
                  <span className="text-[#008F5A]">
                    Seuil: {label.threshold}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                <Target className="mr-1 h-3 w-3" />
                {label.status}
              </Badge>
            </div>

            {/* Simulate button or results */}
            {!expanded && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 h-7 text-xs"
                onClick={handleSimulate}
              >
                <Sparkles className="mr-1.5 h-3 w-3" />
                Simuler
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            )}

            {expanded && loading && (
              <div className="mt-3">
                <AILoadingState lines={4} />
              </div>
            )}

            {expanded && error && (
              <div className="mt-3 rounded-md border border-[#8FDAB5] bg-[#E6F7EF] p-3 dark:border-[#008F5A] dark:bg-[#004428]/20">
                <p className="text-xs text-[#008F5A]">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-6 text-[10px]"
                  onClick={() => {
                    reset();
                    setExpanded(false);
                  }}
                >
                  Reessayer
                </Button>
              </div>
            )}

            {expanded && response && !loading && (
              <div className="mt-3 space-y-2">
                <div className={`rounded-md p-3 ${label.bgColor}`}>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">
                    {response.content}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px]"
                  onClick={() => {
                    reset();
                    setExpanded(false);
                  }}
                >
                  Fermer
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AILabelSimulator({ className }: { className?: string }) {
  const subscription = useSubscription();

  if (!subscription.loading && !subscription.canAccess('dedicated_support')) {
    return (
      <UpgradePrompt
        feature="Simulateur de labels RSE"
        requiredPlan="enterprise"
      />
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5 text-[#00A86B]" />
              Simulateur de labels
            </CardTitle>
            <AIPoweredBadge methodology="Multi-referentiel" />
          </div>
          <p className="text-muted-foreground text-xs">
            Estimez votre eligibilite aux principaux labels RSE et obtenez des
            recommandations personnalisees.
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {labelCards.map((label) => (
            <LabelSimulatorCard key={label.id} label={label} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
