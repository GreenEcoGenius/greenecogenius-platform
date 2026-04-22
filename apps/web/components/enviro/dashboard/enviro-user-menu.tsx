'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';

import { ChevronDown, Globe, LogOut } from 'lucide-react';
import { useLocale } from 'next-intl';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { cn } from '@kit/ui/utils';

interface EnviroUserMenuProps {
  /** Already-translated user display name. */
  displayName: ReactNode;
  /** User email (used as secondary text in the dropdown header). */
  email?: ReactNode;
  /** Optional avatar image URL. */
  avatarSrc?: string;
  /** Optional initials fallback (max 2 chars recommended). */
  initials?: string;
  /** Items above the language and sign-out section. Pass already-translated labels + hrefs. */
  items?: Array<{
    /** Already-translated label. */
    label: ReactNode;
    /** Internal href. */
    href: string;
    /** Optional icon (lucide). */
    icon?: ReactNode;
  }>;
  /** Already-translated label for the language section header. */
  languageLabel?: ReactNode;
  /** Already-translated label for the sign-out item. */
  signOutLabel: ReactNode;
  /** Callback fired when the user clicks "Sign out". */
  onSignOut: () => void;
  /** Already-translated aria-label for the trigger button. */
  ariaLabel?: string;
  /** Show or hide the trailing chevron on the trigger. */
  showChevron?: boolean;
}

const LOCALE_LABELS: Record<string, { label: string; tag: string }> = {
  fr: { label: 'Français', tag: 'FR' },
  en: { label: 'English', tag: 'EN' },
};

/**
 * Avatar trigger + dropdown menu rendered in the topbar. Per Phase 6
 * decision, the locale switcher lives here (instead of the topbar) to
 * declutter the top bar and treat the locale as a profile preference.
 */
export function EnviroUserMenu({
  displayName,
  email,
  avatarSrc,
  initials,
  items = [],
  languageLabel,
  signOutLabel,
  onSignOut,
  ariaLabel,
  showChevron = true,
}: EnviroUserMenuProps) {
  const locale = useLocale();
  const otherLocales = Object.keys(LOCALE_LABELS).filter((l) => l !== locale);

  const handleLocaleSwitch = (next: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    const stripped = window.location.pathname.replace(
      /^\/(fr|en)(\/|$)/,
      '/',
    );
    const target =
      next === 'en' ? stripped : `/${next}${stripped === '/' ? '' : stripped}`;
    window.location.href = target || '/';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center gap-2 rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] py-1 pr-3 pl-1 text-sm font-medium text-[--color-enviro-forest-900] transition-colors duration-200 hover:border-[--color-enviro-lime-400] hover:bg-[--color-enviro-cream-50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60',
          'font-[family-name:var(--font-enviro-sans)]',
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[--color-enviro-forest-900] text-[10px] font-semibold uppercase text-[--color-enviro-lime-300]"
        >
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            (initials ?? '').slice(0, 2)
          )}
        </span>

        <span className="hidden max-w-[140px] truncate md:inline">
          {displayName}
        </span>

        {showChevron ? (
          <ChevronDown
            aria-hidden="true"
            className="h-3.5 w-3.5 text-[--color-enviro-forest-700]"
          />
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-[--radius-enviro-lg] border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] p-2 font-[family-name:var(--font-enviro-sans)] shadow-[--shadow-enviro-lg]"
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-2">
          <span className="text-sm font-semibold text-[--color-enviro-forest-900]">
            {displayName}
          </span>
          {email ? (
            <span className="text-xs text-[--color-enviro-forest-700]">
              {email}
            </span>
          ) : null}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 h-px bg-[--color-enviro-cream-200]" />

        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            render={
              <Link
                href={item.href}
                className="flex items-center gap-2 rounded-[--radius-enviro-sm] px-2 py-2 text-sm text-[--color-enviro-forest-900] focus:bg-[--color-enviro-lime-100] focus:text-[--color-enviro-forest-900]"
              >
                {item.icon ? (
                  <span className="flex h-4 w-4 items-center justify-center text-[--color-enviro-forest-700]">
                    {item.icon}
                  </span>
                ) : null}
                <span>{item.label}</span>
              </Link>
            }
          />
        ))}

        <DropdownMenuSeparator className="my-1 h-px bg-[--color-enviro-cream-200]" />

        {languageLabel ? (
          <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
            {languageLabel}
          </div>
        ) : null}

        <div className="flex items-center gap-1 px-1 pb-1">
          <span
            className="inline-flex items-center justify-center rounded-[--radius-enviro-sm] bg-[--color-enviro-cream-100] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[--color-enviro-forest-900]"
            aria-current="true"
          >
            <Globe aria-hidden="true" className="mr-1 h-3 w-3" />
            {LOCALE_LABELS[locale]?.tag ?? locale.toUpperCase()}
          </span>
          {otherLocales.map((other) => (
            <button
              key={other}
              type="button"
              onClick={() => handleLocaleSwitch(other)}
              className="inline-flex items-center justify-center rounded-[--radius-enviro-sm] px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[--color-enviro-forest-700] transition-colors hover:bg-[--color-enviro-cream-100] hover:text-[--color-enviro-forest-900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60"
            >
              {LOCALE_LABELS[other]?.tag ?? other.toUpperCase()}
            </button>
          ))}
        </div>

        <DropdownMenuSeparator className="my-1 h-px bg-[--color-enviro-cream-200]" />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onSignOut();
          }}
          className="rounded-[--radius-enviro-sm] px-2 py-2 text-sm text-[--color-enviro-ember-700] focus:bg-[--color-enviro-ember-50] focus:text-[--color-enviro-ember-700]"
        >
          <LogOut aria-hidden="true" className="mr-2 h-4 w-4" />
          {signOutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
