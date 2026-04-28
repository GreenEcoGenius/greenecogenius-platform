import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import type { AgentType } from '~/lib/ai/client';
import {
  formatContextForPrompt,
  loadGeniusContext,
} from '~/lib/ai/genius-context';
import { executeStream, routeRequest } from '~/lib/ai/orchestrator';
import { AI_RATE_LIMIT, applyRateLimit } from '~/lib/server/rate-limit';

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(10_000),
  agentType: z.enum(['comptoir', 'carbon', 'esg', 'traceability', 'rse', 'compliance']).optional(),
  locale: z.enum(['fr', 'en']).optional(),
  context: z.object({
    previousMessages: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })).optional(),
  }).passthrough().optional(),
});

export async function POST(req: NextRequest) {
  // Rate limiting — protect Anthropic credits
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
    const parsed = ChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { message, agentType, locale, context } = parsed.data;

    const resolvedAgent: AgentType = agentType
      ? (agentType as AgentType)
      : await routeRequest(message);

    let userContextPrompt = '';
    try {
      const adminClient = getSupabaseServerAdminClient();
      const geniusCtx = await loadGeniusContext(adminClient, user.id);
      userContextPrompt = formatContextForPrompt(geniusCtx, locale ?? 'fr');
    } catch (e) {
      console.error('[Genius] Failed to load user context:', e);
    }

    const stream = executeStream(resolvedAgent, message, {
      ...context,
      locale: locale ?? 'fr',
      userContext: userContextPrompt,
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('[AI Chat] Error:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
