import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';


export async function GET() {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accountId = user.id;

  // Use standard client — RLS ensures user can only access their own data
  const { data: records } = await client
    .from('carbon_records')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  const allRecords = (records ?? []) as Record<string, unknown>[];

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

  const rows = allRecords.map((r) => {
    const date = r.created_at
      ? new Date(r.created_at as string).toISOString().split('T')[0]
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
