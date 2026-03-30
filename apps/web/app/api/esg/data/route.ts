import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

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

  // RLS will filter by account
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (client as any)
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

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  if (!body.reporting_year || !body.reporting_period) {
    return NextResponse.json(
      { error: 'reporting_year and reporting_period are required' },
      { status: 400 },
    );
  }

  const record = {
    ...body,
    account_id: user.id,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (client as any)
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
