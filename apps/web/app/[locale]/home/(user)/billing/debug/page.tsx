import { getProductPlanPair } from '@kit/billing';
import { CreateBillingCheckoutSchema } from '@kit/billing/schema';
import { getBillingGatewayProvider } from '@kit/billing-gateway';
import { createAccountsApi } from '@kit/accounts/api';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import appConfig from '~/config/app.config';
import billingConfig from '~/config/billing.config';
import pathsConfig from '~/config/paths.config';

export default async function DebugBillingPage() {
  const checks: Record<string, unknown> = {};

  try {
    const client = getSupabaseServerClient();
    const { data: user, error: authError } = await requireUser(client);

    if (authError || !user) {
      checks.step1_auth = 'FAIL';
      checks.auth_error = authError?.message;
      return <pre>{JSON.stringify(checks, null, 2)}</pre>;
    }

    checks.step1_auth = 'OK - ' + user.email;
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
      variantQuantities: [] as { variantId: string; quantity: number }[],
      enableDiscountField: product.enableDiscountField,
    };

    checks.step4_params = {
      returnUrl,
      accountId,
      customerEmail: user.email,
      customerId: customerId ?? 'undefined',
      planId,
    };

    // Step 5: Validate checkout schema
    const schemaResult = CreateBillingCheckoutSchema.safeParse(checkoutParams);
    if (schemaResult.success) {
      checks.step5_schema = 'PASS';
    } else {
      checks.step5_schema = 'FAIL';
      checks.step5_issues = schemaResult.error.issues;
    }

    // Step 6: Direct Stripe API test
    try {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2026-02-25.clover' as never,
      });

      // Simple test: list 1 product
      const products = await stripe.products.list({ limit: 1 });
      checks.step6_stripe_api = 'OK';
      checks.step6_products_count = products.data.length;
      checks.step6_first_product = products.data[0]?.name;
    } catch (e) {
      checks.step6_stripe_error = (e as Error).message;
      checks.step6_stripe_error_type = (e as { type?: string }).type;
      checks.step6_stripe_error_code = (e as { code?: string }).code;
      checks.step6_stripe_status = (e as { statusCode?: number }).statusCode;
    }

    // Step 7: Try full checkout
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

      checks.step7_checkout = 'OK';
      checks.step7_token = result.checkoutToken ? 'received' : 'missing';
    } catch (e) {
      checks.step7_error = (e as Error).message;
      checks.step7_error_name = (e as Error).name;

      const cause = (e as Error).cause as Error | undefined;
      if (cause) {
        checks.step7_cause_message = cause.message;
        checks.step7_cause_name = cause.name;
      }
    }
  } catch (e) {
    checks.top_error = (e as Error).message;
    checks.top_error_name = (e as Error).name;

    if ((e as Error).name === 'ZodError') {
      checks.top_zod = (e as { issues?: unknown[] }).issues;
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Billing Debug</h1>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {JSON.stringify(checks, null, 2)}
      </pre>
    </div>
  );
}
