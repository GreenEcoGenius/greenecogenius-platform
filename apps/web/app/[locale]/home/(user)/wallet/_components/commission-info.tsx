'use client';

import { useEffect, useState } from 'react';

import { Info, Tag } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface CommissionTier {
  min: number;
  max: number | null;
  rate: number;
}

interface CommissionConfig {
  name: string;
  commission_type: string;
  flat_rate: number | null;
  tiers: CommissionTier[];
  valid_until: string | null;
  is_active: boolean;
}

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
}

export function CommissionInfo() {
  const [configs, setConfigs] = useState<CommissionConfig[]>([]);

  useEffect(() => {
    fetch('/api/stripe/commission/config')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setConfigs(data);
      })
      .catch(() => {});
  }, []);

  const activeConfig = configs.find((c) => c.is_active);

  if (!activeConfig) return null;

  const isPromo =
    activeConfig.commission_type === 'flat' && activeConfig.valid_until;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          <Trans i18nKey="wallet.commissionTitle" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPromo ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-lg bg-[#1A5C3E] p-3 dark:bg-verdure-950">
              <Info className="mt-0.5 h-4 w-4 text-verdure-600" />
              <div>
                <p className="text-sm font-medium text-verdure-800 dark:text-verdure-200">
                  <Trans i18nKey="wallet.promoActive" />
                </p>
                <p className="text-sm text-verdure-700 dark:text-verdure-300">
                  {(Number(activeConfig.flat_rate) * 100).toFixed(0)}%{' '}
                  <Trans i18nKey="wallet.promoFlat" />
                </p>
                <p className="text-[#B8D4E3] mt-1 text-xs">
                  <Trans i18nKey="wallet.promoUntil" />{' '}
                  {new Date(activeConfig.valid_until!).toLocaleDateString(
                    'fr-FR',
                    { day: '2-digit', month: 'long', year: 'numeric' },
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : activeConfig.commission_type === 'degressive' ? (
          <div className="space-y-3">
            <p className="text-[#B8D4E3] text-sm">
              <Trans i18nKey="wallet.degressiveDesc" />
            </p>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">
                      <Trans i18nKey="wallet.tierRange" />
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      <Trans i18nKey="wallet.tierRate" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(activeConfig.tiers as CommissionTier[]).map((tier, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">
                        {formatCents(tier.min)} —{' '}
                        {tier.max ? formatCents(tier.max) : '∞'}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {(tier.rate * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
