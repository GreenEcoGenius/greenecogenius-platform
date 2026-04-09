import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import appConfig from '~/config/app.config';

export async function POST() {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminClient = getSupabaseServerAdminClient();

  // Get the subscription to find the Stripe customer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sub } = await (adminClient as any)
    .from('organization_subscriptions')
    .select('stripe_customer_id')
    .eq('account_id', user.id)
    .single();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No subscription found' },
      { status: 404 },
    );
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: new URL('/home/wallet', appConfig.url).toString(),
  });

  return NextResponse.json({ url: session.url });
}
