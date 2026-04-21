import type { ReactNode } from 'react';

import Link from 'next/link';

import { Mail, MessageCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { cn } from '@kit/ui/utils';

import {
  EnviroButton,
  EnviroPageHero,
} from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';

import { LegalToc } from './legal-toc';

interface LegalPageShellProps {
  /** Already-translated page title (Conditions générales, Politique de confidentialité, Politique de cookies). */
  title: string;
  /** Already-translated page subtitle. */
  subtitle: string;
  /** Already-formatted "Last updated" date string (e.g. "29 mars 2026"). */
  lastUpdated: string;
  /** The page body — a sequence of `<LegalSection id="…" title="…" />` blocks. */
  children: ReactNode;
}

/**
 * Shared shell for the three legal pages (terms, privacy, cookies):
 *  - Cream EnviroPageHero with bracket tag `[ Mentions légales ]`.
 *  - 8/4 grid: long-form article on the left, sticky `LegalToc` on the
 *    right (desktop only — collapses on mobile).
 *  - Forest CTA section pointing to `/contact` for legal questions.
 *
 * The legal content stays IN-PLACE (RGPD obligation: no semantic drift),
 * only the surrounding chrome gets the Enviro re-skin.
 */
export async function LegalPageShell({
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  const t = await getTranslations('legal');

  return (
    <div className="flex flex-col bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]">
      <EnviroPageHero tag={t('heroTag')} title={title} subtitle={subtitle} tone="cream" align="left" />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <p className="text-xs uppercase tracking-[0.08em] text-[--color-enviro-cta] font-[family-name:var(--font-enviro-mono)]">
            <span aria-hidden="true">[ </span>
            {t('lastUpdatedLabel')} {lastUpdated}
            <span aria-hidden="true"> ]</span>
          </p>

          <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <article className="legal-article lg:col-span-8 prose prose-neutral max-w-none prose-headings:font-[family-name:var(--font-enviro-display)] prose-headings:tracking-tight prose-h2:scroll-mt-32 prose-a:text-[--color-enviro-cta] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[--color-enviro-lime-400] prose-blockquote:bg-[--color-enviro-cream-50] prose-blockquote:not-italic">
              {children}
            </article>

            <aside className="hidden lg:col-span-4 lg:block">
              <LegalToc />
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[--color-enviro-forest-900] py-16 lg:py-24 text-[--color-enviro-fg-inverse]">
        <div className="mx-auto w-full max-w-[--container-enviro-md] px-4 text-center lg:px-8">
          <FadeInSection>
            <span className="inline-flex items-center gap-1 text-xs uppercase font-medium tracking-[0.08em] text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[</span>
              <span className="px-1">{t('ctaTag')}</span>
              <span aria-hidden="true">]</span>
            </span>
            <h2 className="mt-4 text-balance text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-enviro-display)]">
              {t('ctaTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
              {t('ctaSubtitle')}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact">
                <EnviroButton variant="primary" size="md" magnetic>
                  <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                  {t('ctaLabel')}
                </EnviroButton>
              </Link>
              <a
                href={`mailto:${t('ctaSecondary')}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[--color-enviro-lime-300] underline underline-offset-4 hover:text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-mono)]"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                {t('ctaSecondary')}
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}

/**
 * Lightweight wrapper around `<section>` so every legal subsection
 * gets a stable `id` (consumed by LegalToc) and a clean Enviro spacing.
 * The Tailwind `prose` plugin styles the headings + paragraphs.
 */
export function LegalSection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('mt-12 first:mt-0', className)}>
      <h2 id={id} className="text-2xl font-semibold leading-tight tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * Definition list block used in the `1. Informations légales` section.
 * Pure presentation, no content moved.
 */
export function LegalInfoGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-4 not-prose rounded-[--radius-enviro-xl] border border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] p-5">
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-[0.04em] text-[--color-enviro-forest-700] font-medium font-[family-name:var(--font-enviro-mono)]">
              {label}
            </dt>
            <dd className="mt-1 text-sm text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-sans)]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Two-column data table used in privacy + cookies pages
 * (RGPD obligations: nature des données, finalités, durées, etc.).
 */
export function LegalDataTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mt-4 not-prose overflow-hidden rounded-[--radius-enviro-xl] border border-[--color-enviro-cream-300] bg-white">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr
              key={label}
              className={
                i > 0 ? 'border-t border-[--color-enviro-cream-300]' : undefined
              }
            >
              <th
                scope="row"
                className="w-1/3 whitespace-nowrap bg-[--color-enviro-cream-50] px-4 py-3 text-left align-top font-medium text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-sans)]"
              >
                {label}
              </th>
              <td className="px-4 py-3 text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Lime-bullet list used in `5. Services proposés`.
 */
export function LegalBulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 list-none pl-0">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-2 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-[--color-enviro-lime-400]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
