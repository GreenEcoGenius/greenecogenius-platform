/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

function getMockCarbonData() {
  return [
    {
      created_at: '2026-03-31T10:00:00Z',
      material_category: 'Plastique PET',
      material_subcategory: 'Bouteilles',
      weight_tonnes: 2.5,
      co2_avoided: 4500,
      co2_transport: 46.5,
      co2_net_benefit: 4453.5,
      origin_location: 'Lyon',
      distance_km: 300,
    },
    {
      created_at: '2026-03-28T14:00:00Z',
      material_category: 'Carton',
      material_subcategory: 'Emballages',
      weight_tonnes: 1.2,
      co2_avoided: 900,
      co2_transport: 14.9,
      co2_net_benefit: 885.1,
      origin_location: 'Marseille',
      distance_km: 200,
    },
    {
      created_at: '2026-03-25T09:30:00Z',
      material_category: 'Metal',
      material_subcategory: 'Acier',
      weight_tonnes: 3.0,
      co2_avoided: 4080,
      co2_transport: 37.2,
      co2_net_benefit: 4042.8,
      origin_location: 'Toulouse',
      distance_km: 200,
    },
    {
      created_at: '2026-03-22T11:00:00Z',
      material_category: 'Aluminium',
      material_subcategory: 'Canettes',
      weight_tonnes: 0.8,
      co2_avoided: 5840,
      co2_transport: 9.9,
      co2_net_benefit: 5830.1,
      origin_location: 'Bordeaux',
      distance_km: 200,
    },
    {
      created_at: '2026-03-20T08:00:00Z',
      material_category: 'Bois',
      material_subcategory: 'Palettes',
      weight_tonnes: 5.0,
      co2_avoided: 1650,
      co2_transport: 62,
      co2_net_benefit: 1588,
      origin_location: 'Nantes',
      distance_km: 200,
    },
    {
      created_at: '2026-03-18T16:00:00Z',
      material_category: 'Verre',
      material_subcategory: 'Bouteilles',
      weight_tonnes: 1.5,
      co2_avoided: 750,
      co2_transport: 18.6,
      co2_net_benefit: 731.4,
      origin_location: 'Strasbourg',
      distance_km: 200,
    },
    {
      created_at: '2026-03-15T13:00:00Z',
      material_category: 'Textile',
      material_subcategory: 'Coton',
      weight_tonnes: 0.6,
      co2_avoided: 2580,
      co2_transport: 5.6,
      co2_net_benefit: 2574.4,
      origin_location: 'Lille',
      distance_km: 150,
    },
    {
      created_at: '2026-03-10T10:00:00Z',
      material_category: 'Papier',
      material_subcategory: 'Bureau',
      weight_tonnes: 2.0,
      co2_avoided: 1500,
      co2_transport: 24.8,
      co2_net_benefit: 1475.2,
      origin_location: 'Paris',
      distance_km: 200,
    },
  ];
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

  // Use real data if available, otherwise use mock data
  const allRecords: any[] =
    records && records.length > 0 ? records : getMockCarbonData();

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
