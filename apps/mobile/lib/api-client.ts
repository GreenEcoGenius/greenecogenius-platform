import { Capacitor } from '@capacitor/core';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'https://www.greenecogenius.tech';

/** Default request timeout in milliseconds (15 seconds). */
const DEFAULT_TIMEOUT_MS = 15_000;

export function apiUrl(path: string): string {
  const isNative =
    typeof window !== 'undefined' && Capacitor.isNativePlatform();
  if (isNative || process.env.NEXT_PUBLIC_MOBILE === 'true') {
    return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  }
  return path;
}

/**
 * Typed API fetch wrapper with:
 * - Automatic Bearer token injection from Supabase session
 * - Request timeout (default 15s) to avoid hanging requests on poor networks
 * - Structured error messages
 */
export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const { supabase } = await import('./supabase-client');
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const controller = new AbortController();
  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(apiUrl(path), {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
        ...init?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(
        `API ${res.status}: ${res.statusText}${body ? ` — ${body.slice(0, 200)}` : ''}`,
      );
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`Requête expirée après ${timeoutMs / 1000}s (${path})`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
