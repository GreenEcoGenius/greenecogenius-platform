'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@kit/ui/utils';

import { useEnviroSidebar } from './enviro-sidebar-context';

interface EnviroSidebarNavItemProps {
  href: string;
  /** Already-translated label. */
  label: ReactNode;
  /** Icon node (lucide-react expected). */
  icon: ReactNode;
  /**
   * Optional regex string used to determine the active state. When omitted,
   * the item is active when the current pathname starts with `href`. The
   * regex is matched against the locale-stripped pathname (`/home/esg`,
   * not `/fr/home/esg`).
   */
  highlightMatch?: string;
  /** Optional badge displayed on the right (only when expanded). */
  badge?: ReactNode;
  /** Forwarded for layout overrides. */
  className?: string;
}

function matches(pathname: string, href: string, regex?: string): boolean {
  const stripped = pathname.replace(/^\/(fr|en)(?=\/|$)/, '') || '/';

  if (regex) {
    try {
      return new RegExp(regex).test(stripped);
    } catch {
      // Fallback to default matching when regex is invalid
    }
  }

  if (href === '/home') return stripped === '/home';
  return stripped === href || stripped.startsWith(`${href}/`);
}

/**
 * Single navigation item rendered inside `EnviroSidebar`. Active state
 * combines a left lime indicator + lime text colour + bold weight, mirroring
 * the Phase 6 design DNA. When the sidebar is collapsed, the label is
 * hidden and the icon stays centred. A hover tooltip would be added in a
 * follow-up if needed.
 */
export function EnviroSidebarNavItem({
  href,
  label,
  icon,
  highlightMatch,
  badge,
  className,
}: EnviroSidebarNavItemProps) {
  const pathname = usePathname();
  const { collapsed, setMobileOpen } = useEnviroSidebar();
  const active = matches(pathname, href, highlightMatch);

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={() => setMobileOpen(false)}
      title={collapsed ? undefined : undefined}
      className={cn(
        'group/nav-item relative flex items-center gap-3 rounded-[--radius-enviro-md] px-3 py-2 text-sm font-medium transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60',
        active
          ? 'bg-white/[0.06] text-[--color-enviro-lime-300]'
          : 'text-[--color-enviro-fg-inverse-muted] hover:bg-white/[0.04] hover:text-[--color-enviro-fg-inverse]',
        collapsed && 'justify-center px-2',
        className,
      )}
    >
      {active ? (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[--color-enviro-lime-300]"
        />
      ) : null}

      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4',
          active && 'text-[--color-enviro-lime-300]',
        )}
      >
        {icon}
      </span>

      {!collapsed ? (
        <span className="flex flex-1 items-center justify-between gap-2 truncate">
          <span className="truncate">{label}</span>
          {badge ? <span className="shrink-0">{badge}</span> : null}
        </span>
      ) : null}
    </Link>
  );
}
