import { NextRequest, NextResponse } from 'next/server';

import { getProductPlanPair } from '@kit/billing';
import { getBillingGatewayProvider } from '@kit/billing-gateway';
import { createAccountsApi } from '@kit/accounts/api';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import appConfig from '~/config/app.config';
import billingConfig from '~/config/billing.config';
import pathsConfig from '~/config/paths.config';

export async function POST(req: NextRequest) {
  const steps: Record<string, unknown> = {};

  try {
    // Step 1: Parse input
    const body = await req.json();
    const { planId, productId } = body;
    steps.step1_input = { planId, productId };

    if (!planId || !productId) {
      return NextResponse.json(
        { error: 'Missing planId or productId', steps },
        { status: 400 },
      );
    }

    // Step 2: Auth
    const client = getSupabaseServerClient();
    const { data: user, error: authError } = await requireUser(client);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated', steps },
        { status: 401 },
      );
    }

    steps.step2_auth = user.email;
    const accountId = user.id;

    // Step 3: Get customer ID
    const api = createAccountsApi(client);
    const customerId = await api.getCustomerId(accountId);
    steps.step3_customerId = customerId ?? 'new customer';

    // Step 4: Get product and plan
    const product = billingConfig.products.find(
      (item) => item.id === productId,
    );

    if (!product) {
      return NextResponse.json(
        { error: `Product '${productId}' not found`, steps },
        { status: 400 },
      );
    }

    const { plan } = getProductPlanPair(billingConfig, planId);
    steps.step4_plan = { planId: plan.id, planName: plan.name };

    // Step 5: Build return URL
    const returnUrl = new URL(
      pathsConfig.app.personalAccountBillingReturn,
      appConfig.url,
    ).toString();
    steps.step5_returnUrl = returnUrl;

    // Step 6: Get billing gateway
    const service = await getBillingGatewayProvider(client);
    steps.step6_gateway = 'OK';

    // Step 7: Create checkout session
    const { checkoutToken } = await service.createCheckoutSession({
      returnUrl,
      accountId,
      customerEmail: user.email,
      customerId,
      plan,
      variantQuantities: [],
      enableDiscountField: product.enableDiscountField,
    });

    steps.step7_checkout = 'OK';

    return NextResponse.json({ checkoutToken, steps });
  } catch (e) {
    const error = e as Error;
    steps.error_name = error.name;
    steps.error_message = error.message;

    if (error.name === 'ZodError') {
      steps.zod_issues = (e as { issues?: unknown[] }).issues;
    }

    const cause = error.cause as Error | undefined;
    if (cause) {
      steps.cause_name = cause.name;
      steps.cause_message = cause.message;

      if (cause.name === 'ZodError') {
        steps.cause_zod_issues = (cause as { issues?: unknown[] }).issues;
      }
    }

    return NextResponse.json(
      { error: error.message, steps },
      { status: 500 },
    );
  }
}
