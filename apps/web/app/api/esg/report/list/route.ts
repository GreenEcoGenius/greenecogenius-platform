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

  // Use standard client — RLS ensures user can only access their own data
  const { data: reports, error } = await client
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
