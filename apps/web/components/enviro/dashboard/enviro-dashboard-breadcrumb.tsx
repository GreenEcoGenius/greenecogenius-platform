import type { ReactNode } from 'react';

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { cn } from '@kit/ui/utils';

export interface EnviroBreadcrumbItem {
  /** Already-translated label. */
  label: ReactNode;
  /** Optional href. When omitted, the item renders as the current page. */
  href?: string;
}

interface EnviroDashboardBreadcrumbProps {
  items: EnviroBreadcrumbItem[];
  className?: string;
  /** Already-translated aria label for the nav. */
  ariaLabel?: string;
}

/**
 * Compact breadcrumb intended for the topbar inside `EnviroDashboardShell`.
 * Uses lime separators and the mono font for the small caps look defined in
 * the Phase 6 dashboard design DNA.
 */
export function EnviroDashboardBreadcrumb({
  items,
  className,
  ariaLabel = 'Breadcrumb',
}: EnviroDashboardBreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'flex items-center gap-1.5 text-xs uppercase tracking-[0.06em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]',
        className,
      )}
    >
      <ol className="flex items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded-sm transition-colors hover:text-[--color-enviro-forest-900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    isLast && 'text-[--color-enviro-forest-900] font-semibold',
                  )}
                >
                  {item.label}
                </span>
              )}

              {!isLast ? (
                <ChevronRight
                  aria-hidden="true"
                  className="h-3 w-3 text-[--color-enviro-lime-500]"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
