'use client';

import { useMemo, useState } from 'react';

import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Inbox,
  Package,
  XCircle,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
} from '~/components/enviro/enviro-card';
import {
  EnviroDataTable,
  EnviroEmptyState,
  EnviroFilterChips,
  EnviroTableBody,
  EnviroTableCell,
  EnviroTableHead,
  EnviroTableHeader,
  EnviroTableRow,
} from '~/components/enviro/dashboard';

import { ConfirmDeliveryButton } from './confirm-delivery-button';

type Transaction = {
  id: string;
  listing_id: string;
  total_amount: number;
  platform_fee: number;
  seller_amount: number;
  transport_amount: number;
  currency: string;
  status: string;
  payment_status: string;
  delivery_status: string;
  created_at: string;
  paid_at: string | null;
  funds_released_at: string | null;
  listings: { title: string } | null;
};

interface TransactionHistoryProps {
  sellerTransactions: Transaction[];
  buyerTransactions: Transaction[];
}

type Tab = 'sales' | 'purchases';

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending_payment: <Clock aria-hidden="true" className="h-3 w-3" />,
  paid: <Package aria-hidden="true" className="h-3 w-3" />,
  in_transit: <Package aria-hidden="true" className="h-3 w-3" />,
  completed: <CheckCircle aria-hidden="true" className="h-3 w-3" />,
  refunded: <XCircle aria-hidden="true" className="h-3 w-3" />,
  cancelled: <XCircle aria-hidden="true" className="h-3 w-3" />,
};

const STATUS_TONE: Record<string, string> = {
  pending_payment:
    'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]',
  paid: 'bg-[--color-enviro-forest-100] text-[--color-enviro-forest-700]',
  in_transit:
    'bg-[--color-enviro-lime-100] text-[--color-enviro-lime-800]',
  completed: 'bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]',
  refunded:
    'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]',
  cancelled:
    'bg-[--color-enviro-ember-100] text-[--color-enviro-ember-700]',
};

export function TransactionHistory({
  sellerTransactions,
  buyerTransactions,
}: TransactionHistoryProps) {
  const t = useTranslations('wallet');
  const locale = useLocale();
  const [tab, setTab] = useState<Tab>('sales');

  const transactions = tab === 'sales' ? sellerTransactions : buyerTransactions;
  const role: 'seller' | 'buyer' = tab === 'sales' ? 'seller' : 'buyer';

  const formatAmount = useMemo(
    () => (cents: number, currency: string) => {
      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency || 'EUR',
        }).format(cents / 100);
      } catch {
        return `${(cents / 100).toFixed(2)} ${currency || 'EUR'}`;
      }
    },
    [locale],
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <EnviroCard variant="cream" hover="none" padding="md">
      <EnviroCardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <EnviroCardTitle className="text-lg">
            {t('transactions')}
          </EnviroCardTitle>
          <EnviroFilterChips
            ariaLabel={t('transactions')}
            value={tab}
            onChange={(next) => setTab(next as Tab)}
            items={[
              {
                value: 'sales',
                label: t('sales'),
                count: sellerTransactions.length,
              },
              {
                value: 'purchases',
                label: t('purchases'),
                count: buyerTransactions.length,
              },
            ]}
          />
        </div>
      </EnviroCardHeader>

      <EnviroCardBody className="pt-5">
        {transactions.length === 0 ? (
          <EnviroEmptyState
            icon={<Inbox aria-hidden="true" className="h-7 w-7" />}
            title={tab === 'sales' ? t('noSales') : t('noPurchases')}
          />
        ) : (
          <EnviroDataTable>
            <EnviroTableHeader>
              <EnviroTableRow>
                <EnviroTableHead>
                  <span className="sr-only">{t('direction')}</span>
                </EnviroTableHead>
                <EnviroTableHead>{t('listing')}</EnviroTableHead>
                <EnviroTableHead>{t('date')}</EnviroTableHead>
                <EnviroTableHead>{t('statusLabel')}</EnviroTableHead>
                <EnviroTableHead>{t('amount')}</EnviroTableHead>
                <EnviroTableHead>
                  <span className="sr-only">{t('actions')}</span>
                </EnviroTableHead>
              </EnviroTableRow>
            </EnviroTableHeader>
            <EnviroTableBody>
              {transactions.map((tx) => (
                <EnviroTableRow key={tx.id}>
                  <EnviroTableCell>
                    <span
                      className={cn(
                        'inline-flex h-7 w-7 items-center justify-center rounded-[--radius-enviro-pill]',
                        role === 'seller'
                          ? 'bg-[--color-enviro-lime-100] text-[--color-enviro-lime-800]'
                          : 'bg-[--color-enviro-forest-100] text-[--color-enviro-forest-700]',
                      )}
                      aria-hidden="true"
                    >
                      {role === 'seller' ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </span>
                  </EnviroTableCell>
                  <EnviroTableCell className="font-medium text-[--color-enviro-forest-900]">
                    {tx.listings?.title ?? t('listing')}
                  </EnviroTableCell>
                  <EnviroTableCell className="text-xs text-[--color-enviro-forest-700]">
                    {formatDate(tx.created_at)}
                  </EnviroTableCell>
                  <EnviroTableCell>
                    <StatusPill status={tx.status} t={t} />
                  </EnviroTableCell>
                  <EnviroTableCell className="text-right tabular-nums">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-[--color-enviro-forest-900]">
                        {role === 'seller'
                          ? `+${formatAmount(tx.seller_amount, tx.currency)}`
                          : `-${formatAmount(tx.total_amount, tx.currency)}`}
                      </span>
                      {role === 'seller' && tx.platform_fee > 0 ? (
                        <span className="text-[11px] text-[--color-enviro-forest-700]">
                          {t('feeDeducted')}{' '}
                          {formatAmount(tx.platform_fee, tx.currency)}
                        </span>
                      ) : null}
                    </div>
                  </EnviroTableCell>
                  <EnviroTableCell>
                    {role === 'buyer' && tx.status === 'paid' ? (
                      <ConfirmDeliveryButton transactionId={tx.id} />
                    ) : null}
                  </EnviroTableCell>
                </EnviroTableRow>
              ))}
            </EnviroTableBody>
          </EnviroDataTable>
        )}
      </EnviroCardBody>
    </EnviroCard>
  );
}

function StatusPill({
  status,
  t,
}: {
  status: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const tone =
    STATUS_TONE[status] ??
    'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]';
  const icon = STATUS_ICON[status] ?? STATUS_ICON.pending_payment;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[--radius-enviro-pill] px-2 py-0.5 text-[11px] font-semibold',
        tone,
      )}
    >
      {icon}
      {t(`status.${status}`)}
    </span>
  );
}
