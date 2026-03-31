'use client';

import { useState } from 'react';

import {
  Award,
  Building2,
  Heart,
  Leaf,
  Scale,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

import { AILoadingState } from '~/components/ai/shared/ai-loading-state';
import { AIPoweredBadge } from '~/components/ai/shared/ai-powered-badge';
import { UpgradePrompt } from '~/home/_components/upgrade-prompt';
import { useRSEAI } from '~/lib/hooks/use-ai';
import { useSubscription } from '~/lib/hooks/use-subscription';

interface DomainScore {
  name: string;
  score: number;
  icon: React.ElementType;
  color: string;
}

const defaultDomains: DomainScore[] = [
  { name: 'Gouvernance', score: 72, icon: Building2, color: 'bg-blue-500' },
  { name: 'Environnement', score: 85, icon: Leaf, color: 'bg-green-500' },
  { name: 'Social', score: 68, icon: Heart, color: 'bg-pink-500' },
  { name: 'Ethique', score: 76, icon: Scale, color: 'bg-purple-500' },
  { name: 'Parties prenantes', score: 61, icon: Users, color: 'bg-orange-500' },
];

const defaultStrengths = [
  'Politique environnementale bien structuree',
  'Gouvernance transparente avec comite RSE actif',
  'Reporting carbone conforme aux standards',
];

const defaultImprovements = [
  'Renforcer le dialogue avec les parties prenantes externes',
  'Formaliser la politique ethique et anti-corruption',
  'Ameliorer les indicateurs sociaux (QVT, diversite)',
];

interface LabelEligibility {
  name: string;
  status: 'eligible' | 'en_cours' | 'non_eligible';
  detail: string;
}

const defaultLabels: LabelEligibility[] = [
  { name: 'B Corp', status: 'en_cours', detail: 'Score estime: 72/200 (seuil: 80)' },
  { name: 'GreenTech', status: 'eligible', detail: 'Criteres remplis' },
  { name: 'Label NR', status: 'en_cours', detail: 'Niveau NR1 atteignable' },
];

const statusConfig = {
  eligible: {
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    label: 'Eligible',
  },
  en_cours: {
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    label: 'En cours',
  },
  non_eligible: {
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    label: 'Non eligible',
  },
};

export function AIDiagnostic() {
  const subscription = useSubscription();
  const { ask, loading, response, error, reset } = useRSEAI();
  const [hasDiagnosed, setHasDiagnosed] = useState(false);

  if (!subscription.loading && !subscription.canAccess('dedicated_support')) {
    return (
      <UpgradePrompt
        feature="Diagnostic RSE complet"
        requiredPlan="enterprise"
      />
    );
  }

  const handleDiagnose = async () => {
    setHasDiagnosed(true);
    await ask('Realise un diagnostic RSE complet selon ISO 26000');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-emerald-600" />
            Diagnostic RSE
          </CardTitle>
          <AIPoweredBadge methodology="ISO 26000" />
        </div>
      </CardHeader>

      <CardContent>
        {!hasDiagnosed && !loading && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="rounded-full bg-emerald-50 p-4 dark:bg-emerald-950/30">
              <Shield className="h-8 w-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Diagnostic RSE complet</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Evaluation selon les 5 domaines ISO 26000 avec recommandations
                personnalisees.
              </p>
            </div>
            <Button
              onClick={handleDiagnose}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Lancer le diagnostic RSE
            </Button>
          </div>
        )}

        {loading && (
          <div className="py-6">
            <p className="mb-4 text-center text-sm text-emerald-600">
              Analyse RSE en cours selon ISO 26000...
            </p>
            <AILoadingState lines={5} />
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
            <p className="text-sm text-red-600">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                reset();
                setHasDiagnosed(false);
              }}
            >
              Reessayer
            </Button>
          </div>
        )}

        {(hasDiagnosed && !loading && !error) && (
          <div className="space-y-6">
            {/* Domain scores */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Scores par domaine</h4>
              {defaultDomains.map((domain) => {
                const Icon = domain.icon;
                return (
                  <div key={domain.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-500" />
                        <span>{domain.name}</span>
                      </div>
                      <span className="font-semibold">{domain.score}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${domain.color}`}
                        style={{ width: `${domain.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI response */}
            {response && (
              <div className="rounded-md border bg-emerald-50/50 p-4 dark:bg-emerald-950/10">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {response.content}
                </p>
              </div>
            )}

            {/* Strengths */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-400">
                Points forts
              </h4>
              <ul className="space-y-1.5">
                {defaultStrengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 text-green-500">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-orange-700 dark:text-orange-400">
                Axes d&apos;amelioration
              </h4>
              <ul className="space-y-1.5">
                {defaultImprovements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 text-orange-500">-</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Label eligibility */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Award className="h-4 w-4" />
                Eligibilite aux labels
              </h4>
              <div className="space-y-2">
                {defaultLabels.map((label) => {
                  const config = statusConfig[label.status];
                  return (
                    <div
                      key={label.name}
                      className="flex items-center justify-between rounded-md border p-2.5"
                    >
                      <div>
                        <span className="text-sm font-medium">{label.name}</span>
                        <p className="text-muted-foreground text-xs">
                          {label.detail}
                        </p>
                      </div>
                      <Badge className={`text-[10px] ${config.badge}`}>
                        {config.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer + reset */}
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground text-[10px]">
                Genere par IA -- les resultats peuvent contenir des inexactitudes
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  reset();
                  setHasDiagnosed(false);
                }}
              >
                Nouveau diagnostic
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
