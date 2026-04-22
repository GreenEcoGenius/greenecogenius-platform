'use client';

import { useState } from 'react';

import {
  BadgeCheck,
  ExternalLink,
  Loader2,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
} from '~/components/enviro/enviro-card';

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
  const t = useTranslations('wallet');
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

  if (!connectedAccount) {
    return (
      <SetupCard
        tone="cream"
        icon={
          <Wallet
            aria-hidden="true"
            className="h-5 w-5 text-[--color-enviro-forest-700]"
          />
        }
        title={t('stripeSetup')}
        body={t('stripeSetupDesc')}
        action={
          <EnviroButton
            type="button"
            variant="primary"
            size="sm"
            magnetic
            onClick={startOnboarding}
            disabled={loading}
          >
            {loading ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet aria-hidden="true" className="h-4 w-4" />
            )}
            {t('activatePayments')}
          </EnviroButton>
        }
      />
    );
  }

  if (!connectedAccount.onboardingComplete) {
    return (
      <SetupCard
        tone="ember"
        icon={
          <ShieldAlert
            aria-hidden="true"
            className="h-5 w-5 text-[--color-enviro-ember-600]"
          />
        }
        title={t('onboardingPending')}
        body={t('onboardingPendingDesc')}
        action={
          <EnviroButton
            type="button"
            variant="primary"
            size="sm"
            onClick={refreshOnboarding}
            disabled={loading}
          >
            {loading ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : null}
            {t('completeOnboarding')}
          </EnviroButton>
        }
      />
    );
  }

  return (
    <SetupCard
      tone="lime"
      icon={
        <BadgeCheck
          aria-hidden="true"
          className="h-5 w-5 text-[--color-enviro-lime-700]"
        />
      }
      title={t('accountVerified')}
      body={t('accountVerifiedDesc')}
      action={
        <EnviroButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={openDashboard}
          disabled={loading}
        >
          {loading ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          )}
          {t('manageDashboard')}
        </EnviroButton>
      }
    />
  );
}

function SetupCard({
  tone,
  icon,
  title,
  body,
  action,
}: {
  tone: 'cream' | 'ember' | 'lime';
  icon: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
  action: React.ReactNode;
}) {
  const accent = {
    cream: '',
    ember:
      'border-[--color-enviro-ember-200] bg-[--color-enviro-ember-50] text-[--color-enviro-forest-900]',
    lime:
      'border-[--color-enviro-lime-200] bg-[--color-enviro-lime-50] text-[--color-enviro-forest-900]',
  }[tone];

  return (
    <EnviroCard
      variant="cream"
      hover="none"
      padding="md"
      className={cn(accent)}
    >
      <EnviroCardHeader>
        <EnviroCardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </EnviroCardTitle>
      </EnviroCardHeader>
      <EnviroCardBody className="flex flex-col gap-4 pt-4">
        <p className="text-sm text-[--color-enviro-forest-700]">{body}</p>
        <div>{action}</div>
      </EnviroCardBody>
    </EnviroCard>
  );
}
