'use client';

import { useState } from 'react';

import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Package,
  XCircle,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

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

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  pending_payment: {
    color: 'bg-gray-100 text-gray-800',
    icon: <Clock className="h-3 w-3" />,
  },
  paid: {
    color: 'bg-blue-100 text-blue-800',
    icon: <Package className="h-3 w-3" />,
  },
  in_transit: {
    color: 'bg-[#A8E6C8] text-[#159B5C]',
    icon: <Package className="h-3 w-3" />,
  },
  completed: {
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  refunded: {
    color: 'bg-slate-100 text-slate-800',
    icon: <XCircle className="h-3 w-3" />,
  },
  cancelled: {
    color: 'bg-slate-100 text-slate-800',
    icon: <XCircle className="h-3 w-3" />,
  },
};

function TransactionRow({
  tx,
  role,
}: {
  tx: Transaction;
  role: 'seller' | 'buyer';
}) {
  const config = statusConfig[tx.status] ?? statusConfig['pending_payment']!;

  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">
      <div className="flex items-center gap-3">
        <div
          className={`rounded-full p-2 ${role === 'seller' ? 'bg-green-100' : 'bg-blue-100'}`}
        >
          {role === 'seller' ? (
            <ArrowDownLeft className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-blue-600" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">
            {tx.listings?.title ?? 'Listing'}
          </p>
          <p className="text-muted-foreground text-xs">
            {formatDate(tx.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className={config.color}>
          <span className="mr-1">{config.icon}</span>
          <Trans i18nKey={`wallet.status.${tx.status}`} />
        </Badge>

        <div className="text-right">
          <p className="text-sm font-semibold">
            {role === 'seller'
              ? `+${formatCents(tx.seller_amount)}`
              : `-${formatCents(tx.total_amount)}`}
          </p>
          {role === 'seller' && tx.platform_fee > 0 && (
            <p className="text-muted-foreground text-xs">
              <Trans i18nKey="wallet.feeDeducted" />{' '}
              {formatCents(tx.platform_fee)}
            </p>
          )}
        </div>

        {role === 'buyer' && tx.status === 'paid' && (
          <ConfirmDeliveryButton transactionId={tx.id} />
        )}
      </div>
    </div>
  );
}

export function TransactionHistory({
  sellerTransactions,
  buyerTransactions,
}: TransactionHistoryProps) {
  const [tab, setTab] = useState<'sales' | 'purchases'>('sales');

  const transactions = tab === 'sales' ? sellerTransactions : buyerTransactions;
  const role = tab === 'sales' ? 'seller' : 'buyer';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            <Trans i18nKey="wallet.transactions" />
          </CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => setTab('sales')}
              className={`rounded-md px-3 py-1 text-sm ${
                tab === 'sales'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Trans i18nKey="wallet.sales" /> ({sellerTransactions.length})
            </button>
            <button
              onClick={() => setTab('purchases')}
              className={`rounded-md px-3 py-1 text-sm ${
                tab === 'purchases'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Trans i18nKey="wallet.purchases" /> ({buyerTransactions.length})
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            <Trans
              i18nKey={
                tab === 'sales' ? 'wallet.noSales' : 'wallet.noPurchases'
              }
            />
          </p>
        ) : (
          <div>
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} role={role} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
