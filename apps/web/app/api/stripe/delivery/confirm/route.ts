import { NextRequest, NextResponse } from 'next/server';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

const ConfirmSchema = z.object({
  transactionId: z.string().uuid(),
  confirmedBy: z.enum(['buyer', 'logistics']),
});

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = ConfirmSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { transactionId, confirmedBy } = parsed.data;
  const adminClient = getSupabaseServerAdminClient();

  // Fetch transaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tx } = await (adminClient as any)
    .from('marketplace_transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (!tx) {
    return NextResponse.json(
      { error: 'Transaction not found' },
      { status: 404 },
    );
  }

  // Only buyer can confirm delivery (or logistics partner in future)
  if (confirmedBy === 'buyer' && tx.buyer_account_id !== user.id) {
    return NextResponse.json(
      { error: 'Only the buyer can confirm delivery' },
      { status: 403 },
    );
  }

  // Transaction must be in paid or in_transit status
  if (!['paid', 'in_transit'].includes(tx.status)) {
    return NextResponse.json(
      { error: `Cannot confirm delivery for status: ${tx.status}` },
      { status: 400 },
    );
  }

  // Get seller's Stripe connected account
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sellerConnect } = await (adminClient as any)
    .from('stripe_connected_accounts')
    .select('stripe_account_id')
    .eq('account_id', tx.seller_account_id)
    .single();

  if (!sellerConnect) {
    return NextResponse.json(
      { error: 'Seller Stripe account not found' },
      { status: 500 },
    );
  }

  // Transfer funds to seller (80%)
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const transfer = await stripe.transfers.create({
    amount: tx.seller_amount,
    currency: tx.currency,
    destination: sellerConnect.stripe_account_id,
    transfer_group: tx.id,
    metadata: {
      transaction_id: tx.id,
      listing_id: tx.listing_id,
    },
  });

  const now = new Date().toISOString();

  // Update transaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient as any)
    .from('marketplace_transactions')
    .update({
      status: 'completed',
      delivery_status: 'confirmed',
      delivery_confirmed_at: now,
      funds_released_at: now,
      stripe_transfer_id: transfer.id,
    })
    .eq('id', transactionId);

  // Update wallet: move from pending to available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: wallet } = await (adminClient as any)
    .from('wallet_balances')
    .select('pending_balance, available_balance, total_earned')
    .eq('account_id', tx.seller_account_id)
    .single();

  if (wallet) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('wallet_balances')
      .update({
        pending_balance: Math.max(0, wallet.pending_balance - tx.seller_amount),
        available_balance: wallet.available_balance + tx.seller_amount,
        total_earned: wallet.total_earned + tx.seller_amount,
      })
      .eq('account_id', tx.seller_account_id);
  }

  // Log events
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient as any).from('transaction_events').insert([
    {
      transaction_id: transactionId,
      event_type: 'delivery_confirmed',
      actor_account_id: user.id,
      actor_role: confirmedBy,
    },
    {
      transaction_id: transactionId,
      event_type: 'funds_released',
      actor_role: 'platform',
      metadata: {
        transfer_id: transfer.id,
        seller_amount: tx.seller_amount,
        platform_fee: tx.platform_fee,
      },
    },
  ]);

  return NextResponse.json({
    success: true,
    transferId: transfer.id,
    sellerAmount: tx.seller_amount,
  });
}
