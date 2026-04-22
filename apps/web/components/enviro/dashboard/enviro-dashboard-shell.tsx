'use client';

import type { ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

import { useEnviroSidebar } from './enviro-sidebar-context';
import {
  ENVIRO_SIDEBAR_WIDTH_COLLAPSED,
  ENVIRO_SIDEBAR_WIDTH_EXPANDED,
} from './enviro-sidebar';

interface EnviroDashboardShellProps {
  /** Sidebar node (typically `<EnviroSidebar />`). */
  sidebar: ReactNode;
  /** Topbar node (typically `<EnviroDashboardTopbar />`). */
  topbar: ReactNode;
  /** Page content. */
  children: ReactNode;
  /**
   * Right-side overlay area. Phase 6.1.1 will pass the existing
   * `<GlobalAIAssistant />` slot here so the Genius drawer keeps its
   * historical behaviour without ChatProvider wiring leaking into this
   * shell. Optional in the preview page.
   */
  rightDrawer?: ReactNode;
  /** Forwarded for layout overrides. */
  className?: string;
}

/**
 * Top-level layout shell for the user dashboard. Pure presentation:
 *   - left rail offset adapts to the sidebar collapsed/expanded state;
 *   - main column scrolls independently from the sidebar;
 *   - right drawer is rendered as a sibling so it can overlay or push the
 *     content depending on `chatOpen` (handled by the existing
 *     `ChatAwareContent` Phase 5 component or its successor).
 *
 * IMPORTANT: this component owns NO chat / Genius logic. Phase 6.1.1 wires
 * `ChatProvider` + `SidebarChatBridge` + `<GlobalAIAssistant />` AROUND it
 * exactly like today, so `apps/web/components/ai/*` stay untouched.
 */
export function EnviroDashboardShell({
  sidebar,
  topbar,
  children,
  rightDrawer,
  className,
}: EnviroDashboardShellProps) {
  const { collapsed } = useEnviroSidebar();

  const sidebarOffset = collapsed
    ? ENVIRO_SIDEBAR_WIDTH_COLLAPSED
    : ENVIRO_SIDEBAR_WIDTH_EXPANDED;

  return (
    <div
      className={cn(
        'relative flex min-h-dvh w-full bg-[--color-enviro-bg] text-[--color-enviro-fg] font-[family-name:var(--font-enviro-sans)]',
        className,
      )}
    >
      {sidebar}

      <div
        data-enviro-shell-main
        className="flex min-h-dvh w-full flex-1 flex-col transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={
          {
            ['--enviro-sidebar-offset' as string]: sidebarOffset,
          } as React.CSSProperties
        }
      >
        <style>{`
          [data-enviro-shell-main] { padding-left: 0; }
          @media (min-width: 1024px) {
            [data-enviro-shell-main] { padding-left: var(--enviro-sidebar-offset, 0); }
          }
        `}</style>

        {topbar}

        <main data-scroll-root className="relative flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

      {rightDrawer}
    </div>
  );
}
