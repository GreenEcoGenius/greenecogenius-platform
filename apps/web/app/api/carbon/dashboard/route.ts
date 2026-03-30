import { NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function GET() {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accountId = user.id;

  // Fetch all carbon records for this account
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: records, error: recordsError } = await (client as any)
    .from('carbon_records')
    .select('*')
    .eq('account_id', accountId);

  if (recordsError) {
    return NextResponse.json(
      { error: 'Failed to fetch carbon records' },
      { status: 500 },
    );
  }

  const allRecords = records ?? [];

  // Aggregated totals
  const totalCo2Avoided = allRecords.reduce(
    (sum: number, r: Record<string, number>) => sum + (r.co2_avoided ?? 0),
    0,
  );
  const totalCo2Transport = allRecords.reduce(
    (sum: number, r: Record<string, number>) => sum + (r.co2_transport ?? 0),
    0,
  );
  const totalCo2NetBenefit = allRecords.reduce(
    (sum: number, r: Record<string, number>) =>
      sum + (r.co2_net_benefit ?? 0),
    0,
  );
  const totalWeightRecycled = allRecords.reduce(
    (sum: number, r: Record<string, number>) =>
      sum + (r.weight_tonnes ?? 0),
    0,
  );
  const transactionCount = allRecords.length;

  // Breakdown by material_category
  const categoryMap: Record<
    string,
    {
      co2_avoided: number;
      co2_transport: number;
      co2_net_benefit: number;
      weight_tonnes: number;
      count: number;
    }
  > = {};

  for (const r of allRecords) {
    const cat = r.material_category ?? 'unknown';

    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        co2_avoided: 0,
        co2_transport: 0,
        co2_net_benefit: 0,
        weight_tonnes: 0,
        count: 0,
      };
    }

    categoryMap[cat]!.co2_avoided += r.co2_avoided ?? 0;
    categoryMap[cat]!.co2_transport += r.co2_transport ?? 0;
    categoryMap[cat]!.co2_net_benefit += r.co2_net_benefit ?? 0;
    categoryMap[cat]!.weight_tonnes += r.weight_tonnes ?? 0;
    categoryMap[cat]!.count += 1;
  }

  // Monthly evolution (last 12 months)
  const now = new Date();
  const twelveMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 11,
    1,
  );

  const monthlyMap: Record<
    string,
    {
      co2_avoided: number;
      co2_transport: number;
      co2_net_benefit: number;
      weight_tonnes: number;
      count: number;
    }
  > = {};

  // Initialize last 12 months
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    monthlyMap[key] = {
      co2_avoided: 0,
      co2_transport: 0,
      co2_net_benefit: 0,
      weight_tonnes: 0,
      count: 0,
    };
  }

  for (const r of allRecords) {
    const createdAt = new Date(r.created_at);

    if (createdAt >= twelveMonthsAgo) {
      const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;

      if (monthlyMap[key]) {
        monthlyMap[key]!.co2_avoided += r.co2_avoided ?? 0;
        monthlyMap[key]!.co2_transport += r.co2_transport ?? 0;
        monthlyMap[key]!.co2_net_benefit += r.co2_net_benefit ?? 0;
        monthlyMap[key]!.weight_tonnes += r.weight_tonnes ?? 0;
        monthlyMap[key]!.count += 1;
      }
    }
  }

  const monthlyEvolution = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));

  // Equivalences
  const equivalences = {
    trees: totalCo2Avoided / 25,
    car_km: totalCo2Avoided / 0.21,
    flights_paris_nyc: totalCo2Avoided / 1000,
  };

  return NextResponse.json({
    totals: {
      co2_avoided: totalCo2Avoided,
      co2_transport: totalCo2Transport,
      co2_net_benefit: totalCo2NetBenefit,
      weight_recycled: totalWeightRecycled,
      transaction_count: transactionCount,
    },
    breakdown_by_category: categoryMap,
    monthly_evolution: monthlyEvolution,
    equivalences,
  });
}
