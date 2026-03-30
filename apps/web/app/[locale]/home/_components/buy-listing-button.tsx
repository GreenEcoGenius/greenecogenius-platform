'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import { ShoppingCart } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

const StripeEmbeddedCheckout = dynamic(
  () => import('./stripe-listing-checkout'),
  { ssr: false },
);

export function BuyListingButton({
  listingId,
  isOwner,
  hasPrice,
}: {
  listingId: string;
  isOwner: boolean;
  hasPrice: boolean;
}) {
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isOwner || !hasPrice) {
    return null;
  }

  if (checkoutToken) {
    return <StripeEmbeddedCheckout checkoutToken={checkoutToken} />;
  }

  async function handleBuy() {
    setIsPending(true);
    setError(null);

    try {
      const res = await fetch('/api/marketplace/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutToken) {
        setError(data.error ?? 'Erreur lors du paiement');
        return;
      }

      setCheckoutToken(data.checkoutToken);
    } catch {
      setError('Erreur de connexion');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button className="w-full" onClick={handleBuy} disabled={isPending}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isPending ? (
          <Trans i18nKey="marketplace.processing" />
        ) : (
          <Trans i18nKey="marketplace.buyLot" />
        )}
      </Button>
      {error && <p className="text-destructive text-center text-sm">{error}</p>}
    </div>
  );
}
