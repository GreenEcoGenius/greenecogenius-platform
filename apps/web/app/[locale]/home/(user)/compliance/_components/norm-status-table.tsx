'use client';

import { useState } from 'react';

import { CheckCircle, Clock, Eye, MinusCircle, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

type NormStatus = 'compliant' | 'partial' | 'non_compliant' | 'not_evaluated';

interface NormRow {
  name: string;
  pillar: string;
  status: NormStatus;
  autoVerified: string;
  evidenceSummary: string;
}

const STATUS_CONFIG: Record<
  NormStatus,
  { icon: typeof CheckCircle; className: string; i18nKey: string }
> = {
  compliant: {
    icon: CheckCircle,
    className: 'bg-[#A8E6C8] text-[#159B5C]',
    i18nKey: 'compliance:statusCompliant',
  },
  partial: {
    icon: Clock,
    className: 'bg-amber-100 text-amber-700',
    i18nKey: 'compliance:statusPartial',
  },
  non_compliant: {
    icon: XCircle,
    className: 'bg-red-100 text-red-700',
    i18nKey: 'compliance:statusNonCompliant',
  },
  not_evaluated: {
    icon: MinusCircle,
    className: 'bg-gray-100 text-gray-500',
    i18nKey: 'compliance:statusNotEvaluated',
  },
};

type FilterType = 'all' | NormStatus;

export function NormStatusTable({ norms }: { norms: NormRow[] }) {
  const t = useTranslations('compliance');
  const [filter, setFilter] = useState<FilterType>('all');

  const PILLAR_NAMES: Record<string, string> = {
    circular_economy: t('pillarCircularEconomy'),
    carbon: t('pillarCarbonEnv'),
    reporting: t('pillarReportingEsg'),
    traceability: t('pillarTraceabilityName'),
    data: t('pillarDataSaas'),
    labels: t('pillarLabelsName'),
  };

  const METHOD_LABELS: Record<string, { label: string; icon: string }> = {
    auto_transaction: { label: t('methodEcosystem'), icon: '🔄' },
    auto_blockchain: { label: t('methodBlockchain'), icon: '⛓️' },
    auto_carbon: { label: t('methodAI'), icon: '🤖' },
    auto_esg: { label: t('methodESG'), icon: '📊' },
    auto_platform: { label: t('methodPlatform'), icon: '🏗️' },
    manual: { label: t('methodManual'), icon: '✍️' },
    pending: { label: t('methodPending'), icon: '⏳' },
  };

  const filtered =
    filter === 'all' ? norms : norms.filter((n) => n.status === filter);

  const counts = {
    all: norms.length,
    compliant: norms.filter((n) => n.status === 'compliant').length,
    partial: norms.filter((n) => n.status === 'partial').length,
    non_compliant: norms.filter((n) => n.status === 'non_compliant').length,
    not_evaluated: norms.filter((n) => n.status === 'not_evaluated').length,
  };

  const autoVerifiedCount = norms.filter(
    (n) => n.autoVerified !== 'manual' && n.autoVerified !== 'pending',
  ).length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">
            <Trans
              i18nKey="compliance:normTableTitle"
              defaults="Statut par norme"
            />
          </h3>
          <div className="flex gap-1.5">
            {(
              [
                { key: 'all' as const, label: t('filterAllLabel') },
                { key: 'compliant' as const, label: t('filterCompliantLabel') },
                { key: 'partial' as const, label: t('filterPartialLabel') },
                {
                  key: 'non_compliant' as const,
                  label: t('filterNonCompliantLabel'),
                },
              ] as const
            ).map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
                onClick={() => setFilter(key)}
              >
                {label}
                {counts[key] > 0 && (
                  <span className="ml-1 opacity-70">({counts[key]})</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs font-medium text-gray-500 uppercase">
                <th className="px-3 py-2">{t('columnNorm')}</th>
                <th className="px-3 py-2">{t('columnPillar')}</th>
                <th className="px-3 py-2">{t('columnStatus')}</th>
                <th className="px-3 py-2">{t('columnVerification')}</th>
                <th className="px-3 py-2">{t('columnAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((norm) => {
                const statusCfg = STATUS_CONFIG[norm.status];
                const StatusIcon = statusCfg.icon;
                const methodInfo =
                  METHOD_LABELS[norm.autoVerified] ?? METHOD_LABELS.pending!;

                return (
                  <tr key={norm.name} className="hover:bg-gray-50/50">
                    <td className="px-3 py-3 font-medium">{norm.name}</td>
                    <td className="text-muted-foreground px-3 py-3 text-xs">
                      {PILLAR_NAMES[norm.pillar] ?? norm.pillar}
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="outline" className={statusCfg.className}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        <Trans
                          i18nKey={statusCfg.i18nKey}
                          defaults={norm.status}
                        />
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs">
                        {methodInfo.icon} {methodInfo.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Eye className="mr-1 h-3 w-3" />
                        <Trans
                          i18nKey="compliance:viewDetails"
                          defaults="Voir détails"
                        />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-muted-foreground mt-4 text-xs">
          {autoVerifiedCount}/{norms.length}{' '}
          <Trans
            i18nKey="compliance:autoVerifiedCount"
            defaults="vérifiées automatiquement par la plateforme"
          />
        </p>
      </CardContent>
    </Card>
  );
}
