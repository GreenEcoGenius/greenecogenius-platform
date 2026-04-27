import { Capacitor } from '@capacitor/core';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://www.greenecogenius.tech';

export function apiUrl(path: string): string {
  const isNative = typeof window !== 'undefined' && Capacitor.isNativePlatform();
  if (isNative || process.env.NEXT_PUBLIC_MOBILE === 'true') {
    return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  }
  return path;
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const { supabase } = await import('./supabase-client');
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      ...init?.headers,
    },
  });

  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}
