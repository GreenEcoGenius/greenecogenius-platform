'use client';

import { supabase } from './supabase-client';
import { apiUrl } from './api-client';

export type GeniusMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AgentType =
  | 'comptoir'
  | 'carbon'
  | 'esg'
  | 'traceability'
  | 'rse'
  | 'compliance';

export type StreamGeniusOpts = {
  message: string;
  history?: GeniusMessage[];
  agentType?: AgentType;
  locale?: string;
  signal?: AbortSignal;
  /** Called with each text chunk as it streams in */
  onChunk: (chunk: string) => void;
};

export type StreamGeniusResult = {
  /** Final concatenated assistant text */
  text: string;
  /** Agent that handled the request (read from X-Agent-Type header) */
  agent: AgentType | null;
};

/**
 * Stream a message to Genius and call onChunk(text) for each delta.
 *
 * Throws on auth errors (no session, expired token), on HTTP errors,
 * or if the request is aborted.
 */
export async function streamGenius(
  opts: StreamGeniusOpts,
): Promise<StreamGeniusResult> {
  const {
    data: { session },
    error: sessionErr,
  } = await supabase.auth.getSession();

  if (sessionErr || !session?.access_token) {
    throw new Error('not_authenticated');
  }

  const url = apiUrl('/api/mobile/ai/chat');

  const res = await fetch(url, {
    method: 'POST',
    signal: opts.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      message: opts.message,
      agentType: opts.agentType,
      locale: opts.locale ?? 'fr',
      context: {
        previousMessages: opts.history ?? [],
      },
    }),
  });

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) errMsg = data.error;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  if (!res.body) {
    throw new Error('No response body');
  }

  const agentHeader = res.headers.get('x-agent-type');
  const agent =
    agentHeader && AGENT_TYPES.includes(agentHeader as AgentType)
      ? (agentHeader as AgentType)
      : null;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        full += chunk;
        opts.onChunk(chunk);
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // noop
    }
  }

  return { text: full, agent };
}

const AGENT_TYPES: AgentType[] = [
  'comptoir',
  'carbon',
  'esg',
  'traceability',
  'rse',
  'compliance',
];
