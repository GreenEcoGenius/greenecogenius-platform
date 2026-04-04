import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import type { AgentType } from '~/lib/ai/client';
import {
  formatContextForPrompt,
  loadGeniusContext,
} from '~/lib/ai/genius-context';
import { execute, routeRequest } from '~/lib/ai/orchestrator';

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
    const {
      message,
      agentType,
      locale,
      context,
    }: {
      message: string;
      agentType?: string;
      locale?: string;
      context?: {
        previousMessages?: Array<{
          role: 'user' | 'assistant';
          content: string;
        }>;
        [key: string]: unknown;
      };
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    const resolvedAgent: AgentType = agentType
      ? (agentType as AgentType)
      : await routeRequest(message);

    // Load real user context for Genius
    let userContextPrompt = '';
    try {
      const adminClient = getSupabaseServerAdminClient();
      const geniusCtx = await loadGeniusContext(adminClient, user.id);
      userContextPrompt = formatContextForPrompt(geniusCtx, locale ?? 'fr');
    } catch (e) {
      console.error('[Genius] Failed to load user context:', e);
    }

    const response = await execute(resolvedAgent, message, {
      ...context,
      locale: locale ?? 'fr',
      userContext: userContextPrompt,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('[AI Chat] Error:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
