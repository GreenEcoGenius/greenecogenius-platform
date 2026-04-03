/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { DEMO_DATA } from '~/lib/demo/demo-data';

/** CSV row shape; values derived from `DEMO_DATA.carbon` (demo-data has no per-record transport fields). */
function getDemoCarbonRecordsForCsv() {
  const { materialData, totalTransport } = DEMO_DATA.carbon;
  const totalWeightKg = materialData.reduce((s, m) => s + m.weight, 0);
  const createdAtStamps = [
    '2026-03-31T10:00:00Z',
    '2026-03-28T14:00:00Z',
    '2026-03-25T09:30:00Z',
    '2026-03-22T11:00:00Z',
    '2026-03-20T08:00:00Z',
  ];
  const origins = [
    { location: 'Lyon', distance_km: 300 },
    { location: 'Marseille', distance_km: 200 },
    { location: 'Toulouse', distance_km: 200 },
    { location: 'Bordeaux', distance_km: 200 },
    { location: 'Nantes', distance_km: 200 },
  ];

  return materialData.map((m, i) => {
    const weight_tonnes = m.weight / 1000;
    const co2_transport =
      totalWeightKg > 0
        ? Math.round((m.weight / totalWeightKg) * totalTransport * 10) / 10
        : 0;
    const co2_avoided = m.co2_avoided;
    const co2_net_benefit =
      Math.round((co2_avoided - co2_transport) * 10) / 10;
    const origin = origins[i % origins.length]!;
    return {
      created_at: createdAtStamps[i % createdAtStamps.length]!,
      material_category: m.category,
      material_subcategory: 'Démo',
      weight_tonnes,
      co2_avoided,
      co2_transport,
      co2_net_benefit,
      origin_location: origin.location,
      distance_km: origin.distance_km,
    };
  });
}

export async function GET() {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accountId = user.id;
  const adminClient = getSupabaseServerAdminClient();

  const { data: records } = await (adminClient as any)
    .from('carbon_records')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  // Use real data if available, otherwise use demo data
  const allRecords: any[] =
    records && records.length > 0 ? records : getDemoCarbonRecordsForCsv();

  // CSV header
  const headers = [
    'Date',
    'Material',
    'Subcategory',
    'Weight(t)',
    'CO2_Avoided(kg)',
    'CO2_Transport(kg)',
    'Net_Benefit(kg)',
    'Origin',
    'Distance(km)',
  ];

  const rows = allRecords.map((r: any) => {
    const date = r.created_at
      ? new Date(r.created_at).toISOString().split('T')[0]
      : '';
    return [
      date,
      escapeCsv(r.material_category ?? ''),
      escapeCsv(r.material_subcategory ?? ''),
      r.weight_tonnes ?? 0,
      r.co2_avoided ?? 0,
      r.co2_transport ?? 0,
      r.co2_net_benefit ?? 0,
      escapeCsv(r.origin_location ?? ''),
      r.distance_km ?? 0,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="carbon-export-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
