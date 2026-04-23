import type { ReactNode } from 'react';

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { cn } from '@kit/ui/utils';

import { AppLogo } from '~/components/app-logo';

import { EnviroDocsBackButton } from './enviro-docs-back-button';

export interface EnviroDocsHeaderBreadcrumbItem {
  /** Already-translated label. */
  label: ReactNode;
  /** Optional href. When omitted, the item renders as the current page. */
  href?: string;
}

interface EnviroDocsHeaderProps {
  /** Already-translated label for the docs link in the brand cluster. */
  docsLinkLabel: string;
  /** Already-translated label for the back-to-site button. */
  backLabel: string;
  /** Already-translated breadcrumb items rendered on the right rail. */
  breadcrumb?: EnviroDocsHeaderBreadcrumbItem[];
  /** Already-translated aria-label for the breadcrumb nav. */
  breadcrumbAriaLabel?: string;
  className?: string;
}

/**
 * Sticky header for the docs segment. Mirrors the structure of the legacy
 * `DocsHeader` (logo + docs anchor + back action) but layers Enviro tokens
 * and an optional breadcrumb trail on the right rail for article context.
 */
export function EnviroDocsHeader({
  docsLinkLabel,
  backLabel,
  breadcrumb,
  breadcrumbAriaLabel = 'Breadcrumb',
  className,
}: EnviroDocsHeaderProps) {
  const hasBreadcrumb = breadcrumb && breadcrumb.length > 0;

  return (
    <header
      className={cn(
        'sticky top-0 z-[--z-enviro-sticky] flex h-14 items-center gap-4 border-b border-[--color-enviro-cream-200] bg-[--color-enviro-cream-50]/95 px-4 shadow-[--shadow-enviro-sm] backdrop-blur-md md:px-6',
        'font-[family-name:var(--font-enviro-sans)]',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <AppLogo href="/" />

        <span
          aria-hidden="true"
          className="hidden h-5 w-px bg-[--color-enviro-cream-300] sm:block"
        />

        <Link
          href="/docs"
          className="hidden truncate text-sm font-semibold tracking-tight text-[--color-enviro-forest-900] transition-colors hover:text-[--color-enviro-forest-700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-forest-300]/60 sm:inline-block"
        >
          {docsLinkLabel}
        </Link>

        {hasBreadcrumb ? (
          <nav
            aria-label={breadcrumbAriaLabel}
            className="hidden min-w-0 flex-1 items-center md:flex"
          >
            <span
              aria-hidden="true"
              className="mx-3 h-5 w-px bg-[--color-enviro-cream-300]"
            />

            <ol className="flex min-w-0 items-center gap-1.5 truncate text-xs uppercase tracking-[0.06em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
              {breadcrumb.map((item, index) => {
                const isLast = index === breadcrumb.length - 1;

                return (
                  <li
                    key={index}
                    className="flex min-w-0 items-center gap-1.5 truncate"
                  >
                    {item.href && !isLast ? (
                      <Link
                        href={item.href}
                        className="truncate rounded-sm transition-colors hover:text-[--color-enviro-forest-900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-forest-300]/60"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={isLast ? 'page' : undefined}
                        className={cn(
                          'truncate',
                          isLast &&
                            'text-[--color-enviro-forest-900] font-semibold',
                        )}
                      >
                        {item.label}
                      </span>
                    )}

                    {!isLast ? (
                      <ChevronRight
                        aria-hidden="true"
                        className="h-3 w-3 shrink-0 text-[--color-enviro-forest-300]"
                      />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}
      </div>

      <EnviroDocsBackButton label={backLabel} fallbackHref="/" />
    </header>
  );
}
