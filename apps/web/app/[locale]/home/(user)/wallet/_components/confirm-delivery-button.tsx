'use client';

import { useState } from 'react';

import { CheckCircle, Loader2 } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

interface ConfirmDeliveryButtonProps {
  transactionId: string;
}

export function ConfirmDeliveryButton({
  transactionId,
}: ConfirmDeliveryButtonProps) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    if (
      !window.confirm(
        'Confirmez-vous la réception de la marchandise ? Cette action libérera le paiement au vendeur.',
      )
    ) {
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
      <span className="flex items-center gap-1 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        <Trans i18nKey="wallet.deliveryConfirmed" />
      </span>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleConfirm}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : (
        <CheckCircle className="mr-1 h-3 w-3" />
      )}
      <Trans i18nKey="wallet.confirmDelivery" />
    </Button>
  );
}
