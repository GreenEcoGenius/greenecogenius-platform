'use client';

import { useState } from 'react';

import { ArrowRight, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

export function SubscribeClientButton({
  planId,
  variant,
}: {
  planId: string;
  variant: 'default' | 'outline';
}) {
  const t = useTranslations('billing');
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
    <div className="mt-6">
      <Button
        variant={variant}
        className="w-full"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="mr-2 h-4 w-4" />
        )}
        <Trans i18nKey="pricingPage.startTrial" />
      </Button>
      {error && (
        <p className="mt-2 text-center text-sm text-slate-500">{error}</p>
      )}
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
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {t('manageSubscription')}
    </Button>
  );
}
