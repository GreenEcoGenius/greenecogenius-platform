'use client';

import { createClient } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import type { SupportedStorage } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const isNative =
  typeof window !== 'undefined' && Capacitor.isNativePlatform();

/**
 * Secure native storage using @capacitor/preferences.
 *
 * On iOS, Capacitor Preferences uses UserDefaults by default.
 * For production, consider migrating to a Keychain-backed plugin
 * (e.g. capacitor-secure-storage-plugin) for enhanced token security.
 *
 * This implementation properly types the SupportedStorage interface
 * required by Supabase Auth.
 */
const nativeStorage: SupportedStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key });
    return value;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({ key, value });
  },
  removeItem: async (key: string): Promise<void> => {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.remove({ key });
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: isNative ? nativeStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: !isNative,
    flowType: 'pkce',
  },
});
