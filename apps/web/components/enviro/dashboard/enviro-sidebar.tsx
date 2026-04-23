'use client';

import type { ReactNode } from 'react';

import { ChevronsLeft, ChevronsRight, X } from 'lucide-react';

import { cn } from '@kit/ui/utils';

import { useEnviroSidebar } from './enviro-sidebar-context';

export interface EnviroSidebarGroupConfig {
  /** Already-translated section heading. */
  heading: ReactNode;
  /** `EnviroSidebarNavItem` nodes (already-translated labels). */
  children: ReactNode;
}

interface EnviroSidebarProps {
  /** Brand block rendered at the top (logo + wordmark). */
  brand: ReactNode;
  /** One or more groups of nav items. */
  groups: EnviroSidebarGroupConfig[];
  /** Optional footer slot (e.g. user mini-card). */
  footer?: ReactNode;
  /** Already-translated aria-label for the collapse toggle. */
  collapseLabel?: string;
  expandLabel?: string;
  /** Already-translated aria-label for the close-mobile button. */
  closeLabel?: string;
  /**
   * Accent color applied to group headings. `lime` (default) for the user
   * dashboard, `ember` for the super-admin segment. Pair with the matching
   * `accent` prop on each `EnviroSidebarNavItem` so active states stay
   * consistent.
   */
  accent?: 'lime' | 'ember';
  /** Forwarded for layout overrides. */
  className?: string;
}

const SIDEBAR_WIDTH_EXPANDED = '17.5rem'; // 280px
const SIDEBAR_WIDTH_COLLAPSED = '4.5rem'; // 72px

/**
 * Sticky forest sidebar for the dashboard. Two responsive shapes:
 *   - Desktop (lg+) → fixed-width left rail with collapse 280 ↔ 72.
 *   - Mobile / tablet → off-canvas drawer slid in via context state.
 *
 * Coloration is locked to forest-900 with lime accents to mirror the brand
 * primary navigation and ensure WCAG AA contrast (lime-300 on forest-900 is
 * 10.8:1, inverse-muted is 8.7:1).
 */
export function EnviroSidebar({
  brand,
  groups,
  footer,
  collapseLabel = 'Collapse sidebar',
  expandLabel = 'Expand sidebar',
  closeLabel = 'Close',
  accent = 'lime',
  className,
}: EnviroSidebarProps) {
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useEnviroSidebar();

  const widthVar = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  const accentHeadingClass =
    accent === 'ember'
      ? 'text-[--color-enviro-ember-300]/70'
      : 'text-[--color-enviro-lime-300]/70';

  return (
    <>
      <aside
        data-state={collapsed ? 'collapsed' : 'expanded'}
        data-mobile-open={mobileOpen ? 'true' : 'false'}
        className={cn(
          'fixed inset-y-0 left-0 z-[--z-enviro-overlay] flex h-dvh flex-col bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse] shadow-[--shadow-enviro-elevated] transition-[width,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'data-[mobile-open=false]:-translate-x-full data-[mobile-open=true]:translate-x-0 lg:translate-x-0',
          'font-[family-name:var(--font-enviro-sans)]',
          className,
        )}
        style={{ width: widthVar }}
        aria-label="Primary navigation"
      >
        <div
          className={cn(
            'flex h-16 shrink-0 items-center border-b border-[--color-enviro-forest-700]',
            collapsed ? 'justify-center px-2' : 'justify-between px-4',
          )}
        >
          <div className="min-w-0 flex-1 truncate">{brand}</div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label={closeLabel}
            className="rounded-[--radius-enviro-sm] p-2 text-[--color-enviro-fg-inverse-muted] transition-colors hover:text-[--color-enviro-fg-inverse] lg:hidden"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden px-3 py-5',
            'scrollbar-thin scrollbar-thumb-white/10',
          )}
        >
          <ul className="flex flex-col gap-6">
            {groups.map((group, index) => (
              <li key={index}>
                {!collapsed ? (
                  <h2
                    className={cn(
                      'mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] font-[family-name:var(--font-enviro-mono)]',
                      accentHeadingClass,
                    )}
                  >
                    {group.heading}
                  </h2>
                ) : null}
                <ul className="flex flex-col gap-1">{group.children}</ul>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={cn(
            'shrink-0 border-t border-[--color-enviro-forest-700]',
            collapsed ? 'p-2' : 'p-3',
          )}
        >
          {footer ? <div className={cn(!collapsed && 'mb-2')}>{footer}</div> : null}

          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? expandLabel : collapseLabel}
            aria-expanded={!collapsed}
            className={cn(
              'hidden w-full items-center gap-2 rounded-[--radius-enviro-md] px-3 py-2 text-xs font-medium uppercase tracking-[0.06em] text-[--color-enviro-fg-inverse-muted] transition-colors duration-200 hover:bg-white/[0.04] hover:text-[--color-enviro-fg-inverse] lg:flex',
              collapsed && 'justify-center px-2',
              'font-[family-name:var(--font-enviro-mono)]',
            )}
          >
            {collapsed ? (
              <ChevronsRight aria-hidden="true" className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft aria-hidden="true" className="h-4 w-4" />
                <span>{collapseLabel}</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        tabIndex={-1}
        className={cn(
          'fixed inset-0 z-[--z-enviro-sticky] bg-[--color-enviro-forest-950]/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden',
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      />
    </>
  );
}

export {
  SIDEBAR_WIDTH_EXPANDED as ENVIRO_SIDEBAR_WIDTH_EXPANDED,
  SIDEBAR_WIDTH_COLLAPSED as ENVIRO_SIDEBAR_WIDTH_COLLAPSED,
};
