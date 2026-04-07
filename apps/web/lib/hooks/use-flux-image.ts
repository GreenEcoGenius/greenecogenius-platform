'use client';

import { useCallback, useState } from 'react';

interface UseFluxImageOptions {
  context: string;
  contextId?: string;
  width?: number;
  height?: number;
}

interface UseFluxImageReturn {
  imageUrl: string | null;
  generating: boolean;
  error: string | null;
  cached: boolean;
  generate: (prompt: string) => Promise<string | null>;
  reset: () => void;
}

export function useFluxImage(options: UseFluxImageOptions): UseFluxImageReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  const generate = useCallback(
    async (prompt: string): Promise<string | null> => {
      setGenerating(true);
      setError(null);

      try {
        const response = await fetch('/api/flux/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            width: options.width ?? 1024,
            height: options.height ?? 1024,
            context: options.context,
            context_id: options.contextId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? 'Image generation failed');
          return null;
        }

        setImageUrl(data.url);
        setCached(data.cached ?? false);
        return data.url as string;
      } catch {
        setError('Network error during image generation');
        return null;
      } finally {
        setGenerating(false);
      }
    },
    [options.context, options.contextId, options.width, options.height],
  );

  const reset = useCallback(() => {
    setImageUrl(null);
    setError(null);
    setCached(false);
  }, []);

  return { imageUrl, generating, error, cached, generate, reset };
}
