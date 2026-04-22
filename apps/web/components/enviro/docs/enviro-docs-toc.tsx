'use client';

import { useEffect, useState } from 'react';

import { cn } from '@kit/ui/utils';

import { slugifyDocsHeading } from './enviro-docs-slugify';

interface EnviroDocsTOCProps {
  /** Already-translated heading rendered above the list (e.g. "Sur cette page"). */
  heading: string;
  /**
   * CSS selector matching the prose container that holds the article. Defaults
   * to the `data-enviro-prose` attribute set by `EnviroDocsProse`. Override
   * when wrapping content in a custom container.
   */
  contentSelector?: string;
  className?: string;
}

interface DocsHeadingEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Auto-generated table of contents extracted from the rendered article DOM.
 * Picks up `h2` and `h3` headings only (article-level outline) and tracks the
 * currently visible section through an `IntersectionObserver` so the active
 * link follows the reader.
 *
 * Slug generation is identical to `EnviroDocsProse` so anchor URLs match the
 * `id` attributes already injected by the prose wrapper.
 */
export function EnviroDocsTOC({
  heading,
  contentSelector = '[data-enviro-prose]',
  className,
}: EnviroDocsTOCProps) {
  const [entries, setEntries] = useState<DocsHeadingEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.querySelector(contentSelector);
    if (!root) {
      setEntries([]);
      return;
    }

    // Defer one frame so EnviroDocsProse has time to inject IDs on its own
    // headings before we read them out.
    const raf = window.requestAnimationFrame(() => {
      const headings = Array.from(
        root.querySelectorAll<HTMLHeadingElement>('h2, h3'),
      );
      const seen = new Map<string, number>();

      const collected: DocsHeadingEntry[] = headings.map((heading) => {
        const text = heading.textContent ?? '';
        const baseSlug = heading.id || slugifyDocsHeading(text);
        const count = seen.get(baseSlug) ?? 0;
        seen.set(baseSlug, count + 1);
        const id = count === 0 ? baseSlug : `${baseSlug}-${count}`;

        if (!heading.id && id) {
          heading.id = id;
        }

        return {
          id: id || baseSlug,
          text,
          level: heading.tagName === 'H3' ? 3 : 2,
        };
      });

      setEntries(collected.filter((entry) => entry.id));
    });

    return () => window.cancelAnimationFrame(raf);
  }, [contentSelector]);

  useEffect(() => {
    if (entries.length === 0) return;
    if (typeof window === 'undefined') return;

    const elements = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top)
          .at(0);

        if (visible?.target instanceof HTMLElement) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={heading}
      className={cn(
        'sticky top-20 hidden w-64 shrink-0 self-start xl:block',
        'font-[family-name:var(--font-enviro-sans)]',
        className,
      )}
    >
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
        {heading}
      </p>

      <ul className="flex flex-col gap-1.5 border-l border-[--color-enviro-cream-200] pl-3">
        {entries.map((entry) => {
          const isActive = entry.id === activeId;

          return (
            <li
              key={entry.id}
              style={{ paddingLeft: entry.level === 3 ? '0.75rem' : 0 }}
            >
              <a
                href={`#${entry.id}`}
                className={cn(
                  'block truncate text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-forest-300]/60',
                  isActive
                    ? 'font-semibold text-[--color-enviro-forest-900]'
                    : 'text-[--color-enviro-forest-700] hover:text-[--color-enviro-forest-900]',
                )}
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
