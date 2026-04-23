import { TriangleAlert } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { resolveProductPlan } from '@kit/billing-gateway';
import {
  CurrentLifetimeOrderCard,
  CurrentSubscriptionCard,
} from '@kit/billing-gateway/components';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { If } from '@kit/ui/if';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import billingConfig from '~/config/billing.config';

import { loadTeamAccountBillingPage } from '../_lib/server/team-account-billing-page.loader';
import { loadTeamWorkspace } from '../_lib/server/team-account-workspace.loader';
import { TeamAccountCheckoutForm } from './_components/team-account-checkout-form';
import { TeamBillingPortalForm } from './_components/team-billing-portal-form';

interface TeamAccountBillingPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const t = await getTranslations('teams');
  const title = t('billing.pageTitle');

  return {
    title,
  };
};

async function TeamAccountBillingPage({ params }: TeamAccountBillingPageProps) {
  const account = (await params).account;
  const tCommon = await getTranslations('common');
  const tTeams = await getTranslations('teams');
  const tBilling = await getTranslations('billing');

  const workspace = await loadTeamWorkspace(account);
  const accountId = workspace.account.id;

  const [subscription, order, customerId] =
    await loadTeamAccountBillingPage(accountId);

  const variantId = subscription?.items[0]?.variant_id;
  const orderVariantId = order?.items[0]?.variant_id;

  const subscriptionProductPlan = variantId
    ? await resolveProductPlan(billingConfig, variantId, subscription.currency)
    : undefined;

  const orderProductPlan = orderVariantId
    ? await resolveProductPlan(billingConfig, orderVariantId, order.currency)
    : undefined;

  const hasBillingData = subscription || order;

  const canManageBilling =
    workspace.account.permissions.includes('billing.manage');

  const shouldShowBillingPortal = canManageBilling && customerId;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.settings')}
        title={tTeams('billing.pageTitle')}
      />

      <div className="flex flex-col space-y-4">
        <If condition={!hasBillingData}>
          <If
            condition={canManageBilling}
            fallback={
              <CannotManageBillingAlert
                title={tBilling('cannotManageBillingAlertTitle')}
                description={tBilling('cannotManageBillingAlertDescription')}
              />
            }
          >
            <TeamAccountCheckoutForm
              customerId={customerId}
              accountId={accountId}
            />
          </If>
        </If>

        <If condition={subscription}>
          {(subscription) => {
            return (
              <CurrentSubscriptionCard
                subscription={subscription}
                product={subscriptionProductPlan!.product}
                plan={subscriptionProductPlan!.plan}
              />
            );
          }}
        </If>

        <If condition={order}>
          {(order) => {
            return (
              <CurrentLifetimeOrderCard
                order={order}
                product={orderProductPlan!.product}
                plan={orderProductPlan!.plan}
              />
            );
          }}
        </If>

        {shouldShowBillingPortal ? (
          <TeamBillingPortalForm accountId={accountId} slug={account} />
        ) : null}
      </div>
    </div>
  );
}

export default TeamAccountBillingPage;

function CannotManageBillingAlert({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Alert variant={'warning'}>
      <TriangleAlert aria-hidden="true" className="h-4 w-4" />

      <AlertTitle>{title}</AlertTitle>

      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
