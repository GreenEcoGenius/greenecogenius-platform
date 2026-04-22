'use client';

import type { ReactNode } from 'react';

import { Menu } from 'lucide-react';

import { cn } from '@kit/ui/utils';

import { useEnviroSidebar } from './enviro-sidebar-context';

interface EnviroDashboardTopbarProps {
  /** Left slot, typically the breadcrumb. */
  leading?: ReactNode;
  /**
   * Centre slot for the search trigger or global search button. Caller
   * wires the Cmd+K listener so the topbar stays presentation-only.
   */
  center?: ReactNode;
  /**
   * Trailing slot for the notifications bell, Genius button, user menu,
   * etc. Rendered right-aligned with a 2-unit gap.
   */
  trailing?: ReactNode;
  /** Already-translated aria-label for the mobile menu button. */
  mobileMenuLabel?: string;
  /** Forwarded for layout overrides. */
  className?: string;
}

/**
 * Sticky top bar for the dashboard shell. Per Phase 6 decision the bar
 * stays visible at all times (no auto-hide on scroll) and stretches the
 * full width of the main column (sidebar pushes it from the left).
 *
 * Slots are intentionally generic so the consuming layout owns the
 * concrete UI (search palette wiring, Genius toggle, user menu) and this
 * component remains presentation-only.
 */
export function EnviroDashboardTopbar({
  leading,
  center,
  trailing,
  mobileMenuLabel = 'Open menu',
  className,
}: EnviroDashboardTopbarProps) {
  const { setMobileOpen } = useEnviroSidebar();

  return (
    <header
      className={cn(
        'sticky top-0 z-[--z-enviro-sticky] flex h-16 items-center gap-3 border-b border-[--color-enviro-cream-200] bg-[--color-enviro-cream-50]/95 px-4 shadow-[--shadow-enviro-sm] backdrop-blur-md md:px-6',
        'font-[family-name:var(--font-enviro-sans)]',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label={mobileMenuLabel}
        className="inline-flex h-9 w-9 items-center justify-center rounded-[--radius-enviro-sm] text-[--color-enviro-forest-900] transition-colors hover:bg-[--color-enviro-cream-100] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60 lg:hidden"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
        {leading}
      </div>

      {center ? (
        <div className="hidden min-w-0 max-w-md flex-1 items-center justify-center md:flex">
          {center}
        </div>
      ) : null}

      <div className="ml-auto flex shrink-0 items-center gap-2">{trailing}</div>
    </header>
  );
}
