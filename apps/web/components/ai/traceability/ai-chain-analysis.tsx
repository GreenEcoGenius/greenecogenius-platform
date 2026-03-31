'use client';

import { useState } from 'react';

import { Link2, Search, Sparkles } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

import { AILoadingState } from '~/components/ai/shared/ai-loading-state';
import { AIPoweredBadge } from '~/components/ai/shared/ai-powered-badge';
import { useTraceabilityAI } from '~/lib/hooks/use-ai';

interface AIChainAnalysisProps {
  lotId: string;
  lotData?: Record<string, unknown>;
}

export function AIChainAnalysis({ lotId, lotData }: AIChainAnalysisProps) {
  const { ask, loading, response, error, reset } = useTraceabilityAI();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setHasAnalyzed(true);
    await ask(`Analyse la chaine de tracabilite complete du lot ${lotId}`, {
      context: lotData ? { lotId, ...lotData } : { lotId },
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="h-5 w-5 text-blue-600" />
            Analyse de chaine
          </CardTitle>
          <AIPoweredBadge methodology="Tracabilite" />
        </div>
      </CardHeader>

      <CardContent>
        {!hasAnalyzed && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-950/30">
              <Search className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Analyse complete du lot {lotId}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                L&apos;IA analysera l&apos;ensemble de la chaine de tracabilite,
                les documents et la conformite.
              </p>
            </div>
            <Button
              onClick={handleAnalyze}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Lancer l&apos;analyse
            </Button>
          </div>
        )}

        {loading && (
          <div className="py-4">
            <p className="mb-3 text-center text-sm text-blue-600">
              Analyse en cours pour {lotId}...
            </p>
            <AILoadingState lines={5} />
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
            <p className="text-sm text-red-600">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                reset();
                setHasAnalyzed(false);
              }}
            >
              Reessayer
            </Button>
          </div>
        )}

        {response && !loading && (
          <div className="space-y-3">
            <div className="rounded-md border bg-blue-50/50 p-4 dark:bg-blue-950/10">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {response.content}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[10px]">
                Genere par IA -- les resultats peuvent contenir des
                inexactitudes
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  reset();
                  setHasAnalyzed(false);
                }}
              >
                Nouvelle analyse
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
