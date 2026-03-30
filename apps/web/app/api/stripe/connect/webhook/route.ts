import { NextRequest, NextResponse } from 'next/server';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

export async function POST(req: NextRequest) {
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_CONNECT_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 },
    );
  }

  let event: import('stripe').Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const adminClient = getSupabaseServerAdminClient();

  if (event.type === 'account.updated') {
    const account = event.data.object as import('stripe').Stripe.Account;
    const stripeAccountId = account.id;

    const chargesEnabled = account.charges_enabled ?? false;
    const payoutsEnabled = account.payouts_enabled ?? false;
    const onboardingComplete = chargesEnabled && payoutsEnabled;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('stripe_connected_accounts')
      .update({
        charges_enabled: chargesEnabled,
        payouts_enabled: payoutsEnabled,
        onboarding_complete: onboardingComplete,
        business_type: account.business_type ?? null,
      })
      .eq('stripe_account_id', stripeAccountId);

    // Create wallet if onboarding just completed and doesn't exist yet
    if (onboardingComplete) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: connected } = await (adminClient as any)
        .from('stripe_connected_accounts')
        .select('account_id')
        .eq('stripe_account_id', stripeAccountId)
        .single();

      if (connected) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (adminClient as any)
          .from('wallet_balances')
          .upsert(
            { account_id: connected.account_id, currency: 'eur' },
            { onConflict: 'account_id' },
          );
      }
    }
  }

  return NextResponse.json({ received: true });
}
