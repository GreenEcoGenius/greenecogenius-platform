import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { execute } from '~/lib/ai/orchestrator';
import { AI_RATE_LIMIT, applyRateLimit } from '~/lib/server/rate-limit';

const RequestSchema = z.object({
  reportingYear: z.number().int().min(2000).max(2100),
});

export async function POST(req: NextRequest) {
  const limited = applyRateLimit(req, AI_RATE_LIMIT);
  if (limited) return limited;

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
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { reportingYear } = parsed.data;

    // Use standard client — RLS ensures user can only read their own data
    const [esgResult, reportsResult] = await Promise.all([
      client
        .from('esg_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('reporting_year', reportingYear),
      client
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

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
