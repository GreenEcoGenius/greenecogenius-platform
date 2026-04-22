'use client';

import { useState } from 'react';

import { ArrowRight, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EnviroButton } from '~/components/enviro/enviro-button';

export function SubscribeClientButton({
  planId,
  variant,
}: {
  planId: string;
  variant: 'default' | 'outline';
}) {
  const t = useTranslations('billing');
  const tPricing = useTranslations('pricingPage');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingPeriod: 'monthly' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t('errorGeneric'));
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(t('errorNoPaymentUrl'));
        setLoading(false);
      }
    } catch {
      setError(t('errorNetwork'));
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-2">
      <EnviroButton
        type="button"
        variant={variant === 'default' ? 'primary' : 'secondary'}
        size="md"
        magnetic={variant === 'default'}
        onClick={handleClick}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        )}
        {tPricing('startTrial')}
      </EnviroButton>
      {error ? (
        <p className="text-center text-sm text-[--color-enviro-ember-700]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ManageClientButton() {
  const t = useTranslations('billing');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/stripe/subscription/portal', {
        method: 'POST',
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <EnviroButton
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      ) : null}
      {t('manageSubscription')}
    </EnviroButton>
  );
}
