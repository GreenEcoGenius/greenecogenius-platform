import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

/**
 * Public GET endpoint returning global blockchain statistics.
 * Cached for 5 minutes via Cache-Control header.
 */
export async function GET() {
  const adminClient = getSupabaseServerAdminClient();

  // Run all queries in parallel
  const [certificatesResult, carbonResult] = await Promise.all([
    // Total certificates count
    // 
    adminClient
      .from('traceability_certificates')
      .select('id', { count: 'exact', head: true }),

    // Carbon aggregates
    // 
    adminClient
      .from('carbon_records')
      .select('weight_tonnes, co2_avoided'),
  ]);

  const totalCertificates = certificatesResult.count ?? 0;

  // Compute aggregates from carbon records
  let totalTonnes = 0;
  let totalCO2Avoided = 0;

  if (carbonResult.data && Array.isArray(carbonResult.data)) {
    for (const record of carbonResult.data) {
      totalTonnes += record.weight_tonnes ?? 0;
      totalCO2Avoided += record.co2_avoided ?? 0;
    }
  }

  const response = NextResponse.json({
    total_certificates: totalCertificates,
    total_tonnes: Math.round(totalTonnes * 100) / 100,
    total_co2_avoided: Math.round(totalCO2Avoided * 100) / 100,
  });

  response.headers.set(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=60',
  );

  return response;
}
