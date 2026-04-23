import { notFound, redirect } from 'next/navigation';

import { getBillingGatewayProvider } from '@kit/billing-gateway';
import { BillingSessionStatus } from '@kit/billing-gateway/components';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import billingConfig from '~/config/billing.config';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

import { EmbeddedCheckoutForm } from '../_components/embedded-checkout-form';

interface SessionPageProps {
  searchParams: Promise<{
    session_id: string;
  }>;
}

async function ReturnCheckoutSessionPage({ searchParams }: SessionPageProps) {
  const sessionId = (await searchParams).session_id;

  if (!sessionId) {
    redirect('../');
  }

  const { customerEmail, checkoutToken } = await loadCheckoutSession(sessionId);

  if (checkoutToken) {
    return (
      <EmbeddedCheckoutForm
        checkoutToken={checkoutToken}
        provider={billingConfig.provider}
      />
    );
  }

  return (
    <>
      <div className="fixed top-48 left-0 z-50 mx-auto w-full">
        <BillingSessionStatus
          redirectPath={'../billing'}
          customerEmail={customerEmail ?? ''}
        />
      </div>

      <BlurryBackdrop />
    </>
  );
}

export default ReturnCheckoutSessionPage;

function BlurryBackdrop() {
  return (
    <div className="fixed left-0 top-0 !m-0 h-full w-full bg-[--color-enviro-cream-50]/80 backdrop-blur-sm" />
  );
}

async function loadCheckoutSession(sessionId: string) {
  await requireUserInServerComponent();

  const client = getSupabaseServerClient();
  const gateway = await getBillingGatewayProvider(client);

  const session = await gateway.retrieveCheckoutSession({
    sessionId,
  });

  if (!session) {
    notFound();
  }

  const checkoutToken = session.isSessionOpen ? session.checkoutToken : null;

  return {
    status: session.status,
    customerEmail: session.customer.email,
    checkoutToken,
  };
}
