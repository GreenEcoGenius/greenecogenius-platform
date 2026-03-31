import { NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function GET() {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminClient = getSupabaseServerAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reports, error } = await (adminClient as any)
    .from('esg_reports')
    .select('recommendations')
    .eq('account_id', user.id)
    .order('report_year', { ascending: false })
    .limit(1);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 },
    );
  }

  if (!reports || reports.length === 0) {
    return NextResponse.json({ data: [] });
  }

  const recommendations = reports[0].recommendations;

  // Handle both string and already-parsed JSON
  const parsed =
    typeof recommendations === 'string'
      ? JSON.parse(recommendations)
      : recommendations;

  return NextResponse.json({ data: parsed ?? [] });
}
