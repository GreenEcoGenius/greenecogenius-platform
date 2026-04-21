'use client';

import type { ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

import { AnimatedCounter } from './animations/animated-counter';
import { StaggerContainer, StaggerItem } from './animations/stagger-container';

export interface EnviroStatBlockProps {
  /** Numerical value, animated from 0 to this number on viewport enter. */
  value: number;
  /** Optional prefix (e.g. "+", "€"). */
  prefix?: string;
  /** Optional suffix (e.g. " %", " Mt"). */
  suffix?: string;
  /** Already-translated descriptive label below the number. */
  label: ReactNode;
  /** Already-translated source citation. */
  source?: ReactNode;
  /** Number of fraction digits. */
  fractionDigits?: number;
}

interface EnviroStatsProps {
  /** Already-translated stats. */
  stats: EnviroStatBlockProps[];
  /** Tone of the surrounding section. */
  tone?: 'forest' | 'cream';
  className?: string;
}

/**
 * Animated stats grid. Each block counts up to its value on viewport enter,
 * with a staggered fade for the labels.
 */
export function EnviroStats({
  stats,
  tone = 'cream',
  className,
}: EnviroStatsProps) {
  return (
    <StaggerContainer
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}
      stagger={0.12}
    >
      {stats.map((stat, idx) => (
        <StaggerItem key={idx}>
          <EnviroStatBlock {...stat} tone={tone} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

export function EnviroStatBlock({
  value,
  prefix,
  suffix,
  label,
  source,
  fractionDigits,
  tone = 'cream',
}: EnviroStatBlockProps & { tone?: 'forest' | 'cream' }) {
  const isInverse = tone === 'forest';

  return (
    <div
      className={cn(
        'flex flex-col gap-2 border-t pt-6',
        isInverse
          ? 'border-[--color-enviro-forest-700]'
          : 'border-[--color-enviro-cream-300]',
      )}
    >
      <span
        className={cn(
          'text-[length:var(--text-enviro-6xl)] leading-none tracking-tight font-bold font-[family-name:var(--font-enviro-display)]',
          isInverse
            ? 'text-[--color-enviro-lime-300]'
            : 'text-[--color-enviro-forest-900]',
        )}
      >
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          fractionDigits={fractionDigits}
        />
      </span>
      <p
        className={cn(
          'text-sm leading-snug font-[family-name:var(--font-enviro-sans)]',
          isInverse
            ? 'text-[--color-enviro-fg-inverse-muted]'
            : 'text-[--color-enviro-forest-700]',
        )}
      >
        {label}
      </p>
      {source ? (
        <p
          className={cn(
            'text-xs uppercase tracking-[0.04em] font-[family-name:var(--font-enviro-mono)]',
            isInverse
              ? 'text-[--color-enviro-fg-inverse-muted]'
              : 'text-[--color-enviro-forest-600]',
          )}
        >
          {source}
        </p>
      ) : null}
    </div>
  );
}
