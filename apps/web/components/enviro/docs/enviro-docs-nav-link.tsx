import Link from 'next/link';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@kit/ui/utils';

interface EnviroDocsNavLinkProps {
  /** Already-translated direction label (e.g. "Article suivant"). */
  direction: string;
  /** Article title shown beneath the direction label. */
  title: string;
  /** Destination URL. */
  href: string;
  /** Visual alignment. `next` aligns content to the right with a forward arrow. */
  variant: 'previous' | 'next';
  className?: string;
}

/**
 * Article-footer prev/next link used at the bottom of every documentation
 * page. Lays out as a card so users can scan continuation paths quickly,
 * matching the rhythm of `EnviroDocsCard` on the index page.
 */
export function EnviroDocsNavLink({
  direction,
  title,
  href,
  variant,
  className,
}: EnviroDocsNavLinkProps) {
  const isNext = variant === 'next';

  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col gap-1 rounded-[--radius-enviro-md] border border-[--color-enviro-cream-200] bg-[--color-enviro-cream-50] px-4 py-3 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[--color-enviro-forest-300] hover:shadow-[--shadow-enviro-sm] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-forest-300]/60',
        'font-[family-name:var(--font-enviro-sans)]',
        isNext ? 'items-end text-right' : 'items-start text-left',
        className,
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]',
        )}
      >
        {!isNext ? (
          <ArrowLeft
            aria-hidden="true"
            className="h-3 w-3 transition-transform duration-200 group-hover:-translate-x-0.5"
          />
        ) : null}
        <span>{direction}</span>
        {isNext ? (
          <ArrowRight
            aria-hidden="true"
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        ) : null}
      </span>

      <span className="text-sm font-semibold text-[--color-enviro-forest-900]">
        {title}
      </span>
    </Link>
  );
}
