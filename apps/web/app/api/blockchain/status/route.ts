import { NextResponse } from 'next/server';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

export async function GET() {
  const configured = !!(
    process.env.ALCHEMY_RPC_URL && process.env.CONTRACT_ADDRESS
  );

  const adminClient = getSupabaseServerAdminClient();

  // Count blockchain records
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: blocksCount } = await (adminClient as any)
    .from('blockchain_records')
    .select('*', { count: 'exact', head: true });

  // Count certificates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: certsCount } = await (adminClient as any)
    .from('traceability_certificates')
    .select('*', { count: 'exact', head: true });

  // Try to get on-chain stats
  let onChain: {
    totalLots: number;
    totalCertificates: number;
  } | null = null;

  if (configured) {
    try {
      const { getBlockchainStats } =
        await import('~/lib/blockchain/alchemy-service');
      const stats = await getBlockchainStats();

      if (stats) {
        onChain = {
          totalLots: stats.totalLots,
          totalCertificates: stats.totalCertificates,
        };
      }
    } catch {
      // On-chain stats not available — that's fine
    }
  }

  return NextResponse.json({
    configured,
    network: configured ? 'Polygon Mainnet' : null,
    contractAddress: process.env.CONTRACT_ADDRESS ?? null,
    supabase: {
      blocks: blocksCount ?? 0,
      certificates: certsCount ?? 0,
    },
    onChain,
  });
}
