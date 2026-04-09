import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

/**
 * Public GET endpoint for blockchain verification.
 * Accepts a record hash or certificate number (case-insensitive).
 * Returns sanitized verification data (no prices, masked names, no internal IDs).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ hash: string }> },
) {
  const { hash } = await params;

  if (!hash || hash.trim().length < 3) {
    return NextResponse.json(
      { error: 'Hash parameter is required', verified: false },
      { status: 400 },
    );
  }

  const adminClient = getSupabaseServerAdminClient();

  // 1. Try to find by record_hash
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { data: blockchainRecord } = await (adminClient as any)
    .from('blockchain_records')
    .select('*')
    .eq('record_hash', hash.trim())
    .single();

  let certificate = null;

  // 2. If not found, try traceability_certificates by certificate_number (case-insensitive)
  if (!blockchainRecord) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cert } = await (adminClient as any)
      .from('traceability_certificates')
      .select('*')
      .ilike('certificate_number', hash.trim())
      .single();

    if (cert) {
      certificate = cert;

      // Find the blockchain record via transaction_id
      if (cert.transaction_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: br } = await (adminClient as any)
          .from('blockchain_records')
          .select('*')
          .eq('transaction_id', cert.transaction_id)
          .single();

        blockchainRecord = br;
      }
    }
  }

  if (!blockchainRecord) {
    return NextResponse.json(
      { error: 'Record not found', verified: false },
      { status: 404 },
    );
  }

  // 3. Fetch related data
  const transactionId = blockchainRecord.transaction_id;

  // Fetch certificate if not already loaded
  if (!certificate && transactionId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cert } = await (adminClient as any)
      .from('traceability_certificates')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    certificate = cert;
  }

  // Fetch carbon record
  let carbonRecord = null;

  if (transactionId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cr } = await (adminClient as any)
      .from('carbon_records')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    carbonRecord = cr;
  }

  // Fetch marketplace transaction + listing
  let transaction = null;
  let listing = null;

  if (transactionId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: tx } = await (adminClient as any)
      .from('marketplace_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    transaction = tx;

    if (tx?.listing_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: l } = await (adminClient as any)
        .from('listings')
        .select('title')
        .eq('id', tx.listing_id)
        .single();

      listing = l;
    }
  }

  // 4. Verify chain integrity
  const chainIntegrity = await verifyChainIntegrity(
    adminClient,
    blockchainRecord,
  );

  // 5. Build timeline
  const timeline = buildTimeline(blockchainRecord, transaction, certificate);

  // 6. Compute equivalences
  const co2Net = carbonRecord
    ? (carbonRecord.co2_net_benefit ??
      carbonRecord.co2_avoided - (carbonRecord.co2_transport ?? 0))
    : 0;
  const equivalences = {
    trees: Math.round(co2Net / 25),
    car_km: Math.round(co2Net * 4.7),
  };

  // 7. Extract hashed_data info for fallback
  const hashedData = blockchainRecord.hashed_data;
  const txData = hashedData?.transaction;

  return NextResponse.json({
    verified: true,
    chain_integrity: chainIntegrity,
    block: {
      hash: blockchainRecord.record_hash,
      block_number: blockchainRecord.block_number,
      previous_hash: blockchainRecord.previous_hash,
      timestamp: blockchainRecord.created_at,
    },
    certificate: certificate
      ? { number: certificate.certificate_number }
      : null,
    transaction: {
      listing_title: listing?.title ?? txData?.listing_title ?? null,
      material: carbonRecord?.material_category ?? null,
      material_category: carbonRecord?.material_category ?? null,
      weight_tonnes: carbonRecord?.weight_tonnes ?? null,
      origin: carbonRecord?.origin_location ?? txData?.origin ?? null,
      destination: txData?.destination ?? null,
      distance_km: carbonRecord?.distance_km ?? null,
    },
    carbon: carbonRecord
      ? {
          co2_avoided: carbonRecord.co2_avoided,
          co2_transport: carbonRecord.co2_transport ?? 0,
          co2_net: co2Net,
        }
      : null,
    timeline,
    equivalences,
  });
}

async function verifyChainIntegrity(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: any,
  record: Record<string, unknown>,
): Promise<boolean> {
  const blockNumber = record.block_number as number;

  // Genesis block is always valid
  if (blockNumber <= 1 || record.previous_hash === 'GENESIS') {
    return true;
  }

  // Check that previous_hash matches the actual previous block's record_hash
  const { data: prevBlock } = await adminClient
    .from('blockchain_records')
    .select('record_hash')
    .eq('block_number', blockNumber - 1)
    .single();

  if (!prevBlock) {
    return false;
  }

  return prevBlock.record_hash === record.previous_hash;
}

function buildTimeline(
  blockchainRecord: Record<string, unknown>,
  transaction: Record<string, unknown> | null,
  certificate: Record<string, unknown> | null,
) {
  const timeline: Array<{
    event: string;
    date: string | null;
    location?: string;
  }> = [];

  const hashedData = blockchainRecord.hashed_data as Record<
    string,
    unknown
  > | null;
  const txData = hashedData?.transaction as Record<string, unknown> | null;

  // Listing created
  if (transaction?.created_at) {
    timeline.push({
      event: 'listing_created',
      date: transaction.created_at as string,
      location: (txData?.origin as string) ?? undefined,
    });
  }

  // Payment confirmed
  if (transaction?.paid_at) {
    timeline.push({
      event: 'payment_confirmed',
      date: transaction.paid_at as string,
    });
  }

  // Shipped
  if (transaction?.shipped_at) {
    timeline.push({
      event: 'shipped',
      date: transaction.shipped_at as string,
    });
  }

  // Delivery confirmed
  if (transaction?.delivered_at || transaction?.delivery_confirmed_at) {
    timeline.push({
      event: 'delivery_confirmed',
      date: (transaction.delivery_confirmed_at ??
        transaction.delivered_at) as string,
      location: (txData?.destination as string) ?? undefined,
    });
  }

  // Blockchain recorded
  if (blockchainRecord.created_at) {
    timeline.push({
      event: 'blockchain_recorded',
      date: blockchainRecord.created_at as string,
    });
  }

  // Certificate issued
  if (certificate?.created_at) {
    timeline.push({
      event: 'certificate_issued',
      date: certificate.created_at as string,
    });
  }

  return timeline;
}
