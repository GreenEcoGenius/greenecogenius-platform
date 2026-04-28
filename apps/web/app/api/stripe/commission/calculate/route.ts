import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function GET(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { error: authError } = await requireUser(client);

  if (authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const amountParam = req.nextUrl.searchParams.get('amount');

  if (!amountParam) {
    return NextResponse.json(
      { error: 'Missing amount parameter (in cents)' },
      { status: 400 },
    );
  }

  const amountCents = parseInt(amountParam, 10);

  if (isNaN(amountCents) || amountCents <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const adminClient = getSupabaseServerAdminClient();

  // Call the SQL function
  const { data, error } = await adminClient.rpc(
    'calculate_commission',
    { p_amount_cents: amountCents },
  );

  if (error || !data?.[0]) {
    return NextResponse.json(
      { error: 'Failed to calculate commission' },
      { status: 500 },
    );
  }

  const result = data[0];

  // Get promo end date if applicable
  const { data: configData } = await adminClient
    .from('commission_config')
    .select('valid_until, commission_type')
    .eq('id', result.config_id)
    .single();

  const isPromo =
    configData?.commission_type === 'flat' && configData?.valid_until;

  return NextResponse.json({
    total_amount: amountCents,
    commission_rate: Number(result.commission_rate),
    commission_rate_display: `${(Number(result.commission_rate) * 100).toFixed(0)}%`,
    platform_fee: result.commission_amount,
    seller_receives: result.seller_amount,
    config_name: result.config_name,
    is_promo: !!isPromo,
    promo_ends_at: isPromo ? configData.valid_until : null,
  });
}
