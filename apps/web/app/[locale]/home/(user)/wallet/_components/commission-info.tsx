'use client';

import { useEffect, useState } from 'react';

import { Info, Tag } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
} from '~/components/enviro/enviro-card';

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

export function CommissionInfo() {
  const t = useTranslations('wallet');
  const locale = useLocale();
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

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(cents / 100);

  return (
    <EnviroCard variant="cream" hover="none" padding="md">
      <EnviroCardHeader>
        <EnviroCardTitle className="flex items-center gap-2 text-lg">
          <Tag
            aria-hidden="true"
            className="h-5 w-5 text-[--color-enviro-forest-700]"
          />
          {t('commissionTitle')}
        </EnviroCardTitle>
      </EnviroCardHeader>
      <EnviroCardBody className="pt-4">
        {isPromo ? (
          <div className="flex items-start gap-3 rounded-[--radius-enviro-md] border border-[--color-enviro-lime-200] bg-[--color-enviro-lime-50] px-4 py-3">
            <Info
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-[--color-enviro-lime-700]"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[--color-enviro-lime-800]">
                {t('promoActive')}
              </p>
              <p className="text-sm text-[--color-enviro-forest-900]">
                <span className="font-semibold tabular-nums">
                  {(Number(activeConfig.flat_rate) * 100).toFixed(0)}%
                </span>{' '}
                {t('promoFlat')}
              </p>
              <p className="text-xs text-[--color-enviro-forest-700]">
                {t('promoUntil')}{' '}
                {new Date(activeConfig.valid_until!).toLocaleDateString(
                  locale,
                  { day: '2-digit', month: 'long', year: 'numeric' },
                )}
              </p>
            </div>
          </div>
        ) : activeConfig.commission_type === 'degressive' ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[--color-enviro-forest-700]">
              {t('degressiveDesc')}
            </p>
            <div className="overflow-hidden rounded-[--radius-enviro-md] border border-[--color-enviro-cream-300]">
              <table className="w-full text-sm font-[family-name:var(--font-enviro-sans)]">
                <thead className="bg-[--color-enviro-forest-900]">
                  <tr>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-mono)]">
                      {t('tierRange')}
                    </th>
                    <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-mono)]">
                      {t('tierRate')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(activeConfig.tiers as CommissionTier[]).map((tier, i) => (
                    <tr
                      key={i}
                      className="border-t border-[--color-enviro-cream-200] even:bg-[--color-enviro-cream-50]"
                    >
                      <td className="px-3 py-2 tabular-nums text-[--color-enviro-forest-900]">
                        {formatCurrency(tier.min)}
                        {' to '}
                        {tier.max ? formatCurrency(tier.max) : '∞'}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums text-[--color-enviro-forest-900]">
                        {(tier.rate * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </EnviroCardBody>
    </EnviroCard>
  );
}
