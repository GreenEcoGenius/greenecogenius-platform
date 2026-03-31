'use client';

import { Sparkles } from 'lucide-react';

export function AIPoweredBadge({ methodology }: { methodology?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-600 dark:bg-violet-950 dark:text-violet-400">
      <Sparkles className="h-3 w-3" />
      IA{methodology ? ` \u00b7 ${methodology}` : ''}
    </span>
  );
}
