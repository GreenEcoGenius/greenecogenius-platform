/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

type Period = 'month' | 'quarter' | 'year' | 'all';

interface DateRange {
  current: Date | null;
  previous: Date | null;
  previousEnd: Date | null;
}

function getDateRange(period: Period): DateRange {
  const now = new Date();

  switch (period) {
    case 'month': {
      const current = new Date(now.getFullYear(), now.getMonth(), 1);
      const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return { current, previous, previousEnd: current };
    }
    case 'quarter': {
      const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
      const current = new Date(now.getFullYear(), quarterMonth, 1);
      const previous = new Date(now.getFullYear(), quarterMonth - 3, 1);
      return { current, previous, previousEnd: current };
    }
    case 'year': {
      const current = new Date(now.getFullYear(), 0, 1);
      const previous = new Date(now.getFullYear() - 1, 0, 1);
      return { current, previous, previousEnd: current };
    }
    case 'all':
    default:
      return { current: null, previous: null, previousEnd: null };
  }
}

function computeScore(params: {
  totalTonnes: number;
  uniqueMaterials: number;
  activeMonthsLast6: number;
  totalCo2Net: number;
  monthsOnPlatform: number;
}) {
  const volumeScore = Math.min((params.totalTonnes / 100) * 100, 100) * 0.3;
  const diversityScore =
    Math.min((params.uniqueMaterials / 5) * 100, 100) * 0.15;
  const regularityScore =
    Math.min((params.activeMonthsLast6 / 6) * 100, 100) * 0.2;
  const co2Score = Math.min((params.totalCo2Net / 50000) * 100, 100) * 0.25;
  const seniorityScore =
    Math.min((params.monthsOnPlatform / 12) * 100, 100) * 0.1;

  const total = Math.round(
    volumeScore + diversityScore + regularityScore + co2Score + seniorityScore,
  );

  let level: string;
  if (total <= 25) level = 'Bronze';
  else if (total <= 50) level = 'Argent';
  else if (total <= 75) level = 'Or';
  else level = 'Platine';

  return {
    total,
    level,
    volume_score: Math.round(volumeScore * 100) / 100,
    diversity_score: Math.round(diversityScore * 100) / 100,
    regularity_score: Math.round(regularityScore * 100) / 100,
    co2_score: Math.round(co2Score * 100) / 100,
    seniority_score: Math.round(seniorityScore * 100) / 100,
  };
}

function computeEquivalences(co2Kg: number) {
  return {
    trees: Math.round((co2Kg / 25) * 10) / 10,
    car_km: Math.round(co2Kg / 0.21),
    flights: Math.round((co2Kg / 1000) * 10) / 10,
    homes: Math.round((co2Kg / 2500) * 10) / 10,
    smartphones: Math.round(co2Kg / 8),
  };
}

