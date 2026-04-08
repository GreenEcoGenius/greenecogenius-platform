'use client';

import { useEffect, useRef } from 'react';

import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

import { useComptoirAI } from '~/lib/hooks/use-ai';

import { AILoadingState } from '../shared/ai-loading-state';
import { AIPoweredBadge } from '../shared/ai-powered-badge';

interface AIPriceSuggestionProps {
  materialType: string;
  weightKg: number;
  quality?: string;
  onApply?: (price: number) => void;
}

interface PriceData {
  low: number;
  high: number;
  currency: string;
  transactions: number;
  trend: 'up' | 'down' | 'stable';
}

function parsePriceData(content: string): PriceData | null {
  try {
    const parsed = JSON.parse(content);

    return {
      low: parsed.low ?? parsed.price_low ?? 0,
      high: parsed.high ?? parsed.price_high ?? 0,
      currency: parsed.currency ?? '\u20ac',
      transactions: parsed.transactions ?? parsed.similar_transactions ?? 0,
      trend: parsed.trend ?? 'stable',
    };
  } catch {
    return null;
  }
}

export function AIPriceSuggestion({
  materialType,
  weightKg,
  quality,
  onApply,
}: AIPriceSuggestionProps) {
  const { ask, loading, response } = useComptoirAI();
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    const prompt = `Estime le prix pour: ${materialType}, poids: ${weightKg}kg${quality ? `, qualit\u00e9: ${quality}` : ''}. R\u00e9ponds en JSON avec: low, high, currency, transactions, trend (up/down/stable).`;

    ask(prompt, {
      context: { materialType, weightKg, quality },
    });
  }, [materialType, weightKg, quality, ask]);

  const priceData = response ? parsePriceData(response.content) : null;

  return (
    <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Suggestion de prix
          </CardTitle>
          <AIPoweredBadge methodology="March\u00e9" />
        </div>
      </CardHeader>

      <CardContent>
        {loading && <AILoadingState lines={3} />}

        {!loading && priceData && (
          <div className="space-y-3">
            {/* Price range */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                {priceData.low.toLocaleString('fr-FR')} {priceData.currency}
              </span>
              <ArrowRight className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                {priceData.high.toLocaleString('fr-FR')} {priceData.currency}
              </span>
            </div>

            {/* Metadata row */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs">
                Bas\u00e9 sur {priceData.transactions} transactions similaires
              </p>

              <div className="flex items-center gap-1 text-xs">
                {priceData.trend === 'up' && (
                  <>
                    <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-green-600">Hausse</span>
                  </>
                )}
                {priceData.trend === 'down' && (
                  <>
                    <TrendingDown className="h-3.5 w-3.5 text-[#2D8C6A]" />
                    <span className="text-[#2D8C6A]">Baisse</span>
                  </>
                )}
                {priceData.trend === 'stable' && (
                  <span className="text-muted-foreground">Stable</span>
                )}
              </div>
            </div>

            {/* Apply button */}
            {onApply && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-green-300 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
                onClick={() => {
                  const midPrice = Math.round(
                    (priceData.low + priceData.high) / 2,
                  );
                  onApply(midPrice);
                }}
              >
                Appliquer le prix sugg\u00e9r\u00e9
              </Button>
            )}
          </div>
        )}

        {!loading && response && !priceData && (
          <p className="text-sm text-green-800 dark:text-green-200">
            {response.content}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
