'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Globe, Menu, X } from 'lucide-react';
import { useLocale } from 'next-intl';

import { cn } from '@kit/ui/utils';

import { EnviroButton } from './enviro-button';

/**
 * Compare a `pathname` against a link `href`, both stripped of the
 * locale prefix, and decide whether the link should render in its
 * "active" state.
 *
 * Rules:
 *  - exact match -> active.
 *  - href is "/" -> active only on the literal "/" pathname (not a
 *    descendant), otherwise every link would activate.
 *  - href is a non-root prefix of pathname -> active (e.g.
 *    `/blog/foo` activates `/blog`).
 */
function isActive(pathname: string, href: string): boolean {
  // Strip any leading locale segment ("/fr", "/en") for stable comparison.
  const stripped = pathname.replace(/^\/(fr|en)(?=\/|$)/, '') || '/';

  if (href === '/') return stripped === '/';
  if (stripped === href) return true;

  return stripped.startsWith(`${href}/`);
}

export interface EnviroNavbarLink {
  /** Internal href, e.g. `/about`. */
  href: string;
  /** Already-translated label rendered by the caller. */
  label: ReactNode;
  /** Optional badge (e.g. "New"). */
  badge?: ReactNode;
}

interface EnviroNavbarProps {
  /** Brand block on the left (logo / wordmark). */
  brand: ReactNode;
  /** Ordered list of menu items. */
  links: EnviroNavbarLink[];
  /** Right-side CTA (typically EnviroButton). */
  ctaPrimary?: ReactNode;
  /** Right-side secondary action (sign in, account, etc.). */
  ctaSecondary?: ReactNode;
  /** Show the FR/EN switcher. Default: true. */
  showLocaleSwitcher?: boolean;
  /** Background tone. */
  tone?: 'forest' | 'cream' | 'transparent';
  /** Sticks to the top with backdrop blur on scroll. Default: true. */
  sticky?: boolean;
  className?: string;
  /** Already-translated label for the locale switcher. */
  localeSwitcherLabel?: string;
  /** Aria label for the mobile menu trigger. */
  mobileMenuLabel?: string;
  /** Aria label for the mobile menu close button. */
  closeMenuLabel?: string;
}

/**
 * Top navigation bar in the Enviro style. Wraps Next.js `Link` and the
 * Enviro primitives. Strings are passed in as `ReactNode` so the caller
 * controls i18n.
 */
export function EnviroNavbar({
  brand,
  links,
  ctaPrimary,
  ctaSecondary,
  showLocaleSwitcher = true,
  tone = 'forest',
  sticky = true,
  className,
  localeSwitcherLabel,
  mobileMenuLabel = 'Open menu',
  closeMenuLabel = 'Close menu',
}: EnviroNavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!sticky) return;

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [sticky]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const toneClasses = {
    forest: 'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse]',
    cream: 'bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]',
    transparent: 'bg-transparent text-[--color-enviro-fg-inverse]',
  } as const;

  const isInverse = tone === 'forest' || tone === 'transparent';

  const linkBaseClasses =
    'relative inline-flex items-center gap-2 py-2 text-sm font-medium transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]';

  const linkColorClasses = (active: boolean) =>
    isInverse
      ? cn(
          'after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-all',
          active
            ? 'text-[--color-enviro-lime-300] after:bg-[--color-enviro-lime-300]'
            : 'text-[--color-enviro-fg-inverse-muted] hover:text-[--color-enviro-lime-300] after:bg-transparent',
        )
      : cn(
          'after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-all',
          active
            ? 'text-[--color-enviro-forest-900] after:bg-[--color-enviro-cta]'
            : 'text-[--color-enviro-forest-700] hover:text-[--color-enviro-forest-900] after:bg-transparent',
        );

  return (
    <header
      className={cn(
        'top-0 left-0 right-0 z-[--z-enviro-sticky] w-full transition-[backdrop-filter,background-color,box-shadow] duration-300',
        sticky ? 'sticky' : 'relative',
        scrolled && 'backdrop-blur-md shadow-[--shadow-enviro-sm]',
        toneClasses[tone],
        className,
      )}
    >
      <nav
        className="mx-auto flex w-full max-w-[--container-enviro-xl] items-center justify-between gap-6 px-4 py-3 lg:px-8 lg:py-4"
        aria-label="Primary"
      >
        <div className="flex items-center gap-3">{brand}</div>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(linkBaseClasses, linkColorClasses(active))}
                >
                  {link.label}
                  {link.badge ? (
                    <span className="ml-2 rounded-full bg-[--color-enviro-lime-300] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[--color-enviro-forest-900]">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {showLocaleSwitcher ? (
            <LocaleSwitcher
              isInverse={isInverse}
              ariaLabel={localeSwitcherLabel}
            />
          ) : null}
          {ctaSecondary}
          {ctaPrimary}
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={mobileMenuLabel}
          className={cn(
            'inline-flex items-center justify-center rounded-[--radius-enviro-sm] p-2 md:hidden',
            isInverse ? 'text-[--color-enviro-fg-inverse]' : 'text-[--color-enviro-forest-900]',
          )}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {mounted && open
        ? createPortal(
            <MobileMenu
              brand={brand}
              links={links}
              ctaPrimary={ctaPrimary}
              ctaSecondary={ctaSecondary}
              showLocaleSwitcher={showLocaleSwitcher}
              localeSwitcherLabel={localeSwitcherLabel}
              closeMenuLabel={closeMenuLabel}
              pathname={pathname}
              onClose={() => setOpen(false)}
            />,
            document.body,
          )
        : null}
    </header>
  );
}

