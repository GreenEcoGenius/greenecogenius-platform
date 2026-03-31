'use client';

import { useState } from 'react';

import { BarChart3, Eye, Hand, Link2, Sparkles } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

type NormStatus = 'compliant' | 'partial' | 'non_compliant' | 'not_evaluated';
type VerificationType = 'blockchain' | 'ai' | 'ecosystem' | 'manual';

interface Norm {
  name: string;
  pillar: string;
  status: NormStatus;
  autoVerified: VerificationType;
}

const MOCK_NORMS: Norm[] = [
  // Economie circulaire (11)
  {
    name: 'Loi AGEC',
    pillar: 'circular',
    status: 'compliant',
    autoVerified: 'blockchain',
  },
  {
    name: 'REP (filières)',
    pillar: 'circular',
    status: 'partial',
    autoVerified: 'ecosystem',
  },
  {
    name: 'Indice de réparabilité',
    pillar: 'circular',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'Éco-conception (ISO 14006)',
    pillar: 'circular',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'Affichage environnemental',
    pillar: 'circular',
    status: 'compliant',
    autoVerified: 'ecosystem',
  },
  {
    name: 'Tri 5 flux',
    pillar: 'circular',
    status: 'compliant',
    autoVerified: 'blockchain',
  },
  {
    name: 'Décret tertiaire',
    pillar: 'circular',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'Zéro déchet (norme AFNOR)',
    pillar: 'circular',
    status: 'compliant',
    autoVerified: 'blockchain',
  },
  {
    name: 'Directive emballages (PPWR)',
    pillar: 'circular',
    status: 'compliant',
    autoVerified: 'ecosystem',
  },
  {
    name: 'Taxonomie UE — circulaire',
    pillar: 'circular',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'Passeport numérique produit (DPP)',
    pillar: 'circular',
    status: 'non_compliant',
    autoVerified: 'manual',
  },
  // Carbone & Env. (7)
  {
    name: 'Bilan GES (art. L229-25)',
    pillar: 'carbon',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'ISO 14064',
    pillar: 'carbon',
    status: 'compliant',
    autoVerified: 'blockchain',
  },
  {
    name: 'SBTi (Science Based Targets)',
    pillar: 'carbon',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'CDP Climate',
    pillar: 'carbon',
    status: 'compliant',
    autoVerified: 'ecosystem',
  },
  {
    name: 'EU ETS — quotas carbone',
    pillar: 'carbon',
    status: 'compliant',
    autoVerified: 'blockchain',
  },
  {
    name: 'CBAM (mécanisme ajustement)',
    pillar: 'carbon',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'Plan de transition climatique',
    pillar: 'carbon',
    status: 'partial',
    autoVerified: 'manual',
  },
  // Reporting ESG (9)
  {
    name: 'CSRD',
    pillar: 'reporting',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'ESRS (normes EFRAG)',
    pillar: 'reporting',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'GRI Standards',
    pillar: 'reporting',
    status: 'compliant',
    autoVerified: 'ecosystem',
  },
  {
    name: 'Taxonomie verte UE',
    pillar: 'reporting',
    status: 'partial',
    autoVerified: 'ai',
  },
  {
    name: 'SFDR (finance durable)',
    pillar: 'reporting',
    status: 'compliant',
    autoVerified: 'ecosystem',
  },
  {
    name: 'Devoir de vigilance',
    pillar: 'reporting',
    status: 'non_compliant',
    autoVerified: 'manual',
  },
  {
    name: 'DPEF',
    pillar: 'reporting',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'Article 29 LEC',
    pillar: 'reporting',
    status: 'partial',
    autoVerified: 'manual',
  },
  {
    name: 'Directive CS3D',
    pillar: 'reporting',
    status: 'compliant',
    autoVerified: 'ai',
  },
  // Traçabilité (6)
  {
    name: 'Blockchain traçabilité',
    pillar: 'traceability',
    status: 'compliant',
    autoVerified: 'blockchain',
  },
  {
    name: 'Devoir de vigilance chaîne',
    pillar: 'traceability',
    status: 'compliant',
    autoVerified: 'blockchain',
  },
  {
    name: 'ISO 22095 (traçabilité matières)',
    pillar: 'traceability',
    status: 'compliant',
    autoVerified: 'blockchain',
  },
  {
    name: 'Règlement déforestation (EUDR)',
    pillar: 'traceability',
    status: 'compliant',
    autoVerified: 'ecosystem',
  },
  {
    name: 'Conflict minerals (3TG)',
    pillar: 'traceability',
    status: 'compliant',
    autoVerified: 'blockchain',
  },
  {
    name: 'Passeport batterie UE',
    pillar: 'traceability',
    status: 'not_evaluated',
    autoVerified: 'manual',
  },
  // Données & SaaS (5)
  {
    name: 'RGPD',
    pillar: 'data',
    status: 'partial',
    autoVerified: 'ai',
  },
  {
    name: 'ISO 27001',
    pillar: 'data',
    status: 'partial',
    autoVerified: 'manual',
  },
  {
    name: 'SOC 2 Type II',
    pillar: 'data',
    status: 'compliant',
    autoVerified: 'ai',
  },
  {
    name: 'HDS (Hébergeur Données Santé)',
    pillar: 'data',
    status: 'compliant',
    autoVerified: 'ecosystem',
  },
  {
    name: 'NIS2 (cybersécurité)',
    pillar: 'data',
    status: 'compliant',
    autoVerified: 'ai',
  },
  // Labels (4)
  {
    name: 'B Corp',
    pillar: 'labels',
    status: 'non_compliant',
    autoVerified: 'manual',
  },
  {
    name: 'Label Numérique Responsable',
    pillar: 'labels',
    status: 'compliant',
    autoVerified: 'ecosystem',
  },
  {
    name: 'Lucie 26000',
    pillar: 'labels',
    status: 'not_evaluated',
    autoVerified: 'manual',
  },
  {
    name: 'Engagé RSE (AFNOR)',
    pillar: 'labels',
    status: 'not_evaluated',
    autoVerified: 'manual',
  },
];

