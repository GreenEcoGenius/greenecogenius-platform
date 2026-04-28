import 'server-only';

import { NextResponse } from 'next/server';

/**
 * In-memory rate limiter for API routes.
 *
 * Uses a sliding-window counter stored in a Map.  This works for
 * single-instance deployments (Vercel serverless functions share the
 * same process for warm invocations).  For multi-region / multi-instance
 * setups, replace with Upstash Redis (`@upstash/ratelimit`).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Garbage-collect expired entries every 60 s
const GC_INTERVAL_MS = 60_000;

let lastGc = Date.now();

function gc() {
  const now = Date.now();

  if (now - lastGc < GC_INTERVAL_MS) return;

  lastGc = now;

  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window. */
  maxRequests: number;
  /** Window duration in seconds. */
  windowSeconds: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 20,
  windowSeconds: 60,
};

/**
 * AI-specific rate limit: stricter because each call costs money.
 */
export const AI_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowSeconds: 60,
};

/**
 * Export / heavy computation rate limit.
 */
export const EXPORT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowSeconds: 60,
};

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check whether a request identified by `key` is within the rate limit.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG,
): RateLimitResult {
  gc();

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });

    return { success: true, remaining: config.maxRequests - 1, resetAt: now + windowMs };
  }

  entry.count += 1;

  if (entry.count > config.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Helper that returns a 429 response when the limit is exceeded.
 * Call at the top of any route handler:
 *
 * ```ts
 * const limited = applyRateLimit(req, AI_RATE_LIMIT);
 * if (limited) return limited;
 * ```
 */
export function applyRateLimit(
  req: Request,
  config: RateLimitConfig = DEFAULT_CONFIG,
): NextResponse | null {
  // Use forwarded IP or fallback to a generic key
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'anonymous';
  const url = new URL(req.url);
  const key = `${ip}:${url.pathname}`;

  const result = checkRateLimit(key, config);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(config.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
        },
      },
    );
  }

  return null;
}
