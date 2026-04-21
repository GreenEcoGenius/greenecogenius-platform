'use client';

import { type MouseEvent, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

interface TocEntry {
  id: string;
  label: string;
}

/**
 * Sticky table of contents rendered as the right-hand sidebar of every
 * legal page. Scrapes the article's `<h2 id="…">` headings after mount
 * so the SSR markup stays empty (no hydration drift) and a smooth
 * scroll on click moves the viewport to the section.
 *
 * Accepts an optional explicit `entries` prop for cases where the
 * heading list is known server-side; falls back to the runtime scrape.
 */
export function LegalToc({
  entries,
  articleSelector = 'article.legal-article',
}: {
  entries?: TocEntry[];
  articleSelector?: string;
}) {
  const t = useTranslations('legal');
  const [scraped, setScraped] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    if (entries) return;

    const article = document.querySelector(articleSelector);
    if (!article) return;

    const headings = Array.from(article.querySelectorAll('h2[id]'));
    setScraped(
      headings.map((h) => ({
        id: h.id,
        label: h.textContent?.trim() ?? h.id,
      })),
    );
  }, [articleSelector, entries]);

  useEffect(() => {
    const article = document.querySelector(articleSelector);
    if (!article) return;

    const headings = Array.from(article.querySelectorAll('h2[id]'));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);

        if (visible[0]?.target instanceof HTMLElement) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, [articleSelector, scraped.length, entries]);

  const list = entries ?? scraped;

  if (list.length === 0) return null;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav
      aria-label={t('tocOnThisPage')}
      className="sticky top-28 flex flex-col gap-3"
    >
      <p className="text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
        <span aria-hidden="true">[ </span>
        {t('tocOnThisPage')}
        <span aria-hidden="true"> ]</span>
      </p>
      <ol className="flex flex-col gap-1 border-l border-[--color-enviro-cream-300]">
        {list.map((entry) => {
          const isActive = entry.id === activeId;

          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                onClick={(event) => handleClick(event, entry.id)}
                className={cn(
                  '-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors duration-200 font-[family-name:var(--font-enviro-sans)]',
                  isActive
                    ? 'border-[--color-enviro-cta] text-[--color-enviro-forest-900] font-medium'
                    : 'border-transparent text-[--color-enviro-forest-700] hover:border-[--color-enviro-forest-700] hover:text-[--color-enviro-forest-900]',
                )}
              >
                {entry.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
