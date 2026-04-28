import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import appConfig from '~/config/app.config';

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accountId = user.id;

  // Check if already has a connected account
  const adminClient = getSupabaseServerAdminClient();

  const { data: existing } = await adminClient
    .from('stripe_connected_accounts')
    .select('stripe_account_id, onboarding_complete')
    .eq('account_id', accountId)
    .single();

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    let stripeAccountId: string;

    if (existing) {
      stripeAccountId = existing.stripe_account_id;
    } else {
      // Create a new Express connected account
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'FR',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'company',
        metadata: {
          account_id: accountId,
          platform: 'greenecogenius',
        },
      });

      stripeAccountId = account.id;

      // Save to database
      // 
      await adminClient.from('stripe_connected_accounts').insert({
        account_id: accountId,
        stripe_account_id: stripeAccountId,
        business_type: 'company',
        country: 'FR',
      });
    }

    // Generate onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: new URL(
        '/home/wallet?refresh=true',
        appConfig.url,
      ).toString(),
      return_url: new URL(
        '/home/wallet?onboarding=complete',
        appConfig.url,
      ).toString(),
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Stripe Connect onboarding error:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
