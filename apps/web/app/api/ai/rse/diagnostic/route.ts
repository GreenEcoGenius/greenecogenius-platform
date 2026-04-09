import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
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
    const { orgData }: { orgData: object } = body;

    if (!orgData || typeof orgData !== 'object') {
      return NextResponse.json(
        { error: 'orgData is required and must be an object' },
        { status: 400 },
      );
    }

    const context = { orgData: orgData as Record<string, unknown> };

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

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
