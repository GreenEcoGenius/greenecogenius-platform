'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase-client';

export interface AuthState {
  /** Current authenticated user (null if not logged in) */
  user: User | null;
  /** Current session (null if not logged in) */
  session: Session | null;
  /** True while the initial session check is in progress */
  loading: boolean;
  /** True if the user is authenticated */
  isAuthenticated: boolean;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Force-refresh the session from the server */
  refreshSession: () => Promise<void>;
}

/**
 * Centralised auth hook that provides consistent session state
 * across the entire mobile app.
 *
 * Uses `getSession()` for fast initial hydration (reads local cache),
 * then subscribes to `onAuthStateChange` for real-time updates.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Fast initial hydration from local cache
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    // Subscribe to auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, s: Session | null) => {
        if (!mounted) return;
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const { data } = await supabase.auth.refreshSession();
    setSession(data.session);
    setUser(data.session?.user ?? null);
  }, []);

  const isAuthenticated = useMemo(() => !!session?.access_token, [session]);

  return { user, session, loading, isAuthenticated, signOut, refreshSession };
}
