import type { ReactNode } from 'react';

import { Check } from 'lucide-react';

import { cn } from '@kit/ui/utils';

import { EnviroCard } from './enviro-card';

interface EnviroPricingCardProps {
  /** Already-translated plan name. */
  name: ReactNode;
  /** Already-translated price string (e.g. "€149", "Custom"). */
  price: ReactNode;
  /** Already-translated period (e.g. "per month"). Hidden when empty. */
  period?: ReactNode;
  /** Already-translated description. */
  description?: ReactNode;
  /** Already-translated features (one bullet per item). */
  features: ReactNode[];
  /** Call-to-action button or link node. */
  cta: ReactNode;
  /** Already-translated badge (rendered floating). */
  badge?: ReactNode;
  /** Variant emphasises one card. */
  variant?: 'default' | 'popular' | 'enterprise';
  className?: string;
}

/**
 * Pricing card. The "popular" variant lifts visually with the Enviro forest
 * surface, the "enterprise" variant uses the lime accent.
 */
export function EnviroPricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  badge,
  variant = 'default',
  className,
}: EnviroPricingCardProps) {
  const cardVariant =
    variant === 'popular' ? 'dark' : variant === 'enterprise' ? 'lime' : 'cream';
  const isInverse = variant === 'popular';

  return (
    <div className={cn('relative', className)}>
      {badge ? (
        <span
          className={cn(
            'absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-[--radius-enviro-pill] bg-[--color-enviro-cta] px-4 py-1 text-xs font-semibold uppercase tracking-[0.04em] text-[--color-enviro-cta-fg] shadow-[--shadow-enviro-md] font-[family-name:var(--font-enviro-mono)]',
          )}
        >
          {badge}
        </span>
      ) : null}

      <EnviroCard
        variant={cardVariant}
        radius="lg"
        hover={variant === 'popular' ? 'glow' : 'lift'}
        padding="lg"
        className="h-full flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <h3
            className={cn(
              'text-xl font-semibold font-[family-name:var(--font-enviro-display)]',
              isInverse
                ? 'text-[--color-enviro-fg-inverse]'
                : 'text-[--color-enviro-forest-900]',
            )}
          >
            {name}
          </h3>
          {description ? (
            <p
              className={cn(
                'text-sm leading-relaxed font-[family-name:var(--font-enviro-sans)]',
                isInverse
                  ? 'text-[--color-enviro-fg-inverse-muted]'
                  : 'text-[--color-enviro-forest-700]',
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              'text-[length:var(--text-enviro-6xl)] leading-none tracking-tight font-bold font-[family-name:var(--font-enviro-display)]',
              isInverse
                ? 'text-[--color-enviro-fg-inverse]'
                : 'text-[--color-enviro-forest-900]',
            )}
          >
            {price}
          </span>
          {period ? (
            <span
              className={cn(
                'text-sm font-[family-name:var(--font-enviro-sans)]',
                isInverse
                  ? 'text-[--color-enviro-fg-inverse-muted]'
                  : 'text-[--color-enviro-forest-700]',
              )}
            >
              {period}
            </span>
          ) : null}
        </div>

        <ul className="flex flex-col gap-3">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className={cn(
                'flex items-start gap-3 text-sm leading-relaxed font-[family-name:var(--font-enviro-sans)]',
                isInverse
                  ? 'text-[--color-enviro-fg-inverse-muted]'
                  : 'text-[--color-enviro-forest-700]',
              )}
            >
              <Check
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0',
                  isInverse
                    ? 'text-[--color-enviro-lime-300]'
                    : 'text-[--color-enviro-forest-900]',
                )}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-2">{cta}</div>
      </EnviroCard>
    </div>
  );
}
