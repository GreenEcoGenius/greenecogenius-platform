import { getTranslations } from 'next-intl/server';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import { PricingContent } from './_components/pricing-content';

export const generateMetadata = async () => {
  const t = await getTranslations('pricingPage');

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
};

async function PricingPage() {
  const adminClient = getSupabaseServerAdminClient();

  const { data: plans } = await adminClient
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  const { data: commissionConfigs } = await adminClient
    .from('commission_config')
    .select('*')
    .order('is_active', { ascending: false });

  return (
    <PricingContent
      plans={plans ?? []}
      commissionConfigs={commissionConfigs ?? []}
    />
  );
}

export default PricingPage;
