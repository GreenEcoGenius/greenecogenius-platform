import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

  if (!year || !/^\d{4}$/.test(year)) {
    return NextResponse.json(
      { error: 'Query parameter "year" is required and must be a 4-digit year' },
      { status: 400 },
    );
  }

  const reportingYear = parseInt(year, 10);

  const startDate = `${reportingYear}-01-01`;
  const endDate = `${reportingYear}-12-31`;

  // Use standard client — RLS ensures user can only access their own data
  const { data: records, error } = await client
    .from('carbon_records')
    .select('co2_avoided_kg, transaction_type, tonnes_recycled')
    .eq('account_id', user.id)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch carbon records' },
      { status: 500 },
    );
  }

  const result = {
    platform_co2_avoided: 0,
    platform_transactions_count: 0,
    platform_tonnes_recycled: 0,
  };

  if (records && records.length > 0) {
    result.platform_transactions_count = records.length;

    for (const record of records) {
      result.platform_co2_avoided += record.co2_avoided_kg ?? 0;
      result.platform_tonnes_recycled += record.tonnes_recycled ?? 0;
    }
  }

  return NextResponse.json({ data: result });
}
