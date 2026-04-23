'use client';

import type { ReactNode } from 'react';

import { useEnviroSidebar } from '~/components/enviro/dashboard';

interface EnviroTeamSidebarBrandProps {
  /** WorkspaceDropdown (or any team switcher) rendered inline. */
  children: ReactNode;
}

/**
 * Brand block for the team account sidebar. Hosts the existing
 * `<WorkspaceDropdown />` so users can switch between personal account
 * and other team workspaces from the same place as before, but reframed
 * inside the forest-900 / lime-accent Enviro shell. The dropdown content
 * itself remains shadcn-styled (transient overlay, acceptable visual
 * impedance for Phase 7.4 minimum-viable migration).
 *
 * When the sidebar collapses, we render only the trigger (avatar) by
 * narrowing the slot. The WorkspaceDropdown internally adapts via its
 * own `useSidebar()` reading.
 */
export function EnviroTeamSidebarBrand({
  children,
}: EnviroTeamSidebarBrandProps) {
  const { collapsed } = useEnviroSidebar();

  return (
    <div
      data-collapsed={collapsed ? 'true' : 'false'}
      className="flex w-full min-w-0 items-center gap-2 text-[--color-enviro-fg-inverse] data-[collapsed=true]:justify-center"
    >
      {children}
    </div>
  );
}
