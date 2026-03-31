'use client';

import { useState } from 'react';

import { ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

export function SubscribeClientButton({
  planId,
  variant,
}: {
  planId: string;
  variant: 'default' | 'outline';
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/stripe/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingPeriod: 'monthly' }),
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
      variant={variant}
      className="mt-6 w-full"
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
  );
}

export function ManageClientButton() {
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
    <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Gérer mon abonnement
    </Button>
  );
}
