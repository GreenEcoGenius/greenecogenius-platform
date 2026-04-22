'use client';

import { useState } from 'react';

import { CheckCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EnviroButton } from '~/components/enviro/enviro-button';

interface ConfirmDeliveryButtonProps {
  transactionId: string;
}

export function ConfirmDeliveryButton({
  transactionId,
}: ConfirmDeliveryButtonProps) {
  const t = useTranslations('wallet');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    if (!window.confirm(t('confirmDeliveryPrompt'))) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/stripe/delivery/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          confirmedBy: 'buyer',
        }),
      });

      if (res.ok) {
        setConfirmed(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[--color-enviro-lime-700]">
        <CheckCircle aria-hidden="true" className="h-3.5 w-3.5" />
        {t('deliveryConfirmed')}
      </span>
    );
  }

  return (
    <EnviroButton
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleConfirm}
      disabled={loading}
    >
      {loading ? (
        <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <CheckCircle aria-hidden="true" className="h-3.5 w-3.5" />
      )}
      {t('confirmDelivery')}
    </EnviroButton>
  );
}
