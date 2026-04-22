'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChevronDown, X } from 'lucide-react';

import type { Cms } from '@kit/cms';
import { cn, isRouteActive } from '@kit/ui/utils';

const SIDEBAR_WIDTH = '18.75rem'; // 300px

interface EnviroDocsSidebarContextValue {
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

const EnviroDocsSidebarContext =
  createContext<EnviroDocsSidebarContextValue | null>(null);

/**
 * Lightweight provider for the docs sidebar mobile drawer state. Distinct from
 * the dashboard `EnviroSidebarProvider` because the docs segment intentionally
 * has no collapse behavior and no cookie persistence (public, transient).
 */
export function EnviroDocsSidebarProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((value) => !value), []);

  const value = useMemo(
    () => ({ mobileOpen, openMobile, closeMobile, toggleMobile }),
    [mobileOpen, openMobile, closeMobile, toggleMobile],
  );

  return (
    <EnviroDocsSidebarContext.Provider value={value}>
      {children}
    </EnviroDocsSidebarContext.Provider>
  );
}

export function useEnviroDocsSidebar() {
  const context = useContext(EnviroDocsSidebarContext);

  if (!context) {
    throw new Error(
      'useEnviroDocsSidebar must be used within <EnviroDocsSidebarProvider>',
    );
  }

  return context;
}

interface EnviroDocsSidebarProps {
  /** Already-translated section heading (e.g. "Documentation"). */
  heading?: ReactNode;
  /** CMS tree (top-level items only, children rendered recursively). */
  pages: Cms.ContentItem[];
  /** Route prefix used to compose item URLs. Defaults to `/docs`. */
  prefix?: string;
  /** Already-translated aria-label for the close button on mobile. */
  closeLabel?: string;
  /** Already-translated empty-state message. */
  emptyStateLabel?: string;
}

/**
 * Fixed 300px navigation rail for the docs segment. On screens below `lg` the
 * rail collapses into an off-canvas drawer driven by `useEnviroDocsSidebar`.
 * Active route detection mirrors the dashboard sidebar so deep links work.
 *
 * Visual contract:
 *   - background: forest-900 (matches dashboard / admin shell)
 *   - active item: forest-300 background tint (neutral, not lime, not ember)
 *   - typography: enviro sans body, enviro mono section headings
 */
export function EnviroDocsSidebar({
  heading,
  pages,
  prefix = '/docs',
  closeLabel = 'Close',
  emptyStateLabel = 'No article available',
}: EnviroDocsSidebarProps) {
  const { mobileOpen, closeMobile } = useEnviroDocsSidebar();

  // Lock body scroll when the mobile drawer is open.
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (mobileOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [mobileOpen]);

  return (
    <>
      <aside
        data-mobile-open={mobileOpen ? 'true' : 'false'}
        className={cn(
          'fixed inset-y-0 left-0 z-[--z-enviro-overlay] flex h-dvh flex-col bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse] shadow-[--shadow-enviro-elevated] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'data-[mobile-open=false]:-translate-x-full data-[mobile-open=true]:translate-x-0 lg:translate-x-0',
          'font-[family-name:var(--font-enviro-sans)]',
        )}
        style={{ width: SIDEBAR_WIDTH }}
        aria-label="Documentation navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[--color-enviro-forest-700] px-4">
          {heading ? (
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[--color-enviro-forest-300] font-[family-name:var(--font-enviro-mono)]">
              {heading}
            </h2>
          ) : (
            <span aria-hidden="true" />
          )}

          <button
            type="button"
            onClick={closeMobile}
            aria-label={closeLabel}
            className="rounded-[--radius-enviro-sm] p-2 text-[--color-enviro-fg-inverse-muted] transition-colors hover:text-[--color-enviro-fg-inverse] lg:hidden"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-x-hidden overflow-y-auto px-3 py-5">
          {pages.length === 0 ? (
            <p className="px-3 text-sm text-[--color-enviro-fg-inverse-muted]">
              {emptyStateLabel}
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              <DocsTree pages={pages} prefix={prefix} level={0} />
            </ul>
          )}
        </nav>
      </aside>

      <button
        type="button"
        onClick={closeMobile}
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

function DocsTree({
  pages,
  prefix,
  level,
}: {
  pages: Cms.ContentItem[];
  prefix: string;
  level: number;
}) {
  return (
    <>
      {pages.map((node) => (
        <DocsTreeNode key={node.id} node={node} prefix={prefix} level={level} />
      ))}
    </>
  );
}

function DocsTreeNode({
  node,
  prefix,
  level,
}: {
  node: Cms.ContentItem;
  prefix: string;
  level: number;
}) {
  const url = `${prefix}/${node.slug}`;
  const label = node.label ?? node.title;
  const children = node.children ?? [];

  if (node.collapsible && children.length > 0) {
    return (
      <DocsCollapsibleNode
        node={node}
        label={label}
        prefix={prefix}
        level={level}
      >
        <DocsTree pages={children} prefix={prefix} level={level + 1} />
      </DocsCollapsibleNode>
    );
  }

  return (
    <li>
      <DocsSidebarLink url={url} label={label} level={level} />
      {children.length > 0 ? (
        <ul className="mt-0.5 flex flex-col gap-0.5">
          <DocsTree pages={children} prefix={prefix} level={level + 1} />
        </ul>
      ) : null}
    </li>
  );
}

function DocsCollapsibleNode({
  node,
  label,
  prefix,
  level,
  children,
}: {
  node: Cms.ContentItem;
  label: string;
  prefix: string;
  level: number;
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isChildActive = (node.children ?? []).some((child) =>
    isRouteActive(`${prefix}/${child.slug}`, pathname),
  );

  const [open, setOpen] = useState<boolean>(
    isChildActive ? true : !node.collapsed,
  );

  // Auto-open whenever an inner route becomes active (e.g. client-side nav).
  useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [isChildActive]);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          'group flex w-full items-center justify-between rounded-[--radius-enviro-sm] px-3 py-2 text-left text-sm font-medium text-[--color-enviro-fg-inverse-muted] transition-colors duration-200 hover:bg-white/[0.04] hover:text-[--color-enviro-fg-inverse]',
        )}
        style={{ paddingLeft: `${0.75 + level * 0.75}rem` }}
      >
        <span className="block max-w-full truncate">{label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-4 w-4 shrink-0 text-[--color-enviro-forest-300] transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open ? (
        <ul className="mt-0.5 flex flex-col gap-0.5">{children}</ul>
      ) : null}
    </li>
  );
}

function DocsSidebarLink({
  url,
  label,
  level,
}: {
  url: string;
  label: string;
  level: number;
}) {
  const pathname = usePathname();
  const isActive = isRouteActive(url, pathname);

  return (
    <Link
      href={url}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center rounded-[--radius-enviro-sm] py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-forest-300]/60',
        isActive
          ? 'bg-[--color-enviro-forest-300]/15 font-semibold text-[--color-enviro-fg-inverse]'
          : 'text-[--color-enviro-fg-inverse-muted] hover:bg-white/[0.04] hover:text-[--color-enviro-fg-inverse]',
      )}
      style={{ paddingLeft: `${0.75 + level * 0.75}rem`, paddingRight: '0.75rem' }}
    >
      <span className="block max-w-full truncate">{label}</span>
    </Link>
  );
}

export { SIDEBAR_WIDTH as ENVIRO_DOCS_SIDEBAR_WIDTH };
