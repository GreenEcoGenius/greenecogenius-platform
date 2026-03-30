import { NextResponse } from 'next/server';

import { getProductPlanPair } from '@kit/billing';
import { CreateBillingCheckoutSchema } from '@kit/billing/schema';
import { getBillingGatewayProvider } from '@kit/billing-gateway';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import appConfig from '~/config/app.config';
import billingConfig from '~/config/billing.config';
import pathsConfig from '~/config/paths.config';

export async function GET() {
  const checks: Record<string, unknown> = {};

  try {
    // Step 1: Check env vars
    checks.step1_env = {
      STRIPE_SECRET_KEY_present: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_SECRET_KEY_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7),
      STRIPE_WEBHOOK_SECRET_present: !!process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_WEBHOOK_SECRET_prefix: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10),
    };

    // Step 2: Check billing config
    const product = billingConfig.products[0];
    const planId = product?.plans[0]?.id;

    checks.step2_billing_config = {
      provider: billingConfig.provider,
      productId: product?.id,
      planId,
      planName: product?.plans[0]?.name,
    };

    // Step 3: Get plan pair
    if (planId) {
      const { plan } = getProductPlanPair(billingConfig, planId);
      checks.step3_plan = {
        id: plan.id,
        name: plan.name,
        paymentType: plan.paymentType,
        lineItemsCount: plan.lineItems.length,
        lineItems: plan.lineItems,
      };

      // Step 4: Build checkout params (same as user-billing.service.ts)
      const returnUrl = new URL(
        pathsConfig.app.personalAccountBillingReturn,
        appConfig.url,
      ).toString();

      const checkoutParams = {
        returnUrl,
        accountId: '00000000-0000-0000-0000-000000000000', // fake UUID
        customerEmail: 'test@test.com',
        plan,
        variantQuantities: [],
        enableDiscountField: product.enableDiscountField,
      };

      checks.step4_checkout_params = {
        returnUrl: checkoutParams.returnUrl,
        accountId: checkoutParams.accountId,
      };

      // Step 5: Validate with CreateBillingCheckoutSchema
      const schemaResult = CreateBillingCheckoutSchema.safeParse(checkoutParams);

      if (schemaResult.success) {
        checks.step5_schema = 'PASS';
      } else {
        checks.step5_schema = 'FAIL';
        checks.step5_issues = schemaResult.error.issues;
      }

      // Step 6: Try to get billing gateway provider
      try {
        const client = getSupabaseServerClient();
        const service = await getBillingGatewayProvider(client);
        checks.step6_gateway = 'OK - provider loaded';
      } catch (e) {
        checks.step6_gateway_error = (e as Error).message;
        checks.step6_gateway_error_name = (e as Error).name;

        if ((e as Error).name === 'ZodError') {
          checks.step6_zod_issues = (e as { issues?: unknown[] }).issues;
        }
      }
    }
  } catch (e) {
    checks.error = (e as Error).message;
    checks.error_name = (e as Error).name;
    checks.error_stack = (e as Error).stack?.split('\n').slice(0, 5);

    if ((e as Error).name === 'ZodError') {
      checks.zod_issues = (e as { issues?: unknown[] }).issues;
    }
  }

  return NextResponse.json(checks, { status: 200 });
}
