import {
  getAnthropicClient,
  MODELS,
  TOKEN_LIMITS,
  type AgentType,
} from './client';
import { CARBON_AGENT_PROMPT } from './prompts/carbon-agent';
import { COMPLIANCE_AGENT_PROMPT } from './prompts/compliance-agent';
import { COMPTOIR_AGENT_PROMPT } from './prompts/comptoir-agent';
import { ESG_AGENT_PROMPT } from './prompts/esg-reporting-agent';
import { RSE_AGENT_PROMPT } from './prompts/rse-labels-agent';
import { getSystemBase } from './prompts/system-base';
import { TRACEABILITY_AGENT_PROMPT } from './prompts/traceability-agent';
import type { AIContext, AIResponse } from './types';

const AGENT_PROMPTS: Record<AgentType, string> = {
  comptoir: COMPTOIR_AGENT_PROMPT,
  carbon: CARBON_AGENT_PROMPT,
  esg: ESG_AGENT_PROMPT,
  traceability: TRACEABILITY_AGENT_PROMPT,
  rse: RSE_AGENT_PROMPT,
  compliance: COMPLIANCE_AGENT_PROMPT,
};

const ROUTER_PROMPT = `You are a routing assistant. Given a user message, classify which specialist agent should handle it.

Available agents:
- comptoir: Questions about the GreenEcoGenius marketplace, material listings, categorization, buying/selling materials
- carbon: Carbon footprint calculations, emissions tracking, GHG protocol, reduction strategies
- esg: ESG reporting, sustainability metrics, GRI standards, environmental data
- traceability: Supply chain traceability, blockchain verification, material provenance, lot tracking
- rse: RSE (Responsabilite Societale des Entreprises) labels, certifications, CSR diagnostics, B Corp
- compliance: Regulatory compliance, CSRD, EU taxonomy, legal requirements, auditing

Respond with ONLY the agent name (one of: comptoir, carbon, esg, traceability, rse, compliance). No explanation.`;

/**
 * Routes an incoming message to the appropriate specialist agent.
 */
export async function routeRequest(message: string): Promise<AgentType> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: MODELS.FAST,
    max_tokens: 32,
    system: ROUTER_PROMPT,
    messages: [{ role: 'user', content: message }],
  });

  const text =
    response.content[0]?.type === 'text'
      ? response.content[0].text.trim().toLowerCase()
      : 'comptoir';

  const validAgents: AgentType[] = [
    'comptoir',
    'carbon',
    'esg',
    'traceability',
    'rse',
    'compliance',
  ];

  if (validAgents.includes(text as AgentType)) {
    return text as AgentType;
  }

  return 'comptoir';
}

/**
 * Builds a context-enriched system prompt.
 */
function buildSystemPrompt(basePrompt: string, context?: AIContext): string {
  const locale = context?.locale ?? 'fr';
  const parts = [getSystemBase(locale), '\n\n', basePrompt];

  if (context?.orgData) {
    parts.push(
      `\n\n--- Organisation Data ---\n${JSON.stringify(context.orgData, null, 2)}`,
    );
  }

  if (context?.lotData) {
    parts.push(
      `\n\n--- Lot / Material Data ---\n${JSON.stringify(context.lotData, null, 2)}`,
    );
  }

  if (context?.carbonData) {
    parts.push(
      `\n\n--- Carbon / Emissions Data ---\n${JSON.stringify(context.carbonData, null, 2)}`,
    );
  }

  return parts.join('');
}

/**
 * Executes a single agent with the given message and optional context.
 */
export async function execute(
  agentType: AgentType,
  message: string,
  context?: AIContext,
): Promise<AIResponse> {
  const client = getAnthropicClient();
  const config = TOKEN_LIMITS[agentType];
  const basePrompt = AGENT_PROMPTS[agentType];

  if (!basePrompt) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }

  const systemPrompt = buildSystemPrompt(basePrompt, context);

  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  if (context?.previousMessages) {
    messages.push(...context.previousMessages);
  }

  messages.push({ role: 'user', content: message });

  const response = await client.messages.create({
    model: config.model,
    max_tokens: config.maxTokens,
    system: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages,
  });

  const content = response.content
    .filter((block) => block.type === 'text')
    .map((block) => ('text' in block ? block.text : ''))
    .join('\n');

  return {
    agent: agentType,
    model: config.model,
    content,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  };
}

/**
 * Executes multiple agents in parallel and returns all responses.
 */
export async function executeMultiAgent(
  message: string,
  agents: AgentType[],
  context?: AIContext,
): Promise<AIResponse[]> {
  const results = await Promise.allSettled(
    agents.map((agent) => execute(agent, message, context)),
  );

  return results
    .filter(
      (result): result is PromiseFulfilledResult<AIResponse> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value);
}
