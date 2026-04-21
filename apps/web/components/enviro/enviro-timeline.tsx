'use client';

import type { ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

import { StaggerContainer, StaggerItem } from './animations/stagger-container';

export interface EnviroTimelineItemProps {
  /** Already-translated year / period label. */
  year: ReactNode;
  /** Already-translated title. */
  title: ReactNode;
  /** Already-translated description. */
  description: ReactNode;
  /** Optional badge (e.g. "Urgent"). */
  badge?: ReactNode;
}

interface EnviroTimelineProps {
  items: EnviroTimelineItemProps[];
  tone?: 'forest' | 'cream';
  className?: string;
}

/**
 * Vertical timeline. Year + title + description per item, optional ember
 * "Urgent" badge. Items reveal sequentially via `StaggerContainer`.
 */
export function EnviroTimeline({
  items,
  tone = 'cream',
  className,
}: EnviroTimelineProps) {
  return (
    <StaggerContainer
      className={cn('flex flex-col gap-0', className)}
      stagger={0.08}
    >
      {items.map((item, idx) => (
        <StaggerItem key={idx}>
          <EnviroTimelineItem
            {...item}
            isLast={idx === items.length - 1}
            tone={tone}
          />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

export function EnviroTimelineItem({
  year,
  title,
  description,
  badge,
  tone = 'cream',
  isLast = false,
}: EnviroTimelineItemProps & {
  tone?: 'forest' | 'cream';
  isLast?: boolean;
}) {
  const isInverse = tone === 'forest';

  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr] gap-6 py-6 lg:grid-cols-[120px_1fr_auto] lg:gap-10',
        !isLast &&
          (isInverse
            ? 'border-b border-[--color-enviro-forest-700]'
            : 'border-b border-[--color-enviro-cream-300]'),
      )}
    >
      <div
        className={cn(
          'text-[length:var(--text-enviro-4xl)] leading-none tracking-tight font-semibold font-[family-name:var(--font-enviro-display)]',
          isInverse
            ? 'text-[--color-enviro-lime-300]'
            : 'text-[--color-enviro-forest-900]',
        )}
      >
        {year}
      </div>

      <div className="flex flex-col gap-2">
        <h3
          className={cn(
            'text-xl font-semibold leading-snug font-[family-name:var(--font-enviro-display)]',
            isInverse
              ? 'text-[--color-enviro-fg-inverse]'
              : 'text-[--color-enviro-forest-900]',
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-base leading-relaxed font-[family-name:var(--font-enviro-sans)]',
            isInverse
              ? 'text-[--color-enviro-fg-inverse-muted]'
              : 'text-[--color-enviro-forest-700]',
          )}
        >
          {description}
        </p>
      </div>

      {badge ? (
        <div className="col-span-2 lg:col-span-1 lg:self-start">
          <span className="inline-flex items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-cta] px-3 py-1 text-xs font-semibold uppercase tracking-[0.04em] text-[--color-enviro-cta-fg] font-[family-name:var(--font-enviro-mono)]">
            {badge}
          </span>
        </div>
      ) : null}
    </div>
  );
}
