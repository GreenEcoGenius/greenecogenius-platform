import { NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import appConfig from '~/config/app.config';

export async function POST() {
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
      { error: 'No connected account found' },
      { status: 404 },
    );
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const accountLink = await stripe.accountLinks.create({
    account: connected.stripe_account_id,
    refresh_url: new URL('/home/wallet?refresh=true', appConfig.url).toString(),
    return_url: new URL(
      '/home/wallet?onboarding=complete',
      appConfig.url,
    ).toString(),
    type: 'account_onboarding',
  });

  return NextResponse.json({ url: accountLink.url });
}
