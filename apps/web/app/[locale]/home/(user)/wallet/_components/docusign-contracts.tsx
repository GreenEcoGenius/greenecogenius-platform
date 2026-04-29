'use client';

import { useState } from 'react';
import {
  FileSignature,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface Transaction {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  contract_status?: string;
  contract_envelope_id?: string;
  listings: { title: string } | null;
}

interface DocuSignContractsProps {
  transactions: Transaction[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
}

const contractStatusConfig: Record<
  string,
  { color: string; icon: React.ReactNode; labelKey: string }
> = {
  not_sent: {
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    icon: <Clock className="h-3 w-3" />,
    labelKey: 'wallet.contractPending',
  },
  sent: {
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: <Send className="h-3 w-3" />,
    labelKey: 'wallet.contractSent',
  },
  seller_signed: {
    color:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: <FileSignature className="h-3 w-3" />,
    labelKey: 'wallet.contractPartial',
  },
  buyer_signed: {
    color:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: <FileSignature className="h-3 w-3" />,
    labelKey: 'wallet.contractPartial',
  },
  fully_signed: {
    color:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: <CheckCircle className="h-3 w-3" />,
    labelKey: 'wallet.contractSigned',
  },
  blockchain_certified: {
    color:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: <ShieldCheck className="h-3 w-3" />,
    labelKey: 'wallet.contractCertified',
  },
};

export function DocuSignContracts({ transactions }: DocuSignContractsProps) {
  const [expanded, setExpanded] = useState(false);

  // Filter transactions that have been paid (contract should exist)
  const contractTransactions = transactions.filter(
    (tx) => tx.status !== 'pending_payment' && tx.status !== 'cancelled',
  );

  const displayedTransactions = expanded
    ? contractTransactions
    : contractTransactions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSignature className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <Trans i18nKey="wallet.contractsTitle" />
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          <Trans i18nKey="wallet.contractsDesc" />
        </p>
      </CardHeader>
      <CardContent>
        {contractTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <FileSignature className="text-muted-foreground/30 mb-3 h-10 w-10" />
            <p className="text-muted-foreground text-sm">
              <Trans i18nKey="wallet.noContracts" />
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedTransactions.map((tx) => {
              const contractStatus = tx.contract_status || 'not_sent';
              const config =
                contractStatusConfig[contractStatus] ??
                contractStatusConfig['not_sent']!;
              const isSigned =
                contractStatus === 'fully_signed' ||
                contractStatus === 'blockchain_certified';

              return (
                <div
                  key={`contract-${tx.id}`}
                  className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isSigned
                          ? 'bg-emerald-100 dark:bg-emerald-900/20'
                          : 'bg-blue-100 dark:bg-blue-900/20'
                      }`}
                    >
                      <FileSignature
                        className={`h-5 w-5 ${
                          isSigned
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {tx.listings?.title ?? 'Transaction'}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatDate(tx.created_at)} · {formatCents(tx.total_amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={config.color}>
                      <span className="mr-1">{config.icon}</span>
                      <Trans i18nKey={config.labelKey} />
                    </Badge>
                    {!isSigned && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        onClick={() =>
                          window.open(
                            `/home/transactions/${tx.id}`,
                            '_blank',
                          )
                        }
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <Trans i18nKey="wallet.signContract" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {contractTransactions.length > 5 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-primary hover:text-primary/80 w-full py-2 text-center text-sm font-medium transition-colors"
              >
                {expanded ? (
                  <Trans i18nKey="wallet.showLess" />
                ) : (
                  <Trans i18nKey="wallet.showAll" />
                )}
              </button>
            )}
          </div>
        )}

        {/* DocuSign info banner */}
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                <Trans i18nKey="wallet.docusignInfoTitle" />
              </p>
              <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                <Trans i18nKey="wallet.docusignInfoDesc" />
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
