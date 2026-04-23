'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

import { slugifyDocsHeading } from './enviro-docs-slugify';

interface EnviroDocsProseProps {
  /** Rendered article content (typically `<ContentRenderer ... />`). */
  children: ReactNode;
  className?: string;
}

/**
 * Typographic wrapper for documentation articles. Carries the Enviro typo
 * scale, code-block density rules and link styling for the docs segment
 * without touching the shared `markdoc.css` (which is also consumed by the
 * blog and would create regression risk if mutated).
 *
 * Headings (h2, h3) get IDs auto-injected on mount so the companion
 * `EnviroDocsTOC` can deep-link to them. ID generation is deterministic
 * (`slugifyDocsHeading`) so server and client agree without a hydration
 * mismatch when re-rendered.
 */
export function EnviroDocsProse({ children, className }: EnviroDocsProseProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const headings = root.querySelectorAll<HTMLHeadingElement>('h2, h3');
    const seen = new Map<string, number>();

    headings.forEach((heading) => {
      if (heading.id) return;

      const text = heading.textContent ?? '';
      const base = slugifyDocsHeading(text);
      if (!base) return;

      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      heading.id = count === 0 ? base : `${base}-${count}`;
    });
  }, [children]);

  return (
    <div
      ref={ref}
      data-enviro-prose
      className={cn(
        'enviro-docs-prose',
        'font-[family-name:var(--font-enviro-sans)] text-[--color-enviro-forest-900]',
        className,
      )}
    >
      {children}

      <style>{`
        .enviro-docs-prose h1 {
          font-family: var(--font-enviro-display);
          font-weight: 700;
          font-size: 2.25rem;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-top: 0;
          margin-bottom: 1.25rem;
          color: var(--color-enviro-forest-900);
        }
        .enviro-docs-prose h2 {
          font-family: var(--font-enviro-display);
          font-weight: 700;
          font-size: 1.5rem;
          line-height: 1.25;
          letter-spacing: -0.01em;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
          color: var(--color-enviro-forest-900);
          scroll-margin-top: 5rem;
        }
        .enviro-docs-prose h3 {
          font-family: var(--font-enviro-display);
          font-weight: 600;
          font-size: 1.25rem;
          line-height: 1.3;
          margin-top: 2rem;
          margin-bottom: 0.5rem;
          color: var(--color-enviro-forest-900);
          scroll-margin-top: 5rem;
        }
        .enviro-docs-prose h4 {
          font-family: var(--font-enviro-display);
          font-weight: 600;
          font-size: 1.0625rem;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--color-enviro-forest-900);
        }
        .enviro-docs-prose p {
          font-size: 0.9375rem;
          line-height: 1.7;
          margin-top: 1rem;
          color: var(--color-enviro-forest-700);
        }
        .enviro-docs-prose strong,
        .enviro-docs-prose b {
          color: var(--color-enviro-forest-900);
          font-weight: 600;
        }
        .enviro-docs-prose a {
          color: var(--color-enviro-forest-700);
          text-decoration: underline;
          text-decoration-color: color-mix(in oklab, var(--color-enviro-forest-300) 60%, transparent);
          text-underline-offset: 3px;
          transition: color 200ms ease, text-decoration-color 200ms ease;
        }
        .enviro-docs-prose a:hover {
          color: var(--color-enviro-forest-900);
          text-decoration-color: var(--color-enviro-forest-900);
        }
        .enviro-docs-prose ul,
        .enviro-docs-prose ol {
          margin-top: 1rem;
          padding-left: 1.5rem;
        }
        .enviro-docs-prose ul {
          list-style: disc;
        }
        .enviro-docs-prose ol {
          list-style: decimal;
        }
        .enviro-docs-prose li {
          font-size: 0.9375rem;
          line-height: 1.7;
          margin-top: 0.375rem;
          color: var(--color-enviro-forest-700);
        }
        .enviro-docs-prose blockquote {
          margin-top: 1.5rem;
          padding: 0.75rem 1rem;
          border-left: 3px solid var(--color-enviro-forest-300);
          background: var(--color-enviro-cream-100);
          border-radius: var(--radius-enviro-sm);
          color: var(--color-enviro-forest-700);
        }
        .enviro-docs-prose blockquote p {
          margin-top: 0;
        }
        .enviro-docs-prose code {
          font-family: var(--font-enviro-mono);
          font-size: 0.85em;
          padding: 0.1em 0.35em;
          border-radius: 4px;
          background: var(--color-enviro-cream-100);
          color: var(--color-enviro-forest-900);
          border: 1px solid var(--color-enviro-cream-200);
        }
        .enviro-docs-prose pre {
          font-family: var(--font-enviro-mono);
          font-size: 0.85rem;
          line-height: 1.55;
          margin-top: 1.5rem;
          padding: 1rem 1.25rem;
          background: var(--color-enviro-forest-900);
          color: var(--color-enviro-fg-inverse);
          border-radius: var(--radius-enviro-md);
          overflow-x: auto;
        }
        .enviro-docs-prose pre code {
          background: transparent;
          border: none;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }
        .enviro-docs-prose hr {
          margin: 2rem 0;
          border: 0;
          border-top: 1px solid var(--color-enviro-cream-200);
        }
        .enviro-docs-prose img,
        .enviro-docs-prose video {
          margin-top: 1.5rem;
          border-radius: var(--radius-enviro-md);
          border: 1px solid var(--color-enviro-cream-200);
        }
        .enviro-docs-prose table {
          width: 100%;
          margin-top: 1.5rem;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        .enviro-docs-prose th,
        .enviro-docs-prose td {
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid var(--color-enviro-cream-200);
          text-align: left;
        }
        .enviro-docs-prose th {
          color: var(--color-enviro-forest-900);
          font-weight: 600;
          background: var(--color-enviro-cream-100);
        }
      `}</style>
    </div>
  );
}
