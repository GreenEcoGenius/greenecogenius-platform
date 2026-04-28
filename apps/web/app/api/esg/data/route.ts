import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

const PostSchema = z.object({
  reporting_year: z.number().int().min(2000).max(2100),
  reporting_period: z.string().min(1).max(50),
  natural_gas_kwh: z.number().min(0).optional(),
  fuel_liters: z.number().min(0).optional(),
  fuel_type: z.string().max(50).optional(),
  other_kg_co2: z.number().min(0).optional(),
  electricity_kwh: z.number().min(0).optional(),
  electricity_source: z.string().max(50).optional(),
  heating_kwh: z.number().min(0).optional(),
  business_travel_km: z.number().min(0).optional(),
  travel_mode: z.string().max(50).optional(),
  commuting_employees: z.number().int().min(0).optional(),
  commuting_avg_km: z.number().min(0).optional(),
  purchased_goods_eur: z.number().min(0).optional(),
  waste_tonnes: z.number().min(0).optional(),
  nb_employees: z.number().int().min(0).optional(),
  platform_co2_avoided: z.number().min(0).optional(),
  platform_transactions_count: z.number().int().min(0).optional(),
  platform_tonnes_recycled: z.number().min(0).optional(),
});

export async function GET(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');

  if (!year || !/^\d{4}$/.test(year)) {
    return NextResponse.json(
      { error: 'Query parameter "year" is required and must be a 4-digit year' },
      { status: 400 },
    );
  }

  const reportingYear = parseInt(year, 10);

  // Use standard client — RLS ensures user can only access their own data
  const { data, error } = await client
    .from('org_esg_data')
    .select('*')
    .eq('account_id', user.id)
    .eq('reporting_year', reportingYear);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ESG data' },
      { status: 500 },
    );
  }

  // Also fetch platform auto-fill data from carbon_records
  const startDate = `${reportingYear}-01-01`;
  const endDate = `${reportingYear}-12-31`;

  const { data: records } = await client
    .from('carbon_records')
    .select('co2_avoided_kg, transaction_type, tonnes_recycled')
    .eq('account_id', user.id)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const platformData = {
    platform_co2_avoided: 0,
    platform_transactions_count: 0,
    platform_tonnes_recycled: 0,
  };

  if (records && records.length > 0) {
    platformData.platform_transactions_count = records.length;

    for (const record of records) {
      platformData.platform_co2_avoided += record.co2_avoided_kg ?? 0;
      platformData.platform_tonnes_recycled += record.tonnes_recycled ?? 0;
    }
  }

  return NextResponse.json({
    data: data ?? [],
    platform: platformData,
  });
}

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawBody: unknown;

  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = PostSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const record = {
    account_id: user.id,
    ...parsed.data,
  };

  // Use standard client — RLS ensures user can only write their own data
  const { data, error } = await client
    .from('org_esg_data')
    .upsert(record, {
      onConflict: 'account_id,reporting_year,reporting_period',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: 'Failed to upsert ESG data', details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}
