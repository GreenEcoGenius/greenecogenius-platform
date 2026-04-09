import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

const RegisterSchema = z.object({
  transactionId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = RegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { transactionId } = parsed.data;
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

  // Fetch listing details
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: listing } = await (adminClient as any)
    .from('marketplace_listings')
    .select('*')
    .eq('id', tx.listing_id)
    .single();

  // Check blockchain configuration
  if (!process.env.CONTRACT_ADDRESS || !process.env.DEPLOYER_PRIVATE_KEY) {
    return NextResponse.json(
      {
        error:
          'Blockchain not configured. Set CONTRACT_ADDRESS and DEPLOYER_PRIVATE_KEY.',
      },
      { status: 503 },
    );
  }

  try {
    const { registerLotOnChain } =
      await import('~/lib/blockchain/alchemy-service');

    const result = await registerLotOnChain({
      lotId: transactionId,
      materialType: listing?.material_type ?? 'unknown',
      weightKg: listing?.weight_kg ?? 0,
      sellerName: tx.seller_account_id,
      buyerName: tx.buyer_account_id,
      co2Avoided: listing?.co2_avoided ?? 0,
      originLocation: listing?.origin_location,
      destinationLocation: listing?.destination_location,
    });

    // Update transaction with tx hash
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('marketplace_transactions')
      .update({ polygon_tx_hash: result.txHash })
      .eq('id', transactionId);

    // Log blockchain record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from('blockchain_records').insert({
      transaction_id: transactionId,
      listing_id: tx.listing_id,
      record_hash: result.dataHash,
      block_number: result.blockNumber,
      hashed_data: JSON.stringify({
        lotId: transactionId,
        materialType: listing?.material_type,
        weightKg: listing?.weight_kg,
        txHash: result.txHash,
      }),
    });

    const polygonscanUrl = `https://polygonscan.com/tx/${result.txHash}`;

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
      blockNumber: result.blockNumber,
      polygonscanUrl,
    });
  } catch (err) {
    console.error('On-chain registration failed:', err);

    return NextResponse.json(
      {
        error: 'On-chain registration failed',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
