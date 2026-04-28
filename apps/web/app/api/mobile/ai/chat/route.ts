import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import type { AgentType } from '~/lib/ai/client';
import {
  formatContextForPrompt,
  loadGeniusContext,
} from '~/lib/ai/genius-context';
import { executeStream, routeRequest } from '~/lib/ai/orchestrator';
import { AI_RATE_LIMIT, applyRateLimit } from '~/lib/server/rate-limit';

export const dynamic = 'force-dynamic';

const MobileChatSchema = z.object({
  message: z.string().min(1).max(4000),
  agentType: z.enum(['comptoir', 'carbon', 'esg', 'traceability', 'rse', 'compliance']).optional(),
  locale: z.enum(['fr', 'en']).optional(),
  context: z.object({
    previousMessages: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })).optional(),
  }).passthrough().optional(),
});

/**
 * Mobile-friendly AI chat endpoint.
 *
 * Differs from /api/ai/chat: accepts Authorization: Bearer <access_token>
 * instead of relying on Supabase cookies (Capacitor WebView does not share
 * cookies with the host domain).
 *
 * CORS is restricted to known mobile origins.
 */
export async function POST(req: NextRequest) {
  // Rate limiting — protect Anthropic credits
  const limited = applyRateLimit(req, AI_RATE_LIMIT);
  if (limited) return limited;

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

  // Parse and validate body
  let rawBody: unknown;

  try {
    rawBody = await req.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const parsed = MobileChatSchema.safeParse(rawBody);

  if (!parsed.success) {
    return jsonError('Invalid request body', 400);
  }

  const { message, agentType, locale, context } = parsed.data;

  try {
    const resolvedAgent: AgentType = agentType
      ? (agentType as AgentType)
      : await routeRequest(message);

    let userContextPrompt = '';
    try {
      // Admin client is justified here: mobile auth uses bearer tokens,
      // not cookie-based sessions, so RLS cannot apply.
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
        ...corsHeaders(req),
      },
    });
  } catch (error) {
    console.error('[Mobile Genius] Error:', error);

    return jsonError('An unexpected error occurred', 500);
  }
}

export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

/**
 * CORS headers restricted to known mobile origins.
 * Capacitor uses capacitor://localhost on iOS and http://localhost on Android.
 */
const ALLOWED_ORIGINS = new Set([
  'capacitor://localhost',
  'http://localhost',
  'https://www.greenecogenius.tech',
  'https://greenecogenius.tech',
]);

function corsHeaders(req?: NextRequest) {
  const origin = req?.headers.get('origin') ?? '';
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : '';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
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
