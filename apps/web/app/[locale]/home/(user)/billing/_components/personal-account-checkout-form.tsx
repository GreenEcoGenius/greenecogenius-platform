'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import { TriangleAlert } from 'lucide-react';

import { PlanPicker } from '@kit/billing-gateway/components';
import { useAppEvents } from '@kit/shared/events';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import billingConfig from '~/config/billing.config';

const EmbeddedCheckout = dynamic(
  async () => {
    const { EmbeddedCheckout } = await import('@kit/billing-gateway/checkout');

    return {
      default: EmbeddedCheckout,
    };
  },
  {
    ssr: false,
  },
);

export function PersonalAccountCheckoutForm(props: {
  customerId: string | null | undefined;
}) {
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const appEvents = useAppEvents();

  const [checkoutToken, setCheckoutToken] = useState<string | undefined>(
    undefined,
  );

  const execute = async (params: { planId: string; productId: string }) => {
    setIsPending(true);
    setError(false);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutToken) {
        setError(true);
        return;
      }

      setCheckoutToken(data.checkoutToken);
    } catch {
      setError(true);
    } finally {
      setIsPending(false);
    }
  };

  // only allow trial if the user is not already a customer
  const canStartTrial = !props.customerId;

  // If the checkout token is set, render the embedded checkout component
  if (checkoutToken) {
    return (
      <EmbeddedCheckout
        checkoutToken={checkoutToken}
        provider={billingConfig.provider}
        onClose={() => setCheckoutToken(undefined)}
      />
    );
  }

  // Otherwise, render the plan picker component
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'billing.planCardLabel'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'billing.planCardDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent className={'space-y-4'}>
          <If condition={error}>
            <ErrorAlert />
          </If>

          <PlanPicker
            pending={isPending}
            config={billingConfig}
            canStartTrial={canStartTrial}
            onSubmit={({ planId, productId }) => {
              appEvents.emit({
                type: 'checkout.started',
                payload: { planId },
              });

              execute({
                planId,
                productId,
              });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorAlert() {
  return (
    <Alert variant={'destructive'}>
      <TriangleAlert className={'h-4'} />

      <AlertTitle>
        <Trans i18nKey={'billing.planPickerAlertErrorTitle'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'billing.planPickerAlertErrorDescription'} />
      </AlertDescription>
    </Alert>
  );
}
