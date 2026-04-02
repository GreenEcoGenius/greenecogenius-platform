import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import type { AgentType } from '~/lib/ai/client';
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
      context,
    }: {
      message: string;
      agentType?: string;
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

    const response = await execute(resolvedAgent, message, context);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[AI Chat] Error:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
