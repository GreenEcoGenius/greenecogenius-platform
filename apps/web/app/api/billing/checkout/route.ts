import { NextRequest, NextResponse } from 'next/server';

import * as z from 'zod';

import { createAccountsApi } from '@kit/accounts/api';
import { getProductPlanPair } from '@kit/billing';
import { getBillingGatewayProvider } from '@kit/billing-gateway';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import appConfig from '~/config/app.config';
import billingConfig from '~/config/billing.config';
import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const CheckoutSchema = z.object({
  planId: z.string().min(1),
  productId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  if (!featureFlagsConfig.enablePersonalAccountBilling) {
    return NextResponse.json(
      { error: 'Personal account billing is not enabled' },
      { status: 400 },
    );
  }

  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { planId, productId } = parsed.data;
  const accountId = user.id;

  const product = billingConfig.products.find((item) => item.id === productId);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 400 });
  }

  const { plan } = getProductPlanPair(billingConfig, planId);

  const returnUrl = new URL(
    pathsConfig.app.personalAccountBillingReturn,
    appConfig.url,
  ).toString();

  const api = createAccountsApi(client);
  const customerId = await api.getCustomerId(accountId);

  const service = await getBillingGatewayProvider(client);

  const { checkoutToken } = await service.createCheckoutSession({
    returnUrl,
    accountId,
    customerEmail: user.email,
    customerId,
    plan,
    variantQuantities: [],
    enableDiscountField: product.enableDiscountField,
  });

  return NextResponse.json({ checkoutToken });
}
