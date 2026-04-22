import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';

import { cn } from '@kit/ui/utils';

interface EnviroDocsCardProps {
  /** Article title (already-translated CMS field). */
  title: string;
  /** Optional CMS-rendered HTML excerpt (sanitized upstream by the CMS). */
  description?: string | null;
  /** Destination URL. */
  href: string;
  /** Optional category / section label rendered above the title. */
  category?: string | null;
  className?: string;
}

/**
 * Card used on the docs index to surface top-level documentation entries.
 * Cream background with forest accents to keep parity with marketing cards
 * while remaining visually distinct from `EnviroBlogCard`.
 *
 * Description is rendered with `dangerouslySetInnerHTML` to mirror the legacy
 * `DocsCard` contract (CMS already sanitizes the value); we pass it through
 * untouched so existing Keystatic content keeps rendering identically.
 */
export function EnviroDocsCard({
  title,
  description,
  href,
  category,
  className,
}: EnviroDocsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col gap-2 rounded-[--radius-enviro-lg] border border-[--color-enviro-cream-200] bg-[--color-enviro-cream-50] p-5 shadow-[--shadow-enviro-sm] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[--color-enviro-forest-300] hover:shadow-[--shadow-enviro-md] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-forest-300]/60',
        'font-[family-name:var(--font-enviro-sans)]',
        className,
      )}
    >
      {category ? (
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
          {category}
        </span>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
          {title}
        </h3>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-1 h-4 w-4 shrink-0 text-[--color-enviro-forest-700] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[--color-enviro-forest-900]"
        />
      </div>

      {description ? (
        <p
          className="text-sm leading-relaxed text-[--color-enviro-forest-700]"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : null}
    </Link>
  );
}
