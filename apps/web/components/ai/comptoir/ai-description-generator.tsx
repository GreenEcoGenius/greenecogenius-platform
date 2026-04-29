'use client';

import { useCallback, useState } from 'react';

import { RefreshCw, Sparkles, Check } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import { useComptoirAI } from '~/lib/hooks/use-ai';

import { AILoadingState } from '../shared/ai-loading-state';
import { AIPoweredBadge } from '../shared/ai-powered-badge';

interface AIDescriptionGeneratorProps {
  materialType: string;
  weightKg: number;
  quality?: string;
  city?: string;
  onGenerated: (desc: string) => void;
}

export function AIDescriptionGenerator({
  materialType,
  weightKg,
  quality,
  city,
  onGenerated,
}: AIDescriptionGeneratorProps) {
  const { ask, loading, response, reset } = useComptoirAI();
  const [applied, setApplied] = useState(false);

  const generate = useCallback(() => {
    setApplied(false);
    reset();

    const prompt = `G\u00e9n\u00e8re une description optimis\u00e9e pour une annonce de mati\u00e8re: ${materialType}, poids: ${weightKg}kg${quality ? `, qualit\u00e9: ${quality}` : ''}${city ? `, localisation: ${city}` : ''}. La description doit \u00eatre professionnelle, informative et attractive pour les acheteurs.`;

    ask(prompt, {
      context: { materialType, weightKg, quality, city },
    });
  }, [materialType, weightKg, quality, city, ask, reset]);

  const handleApply = useCallback(() => {
    if (response) {
      onGenerated(response.content);
      setApplied(true);
    }
  }, [response, onGenerated]);

  const handleRegenerate = useCallback(() => {
    generate();
  }, [generate]);

  // Initial state: just a button
  if (!response && !loading) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-violet-200 text-violet-600 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-950"
        onClick={generate}
      >
        <Sparkles className="h-3.5 w-3.5" />
        G\u00e9n\u00e9rer une description IA
      </Button>
    );
  }

  return (
    <Card className="border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/20">
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <AIPoweredBadge methodology="R\u00e9daction" />
          {applied && (
            <span className="inline-flex items-center gap-1 text-xs text-verdure-600">
              <Check className="h-3 w-3" />
              Appliqu\u00e9e
            </span>
          )}
        </div>

        {loading && <AILoadingState lines={4} />}

        {!loading && response && (
          <>
            <div className="rounded-md border border-violet-200 bg-card p-3 text-sm dark:border-violet-800 dark:bg-gray-950">
              <p className="whitespace-pre-wrap">{response.content}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={handleApply}
                disabled={applied}
              >
                <Check className="h-3.5 w-3.5" />
                {applied ? 'Appliqu\u00e9e' : 'Appliquer'}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={handleRegenerate}
                disabled={loading}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reg\u00e9n\u00e9rer
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
