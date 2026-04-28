import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { execute } from '~/lib/ai/orchestrator';
import { AI_RATE_LIMIT, applyRateLimit } from '~/lib/server/rate-limit';

const RequestSchema = z.object({
  orgData: z.record(z.unknown()).refine((v) => Object.keys(v).length > 0, {
    message: 'orgData must be a non-empty object',
  }),
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

    const { orgData } = parsed.data;
    const context = { orgData };

    const prompt = `Perform a comprehensive RSE (Responsabilite Societale des Entreprises) diagnostic for this organisation. Based on the provided organisation data, evaluate:

1. **Governance**: Leadership commitment, ethical practices, stakeholder engagement
2. **Social**: Employee well-being, diversity & inclusion, community impact, human rights
3. **Environmental**: Carbon footprint, resource management, biodiversity, circular economy practices
4. **Economic**: Responsible procurement, fair trade, local economic impact

For each pillar, provide:
- A maturity score (1-5, where 1 = initial, 5 = exemplary)
- Key strengths identified
- Priority areas for improvement
- Specific, actionable recommendations
- Relevant French RSE labels to target (e.g., Label Lucie, B Corp, Engagee RSE by AFNOR, PME+)

Conclude with an overall RSE maturity assessment and a prioritised 12-month action plan.`;

    const response = await execute('rse', prompt, context);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[RSE Diagnostic] Error:', error);

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
