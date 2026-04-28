import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function GET() {
  const client = getSupabaseServerClient();
  const { error: authError } = await requireUser(client);

  if (authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await client
    .from('commission_config')
    .select(
      'name, commission_type, flat_rate, tiers, valid_from, valid_until, is_active, description',
    )
    .order('is_active', { ascending: false });

  return NextResponse.json(data ?? []);
}
