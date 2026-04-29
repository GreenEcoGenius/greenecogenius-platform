'use client';

import { useState } from 'react';

import {
  BadgeCheck,
  ExternalLink,
  Loader2,
  ShieldAlert,
  Wallet,
} from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface StripeConnectSetupProps {
  connectedAccount: {
    stripeAccountId: string;
    onboardingComplete: boolean;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
  } | null;
}

export function StripeConnectSetup({
  connectedAccount,
}: StripeConnectSetupProps) {
  const [loading, setLoading] = useState(false);

  const startOnboarding = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/stripe/connect/onboarding', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  const refreshOnboarding = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/stripe/connect/refresh', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  const openDashboard = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/stripe/connect/dashboard', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } finally {
      setLoading(false);
    }
  };

  // No account yet
  if (!connectedAccount) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <Trans i18nKey="wallet.stripeSetup" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            <Trans i18nKey="wallet.stripeSetupDesc" />
          </p>
          <Button onClick={startOnboarding} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            <Trans i18nKey="wallet.activatePayments" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Onboarding incomplete
  if (!connectedAccount.onboardingComplete) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <Trans i18nKey="wallet.onboardingPending" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            <Trans i18nKey="wallet.onboardingPendingDesc" />
          </p>
          <Button onClick={refreshOnboarding} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Trans i18nKey="wallet.completeOnboarding" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Fully set up
  return (
    <Card className="border-verdure-200 bg-verdure-50 dark:border-verdure-900 dark:bg-verdure-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-verdure-600" />
          <Trans i18nKey="wallet.accountVerified" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          <Trans i18nKey="wallet.accountVerifiedDesc" />
        </p>
        <Button variant="outline" onClick={openDashboard} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <ExternalLink className="mr-2 h-4 w-4" />
          <Trans i18nKey="wallet.manageDashboard" />
        </Button>
      </CardContent>
    </Card>
  );
}
