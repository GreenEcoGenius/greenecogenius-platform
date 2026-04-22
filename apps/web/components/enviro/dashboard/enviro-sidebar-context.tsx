'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const SIDEBAR_COOKIE_NAME = 'enviro_sidebar_collapsed';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface EnviroSidebarContextValue {
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
  toggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: (next: boolean) => void;
}

const EnviroSidebarContext = createContext<EnviroSidebarContextValue | null>(
  null,
);

interface EnviroSidebarProviderProps {
  /**
   * Initial collapsed state. Pass the cookie-derived value from a Server
   * Component to keep SSR markup deterministic. Defaults to `false`
   * (sidebar OPEN by default at first login, per Phase 6 decision).
   */
  initialCollapsed?: boolean;
  children: React.ReactNode;
}

/**
 * Lightweight provider for the Enviro dashboard sidebar collapse state.
 *
 * Design choices:
 *   - Persisted in a non-HttpOnly cookie so a Server Component can read it
 *     and forward it as `initialCollapsed` for SSR-safe markup.
 *   - Independent from `@kit/ui/sidebar` because we want a sticky forest
 *     sidebar styling that the shadcn primitive does not expose; the kit
 *     primitive is still used for unrelated team-account flows.
 *   - Mobile drawer state is local to the client to avoid a full layout
 *     redraw on toggle.
 */
export function EnviroSidebarProvider({
  initialCollapsed = false,
  children,
}: EnviroSidebarProviderProps) {
  const [collapsed, setCollapsedState] = useState<boolean>(initialCollapsed);
  const [mobileOpen, setMobileOpenState] = useState<boolean>(false);

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    if (typeof document !== 'undefined') {
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next ? '1' : '0'}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  const setMobileOpen = useCallback((next: boolean) => {
    setMobileOpenState(next);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const value = useMemo<EnviroSidebarContextValue>(
    () => ({ collapsed, setCollapsed, toggle, mobileOpen, setMobileOpen }),
    [collapsed, setCollapsed, toggle, mobileOpen, setMobileOpen],
  );

  return (
    <EnviroSidebarContext.Provider value={value}>
      {children}
    </EnviroSidebarContext.Provider>
  );
}

export function useEnviroSidebar(): EnviroSidebarContextValue {
  const ctx = useContext(EnviroSidebarContext);

  if (!ctx) {
    throw new Error(
      'useEnviroSidebar must be used inside <EnviroSidebarProvider>',
    );
  }

  return ctx;
}

export { SIDEBAR_COOKIE_NAME as ENVIRO_SIDEBAR_COOKIE_NAME };
