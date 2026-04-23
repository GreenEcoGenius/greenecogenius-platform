'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
} from '~/components/enviro';
import {
  StaggerContainer,
  StaggerItem,
} from '~/components/enviro/animations/stagger-container';

export type ChangelogType =
  | 'feat'
  | 'fix'
  | 'improvement'
  | 'security'
  | 'docs'
  | 'chore';

export interface ChangelogClientEntry {
  id: string;
  slug: string;
  title: string;
  description?: string;
  publishedAt: string;
  type: ChangelogType;
  /** Best-effort version tag derived from the entry (e.g. "v1.2.0", "Mar 2026"). */
  version?: string;
  highlight?: boolean;
}

const TYPES: ReadonlyArray<{ id: 'all' | ChangelogType; labelKey: string }> = [
  { id: 'all', labelKey: 'typeAll' },
  { id: 'feat', labelKey: 'typeFeat' },
  { id: 'fix', labelKey: 'typeFix' },
  { id: 'improvement', labelKey: 'typeImprovement' },
  { id: 'security', labelKey: 'typeSecurity' },
] as const;

/**
 * Maps a changelog entry type to a Tailwind colour pair for the inline
 * bracket-style badge. We bias `feat` to lime (positive change), `fix`
 * and `security` to ember (caution / important), and the rest to a
 * neutral cream surface.
 */
function badgeClasses(type: ChangelogType) {
  switch (type) {
    case 'feat':
    case 'improvement':
      return 'border-[--color-enviro-lime-400] bg-[--color-enviro-lime-300]/30 text-[--color-enviro-forest-900]';
    case 'fix':
    case 'security':
      return 'border-[--color-enviro-cta] bg-[--color-enviro-ember-50] text-[--color-enviro-ember-700]';
    case 'docs':
    case 'chore':
    default:
      return 'border-[--color-enviro-cream-300] bg-white text-[--color-enviro-forest-700]';
  }
}

export function ChangelogContent({
  entries,
}: {
  entries: ChangelogClientEntry[];
}) {
  const t = useTranslations('changelog');
  const formatter = useFormatter();
  const [active, setActive] = useState<'all' | ChangelogType>('all');

  const visible = useMemo(() => {
    if (active === 'all') return entries;
    return entries.filter((entry) => entry.type === active);
  }, [entries, active]);

  if (entries.length === 0) {
    return (
      <p className="py-20 text-center text-base text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
        {t('noEntries')}
      </p>
    );
  }

  return (
    <>
      <div
        className="mt-10 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
      >
        {TYPES.map((type) => {
          const isActive = active === type.id;

          return (
            <button
              key={type.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(type.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-[--radius-enviro-pill] border px-4 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] font-[family-name:var(--font-enviro-sans)]',
                isActive
                  ? 'border-[--color-enviro-forest-900] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300] shadow-[--shadow-enviro-md]'
                  : 'border-[--color-enviro-cream-300] bg-white text-[--color-enviro-forest-700] hover:border-[--color-enviro-forest-700] hover:bg-[--color-enviro-cream-100]',
              )}
            >
              {t(type.labelKey)}
            </button>
          );
        })}
      </div>

      <StaggerContainer
        className="mx-auto mt-12 flex max-w-3xl flex-col gap-6"
        stagger={0.06}
      >
        {visible.map((entry) => {
          const formattedDate = formatter.dateTime(new Date(entry.publishedAt), {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          const badgeKey = `typeBadge${entry.type.charAt(0).toUpperCase()}${entry.type.slice(1)}`;
          const badgeLabel = t(badgeKey);

          return (
            <StaggerItem key={entry.id}>
              <EnviroCard
                variant="cream"
                radius="lg"
                hover="lift"
                padding="lg"
                className="relative"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.08em] font-[family-name:var(--font-enviro-mono)]">
                  {entry.version ? (
                    <span className="text-[--color-enviro-cta]">
                      <span aria-hidden="true">[ </span>
                      {entry.version}
                      <span aria-hidden="true"> ]</span>
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      'inline-flex items-center rounded-[--radius-enviro-pill] border px-2 py-0.5 text-[10px] font-medium',
                      badgeClasses(entry.type),
                    )}
                  >
                    {badgeLabel}
                  </span>
                  <time
                    dateTime={entry.publishedAt}
                    className="text-[--color-enviro-forest-600]"
                  >
                    {formattedDate}
                  </time>
                  {entry.highlight ? (
                    <span className="inline-flex items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-cta] px-2 py-0.5 text-[10px] font-semibold uppercase text-[--color-enviro-cta-fg]">
                      {t('latestBadge')}
                    </span>
                  ) : null}
                </div>

                <EnviroCardHeader>
                  <EnviroCardTitle>
                    <Link
                      href={`/changelog/${entry.slug}`}
                      className="text-[--color-enviro-forest-900] transition-colors hover:text-[--color-enviro-cta]"
                    >
                      {entry.title}
                    </Link>
                  </EnviroCardTitle>
                </EnviroCardHeader>

                {entry.description ? (
                  <EnviroCardBody className="text-sm leading-relaxed text-[--color-enviro-forest-700]">
                    {entry.description}
                  </EnviroCardBody>
                ) : null}

                <Link
                  href={`/changelog/${entry.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[--color-enviro-cta] hover:text-[--color-enviro-cta-hover] font-[family-name:var(--font-enviro-sans)]"
                >
                  {t('readDetail')}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </EnviroCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
          {t('noEntries')}
        </p>
      ) : null}
    </>
  );
}
