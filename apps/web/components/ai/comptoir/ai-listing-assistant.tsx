'use client';

import { useEffect, useRef } from 'react';

import { Leaf, Recycle, Scale, ShieldCheck } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

import { useComptoirAI } from '~/lib/hooks/use-ai';

import { AILoadingState } from '../shared/ai-loading-state';
import { AIPoweredBadge } from '../shared/ai-powered-badge';

interface AIListingAssistantProps {
  materialType?: string;
  weightKg?: number;
  city?: string;
}

interface ClassificationResult {
  fluxCategory: string;
  wasteCode: string;
  norm: string;
  certification: string;
  co2Avoided: string;
  priceRange: string;
}

function parseClassification(content: string): ClassificationResult | null {
  try {
    const parsed = JSON.parse(content);

    return {
      fluxCategory: parsed.fluxCategory || parsed.flux_category || '-',
      wasteCode: parsed.wasteCode || parsed.waste_code || '-',
      norm: parsed.norm || parsed.applicable_norm || '-',
      certification:
        parsed.certification || parsed.suggested_certification || '-',
      co2Avoided: parsed.co2Avoided || parsed.co2_avoided || '-',
      priceRange: parsed.priceRange || parsed.price_range || '-',
    };
  } catch {
    return null;
  }
}

export function AIListingAssistant({
  materialType,
  weightKg,
  city,
}: AIListingAssistantProps) {
  const { ask, loading, response, reset } = useComptoirAI();
  const lastQueryRef = useRef('');

  useEffect(() => {
    if (!materialType) {
      reset();
      lastQueryRef.current = '';

      return;
    }

    const query = `${materialType}-${weightKg}-${city}`;

    if (query === lastQueryRef.current) return;
    lastQueryRef.current = query;

    const prompt = `Classifie cette mati\u00e8re: ${materialType}${weightKg ? `, poids: ${weightKg}kg` : ''}${city ? `, ville: ${city}` : ''}. R\u00e9ponds en JSON avec: fluxCategory, wasteCode, norm, certification, co2Avoided, priceRange.`;

    ask(prompt, {
      context: { materialType, weightKg, city },
    });
  }, [materialType, weightKg, city, ask, reset]);

  if (!materialType) return null;

  const classification = response
    ? parseClassification(response.content)
    : null;

  return (
    <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Classification IA
          </CardTitle>
          <AIPoweredBadge methodology="R\u00e9glementation d\u00e9chets" />
        </div>
      </CardHeader>

      <CardContent>
        {loading && <AILoadingState lines={4} />}

        {!loading && classification && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Recycle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-muted-foreground text-xs">
                  Cat\u00e9gorie de flux
                </p>
                <p className="text-sm font-medium">
                  {classification.fluxCategory}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Scale className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-muted-foreground text-xs">
                  Code d\u00e9chet
                </p>
                <p className="text-sm font-medium">
                  {classification.wasteCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-muted-foreground text-xs">
                  Norme applicable
                </p>
                <p className="text-sm font-medium">{classification.norm}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-muted-foreground text-xs">
                  Certification sugg\u00e9r\u00e9e
                </p>
                <p className="text-sm font-medium">
                  {classification.certification}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-muted-foreground text-xs">
                  CO2 \u00e9vit\u00e9 estim\u00e9
                </p>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  {classification.co2Avoided}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Scale className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-muted-foreground text-xs">
                  Fourchette de prix
                </p>
                <p className="text-sm font-medium">
                  {classification.priceRange}
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && response && !classification && (
          <p className="text-sm text-green-800 dark:text-green-200">
            {response.content}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