export async function GET(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accountId = user.id;
  const period = (req.nextUrl.searchParams.get('period') as Period) || 'all';
  const { current, previous, previousEnd } = getDateRange(period);

  const adminClient = getSupabaseServerAdminClient();

  // ---------------------------------------------------------------------------
  // Build all queries in parallel
  // ---------------------------------------------------------------------------

  // 1. Current-period carbon records
  const currentRecordsQuery = (adminClient as any)
    .from('carbon_records')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (current) {
    currentRecordsQuery.gte('created_at', current.toISOString());
  }

  // 2. Previous-period carbon records (for comparison)
  let previousRecordsPromise: Promise<{ data: any[]; error: any }>;
  if (previous && previousEnd) {
    previousRecordsPromise = (adminClient as any)
      .from('carbon_records')
      .select('co2_avoided, co2_net_benefit, weight_tonnes')
      .eq('account_id', accountId)
      .gte('created_at', previous.toISOString())
      .lt('created_at', previousEnd.toISOString());
  } else {
    previousRecordsPromise = Promise.resolve({ data: [], error: null });
  }

  // 3. ALL records (needed for score calculation regardless of period filter)
  const allRecordsQuery = (adminClient as any)
    .from('carbon_records')
    .select('created_at, material_category, weight_tonnes, co2_net_benefit')
    .eq('account_id', accountId);

  // 4. Recent transactions (limit 10) with listing title + blockchain hash
  const recentTransactionsQuery = (adminClient as any)
    .from('carbon_records')
    .select(
      `
      id,
      transaction_id,
      material_category,
      material_subcategory,
      weight_tonnes,
      co2_avoided,
      co2_transport,
      co2_net_benefit,
      origin_location,
      distance_km,
      created_at,
      marketplace_transactions!inner (
        id,
        total_amount,
        status,
        listing_id,
        listings!inner ( id, title ),
        blockchain_hash
      )
    `,
    )
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
    .limit(10);

  // 5. Certificates (limit 6) with blockchain hash + carbon co2
  const certificatesQuery = (adminClient as any)
    .from('traceability_certificates')
    .select(
      `
      id,
      certificate_number,
      certificate_url,
      material_summary,
      weight_tonnes,
      co2_avoided,
      blockchain_hash,
      issued_at,
      expires_at,
      blockchain_records!inner ( record_hash ),
      carbon_records!inner ( co2_net_benefit, co2_transport )
    `,
    )
    .eq('issued_to_account_id', accountId)
    .order('issued_at', { ascending: false })
    .limit(6);

  // 6. First record date (for seniority)
  const firstRecordQuery = (adminClient as any)
    .from('carbon_records')
    .select('created_at')
    .eq('account_id', accountId)
    .order('created_at', { ascending: true })
    .limit(1);

  // ---------------------------------------------------------------------------
  // Execute all in parallel
  // ---------------------------------------------------------------------------

  const [
    currentRecordsRes,
    previousRecordsRes,
    allRecordsRes,
    recentTxRes,
    certsRes,
    firstRecordRes,
  ] = await Promise.all([
    currentRecordsQuery,
    previousRecordsPromise,
    allRecordsQuery,
    recentTransactionsQuery,
    certificatesQuery,
    firstRecordQuery,
  ]);

  if (currentRecordsRes.error) {
    return NextResponse.json(
      { error: 'Failed to fetch carbon records' },
      { status: 500 },
    );
  }

  const records: any[] = currentRecordsRes.data ?? [];
  const prevRecords: any[] = previousRecordsRes.data ?? [];
  const allRecords: any[] = allRecordsRes.data ?? [];

  // ---------------------------------------------------------------------------
  // HERO metrics
  // ---------------------------------------------------------------------------

  const hero = {
    co2_avoided: 0,
    co2_transport: 0,
    co2_net: 0,
    weight_tonnes: 0,
    transaction_count: records.length,
    prev_co2_avoided: 0,
    prev_weight_tonnes: 0,
    prev_transaction_count: prevRecords.length,
  };

  for (const r of records) {
    hero.co2_avoided += Number(r.co2_avoided ?? 0);
    hero.co2_transport += Number(r.co2_transport ?? 0);
    hero.co2_net += Number(r.co2_net_benefit ?? 0);
    hero.weight_tonnes += Number(r.weight_tonnes ?? 0);
  }

  for (const r of prevRecords) {
    hero.prev_co2_avoided += Number(r.co2_avoided ?? 0);
    hero.prev_weight_tonnes += Number(r.weight_tonnes ?? 0);
  }

  // Round hero values
  hero.co2_avoided = Math.round(hero.co2_avoided * 100) / 100;
  hero.co2_transport = Math.round(hero.co2_transport * 100) / 100;
  hero.co2_net = Math.round(hero.co2_net * 100) / 100;
  hero.weight_tonnes = Math.round(hero.weight_tonnes * 1000) / 1000;
  hero.prev_co2_avoided = Math.round(hero.prev_co2_avoided * 100) / 100;
  hero.prev_weight_tonnes = Math.round(hero.prev_weight_tonnes * 1000) / 1000;

  // ---------------------------------------------------------------------------
  // MONTHLY aggregation (last 12 months, always from all-time filtered records)
  // ---------------------------------------------------------------------------

  const now = new Date();
  const monthlyMap: Record<
    string,
    {
      co2_avoided: number;
      co2_transport: number;
      co2_net: number;
      weight: number;
      count: number;
    }
  > = {};

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap[key] = {
      co2_avoided: 0,
      co2_transport: 0,
      co2_net: 0,
      weight: 0,
      count: 0,
    };
  }

  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  for (const r of records) {
    const createdAt = new Date(r.created_at);
    if (createdAt >= twelveMonthsAgo) {
      const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap[key]) {
        monthlyMap[key]!.co2_avoided += Number(r.co2_avoided ?? 0);
        monthlyMap[key]!.co2_transport += Number(r.co2_transport ?? 0);
        monthlyMap[key]!.co2_net += Number(r.co2_net_benefit ?? 0);
        monthlyMap[key]!.weight += Number(r.weight_tonnes ?? 0);
        monthlyMap[key]!.count += 1;
      }
    }
  }

  const monthly = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      co2_avoided: Math.round(data.co2_avoided * 100) / 100,
      co2_transport: Math.round(data.co2_transport * 100) / 100,
      co2_net: Math.round(data.co2_net * 100) / 100,
      weight: Math.round(data.weight * 1000) / 1000,
      count: data.count,
    }));

  // ---------------------------------------------------------------------------
  // MATERIALS breakdown
  // ---------------------------------------------------------------------------

  const materialMap: Record<
    string,
    { co2_avoided: number; weight: number; count: number }
  > = {};

  for (const r of records) {
    const cat = r.material_category ?? 'unknown';
    if (!materialMap[cat]) {
      materialMap[cat] = { co2_avoided: 0, weight: 0, count: 0 };
    }
    materialMap[cat]!.co2_avoided += Number(r.co2_avoided ?? 0);
    materialMap[cat]!.weight += Number(r.weight_tonnes ?? 0);
    materialMap[cat]!.count += 1;
  }

  const materials = Object.entries(materialMap)
    .map(([category, data]) => ({
      category,
      co2_avoided: Math.round(data.co2_avoided * 100) / 100,
      weight: Math.round(data.weight * 1000) / 1000,
      count: data.count,
    }))
    .sort((a, b) => b.co2_avoided - a.co2_avoided);

  // ---------------------------------------------------------------------------
  // SCORE (always computed from ALL records, not period-filtered)
  // ---------------------------------------------------------------------------

  const totalTonnesAll = allRecords.reduce(
    (sum: number, r: any) => sum + Number(r.weight_tonnes ?? 0),
    0,
  );
  const totalCo2NetAll = allRecords.reduce(
    (sum: number, r: any) => sum + Number(r.co2_net_benefit ?? 0),
    0,
  );
  const uniqueMaterials = new Set(
    allRecords.map((r: any) => r.material_category),
  ).size;

  // Active months in last 6 months
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const activeMonthsSet = new Set<string>();
  for (const r of allRecords) {
    const d = new Date(r.created_at);
    if (d >= sixMonthsAgo) {
      activeMonthsSet.add(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      );
    }
  }

  // Months on platform
  const firstRecord = firstRecordRes.data?.[0];
  let monthsOnPlatform = 0;
  if (firstRecord) {
    const firstDate = new Date(firstRecord.created_at);
    monthsOnPlatform =
      (now.getFullYear() - firstDate.getFullYear()) * 12 +
      (now.getMonth() - firstDate.getMonth()) +
      1;
  }

  const score = computeScore({
    totalTonnes: totalTonnesAll,
    uniqueMaterials,
    activeMonthsLast6: activeMonthsSet.size,
    totalCo2Net: totalCo2NetAll,
    monthsOnPlatform,
  });

  // ---------------------------------------------------------------------------
  // RECENT TRANSACTIONS
  // ---------------------------------------------------------------------------

  const recentTransactions = (recentTxRes.data ?? []).map((r: any) => {
    const tx = r.marketplace_transactions;
    return {
      id: r.id,
      transaction_id: r.transaction_id,
      material_category: r.material_category,
      material_subcategory: r.material_subcategory,
      weight_tonnes: r.weight_tonnes,
      co2_avoided: r.co2_avoided,
      co2_transport: r.co2_transport,
      co2_net_benefit: r.co2_net_benefit,
      origin_location: r.origin_location,
      distance_km: r.distance_km,
      created_at: r.created_at,
      listing_title: tx?.listings?.title ?? null,
      blockchain_hash: tx?.blockchain_hash ?? null,
      status: tx?.status ?? null,
      total_amount: tx?.total_amount ?? null,
    };
  });

  // ---------------------------------------------------------------------------
  // CERTIFICATES
  // ---------------------------------------------------------------------------

  const certificates = (certsRes.data ?? []).map((c: any) => ({
    id: c.id,
    certificate_number: c.certificate_number,
    certificate_url: c.certificate_url,
    material_summary: c.material_summary,
    weight_tonnes: c.weight_tonnes,
    co2_avoided: c.co2_avoided,
    blockchain_hash:
      c.blockchain_hash ?? c.blockchain_records?.record_hash ?? null,
    co2_net_benefit: c.carbon_records?.co2_net_benefit ?? null,
    co2_transport: c.carbon_records?.co2_transport ?? null,
    issued_at: c.issued_at,
    expires_at: c.expires_at,
  }));

  // ---------------------------------------------------------------------------
  // EQUIVALENCES
  // ---------------------------------------------------------------------------

  const equivalences = computeEquivalences(hero.co2_avoided);

  // ---------------------------------------------------------------------------
  // Response
  // ---------------------------------------------------------------------------

  return NextResponse.json({
    hero,
    monthly,
    materials,
    score,
    recent_transactions: recentTransactions,
    certificates,
    equivalences,
  });
}
