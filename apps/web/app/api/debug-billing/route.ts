import { NextResponse } from 'next/server';

import { getProductPlanPair } from '@kit/billing';
import { CreateBillingCheckoutSchema } from '@kit/billing/schema';
import { getBillingGatewayProvider } from '@kit/billing-gateway';
import { createAccountsApi } from '@kit/accounts/api';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import appConfig from '~/config/app.config';
import billingConfig from '~/config/billing.config';
import pathsConfig from '~/config/paths.config';

export async function GET() {
  const checks: Record<string, unknown> = {};

  try {
    // Step 1: Auth
    const client = getSupabaseServerClient();
    const { data: user, error: authError } = await requireUser(client);

    if (authError || !user) {
      checks.step1_auth = 'FAIL - not authenticated';
      checks.auth_error = authError?.message;
      return NextResponse.json(checks, { status: 200 });
    }

    checks.step1_auth = 'OK - user: ' + user.email;
    const accountId = user.id;

    // Step 2: Get customer ID
    try {
      const api = createAccountsApi(client);
      const customerId = await api.getCustomerId(accountId);
      checks.step2_customerId = customerId ?? 'null/undefined (new customer)';
    } catch (e) {
      checks.step2_error = (e as Error).message;
    }

    // Step 3: Get billing provider
    try {
      const service = await getBillingGatewayProvider(client);
      checks.step3_gateway = 'OK';
    } catch (e) {
      checks.step3_error = (e as Error).message;
      checks.step3_error_name = (e as Error).name;
      if ((e as Error).name === 'ZodError') {
        checks.step3_zod_issues = (e as { issues?: unknown[] }).issues;
      }
    }

    // Step 4: Build checkout params
    const product = billingConfig.products[0]!;
    const planId = product.plans[0]!.id;
    const { plan } = getProductPlanPair(billingConfig, planId);

    const returnUrl = new URL(
      pathsConfig.app.personalAccountBillingReturn,
      appConfig.url,
    ).toString();

    const api = createAccountsApi(client);
    const customerId = await api.getCustomerId(accountId);

    const checkoutParams = {
      returnUrl,
      accountId,
      customerEmail: user.email,
      customerId,
      plan,
      variantQuantities: [],
      enableDiscountField: product.enableDiscountField,
    };

    checks.step4_params = {
      returnUrl,
      accountId,
      customerEmail: user.email,
      customerId: customerId ?? 'undefined',
      planId,
      enableDiscountField: product.enableDiscountField ?? 'undefined',
    };

    // Step 5: Validate checkout schema
    const schemaResult = CreateBillingCheckoutSchema.safeParse(checkoutParams);
    if (schemaResult.success) {
      checks.step5_schema = 'PASS';
    } else {
      checks.step5_schema = 'FAIL';
      checks.step5_issues = schemaResult.error.issues;
    }

    // Step 6: Try full checkout (will create a real session!)
    try {
      const service = await getBillingGatewayProvider(client);

      const result = await service.createCheckoutSession({
        returnUrl,
        accountId,
        customerEmail: user.email,
        customerId,
        plan,
        variantQuantities: [],
        enableDiscountField: product.enableDiscountField,
      });

      checks.step6_checkout = 'OK';
      checks.step6_token = result.checkoutToken ? 'received' : 'missing';
    } catch (e) {
      checks.step6_error = (e as Error).message;
      checks.step6_error_name = (e as Error).name;
      checks.step6_error_cause = (e as Error).cause
        ? {
            message: ((e as Error).cause as Error).message,
            name: ((e as Error).cause as Error).name,
          }
        : undefined;

      if ((e as Error).name === 'ZodError') {
        checks.step6_zod_issues = (e as { issues?: unknown[] }).issues;
      }

      // Check cause for ZodError
      if (((e as Error).cause as Error)?.name === 'ZodError') {
        checks.step6_cause_zod_issues = ((e as Error).cause as { issues?: unknown[] }).issues;
      }
    }
  } catch (e) {
    checks.top_level_error = (e as Error).message;
    checks.top_level_error_name = (e as Error).name;

    if ((e as Error).name === 'ZodError') {
      checks.top_level_zod_issues = (e as { issues?: unknown[] }).issues;
    }
  }

  return NextResponse.json(checks, { status: 200 });
}
