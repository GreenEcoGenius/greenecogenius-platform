import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { execute } from '~/lib/ai/orchestrator';
import { AI_RATE_LIMIT, applyRateLimit } from '~/lib/server/rate-limit';

const RequestSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
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

    const { title, description } = parsed.data;

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

    let categorization;

    try {
      categorization = JSON.parse(response.content);
    } catch {
      categorization = {
        materialType: 'other',
        qualityGrade: 'C',
        fluxCategory: 'recycling',
        estimatedCo2: 0,
        suggestions: [response.content],
      };
    }

    return NextResponse.json({
      ...categorization,
      agent: response.agent,
      model: response.model,
      usage: response.usage,
    });
  } catch (error) {
    console.error('[Comptoir Categorize] Error:', error);

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
