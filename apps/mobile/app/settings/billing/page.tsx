'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, BarChart3, Building2, Check, ExternalLink, Loader2, Crown } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { useTranslations } from 'next-intl';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';
import { Capacitor } from '@capacitor/core';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  target: string;
  icon: typeof Zap;
  color: string;
  popular?: boolean;
  features: string[];
  cta: string;
  ctaStyle: 'outline' | 'filled' | 'contact';
}

function BillingContent() {
  const router = useRouter();
  const t = useTranslations('settings');
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const plans: Plan[] = [
    {
      id: 'essentiel',
      name: 'Essentiel',
      price: '149€',
      period: t('perMonth'),
      target: t('planEssentielTarget'),
      icon: Zap,
      color: '#B8D4E3',
      features: [
        t('featEssCarbonScope12'),
        t('featEssFormEntry'),
        t('featEssReportPdf'),
        t('featEssMarketplace'),
        t('featEssMarketPrices'),
        t('featEssCo2Avoided'),
        t('featEssBlockchain50'),
        t('featEssCertificates'),
        t('featEssRseBasic'),
        t('featEssCompliance37'),
        t('featEssGenius10'),
        t('featEssSupport'),
      ],
      cta: t('startTrial'),
      ctaStyle: 'outline',
    },
    {
      id: 'avance',
      name: t('planAvance'),
      price: '449€',
      period: t('perMonth'),
      target: t('planAvanceTarget'),
      icon: BarChart3,
      color: '#6EE7B7',
      popular: true,
      features: [
        t('featAdvIncludes'),
        t('featAdvCarbonScope123'),
        t('featAdvCsrdGri'),
        t('featAdvReductionPlan'),
        t('featAdvSbti'),
        t('featAdvEsgReport'),
        t('featAdvBlockchainUnlimited'),
        t('featAdvRseFull'),
        t('featAdvLabels'),
        t('featAdvPreAudit'),
        t('featAdvRegWatch'),
        t('featAdvAutoEsg'),
        t('featAdvExport'),
        t('featAdvGenius100'),
        t('featAdvSupport'),
      ],
      cta: t('startTrial'),
      ctaStyle: 'filled',
    },
    {
      id: 'enterprise',
      name: t('planEnterprise'),
      price: t('planEnterprisePriceLabel'),
      period: '',
      target: t('planEnterpriseTarget'),
      icon: Building2,
      color: '#F59E0B',
      features: [
        t('featEntIncludes'),
        t('featEntGeniusUnlimited'),
        t('featEntCustomReports'),
        t('featEntApi'),
        t('featEntMultiUser'),
        t('featEntOnboarding'),
        t('featEntAccountManager'),
        t('featEntSla'),
        t('featEntSupportVisio'),
      ],
      cta: t('contactSales'),
      ctaStyle: 'contact',
    },
  ];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentPlan(user?.user_metadata?.plan || null);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSubscribe(planId: string) {
    if (planId === 'enterprise') {
      const url = 'mailto:contact@greenecogenius.tech?subject=Demande%20Enterprise%20GreenEcoGenius';
      if (Capacitor.isNativePlatform()) {
        try {
          const { Browser } = await import('@capacitor/browser');
          await (Browser as any).open({ url });
        } catch {
          window.open(url, '_blank');
        }
      } else {
        window.open(url, '_blank');
      }
      return;
    }
    const stripeLinks: Record<string, string> = {
      essentiel: 'https://buy.stripe.com/dRm3cv9pFblgfUH9HpfQI00',
      avance: 'https://buy.stripe.com/6oUbJ145l1KGdMz6vdfQI01',
    };
    const checkoutUrl = stripeLinks[planId];
    if (!checkoutUrl) return;
    if (Capacitor.isNativePlatform()) {
      try {
        const { Browser } = await import('@capacitor/browser');
        await (Browser as any).open({ url: checkoutUrl });
      } catch {
        window.open(checkoutUrl, '_blank');
      }
    } else {
      window.open(checkoutUrl, '_blank');
    }
  }

  if (loading) {
    return (
      <AppShell title={t("billingTitle")} showBack hideTabBar>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#F5F5F0]/30" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t("billingTitle")} showBack hideTabBar>
      <div className="space-y-6 pb-6">
        <p className="text-center text-[13px] text-[#F5F5F0]/50">
          {t('billingSubtitle')}
        </p>
        {!currentPlan && (
          <div className="rounded-2xl border border-[#B8D4E3]/20 bg-[#B8D4E3]/[0.04] p-4 text-center">
            <p className="text-[13px] font-medium text-[#B8D4E3]">
              {t('startTrial')}
            </p>
            <p className="mt-1 text-[11px] text-[#F5F5F0]/40">
              {t('billingNoCard')}
            </p>
          </div>
        )}
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-4 ${
                plan.popular
                  ? 'border-[#6EE7B7]/30 bg-[#6EE7B7]/[0.03]'
                  : 'border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.02]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#6EE7B7] px-3 py-0.5 text-[10px] font-bold text-[#0A2F1F]">
                    <Crown className="h-3 w-3" />
                    {t('planAvanceBadge')}
                  </span>
                </div>
              )}
              <div className="flex items-start gap-3 pt-1">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${plan.color}15` }}
                >
                  <plan.icon className="h-5 w-5" style={{ color: plan.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-bold text-[#F5F5F0]">{plan.name}</h3>
                  <p className="text-[11px] text-[#F5F5F0]/40">{plan.target}</p>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[28px] font-bold text-[#F5F5F0]">{plan.price}</span>
                {plan.period && (
                  <span className="text-[13px] text-[#F5F5F0]/40">{plan.period}</span>
                )}
              </div>
              <div className="mt-3 space-y-1.5">
                {plan.features.map((feat, i) => {
                  const isHeader = feat.endsWith(':');
                  return (
                    <div key={i} className="flex items-start gap-2">
                      {!isHeader && (
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      )}
                      <p
                        className={`text-[11px] leading-relaxed ${
                          isHeader
                            ? 'text-[#F5F5F0]/50 italic'
                            : 'text-[#F5F5F0]/60'
                        }`}
                      >
                        {feat}
                      </p>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold transition-opacity active:opacity-80 ${
                  isCurrent
                    ? 'border border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                    : plan.ctaStyle === 'filled'
                    ? 'bg-[#6EE7B7] text-[#0A2F1F]'
                    : plan.ctaStyle === 'contact'
                    ? 'border border-[#F5F5F0]/[0.12] bg-[#F5F5F0]/[0.04] text-[#F5F5F0]/70'
                    : 'border border-[#F5F5F0]/[0.12] bg-[#F5F5F0]/[0.04] text-[#F5F5F0]/70'
                }`}
              >
                {isCurrent ? (
                  <>
                    <Check className="h-4 w-4" />
                    {t('billingCurrentPlan')}
                  </>
                ) : (
                  <>
                    {plan.cta}
                    {plan.ctaStyle !== 'contact' && (
                      <ExternalLink className="h-3.5 w-3.5" />
                    )}
                  </>
                )}
              </button>
              {plan.ctaStyle === 'contact' && !isCurrent && (
                <p className="mt-1.5 text-center text-[10px] text-[#F5F5F0]/25">
                  {t('billingResponse48h')}
                </p>
              )}
            </div>
          );
        })}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="h-px flex-1 bg-[#F5F5F0]/[0.06]" />
          <p className="text-[10px] text-[#F5F5F0]/20">{t('billingSecuredByStripe')}</p>
          <div className="h-px flex-1 bg-[#F5F5F0]/[0.06]" />
        </div>
      </div>
    </AppShell>
  );
}

export default function BillingPage() {
  return (
    <AuthGuard>
      <BillingContent />
    </AuthGuard>
  );
}
