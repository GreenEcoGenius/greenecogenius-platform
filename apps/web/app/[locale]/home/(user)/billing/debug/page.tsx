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

    // Step 6: Direct Stripe API test via gateway
    try {
      const service = await getBillingGatewayProvider(client);
      // Try to get plan details (simpler than checkout)
      const planDetails = await service.getPlanById(plan.lineItems[0]!.id);
      checks.step6_plan_lookup = 'OK';
      checks.step6_plan_details = planDetails;
    } catch (e) {
      checks.step6_error = (e as Error).message;
      checks.step6_error_name = (e as Error).name;
      checks.step6_error_type = (e as { type?: string }).type;
      checks.step6_error_code = (e as { code?: string }).code;
      checks.step6_error_statusCode = (e as { statusCode?: number }).statusCode;

      const cause = (e as Error).cause as Error | undefined;
      if (cause) {
        checks.step6_cause = {
          message: cause.message,
          name: cause.name,
          type: (cause as { type?: string }).type,
          code: (cause as { code?: string }).code,
          statusCode: (cause as { statusCode?: number }).statusCode,
          rawType: (cause as { rawType?: string }).rawType,
        };
      }
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
