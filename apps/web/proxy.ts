import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import createNextIntlMiddleware from 'next-intl/middleware';

import { isSuperAdmin } from '@kit/admin';
import { routing } from '@kit/i18n/routing';
import { getSafeRedirectPath } from '@kit/shared/utils';
import { checkRequiresMultiFactorAuthentication } from '@kit/supabase/check-requires-mfa';
import { createMiddlewareClient } from '@kit/supabase/middleware-client';

import pathsConfig from '~/config/paths.config';

const NEXT_ACTION_HEADER = 'next-action';
const LOCALE_COOKIE = 'NEXT_LOCALE';

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|locales|assets|api/*).*)'],
};

// create i18n middleware once at module scope
const handleI18nRouting = createNextIntlMiddleware(routing);

const getUser = async (request: NextRequest, response: NextResponse) => {
  const supabase = createMiddlewareClient(request, response);

  try {
    const result = await supabase.auth.getClaims();
    return result;
  } catch {
    // If getClaims fails (e.g. network error, invalid JWT), treat as logged out
    return { data: null, error: new Error('Failed to get claims') };
  }
};

/**
 * Verify that the user's session can actually be refreshed.
 * This catches the case where JWT is still valid but refresh token is revoked.
 */
const verifySessionIsValid = async (
  request: NextRequest,
  response: NextResponse,
) => {
  const supabase = createMiddlewareClient(request, response);

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Detect preferred locale from Vercel geo header.
 * France = fr, everywhere else = en.
 */
function detectLocaleFromGeo(request: NextRequest): string {
  const country = request.headers.get('x-vercel-ip-country');
  return country === 'FR' ? 'fr' : 'en';
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const strippedPath = pathname.replace(/^\/(fr|en)/, '');

  const hasLocaleCookie = request.cookies.has(LOCALE_COOKIE);

  if (!hasLocaleCookie) {
    const geoLocale = detectLocaleFromGeo(request);
    request.cookies.set(LOCALE_COOKIE, geoLocale);
  }

  // run next-intl middleware to get the i18n-aware response
  let response = handleI18nRouting(request);

  // Auth callback/confirm paths must never be visibly redirected — the extra
  // round-trip can cause mobile browsers to drop the PKCE code-verifier cookie
  // or session cookies.  Convert the redirect to an internal rewrite so the
  // route handler runs in the same request cycle (identical to default-locale).
  const isAuthExchange =
    strippedPath.startsWith('/auth/callback') ||
    strippedPath.startsWith('/auth/confirm');

  if (isAuthExchange && response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location');

    if (location) {
      const target = new URL(location, request.url);
      const rewrite = NextResponse.rewrite(target);

      for (const cookie of response.cookies.getAll()) {
        rewrite.cookies.set(cookie);
      }

      response = rewrite;
    }
  }

  if (!hasLocaleCookie) {
    const geoLocale = detectLocaleFromGeo(request);
    response.cookies.set(LOCALE_COOKIE, geoLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  // apply secure headers on top of the i18n response
  const secureHeadersResponse = await createResponseWithSecureHeaders(response);

  // set a unique request ID for each request
  // this helps us log and trace requests
  setRequestId(request);

  // handle patterns for specific routes
  const handlePattern = await matchUrlPattern(request.url);

  // if a pattern handler exists, call it
  if (handlePattern) {
    const patternHandlerResponse = await handlePattern(
      request,
      secureHeadersResponse,
    );

    // if a pattern handler returns a response, return it
    if (patternHandlerResponse) {
      return patternHandlerResponse;
    }
  }

  // append the action path to the request headers
  // which is useful for knowing the action path in server actions
  if (isServerAction(request)) {
    secureHeadersResponse.headers.set(
      'x-action-path',
      request.nextUrl.pathname,
    );
  }

  // if no pattern handler returned a response,
  // return the session response
  return secureHeadersResponse;
}

function isServerAction(request: NextRequest) {
  const headers = new Headers(request.headers);
  return headers.has(NEXT_ACTION_HEADER);
}

async function adminMiddleware(request: NextRequest, response: NextResponse) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  if (!isAdminPath) {
    return;
  }

  const { data, error } = await getUser(request, response);

  // If user is not logged in, redirect to sign in page.
  // This should never happen, but just in case.
  if (!data?.claims || error) {
    return NextResponse.redirect(
      new URL(pathsConfig.auth.signIn, request.nextUrl.origin).href,
    );
  }

  const client = createMiddlewareClient(request, response);
  const userIsSuperAdmin = await isSuperAdmin(client);

  // If user is not an admin, redirect to 404 page.
  if (!userIsSuperAdmin) {
    return NextResponse.redirect(new URL('/404', request.nextUrl.origin).href);
  }

  // in all other cases, return the response
  return response;
}

/**
 * Define URL patterns and their corresponding handlers.
 */
async function getPatterns() {
  let URLPattern = globalThis.URLPattern;

  if (!URLPattern) {
    const { URLPattern: polyfill } = await import('urlpattern-polyfill');
    URLPattern = polyfill as typeof URLPattern;
  }

  return [
    {
      pattern: new URLPattern({ pathname: '/admin/*?' }),
      handler: adminMiddleware,
    },
    {
      pattern: new URLPattern({ pathname: '/auth/*?' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        const strippedPath = req.nextUrl.pathname.replace(/^\/(fr|en)/, '');

        // CRITICAL FIX: Never intercept /auth/callback or /auth/confirm routes.
        // These are the OAuth return endpoints that must complete the PKCE flow.
        // Intercepting them causes the code exchange to fail, sending users
        // back to the homepage instead of completing sign-in.
        if (
          strippedPath.startsWith('/auth/callback') ||
          strippedPath.startsWith('/auth/confirm')
        ) {
          return;
        }

        const { data } = await getUser(req, res);

        // the user is logged out, so we don't need to do anything
        if (!data?.claims) {
          return;
        }

        // FIX: Before redirecting an "authenticated" user away from /auth/sign-in,
        // verify that their session is actually valid (refresh token works).
        // This prevents the redirect loop when JWT is valid but refresh token is revoked.
        const sessionValid = await verifySessionIsValid(req, res);

        if (!sessionValid) {
          // Session is stale — clear the auth cookies and let the user
          // proceed to the sign-in page as if they were logged out.
          const signInResponse = NextResponse.next();

          // Delete all Supabase auth cookies to clear the stale session
          for (const cookie of req.cookies.getAll()) {
            if (
              cookie.name.startsWith('sb-') ||
              cookie.name.includes('supabase')
            ) {
              signInResponse.cookies.delete(cookie.name);
            }
          }

          return;
        }

        // check if we need to verify MFA (user is authenticated but needs to verify MFA)
        const isVerifyMfa = req.nextUrl.pathname === pathsConfig.auth.verifyMfa;

        // If user is logged in and does not need to verify MFA,
        // redirect to home page.
        if (!isVerifyMfa) {
          const nextPath = getSafeRedirectPath(
            req.nextUrl.searchParams.get('next'),
            pathsConfig.app.home,
          );

          return NextResponse.redirect(
            new URL(nextPath, req.nextUrl.origin).href,
          );
        }
      },
    },
    {
      pattern: new URLPattern({ pathname: '/home/*?' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        const { data } = await getUser(req, res);
        const { origin, pathname: next } = req.nextUrl;

        // If user is not logged in, redirect to sign in page.
        if (!data?.claims) {
          const signIn = pathsConfig.auth.signIn;
          const redirectPath = `${signIn}?next=${next}`;

          return NextResponse.redirect(new URL(redirectPath, origin).href);
        }

        // FIX: Also verify the session is valid for /home routes.
        // If the refresh token is dead, redirect to sign-in and clear cookies.
        const sessionValid = await verifySessionIsValid(req, res);

        if (!sessionValid) {
          const signIn = pathsConfig.auth.signIn;
          const redirectPath = `${signIn}?next=${next}`;
          const redirectResponse = NextResponse.redirect(
            new URL(redirectPath, origin).href,
          );

          // Clear stale auth cookies
          for (const cookie of req.cookies.getAll()) {
            if (
              cookie.name.startsWith('sb-') ||
              cookie.name.includes('supabase')
            ) {
              redirectResponse.cookies.delete(cookie.name);
            }
          }

          return redirectResponse;
        }

        const supabase = createMiddlewareClient(req, res);

        const requiresMultiFactorAuthentication =
          await checkRequiresMultiFactorAuthentication(supabase);

        // If user requires multi-factor authentication, redirect to MFA page.
        if (requiresMultiFactorAuthentication) {
          return NextResponse.redirect(
            new URL(pathsConfig.auth.verifyMfa, origin).href,
          );
        }
      },
    },
  ];
}

/**
 * Match URL patterns to specific handlers.
 * @param url
 */
async function matchUrlPattern(url: string) {
  const patterns = await getPatterns();

  const input = url.split('?')[0] ?? url;

  for (const pattern of patterns) {
    const patternResult = pattern.pattern.exec(input);

    if (patternResult !== null && 'pathname' in patternResult) {
      return pattern.handler;
    }
  }

  const strippedInput = stripLocalePrefix(input) ?? input;

  if (strippedInput !== input) {
    for (const pattern of patterns) {
      const patternResult = pattern.pattern.exec(strippedInput);

      if (patternResult !== null && 'pathname' in patternResult) {
        return pattern.handler;
      }
    }
  }
}

function stripLocalePrefix(url: string): string {
  return url.replace(
    /^(https?:\/\/[^/]+)?\/(?:fr|en)(\/|$)/,
    '$1/$2',
  ) as string;
}

/**
 * Set a unique request ID for each request.
 * @param request
 */
function setRequestId(request: Request) {
  request.headers.set('x-correlation-id', crypto.randomUUID());
}

/**
 * @name createResponseWithSecureHeaders
 * @description Create a middleware with enhanced headers applied (if applied).
 * This is disabled by default. To enable set ENABLE_STRICT_CSP=true
 */
async function createResponseWithSecureHeaders(response: NextResponse) {
  const enableStrictCsp = process.env.ENABLE_STRICT_CSP ?? 'false';

  // we disable ENABLE_STRICT_CSP by default
  if (enableStrictCsp === 'false') {
    return response;
  }

  const { createCspResponse } = await import('./lib/create-csp-response');
  const cspResponse = await createCspResponse();

  // set the CSP headers on the i18n response
  if (cspResponse) {
    for (const [key, value] of cspResponse.headers.entries()) {
      response.headers.set(key, value);
    }
  }

  return response;
}
