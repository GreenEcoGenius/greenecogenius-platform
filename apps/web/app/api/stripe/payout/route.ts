import { NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function GET() {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminClient = getSupabaseServerAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: connected } = await (adminClient as any)
    .from('stripe_connected_accounts')
    .select('stripe_account_id')
    .eq('account_id', user.id)
    .single();

  if (!connected) {
    return NextResponse.json(
      { error: 'No connected account' },
      { status: 404 },
    );
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Get balance on the connected account
  const balance = await stripe.balance.retrieve({
    stripeAccount: connected.stripe_account_id,
  });

  // Get recent payouts
  const payouts = await stripe.payouts.list(
    { limit: 10 },
    { stripeAccount: connected.stripe_account_id },
  );

  return NextResponse.json({
    balance: {
      available: balance.available,
      pending: balance.pending,
    },
    payouts: payouts.data.map((p) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      arrival_date: p.arrival_date,
      created: p.created,
    })),
  });
}
