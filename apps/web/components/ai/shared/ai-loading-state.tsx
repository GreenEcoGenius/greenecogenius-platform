'use client';

export function AILoadingState({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 py-2" role="status" aria-label="Chargement IA">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded bg-verdure-100 dark:bg-verdure-900/30"
          style={{
            width: `${85 - i * 15}%`,
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
      <span className="sr-only">Chargement en cours...</span>
    </div>
  );
}
