import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

export async function GET(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');

  if (!year) {
    return NextResponse.json(
      { error: 'Query parameter "year" is required' },
      { status: 400 },
    );
  }

  const reportingYear = parseInt(year, 10);

  if (isNaN(reportingYear)) {
    return NextResponse.json(
      { error: 'Invalid year parameter' },
      { status: 400 },
    );
  }

  const adminClient = getSupabaseServerAdminClient();

  // Fetch org_esg_data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (adminClient as any)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: records } = await (adminClient as any)
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

  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.reporting_year || !body.reporting_period) {
    return NextResponse.json(
      { error: 'reporting_year and reporting_period are required' },
      { status: 400 },
    );
  }

  // Whitelist allowed fields for upsert
  const allowedFields = [
    'reporting_year',
    'reporting_period',
    // Scope 1 fields
    'natural_gas_kwh',
    'fuel_liters',
    'fuel_type',
    'other_kg_co2',
    // Scope 2 fields
    'electricity_kwh',
    'electricity_source',
    'heating_kwh',
    // Scope 3 fields
    'business_travel_km',
    'travel_mode',
    'commuting_employees',
    'commuting_avg_km',
    'purchased_goods_eur',
    'waste_tonnes',
    // General
    'nb_employees',
    // Platform auto-fill
    'platform_co2_avoided',
    'platform_transactions_count',
    'platform_tonnes_recycled',
  ];

  const record: Record<string, unknown> = {
    account_id: user.id,
  };

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      record[field] = body[field];
    }
  }

  const adminClient = getSupabaseServerAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (adminClient as any)
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
