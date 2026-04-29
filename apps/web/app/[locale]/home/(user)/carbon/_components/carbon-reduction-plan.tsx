'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  TrendingDown,
  DollarSign,
  Leaf,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { Trans } from '@kit/ui/trans';

interface ReductionAction {
  id: string;
  title: string;
  description: string;
  co2Reduction: number;
  investmentEur: number;
  roiMonths: number;
  difficulty: 'easy' | 'medium' | 'hard';
  scope: 1 | 2 | 3;
  category: string;
}

const DEMO_ACTIONS: ReductionAction[] = [
  {
    id: '1',
    title: 'Passage aux énergies renouvelables',
    description:
      'Souscrire un contrat énergie verte pour les locaux. Réduction immédiate du Scope 2.',
    co2Reduction: 12.5,
    investmentEur: 2400,
    roiMonths: 8,
    difficulty: 'easy',
    scope: 2,
    category: 'Énergie',
  },
  {
    id: '2',
    title: 'Optimisation logistique fournisseurs',
    description:
      'Consolider les livraisons et privilégier les fournisseurs locaux (<200km).',
    co2Reduction: 8.3,
    investmentEur: 0,
    roiMonths: 0,
    difficulty: 'medium',
    scope: 3,
    category: 'Transport',
  },
  {
    id: '3',
    title: 'Télétravail 2j/semaine',
    description:
      'Réduire les déplacements domicile-travail. Impact direct sur le Scope 3.',
    co2Reduction: 4.2,
    investmentEur: 500,
    roiMonths: 2,
    difficulty: 'easy',
    scope: 3,
    category: 'Mobilité',
  },
  {
    id: '4',
    title: 'Isolation thermique des locaux',
    description:
      'Améliorer l\'isolation pour réduire la consommation de chauffage.',
    co2Reduction: 6.8,
    investmentEur: 15000,
    roiMonths: 36,
    difficulty: 'hard',
    scope: 1,
    category: 'Bâtiment',
  },
  {
    id: '5',
    title: 'Économie circulaire des emballages',
    description:
      'Passer aux emballages réutilisables ou recyclés pour les expéditions.',
    co2Reduction: 3.1,
    investmentEur: 1200,
    roiMonths: 6,
    difficulty: 'medium',
    scope: 3,
    category: 'Matériaux',
  },
];

function getDifficultyBadge(d: ReductionAction['difficulty']) {
  switch (d) {
    case 'easy':
      return (
        <Badge
          variant="outline"
          className="border-[#8FDAB5] text-[10px] text-[#00A86B]"
        >
          <Trans i18nKey="carbon:difficultyEasy" defaults="Facile" />
        </Badge>
      );
    case 'medium':
      return (
        <Badge
          variant="outline"
          className="border-amber-300 text-[10px] text-amber-500"
        >
          <Trans i18nKey="carbon:difficultyMedium" defaults="Moyen" />
        </Badge>
      );
    case 'hard':
      return (
        <Badge
          variant="outline"
          className="border-red-300 text-[10px] text-red-400"
        >
          <Trans i18nKey="carbon:difficultyHard" defaults="Complexe" />
        </Badge>
      );
  }
}

export function CarbonReductionPlan() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalReduction = DEMO_ACTIONS.reduce(
    (s, a) => s + a.co2Reduction,
    0,
  );
  const totalInvestment = DEMO_ACTIONS.reduce(
    (s, a) => s + a.investmentEur,
    0,
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#1A5C3E] p-2">
              <Sparkles className="h-5 w-5 text-[#00A86B]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                <Trans
                  i18nKey="carbon:reductionPlanTitle"
                  defaults="Plan de réduction carbone"
                />
              </h3>
              <p className="text-[#B8D4E3] text-xs">
                {`Personnalisé par Genius IA · ${DEMO_ACTIONS.length} actions recommandées`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#00A86B]">
              -{totalReduction.toFixed(1)}t
            </p>
            <p className="text-[#B8D4E3] text-xs">
              <Trans
                i18nKey="carbon:reductionPotential"
                defaults="CO₂ évitable/an"
              />
            </p>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[#1A5C3E]/30 p-3 text-center">
            <TrendingDown className="mx-auto mb-1 h-4 w-4 text-[#00A86B]" />
            <p className="text-lg font-bold text-[#00A86B]">
              -{totalReduction.toFixed(0)}t
            </p>
            <p className="text-[10px] text-[#B8D4E3]">
              <Trans i18nKey="carbon:reductionTotal" defaults="Réduction totale" />
            </p>
          </div>
          <div className="rounded-lg bg-[#1A5C3E]/30 p-3 text-center">
            <DollarSign className="mx-auto mb-1 h-4 w-4 text-[#00A86B]" />
            <p className="text-lg font-bold text-[#00A86B]">
              {(totalInvestment / 1000).toFixed(1)}k€
            </p>
            <p className="text-[10px] text-[#B8D4E3]">
              <Trans
                i18nKey="carbon:reductionInvestment"
                defaults="Investissement"
              />
            </p>
          </div>
          <div className="rounded-lg bg-[#1A5C3E]/30 p-3 text-center">
            <Clock className="mx-auto mb-1 h-4 w-4 text-[#00A86B]" />
            <p className="text-lg font-bold text-[#00A86B]">12</p>
            <p className="text-[10px] text-[#B8D4E3]">
              <Trans i18nKey="carbon:reductionRoi" defaults="Mois ROI moyen" />
            </p>
          </div>
        </div>

        {/* Actions list */}
        <div className="space-y-2">
          {DEMO_ACTIONS.map((action) => (
            <div
              key={action.id}
              className="rounded-lg border border-[#8FDAB5]/20 bg-[#1A5C3E]/10 transition-all"
            >
              <button
                onClick={() =>
                  setExpanded(expanded === action.id ? null : action.id)
                }
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1A5C3E]">
                  <Leaf className="h-4 w-4 text-[#00A86B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{action.title}</span>
                    {getDifficultyBadge(action.difficulty)}
                    <Badge
                      variant="outline"
                      className="text-[10px] text-[#B8D4E3]"
                    >
                      Scope {action.scope}
                    </Badge>
                  </div>
                  <p className="text-[#B8D4E3] text-xs">{action.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#00A86B]">
                    -{action.co2Reduction}t
                  </span>
                  {expanded === action.id ? (
                    <ChevronUp className="h-4 w-4 text-[#B8D4E3]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#B8D4E3]" />
                  )}
                </div>
              </button>
              {expanded === action.id && (
                <div className="border-t border-[#8FDAB5]/10 px-3 pb-3 pt-2">
                  <p className="text-[#B8D4E3] mb-3 text-sm">
                    {action.description}
                  </p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-[#B8D4E3]">
                      💰 Investissement:{' '}
                      <strong className="text-[#F5F5F0]">
                        {action.investmentEur === 0
                          ? 'Gratuit'
                          : `${action.investmentEur.toLocaleString()}€`}
                      </strong>
                    </span>
                    <span className="text-[#B8D4E3]">
                      ⏱ ROI:{' '}
                      <strong className="text-[#F5F5F0]">
                        {action.roiMonths === 0
                          ? 'Immédiat'
                          : `${action.roiMonths} mois`}
                      </strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
