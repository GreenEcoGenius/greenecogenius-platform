'use client';

import type { ReactNode } from 'react';

import { Menu } from 'lucide-react';

import { cn } from '@kit/ui/utils';

import {
  ENVIRO_SIDEBAR_WIDTH_COLLAPSED,
  ENVIRO_SIDEBAR_WIDTH_EXPANDED,
  useEnviroSidebar,
} from '~/components/enviro/dashboard';

interface EnviroAdminShellProps {
  /** Sidebar node (typically `<EnviroAdminSidebar />`). */
  sidebar: ReactNode;
  /** Page content (admin pages). */
  children: ReactNode;
  /** Already-translated aria-label for the mobile menu trigger. */
  mobileMenuLabel?: string;
  /** Already-translated tag rendered in the mini topbar. */
  topbarLabel?: string;
}

/**
 * Lightweight layout shell for the super-admin segment. Reuses the same
 * `EnviroSidebar` + `EnviroSidebarProvider` plumbing as the user
 * dashboard so the collapse cookie (`enviro_sidebar_collapsed`) is shared,
 * but ships a slimmer mini-topbar (mobile menu trigger + tag) instead of
 * the full `EnviroDashboardTopbar` because admin pages don't host the
 * Genius drawer, the locale switcher or the global search.
 */
export function EnviroAdminShell({
  sidebar,
  children,
  mobileMenuLabel = 'Open menu',
  topbarLabel,
}: EnviroAdminShellProps) {
  const { collapsed, setMobileOpen } = useEnviroSidebar();

  const sidebarOffset = collapsed
    ? ENVIRO_SIDEBAR_WIDTH_COLLAPSED
    : ENVIRO_SIDEBAR_WIDTH_EXPANDED;

  return (
    <div
      className={cn(
        'relative flex min-h-dvh w-full bg-[--color-enviro-bg] text-[--color-enviro-fg] font-[family-name:var(--font-enviro-sans)]',
      )}
    >
      {sidebar}

      <div
        data-enviro-admin-shell-main
        className="flex min-h-dvh w-full flex-1 flex-col transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={
          {
            ['--enviro-admin-sidebar-offset' as string]: sidebarOffset,
          } as React.CSSProperties
        }
      >
        <style>{`
          [data-enviro-admin-shell-main] { padding-left: 0; }
          @media (min-width: 1024px) {
            [data-enviro-admin-shell-main] { padding-left: var(--enviro-admin-sidebar-offset, 0); }
          }
        `}</style>

        <header className="sticky top-0 z-[--z-enviro-sticky] flex h-14 items-center gap-3 border-b border-[--color-enviro-cream-200] bg-[--color-enviro-cream-50]/95 px-4 shadow-[--shadow-enviro-sm] backdrop-blur-md md:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={mobileMenuLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[--radius-enviro-sm] text-[--color-enviro-forest-900] transition-colors hover:bg-[--color-enviro-cream-100] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-ember-300]/60"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
          {topbarLabel ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[--color-enviro-ember-700] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[</span>
              <span className="px-1">{topbarLabel}</span>
              <span aria-hidden="true">]</span>
            </span>
          ) : null}
        </header>

        <main data-scroll-root className="relative flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
