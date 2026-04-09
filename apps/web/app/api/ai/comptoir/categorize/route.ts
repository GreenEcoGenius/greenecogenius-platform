import { NextRequest, NextResponse } from 'next/server';

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
    const { title, description }: { title: string; description: string } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const prompt = `Categorize the following material listing for the GreenEcoGenius circular economy marketplace.

Title: ${title}
Description: ${description ?? 'No description provided'}

Respond in valid JSON format with the following fields:
- materialType: the type of material (e.g., "metal", "plastic", "wood", "textile", "glass", "paper", "organic", "electronic", "composite", "other")
- qualityGrade: quality grade from A to D (A = like new, B = good, C = fair, D = poor)
- fluxCategory: the flux category for the circular economy (e.g., "reuse", "recycling", "upcycling", "composting", "energy_recovery")
- estimatedCo2: estimated kg CO2 avoided by reusing this material instead of new production (number)
- suggestions: array of strings with improvement suggestions for the listing

Return ONLY the JSON object, no markdown fences or extra text.`;

    const response = await execute('comptoir', prompt);

    let parsed;

    try {
      parsed = JSON.parse(response.content);
    } catch {
      parsed = {
        materialType: 'other',
        qualityGrade: 'C',
        fluxCategory: 'recycling',
        estimatedCo2: 0,
        suggestions: [response.content],
      };
    }

    return NextResponse.json({
      ...parsed,
      agent: response.agent,
      model: response.model,
      usage: response.usage,
    });
  } catch (error) {
    console.error('[Comptoir Categorize] Error:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
