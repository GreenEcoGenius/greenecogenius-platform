'use client';

import { useCallback, useEffect, useState } from 'react';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';

interface Subscription {
  plan: string | null; // 'essentiel', 'avance', 'enterprise'
  status: string | null; // 'active', 'trialing', 'past_due', 'cancelled'
  isActive: boolean;
  isTrial: boolean;
  loading: boolean;
}

type Feature =
  | 'scope12'
  | 'scope3'
  | 'ghg_report'
  | 'csrd_report'
  | 'ai_recommendations'
  | 'benchmarking'
  | 'api_access'
  | 'multi_site'
  | 'erp_integration'
  | 'dedicated_support';

const featureAccess: Record<Feature, string[]> = {
  scope12: ['essentiel', 'avance', 'enterprise'],
  scope3: ['avance', 'enterprise'],
  ghg_report: ['essentiel', 'avance', 'enterprise'],
  csrd_report: ['avance', 'enterprise'],
  ai_recommendations: ['avance', 'enterprise'],
  benchmarking: ['avance', 'enterprise'],
  api_access: ['avance', 'enterprise'],
  multi_site: ['enterprise'],
  erp_integration: ['enterprise'],
  dedicated_support: ['enterprise'],
};

export function useSubscription(): Subscription & {
  canAccess: (feature: Feature) => boolean;
  requiredPlan: (feature: Feature) => string;
} {
  const client = useSupabase();
  const [plan, setPlan] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const {
          data: { user },
        } = await client.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: sub } = await (client as any)
          .from('organization_subscriptions')
          .select('status, subscription_plans(name)')
          .eq('account_id', user.id)
          .in('status', ['active', 'trialing', 'past_due'])
          .single();

        if (sub) {
          setPlan(sub.subscription_plans?.name ?? null);
          setStatus(sub.status);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [client]);

  const isActive = status === 'active' || status === 'trialing';
  const isTrial = status === 'trialing';

  const canAccess = useCallback(
    (feature: Feature) => {
      if (!isActive || !plan) return false;
      return featureAccess[feature]?.includes(plan) ?? false;
    },
    [isActive, plan],
  );

  const requiredPlan = useCallback((feature: Feature) => {
    const plans = featureAccess[feature];
    return plans?.[0] ?? 'essentiel';
  }, []);

  return { plan, status, isActive, isTrial, loading, canAccess, requiredPlan };
}
