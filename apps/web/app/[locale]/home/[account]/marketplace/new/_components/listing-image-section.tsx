'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Loader2, Sparkles, Trash2 } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

import { buildListingPrompt } from '~/lib/config/flux-prompts';
import { useFluxImage } from '~/lib/hooks/use-flux-image';
import { useSubscription } from '~/lib/hooks/use-subscription';

interface ListingImageSectionProps {
  categorySlug: string;
  description: string;
  onImageGenerated?: (url: string) => void;
}

export function ListingImageSection({
  categorySlug,
  description,
  onImageGenerated,
}: ListingImageSectionProps) {
  const { canAccess } = useSubscription();
  const hasFlux = canAccess('flux_image_generation');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { generating, error, generate } = useFluxImage({
    context: 'listings',
    width: 768,
    height: 768,
  });

  if (!hasFlux) {
    return null;
  }

  const handleGenerate = async () => {
    const prompt = buildListingPrompt(categorySlug, description || categorySlug);
    const url = await generate(prompt);

    if (url) {
      setPreviewUrl(url);
      onImageGenerated?.(url);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-3">
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-lg border">
          <Image
            src={previewUrl}
            alt="Generated listing image"
            width={768}
            height={768}
            className="h-auto w-full"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute right-2 top-2"
            onClick={handleRemove}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            <Trans i18nKey="marketplace.flux.remove" />
          </Button>
          <p className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1.5 text-xs text-white/70">
            <Trans i18nKey="marketplace.flux.attribution" />
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 p-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={generating}
            className="text-teal-600 hover:text-teal-700"
          >
            {generating ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                <Trans i18nKey="marketplace.flux.generating" />
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 h-4 w-4" />
                <Trans i18nKey="marketplace.flux.generate" />
              </>
            )}
          </Button>
          <p className="mt-1.5 text-xs text-gray-400">
            <Trans i18nKey="marketplace.flux.hint" />
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
