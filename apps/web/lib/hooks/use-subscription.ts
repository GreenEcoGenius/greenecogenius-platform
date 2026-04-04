'use client';

import { useCallback, useEffect, useState } from 'react';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';

interface Subscription {
  plan: string | null;
  status: string | null;
  isActive: boolean;
  isTrial: boolean;
  loading: boolean;
}

export type Feature =
  // Carbon
  | 'scope12'
  | 'scope3'
  | 'scope3_guided'
  | 'carbon_report_pdf'
  | 'carbon_reduction_plan'
  | 'sbti_trajectory'
  // Comptoir
  | 'comptoir_listings'
  | 'comptoir_transactions'
  | 'comptoir_market_prices'
  | 'comptoir_co2_auto'
  // Blockchain
  | 'blockchain_trace'
  | 'blockchain_certificates'
  | 'blockchain_unlimited'
  // ESG
  | 'esg_report'
  | 'esg_report_csrd'
  | 'esg_esrs_indicators'
  | 'esg_auto_populate'
  // RSE
  | 'rse_diagnostic_basic'
  | 'rse_diagnostic_full'
  | 'rse_label_eligibility'
  | 'rse_action_plan'
  // Compliance
  | 'compliance_score'
  | 'compliance_42_norms'
  | 'compliance_pre_audit'
  | 'compliance_regulatory_watch'
  // Genius
  | 'genius_chat'
  | 'genius_advanced'
  | 'genius_unlimited'
  // Export
  | 'export_pdf'
  | 'export_csv'
  // Enterprise
  | 'api_access'
  | 'multi_users'
  | 'custom_branding'
  | 'dedicated_support';

const featureAccess: Record<Feature, string[]> = {
  // Essentiel + Avancé + Enterprise
  scope12: ['essentiel', 'avance', 'enterprise'],
  carbon_report_pdf: ['essentiel', 'avance', 'enterprise'],
  comptoir_listings: ['essentiel', 'avance', 'enterprise'],
  comptoir_transactions: ['essentiel', 'avance', 'enterprise'],
  comptoir_market_prices: ['essentiel', 'avance', 'enterprise'],
  comptoir_co2_auto: ['essentiel', 'avance', 'enterprise'],
  blockchain_trace: ['essentiel', 'avance', 'enterprise'],
  blockchain_certificates: ['essentiel', 'avance', 'enterprise'],
  rse_diagnostic_basic: ['essentiel', 'avance', 'enterprise'],
  compliance_score: ['essentiel', 'avance', 'enterprise'],
  compliance_42_norms: ['essentiel', 'avance', 'enterprise'],
  genius_chat: ['essentiel', 'avance', 'enterprise'],
  export_pdf: ['essentiel', 'avance', 'enterprise'],

  // Avancé + Enterprise only
  scope3: ['avance', 'enterprise'],
  scope3_guided: ['avance', 'enterprise'],
  carbon_reduction_plan: ['avance', 'enterprise'],
  esg_report: ['avance', 'enterprise'],
  esg_report_csrd: ['avance', 'enterprise'],
  esg_esrs_indicators: ['avance', 'enterprise'],
  esg_auto_populate: ['avance', 'enterprise'],
  sbti_trajectory: ['avance', 'enterprise'],
  blockchain_unlimited: ['avance', 'enterprise'],
  rse_diagnostic_full: ['avance', 'enterprise'],
  rse_label_eligibility: ['avance', 'enterprise'],
  rse_action_plan: ['avance', 'enterprise'],
  compliance_pre_audit: ['avance', 'enterprise'],
  compliance_regulatory_watch: ['avance', 'enterprise'],
  genius_advanced: ['avance', 'enterprise'],
  export_csv: ['avance', 'enterprise'],

  // Enterprise only
  genius_unlimited: ['enterprise'],
  api_access: ['enterprise'],
  multi_users: ['enterprise'],
  custom_branding: ['enterprise'],
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
        } else {
          // No subscription — treat as trial/free with essentiel features
          setPlan('essentiel');
          setStatus('trialing');
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