const STATUS_CONFIG: Record<
  NormStatus,
  { variant: 'default' | 'outline' | 'destructive'; i18nKey: string }
> = {
  compliant: { variant: 'default', i18nKey: 'compliance:compliant' },
  partial: { variant: 'outline', i18nKey: 'compliance:partial' },
  non_compliant: { variant: 'destructive', i18nKey: 'compliance:nonCompliant' },
  not_evaluated: { variant: 'outline', i18nKey: 'compliance:notEvaluated' },
};

const VERIFICATION_CONFIG: Record<
  VerificationType,
  { icon: React.ReactNode; i18nKey: string }
> = {
  blockchain: {
    icon: <Link2 size={14} strokeWidth={1.5} />,
    i18nKey: 'compliance:viaBlockchain',
  },
  ai: {
    icon: <Sparkles size={14} strokeWidth={1.5} />,
    i18nKey: 'compliance:viaAI',
  },
  ecosystem: {
    icon: <BarChart3 size={14} strokeWidth={1.5} />,
    i18nKey: 'compliance:viaEcosystem',
  },
  manual: {
    icon: <Hand size={14} strokeWidth={1.5} />,
    i18nKey: 'compliance:manual',
  },
};

const PILLAR_NAMES: Record<string, string> = {
  circular: 'compliance:pillarCircular',
  carbon: 'compliance:pillarCarbon',
  reporting: 'compliance:pillarReporting',
  traceability: 'compliance:pillarTraceability',
  data: 'compliance:pillarData',
  labels: 'compliance:pillarLabels',
};

type FilterType = 'all' | 'compliant' | 'partial' | 'non_compliant';

export function NormStatusTable() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredNorms =
    filter === 'all'
      ? MOCK_NORMS
      : MOCK_NORMS.filter((n) => n.status === filter);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold">
            <Trans i18nKey="compliance:normTable" />
          </h3>
          <div className="flex gap-2">
            {(
              [
                { key: 'all', i18n: 'compliance:filterAll' },
                { key: 'compliant', i18n: 'compliance:filterCompliant' },
                { key: 'partial', i18n: 'compliance:filterPartial' },
                {
                  key: 'non_compliant',
                  i18n: 'compliance:filterNonCompliant',
                },
              ] as const
            ).map(({ key, i18n }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Trans i18nKey={i18n} />
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left text-xs">
                <th className="pr-4 pb-2 font-medium">
                  <Trans i18nKey="compliance:norm" />
                </th>
                <th className="pr-4 pb-2 font-medium">
                  <Trans i18nKey="compliance:pillar" />
                </th>
                <th className="pr-4 pb-2 font-medium">
                  <Trans i18nKey="compliance:status" />
                </th>
                <th className="pr-4 pb-2 font-medium">
                  <Trans i18nKey="compliance:autoVerified" />
                </th>
                <th className="pb-2 font-medium">
                  <Trans i18nKey="compliance:action" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredNorms.map((norm) => {
                const statusCfg = STATUS_CONFIG[norm.status];
                const verifCfg = VERIFICATION_CONFIG[norm.autoVerified];

                return (
                  <tr
                    key={norm.name}
                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <td className="py-2.5 pr-4 font-medium">{norm.name}</td>
                    <td className="text-muted-foreground py-2.5 pr-4">
                      <Trans i18nKey={PILLAR_NAMES[norm.pillar] ?? ''} />
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge
                        variant={statusCfg.variant}
                        className={
                          norm.status === 'compliant'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : norm.status === 'partial'
                              ? 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                              : norm.status === 'not_evaluated'
                                ? 'border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                : ''
                        }
                      >
                        <Trans i18nKey={statusCfg.i18nKey} />
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4">
                      {norm.autoVerified !== 'manual' ? (
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {verifCfg.icon} <Trans i18nKey={verifCfg.i18nKey} />
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          <Trans i18nKey="compliance:manual" />
                        </span>
                      )}
                    </td>
                    <td className="py-2.5">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Eye className="mr-1 h-3 w-3" />
                        <Trans i18nKey="compliance:viewDetails" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-muted-foreground mt-3 text-xs">
          {MOCK_NORMS.filter((n) => n.autoVerified !== 'manual').length}/
          {MOCK_NORMS.length} <Trans i18nKey="compliance:autoVerifiedNote" />
        </p>
      </CardContent>
    </Card>
  );
}
