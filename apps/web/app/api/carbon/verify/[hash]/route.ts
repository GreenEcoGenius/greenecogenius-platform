import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ hash: string }> },
) {
  const { hash } = await params;

  if (!hash) {
    return NextResponse.json(
      { error: 'Hash parameter is required' },
      { status: 400 },
    );
  }

  const adminClient = getSupabaseServerAdminClient();

  // Query blockchain_records by record_hash
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: blockchainRecord, error } = await (adminClient as any)
    .from('blockchain_records')
    .select('*')
    .eq('record_hash', hash)
    .single();

  if (error || !blockchainRecord) {
    return NextResponse.json(
      { error: 'Blockchain record not found', verified: false },
      { status: 404 },
    );
  }

  // Fetch related carbon record if available
  let carbonData = null;

  if (blockchainRecord.transaction_id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: carbonRecord } = await (adminClient as any)
      .from('carbon_records')
      .select('*')
      .eq('transaction_id', blockchainRecord.transaction_id)
      .single();

    carbonData = carbonRecord ?? null;
  }

  return NextResponse.json({
    verified: blockchainRecord.is_verified ?? false,
    blockchain: {
      record_hash: blockchainRecord.record_hash,
      hashed_data: blockchainRecord.hashed_data,
      block_number: blockchainRecord.block_number,
      previous_hash: blockchainRecord.previous_hash,
      is_verified: blockchainRecord.is_verified,
      verification_timestamp: blockchainRecord.verification_timestamp,
    },
    carbon_data: carbonData,
  });
}