interface MobileMenuProps
  extends Pick<
    EnviroNavbarProps,
    | 'brand'
    | 'links'
    | 'ctaPrimary'
    | 'ctaSecondary'
    | 'showLocaleSwitcher'
    | 'localeSwitcherLabel'
    | 'closeMenuLabel'
  > {
  pathname: string;
  onClose: () => void;
}

function MobileMenu({
  brand,
  links,
  ctaPrimary,
  ctaSecondary,
  showLocaleSwitcher,
  localeSwitcherLabel,
  closeMenuLabel = 'Close menu',
  pathname,
  onClose,
}: MobileMenuProps) {
  return (
    <div className="fixed inset-0 z-[--z-enviro-modal] flex flex-col bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse]">
      <div className="flex items-center justify-between border-b border-[--color-enviro-forest-700] px-5 py-4">
        <div className="flex items-center gap-3">{brand}</div>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeMenuLabel}
          className="rounded-[--radius-enviro-sm] p-2 text-[--color-enviro-fg-inverse]"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <ul className="flex flex-col gap-1 px-5 py-6">
        {links.map((link) => {
          const active = isActive(pathname, link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'block py-3 text-lg font-medium transition-colors',
                  active
                    ? 'text-[--color-enviro-lime-300]'
                    : 'text-[--color-enviro-fg-inverse] hover:text-[--color-enviro-lime-300]',
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-3 border-t border-[--color-enviro-forest-700] px-5 py-6">
        {showLocaleSwitcher ? (
          <LocaleSwitcher isInverse ariaLabel={localeSwitcherLabel} />
        ) : null}
        {ctaSecondary}
        {ctaPrimary}
      </div>
    </div>
  );
}

function LocaleSwitcher({
  isInverse,
  ariaLabel,
}: {
  isInverse: boolean;
  ariaLabel?: string;
}) {
  const locale = useLocale();

  const next = locale === 'fr' ? 'en' : 'fr';

  const handleSwitch = () => {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    const stripped = window.location.pathname.replace(/^\/(fr|en)(\/|$)/, '/');
    const target =
      next === 'en' ? stripped : `/${next}${stripped === '/' ? '' : stripped}`;
    window.location.href = target || '/';
  };

  return (
    <EnviroButton
      type="button"
      variant={isInverse ? 'outlineCream' : 'secondary'}
      size="sm"
      onClick={handleSwitch}
      aria-label={ariaLabel}
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase">{next}</span>
    </EnviroButton>
  );
}
