import { Loader2 } from 'lucide-react';

import { cn } from '@kit/ui/utils';

interface EnviroAuthLoadingProps {
  /** Already-translated label (e.g. "Loading your workspace..."). */
  label?: string;
  className?: string;
}

/**
 * Loading state for the auth segment. Cream surface + lime forest spinner,
 * full viewport, accessible label so screen readers announce the wait.
 */
export function EnviroAuthLoading({
  label,
  className,
}: EnviroAuthLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex min-h-dvh flex-col items-center justify-center gap-4 bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-sans)]',
        className,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-[--radius-enviro-pill] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]">
        <Loader2
          aria-hidden="true"
          className="h-6 w-6 animate-spin motion-reduce:animate-none"
          strokeWidth={1.5}
        />
      </span>
      {label ? (
        <p className="text-sm font-medium text-[--color-enviro-forest-700]">
          {label}
        </p>
      ) : null}
    </div>
  );
}
