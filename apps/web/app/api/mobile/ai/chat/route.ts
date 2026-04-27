import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import type { AgentType } from '~/lib/ai/client';
import {
  formatContextForPrompt,
  loadGeniusContext,
} from '~/lib/ai/genius-context';
import { executeStream, routeRequest } from '~/lib/ai/orchestrator';

export const dynamic = 'force-dynamic';

/**
 * Mobile-friendly AI chat endpoint.
 *
 * Differs from /api/ai/chat: accepts Authorization: Bearer <access_token>
 * instead of relying on Supabase cookies (Capacitor WebView does not share
 * cookies with the host domain).
 *
 * CORS is enabled because the iOS app loads from capacitor://localhost.
 */
export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError('AI not configured', 503);
  }

  // Extract bearer token
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return jsonError('Missing bearer token', 401);
  }

  // Validate the token by creating a Supabase client scoped to this user
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonError('Supabase not configured', 503);
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return jsonError('Invalid or expired token', 401);
  }

  const user = userData.user;

  // Parse body
  let body: {
    message?: string;
    agentType?: string;
    locale?: string;
    context?: {
      previousMessages?: Array<{
        role: 'user' | 'assistant';
        content: string;
      }>;
      [key: string]: unknown;
    };
  };

  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const { message, agentType, locale, context } = body;

  if (!message || typeof message !== 'string') {
    return jsonError('Message is required', 400);
  }

  if (message.length > 4000) {
    return jsonError('Message too long (max 4000 chars)', 400);
  }

  try {
    const resolvedAgent: AgentType = agentType
      ? (agentType as AgentType)
      : await routeRequest(message);

    let userContextPrompt = '';
    try {
      const adminClient = getSupabaseServerAdminClient();
      const geniusCtx = await loadGeniusContext(adminClient, user.id);
      userContextPrompt = formatContextForPrompt(geniusCtx, locale ?? 'fr');
    } catch (e) {
      console.error('[Mobile Genius] Failed to load user context:', e);
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
        'X-Agent-Type': resolvedAgent,
        ...corsHeaders(),
      },
    });
  } catch (error) {
    console.error('[Mobile Genius] Error:', error);
    const msg =
      error instanceof Error ? error.message : 'Internal server error';
    return jsonError(msg, 500);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Expose-Headers': 'X-Agent-Type',
  } as const;
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: corsHeaders() },
  );
}
