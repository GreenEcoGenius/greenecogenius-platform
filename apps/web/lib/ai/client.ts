import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const MODELS = {
  FAST: 'claude-haiku-4-5-20251001',
  BALANCED: 'claude-sonnet-4-6',
  PREMIUM: 'claude-opus-4-6',
} as const;

export const TOKEN_LIMITS = {
  comptoir: { maxTokens: 1024, model: MODELS.FAST },
  carbon: { maxTokens: 4096, model: MODELS.BALANCED },
  esg: { maxTokens: 8192, model: MODELS.BALANCED },
  traceability: { maxTokens: 2048, model: MODELS.FAST },
  rse: { maxTokens: 8192, model: MODELS.PREMIUM },
  compliance: { maxTokens: 4096, model: MODELS.BALANCED },
} as const;

export type AgentType = keyof typeof TOKEN_LIMITS;
