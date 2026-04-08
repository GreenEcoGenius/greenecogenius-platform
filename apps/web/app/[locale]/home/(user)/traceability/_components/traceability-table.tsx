'use client';

import { ExternalLink } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import type { MockLot } from '~/lib/mock/traceability-mock-data';

const CONTRACT_ADDRESS = '0x9EB83c7Acd57E228Cc3f9316eC4f27ce1fE94cF6';

const STATUS_BADGE_STYLES: Record<string, string> = {
  created: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  qualified: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  listed: 'bg-[#B8F5CE] text-[#1BC454] dark:bg-[#0A1F1B]/40 dark:text-[#B8F5CE]',
  sold: 'bg-[#B8F5CE] text-[#1BC454] dark:bg-[#0A1F1B]/40 dark:text-[#B8F5CE]',
  in_transit:
    'bg-[#B8F5CE] text-[#1BC454] dark:bg-[#0A1F1B]/40 dark:text-[#B8F5CE]',
  delivered:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  certified:
    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
};

const STATUS_I18N: Record<string, string> = {
  created: 'blockchain:statusCreated',
  qualified: 'blockchain:statusQualified',
  listed: 'blockchain:statusListed',
  sold: 'blockchain:statusSold',
  in_transit: 'blockchain:statusInTransit',
  delivered: 'blockchain:statusDelivered',
  certified: 'blockchain:statusCertified',
};

const SOURCE_BADGE_STYLES: Record<string, string> = {
  marketplace:
    'bg-[#B8F5CE] text-[#1BC454] dark:bg-[#0A1F1B]/40 dark:text-[#B8F5CE]',
  collecte: 'bg-[#B8F5CE] text-[#1BC454] dark:bg-[#0A1F1B]/40 dark:text-[#B8F5CE]',
  import: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const SOURCE_I18N: Record<string, string> = {
  marketplace: 'blockchain:sourceMarketplace',
  collecte: 'blockchain:sourceCollecte',
  import: 'blockchain:sourceImport',
};

const MATERIAL_LABELS: Record<string, string> = {
  plastique: 'Plastique',
  metal: 'M\u00e9tal',
  aluminium: 'Aluminium',
  bois: 'Bois',
  verre: 'Verre',
  textile: 'Textile',
  organique: 'Organique',
  papier: 'Papier',
};

function truncateHash(hash: string | null): string {
  if (!hash) return '\u2014';
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t`;
  }
  return `${kg}kg`;
}

function formatCo2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)}t`;
  }
  return `${kg.toFixed(0)}kg`;
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface TraceabilityTableProps {
  lots: MockLot[];
}

export function TraceabilityTable({ lots }: TraceabilityTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          <Trans i18nKey="blockchain:recentLots" />
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-xs font-medium">
              <th className="px-4 py-3">
                <Trans i18nKey="blockchain:lotId" />
              </th>
              <th className="px-4 py-3">
                <Trans i18nKey="blockchain:source" />
              </th>
              <th className="px-4 py-3">
                <Trans i18nKey="blockchain:materialCol" />
              </th>
              <th className="px-4 py-3 text-right">
                <Trans i18nKey="blockchain:weightCol" />
              </th>
              <th className="px-4 py-3">
                <Trans i18nKey="blockchain:seller" />
              </th>
              <th className="px-4 py-3">
                <Trans i18nKey="blockchain:buyer" />
              </th>
              <th className="px-4 py-3 text-right">
                <Trans i18nKey="blockchain:co2Col" />
              </th>
              <th className="px-4 py-3">
                <Trans i18nKey="blockchain:statusCol" />
              </th>
              <th className="px-4 py-3">
                <Trans i18nKey="blockchain:blockchainCol" />
              </th>
              <th className="px-4 py-3">
                <Trans i18nKey="blockchain:dateCol" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {lots.map((lot) => (
              <tr key={lot.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold">
                  {lot.lotId}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-medium ${SOURCE_BADGE_STYLES[lot.source] ?? ''}`}
                  >
                    <Trans
                      i18nKey={
                        SOURCE_I18N[lot.source] ?? 'blockchain:sourceImport'
                      }
                    />
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs">
                  {MATERIAL_LABELS[lot.materialType] ?? lot.materialType}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs">
                  {formatWeight(lot.weightKg)}
                </td>
                <td className="px-4 py-3 text-xs">{lot.sellerName}</td>
                <td className="px-4 py-3 text-xs">
                  {lot.buyerName ?? '\u2014'}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-green-600 dark:text-green-400">
                  {formatCo2(lot.co2AvoidedKg)}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-medium ${STATUS_BADGE_STYLES[lot.status] ?? ''}`}
                  >
                    <Trans
                      i18nKey={
                        STATUS_I18N[lot.status] ?? 'blockchain:statusCreated'
                      }
                    />
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {lot.blockchainTxHash ? (
                    <a
                      href={`https://polygonscan.com/tx/${lot.blockchainTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {truncateHash(lot.blockchainTxHash)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      {truncateHash(lot.dataHash)}
                    </span>
                  )}
                </td>
                <td className="text-muted-foreground px-4 py-3 text-xs">
                  {formatDate(lot.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
