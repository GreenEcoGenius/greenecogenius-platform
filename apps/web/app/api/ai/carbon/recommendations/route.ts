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
    const { data: esgReports, error: fetchError } = await client
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

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
