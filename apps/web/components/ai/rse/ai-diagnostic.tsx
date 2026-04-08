'use client';

import { useMemo, useState } from 'react';

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
import { useTranslations } from 'next-intl';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

import { AILoadingState } from '~/components/ai/shared/ai-loading-state';
import { AIPoweredBadge } from '~/components/ai/shared/ai-powered-badge';
import { UpgradePrompt } from '~/home/_components/upgrade-prompt';
import { useRSEAI } from '~/lib/hooks/use-ai';
import { useSubscription } from '~/lib/hooks/use-subscription';

interface DomainScore {
  nameKey: string;
  score: number;
  icon: React.ElementType;
  color: string;
}

interface LabelEligibility {
  nameKey: string;
  detailKey: string;
  status: 'eligible' | 'en_cours' | 'non_eligible';
}

export function AIDiagnostic() {
  const t = useTranslations('rse');
  const subscription = useSubscription();
  const { ask, loading, response, error, reset } = useRSEAI();
  const [hasDiagnosed, setHasDiagnosed] = useState(false);

  const defaultDomains: DomainScore[] = useMemo(
    () => [
      {
        nameKey: 'domainGovernance',
        score: 72,
        icon: Building2,
        color: 'bg-blue-500',
      },
      {
        nameKey: 'domainEnvironment',
        score: 85,
        icon: Leaf,
        color: 'bg-green-500',
      },
      { nameKey: 'domainSocial', score: 68, icon: Heart, color: 'bg-pink-500' },
      {
        nameKey: 'domainEthics',
        score: 76,
        icon: Scale,
        color: 'bg-purple-500',
      },
      {
        nameKey: 'domainStakeholders',
        score: 61,
        icon: Users,
        color: 'bg-[#E6F2ED]0',
      },
    ],
    [],
  );

  const defaultStrengths = [
    'strengthPolicyEnv',
    'strengthGovernance',
    'strengthReporting',
  ];

  const defaultImprovements = [
    'improvementStakeholders',
    'improvementEthics',
    'improvementSocial',
  ];

  const defaultLabels: LabelEligibility[] = [
    {
      nameKey: 'labelBCorp',
      detailKey: 'labelBCorpDetail',
      status: 'en_cours',
    },
    {
      nameKey: 'labelGreenTech',
      detailKey: 'labelGreenTechDetail',
      status: 'eligible',
    },
    { nameKey: 'labelNR', detailKey: 'labelNRDetail', status: 'en_cours' },
  ];

  const statusConfig = {
    eligible: {
      badge:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      label: t('eligibleLabel'),
    },
    en_cours: {
      badge: 'bg-[#C2DED1] text-[#224E3F] dark:bg-[#224E3F]/30 dark:text-[#2D8C6A]',
      label: t('inProgressLabel'),
    },
    non_eligible: {
      badge:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      label: t('notEligibleLabel'),
    },
  };

  if (!subscription.loading && !subscription.canAccess('dedicated_support')) {
    return (
      <UpgradePrompt
        feature={t('aiDiagnosticFeature')}
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
            {t('aiDiagnosticTitle')}
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
              <p className="text-sm font-medium">{t('aiDiagnosticFeature')}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {t('aiDiagnosticDesc')}
              </p>
            </div>
            <Button
              onClick={handleDiagnose}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {t('aiDiagnosticRun')}
            </Button>
          </div>
        )}

        {loading && (
          <div className="py-6">
            <p className="mb-4 text-center text-sm text-emerald-600">
              {t('aiDiagnosticAnalyzing')}
            </p>
            <AILoadingState lines={5} />
          </div>
        )}

        {error && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
            <p className="text-sm text-emerald-700">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                reset();
                setHasDiagnosed(false);
              }}
            >
              {t('aiDiagnosticRetry')}
            </Button>
          </div>
        )}

        {hasDiagnosed && !loading && !error && (
          <div className="space-y-6">
            {/* Domain scores */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">
                {t('aiDiagnosticScoresByDomain')}
              </h4>
              {defaultDomains.map((domain) => {
                const Icon = domain.icon;
                return (
                  <div key={domain.nameKey} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-500" />
                        <span>{t(domain.nameKey)}</span>
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
                {t('strengths')}
              </h4>
              <ul className="space-y-1.5">
                {defaultStrengths.map((k) => (
                  <li key={k} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 text-green-500">+</span>
                    {t(k)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-[#224E3F] dark:text-[#2D8C6A]">
                {t('improvements')}
              </h4>
              <ul className="space-y-1.5">
                {defaultImprovements.map((k) => (
                  <li key={k} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 text-[#E6F2ED]0">-</span>
                    {t(k)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Label eligibility */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Award className="h-4 w-4" />
                {t('labelEligibility')}
              </h4>
              <div className="space-y-2">
                {defaultLabels.map((label) => {
                  const config = statusConfig[label.status];
                  return (
                    <div
                      key={label.nameKey}
                      className="flex items-center justify-between rounded-md border p-2.5"
                    >
                      <div>
                        <span className="text-sm font-medium">
                          {t(label.nameKey)}
                        </span>
                        <p className="text-muted-foreground text-xs">
                          {t(label.detailKey)}
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
                {t('aiDisclaimer')}
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
                {t('aiDiagnosticNewDiagnostic')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
