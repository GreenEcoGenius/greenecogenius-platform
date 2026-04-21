'use client';

import type { ReactNode } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@kit/ui/accordion';
import { cn } from '@kit/ui/utils';

export interface EnviroFaqItem {
  /** Stable unique value used by the underlying accordion. */
  value: string;
  /** Already-translated question. */
  question: ReactNode;
  /** Already-translated answer (string or rich content). */
  answer: ReactNode;
}

interface EnviroFaqProps {
  items: EnviroFaqItem[];
  tone?: 'forest' | 'cream';
  /** Allow multiple panels open at the same time. Default: false. */
  multiple?: boolean;
  className?: string;
}

/**
 * FAQ accordion. Wraps `@kit/ui/accordion` (Base UI) with Enviro typography
 * and borders. The accordion itself manages a11y (aria-expanded, keyboard
 * navigation, focus rings).
 */
export function EnviroFaq({
  items,
  tone = 'cream',
  multiple = false,
  className,
}: EnviroFaqProps) {
  const isInverse = tone === 'forest';

  return (
    <Accordion
      multiple={multiple}
      className={cn('flex w-full flex-col gap-3', className)}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className={cn(
            'overflow-hidden rounded-[--radius-enviro-lg] border transition-colors duration-200',
            isInverse
              ? 'border-[--color-enviro-forest-700] bg-[--color-enviro-forest-800] hover:border-[--color-enviro-lime-300]'
              : 'border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] hover:border-[--color-enviro-forest-700]',
          )}
        >
          <AccordionTrigger
            className={cn(
              'group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base md:text-lg font-medium font-[family-name:var(--font-enviro-display)] hover:no-underline',
              isInverse
                ? 'text-[--color-enviro-fg-inverse]'
                : 'text-[--color-enviro-forest-900]',
            )}
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              'px-5 pb-5 text-sm md:text-base leading-relaxed font-[family-name:var(--font-enviro-sans)]',
              isInverse
                ? 'text-[--color-enviro-fg-inverse-muted]'
                : 'text-[--color-enviro-forest-700]',
            )}
          >
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
