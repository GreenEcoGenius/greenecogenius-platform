import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { execute } from '~/lib/ai/orchestrator';

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  try {
    const client = getSupabaseServerClient();
    const { data: user, error: authError } = await requireUser(client);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { reportingYear }: { reportingYear: number } = body;

    if (!reportingYear || typeof reportingYear !== 'number') {
      return NextResponse.json(
        { error: 'reportingYear is required and must be a number' },
        { status: 400 },
      );
    }

    const adminClient = getSupabaseServerAdminClient() as any;

    const { data: esgReports, error: fetchError } = await adminClient
      .from('esg_reports')
      .select('*')
      .eq('user_id', user.id)
      .eq('reporting_year', reportingYear);

    if (fetchError) {
      console.error('[Carbon Recommendations] DB error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch ESG data' },
        { status: 500 },
      );
    }

    const context = {
      carbonData: {
        reportingYear,
        reports: esgReports ?? [],
      },
    };

    const prompt = `Based on the provided carbon emissions data for the year ${reportingYear}, provide specific, actionable recommendations to reduce carbon footprint. Focus on the highest-impact areas and provide estimated reduction percentages where possible. Format your response as a structured list of recommendations with priorities (high/medium/low).`;

    const response = await execute('carbon', prompt, context);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Carbon Recommendations] Error:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
