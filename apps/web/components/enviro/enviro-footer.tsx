import type { ReactNode } from 'react';

import Link from 'next/link';

import { cn } from '@kit/ui/utils';

export interface EnviroFooterLink {
  href: string;
  label: ReactNode;
  external?: boolean;
}

export interface EnviroFooterSection {
  /** Already-translated heading. */
  heading: ReactNode;
  links: EnviroFooterLink[];
}

interface EnviroFooterProps {
  /** Brand block (logo + short pitch). */
  brand: ReactNode;
  /** Optional short description rendered below the brand. */
  description?: ReactNode;
  /** Up to 4 columns of links. */
  sections: EnviroFooterSection[];
  /** Newsletter / CTA block on the right. */
  newsletter?: ReactNode;
  /** Already-translated copyright string. */
  copyright: ReactNode;
  /** Social icons row. */
  social?: ReactNode;
  /** Background tone. Default: forest (dark). */
  tone?: 'forest' | 'cream';
  className?: string;
}

/**
 * Footer in the Enviro style. Composes Next `Link` and the Enviro tokens.
 * Strings are passed in as `ReactNode` so the caller controls i18n.
 */
export function EnviroFooter({
  brand,
  description,
  sections,
  newsletter,
  copyright,
  social,
  tone = 'forest',
  className,
}: EnviroFooterProps) {
  const isInverse = tone === 'forest';

  return (
    <footer
      className={cn(
        'mt-16 w-full',
        isInverse
          ? 'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse]'
          : 'bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-5">
            {brand}
            {description ? (
              <p
                className={cn(
                  'max-w-sm text-sm leading-relaxed font-[family-name:var(--font-enviro-sans)]',
                  isInverse
                    ? 'text-[--color-enviro-fg-inverse-muted]'
                    : 'text-[--color-enviro-forest-700]',
                )}
              >
                {description}
              </p>
            ) : null}
            {social ? <div className="flex gap-3 pt-2">{social}</div> : null}
          </div>

          <div
            className={cn(
              'grid gap-10 sm:grid-cols-2 lg:grid-cols-3',
              newsletter ? 'lg:col-span-5' : 'lg:col-span-8',
            )}
          >
            {sections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <h3
                  className={cn(
                    'text-sm uppercase tracking-[0.08em] font-medium font-[family-name:var(--font-enviro-mono)]',
                    isInverse
                      ? 'text-[--color-enviro-lime-300]'
                      : 'text-[--color-enviro-forest-700]',
                  )}
                >
                  {section.heading}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link, lidx) => (
                    <li key={lidx}>
                      <Link
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={
                          link.external ? 'noopener noreferrer' : undefined
                        }
                        className={cn(
                          'text-sm transition-colors duration-200 font-[family-name:var(--font-enviro-sans)]',
                          isInverse
                            ? 'text-[--color-enviro-fg-inverse-muted] hover:text-[--color-enviro-fg-inverse]'
                            : 'text-[--color-enviro-forest-700] hover:text-[--color-enviro-forest-900]',
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {newsletter ? (
            <div className="lg:col-span-3">{newsletter}</div>
          ) : null}
        </div>

        <div
          className={cn(
            'mt-12 flex flex-col gap-3 border-t pt-8 md:flex-row md:items-center md:justify-between',
            isInverse
              ? 'border-[--color-enviro-forest-700] text-[--color-enviro-fg-inverse-muted]'
              : 'border-[--color-enviro-cream-300] text-[--color-enviro-forest-700]',
          )}
        >
          <p className="text-xs font-[family-name:var(--font-enviro-sans)]">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
