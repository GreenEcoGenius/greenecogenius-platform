'use client';

import { useCallback, useState } from 'react';

interface AIResponseData {
  content: string;
  agent: string;
  model: string;
  usage?: { input_tokens: number; output_tokens: number };
}

export function useAI(defaultAgent?: string) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(
    async (
      message: string,
      options?: { agent?: string; context?: object },
    ): Promise<AIResponseData | null> => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            agentType: options?.agent || defaultAgent,
            context: options?.context,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'AI request failed');
        }

        const data: AIResponseData = await res.json();
        setResponse(data);

        return data;
      } catch (e: unknown) {
        const errorMessage =
          e instanceof Error ? e.message : 'AI request failed';
        setError(errorMessage);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [defaultAgent],
  );

  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return { ask, loading, response, error, reset };
}

export function useComptoirAI() {
  return useAI('comptoir');
}

export function useCarbonAI() {
  return useAI('carbon');
}

export function useESGAI() {
  return useAI('esg');
}

export function useTraceabilityAI() {
  return useAI('traceability');
}

export function useRSEAI() {
  return useAI('rse');
}

export function useComplianceAI() {
  return useAI('compliance');
}
