import { NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

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
    .select('*')
    .eq('account_id', user.id)
    .order('report_year', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: reports ?? [] });
}
