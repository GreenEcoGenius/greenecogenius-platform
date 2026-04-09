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

    const [esgResult, reportsResult] = await Promise.all([
      adminClient
        .from('esg_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('reporting_year', reportingYear),
      adminClient
        .from('esg_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('reporting_year', reportingYear),
    ]);

    if (esgResult.error || reportsResult.error) {
      console.error(
        '[CSRD Check] DB error:',
        esgResult.error ?? reportsResult.error,
      );
      return NextResponse.json(
        { error: 'Failed to fetch ESG data' },
        { status: 500 },
      );
    }

    const context = {
      orgData: {
        reportingYear,
        esgData: esgResult.data ?? [],
        esgReports: reportsResult.data ?? [],
      },
    };

    const prompt = `Perform a comprehensive CSRD (Corporate Sustainability Reporting Directive) compliance check for the reporting year ${reportingYear}. Analyze the provided ESG data against CSRD requirements and ESRS (European Sustainability Reporting Standards). Identify:
1. Which ESRS disclosure requirements are met
2. Which requirements have gaps
3. Data quality issues
4. Specific actions needed to achieve full compliance
Format your response with clear sections and a compliance score estimate.`;

    const response = await execute('compliance', prompt, context);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[CSRD Check] Error:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
