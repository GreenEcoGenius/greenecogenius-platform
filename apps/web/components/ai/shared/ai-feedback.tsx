'use client';

import { useState } from 'react';

import { ThumbsDown, ThumbsUp } from 'lucide-react';

import { Button } from '@kit/ui/button';

export function AIFeedback({
  onFeedback,
}: {
  onFeedback?: (positive: boolean) => void;
}) {
  const [selected, setSelected] = useState<boolean | null>(null);

  function handleFeedback(positive: boolean) {
    setSelected(positive);
    onFeedback?.(positive);
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-muted-foreground mr-1 text-xs">
        Cette r\u00e9ponse est utile ?
      </span>

      <Button
        variant={selected === true ? 'default' : 'ghost'}
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => handleFeedback(true)}
        disabled={selected !== null}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        <span className="sr-only">Utile</span>
      </Button>

      <Button
        variant={selected === false ? 'destructive' : 'ghost'}
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => handleFeedback(false)}
        disabled={selected !== null}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
        <span className="sr-only">Pas utile</span>
      </Button>
    </div>
  );
}
