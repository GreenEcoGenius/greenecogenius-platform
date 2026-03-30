import { NextRequest, NextResponse } from 'next/server';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import appConfig from '~/config/app.config';

const CheckoutSchema = z.object({
  planId: z.string().uuid(),
  billingPeriod: z.enum(['monthly', 'yearly']),
});

export async function POST(req: NextRequest) {
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

  const { planId, billingPeriod } = parsed.data;
  const adminClient = getSupabaseServerAdminClient();

  // Check if already has active subscription
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingSub } = await (adminClient as any)
    .from('organization_subscriptions')
    .select('id, status')
    .eq('account_id', user.id)
    .in('status', ['active', 'trialing'])
    .single();

  if (existingSub) {
    return NextResponse.json(
      { error: 'Already has an active subscription' },
      { status: 400 },
    );
  }

  // Get plan
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: plan } = await (adminClient as any)
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  const stripePriceId =
    billingPeriod === 'yearly'
      ? plan.stripe_price_id_annual
      : plan.stripe_price_id_monthly;

  if (!stripePriceId) {
    return NextResponse.json(
      { error: 'Stripe price not configured for this plan' },
      { status: 400 },
    );
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email,
    line_items: [{ price: stripePriceId, quantity: 1 }],
    success_url: new URL(
      '/home/carbon?subscription=success',
      appConfig.url,
    ).toString(),
    cancel_url: new URL('/pricing?cancelled=true', appConfig.url).toString(),
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        account_id: user.id,
        plan_id: planId,
        plan_name: plan.name,
      },
    },
    metadata: {
      account_id: user.id,
      plan_id: planId,
    },
  });

  return NextResponse.json({ url: session.url });
}
