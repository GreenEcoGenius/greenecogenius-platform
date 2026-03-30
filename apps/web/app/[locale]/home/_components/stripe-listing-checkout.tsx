'use client';

import dynamic from 'next/dynamic';

import billingConfig from '~/config/billing.config';

const EmbeddedCheckout = dynamic(
  async () => {
    const { EmbeddedCheckout } = await import('@kit/billing-gateway/checkout');
    return { default: EmbeddedCheckout };
  },
  { ssr: false },
);

export default function StripeListingCheckout({
  checkoutToken,
}: {
  checkoutToken: string;
}) {
  return (
    <EmbeddedCheckout
      checkoutToken={checkoutToken}
      provider={billingConfig.provider}
    />
  );
}
