import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

// Create next-intl plugin with the request config path
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ENABLE_REACT_COMPILER = process.env.ENABLE_REACT_COMPILER === 'true';

const INTERNAL_PACKAGES = [
  '@kit/ui',
  '@kit/auth',
  '@kit/accounts',
  '@kit/admin',
  '@kit/team-accounts',
  '@kit/shared',
  '@kit/supabase',
  '@kit/i18n',
  '@kit/mailers',
  '@kit/billing-gateway',
  '@kit/email-templates',
  '@kit/database-webhooks',
  '@kit/cms',
  '@kit/monitoring',
  '@kit/next',
  '@kit/notifications',
];

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: INTERNAL_PACKAGES,
  images: getImagesConfig(),
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: [],
  // needed for supporting dynamic imports for local content
  outputFileTracingIncludes: {
    '/*': ['./content/**/*'],
  },
  redirects: getRedirects,
  rewrites: getRewrites,
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
    resolveAlias: getModulesAliases(),
  },
  devIndicators:
    process.env.NEXT_PUBLIC_CI === 'true'
      ? false
      : {
          position: 'bottom-right',
        },
  reactCompiler: ENABLE_REACT_COMPILER,
  experimental: {
    mdxRs: true,
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: [
      'recharts',
      'lucide-react',
      'date-fns',
      ...INTERNAL_PACKAGES,
    ],
  },
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  /** We already do linting and typechecking as separate tasks in CI */
  typescript: { ignoreBuildErrors: true },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(withNextIntl(config));

/** @returns {import('next').NextConfig['images']} */
function getImagesConfig() {
  const remotePatterns = [
    {
      protocol: 'https',
      hostname: 'fnlenvefzwlncgorsmib.supabase.co',
    },
  ];

  if (SUPABASE_URL) {
    const hostname = new URL(SUPABASE_URL).hostname;

    remotePatterns.push({
      protocol: 'https',
      hostname,
    });
  }

  if (IS_PRODUCTION) {
    return {
      remotePatterns,
    };
  }

  remotePatterns.push(
    ...[
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  );

  return {
    remotePatterns,
  };
}

async function getRedirects() {
  return [
    {
      source: '/server-sitemap.xml',
      destination: '/sitemap.xml',
      permanent: true,
    },
  ];
}

/**
 * Enviro template preview rewrites.
 *
 * Phase 2 of the Enviro adoption plan exposes the Webflow source under a
 * cleaner alias (`/preview/enviro`) so designers and reviewers can browse the
 * reference template alongside the Next.js implementation without leaving
 * the project. The actual files live untouched under `apps/web/public/enviro`.
 *
 * The alias is enabled in development and Vercel preview deployments, and
 * disabled in production by default. To force-disable it (or reactivate in
 * a specific Vercel deploy), set `NEXT_PUBLIC_ENABLE_ENVIRO_PREVIEW`.
 *
 * Phase 9 cleanup: revisit this block before merging to `main`. The plan is
 * either to remove it entirely once all Enviro pages are migrated, or to
 * keep it gated behind an explicit env var for ongoing internal review.
 */
function isEnviroPreviewEnabled() {
  const explicit = process.env.NEXT_PUBLIC_ENABLE_ENVIRO_PREVIEW;

  if (explicit === 'true') return true;
  if (explicit === 'false') return false;

  // Default: enabled everywhere except Vercel production.
  return process.env.VERCEL_ENV !== 'production';
}

/** @type {import('next').NextConfig['rewrites']} */
async function getRewrites() {
  if (!isEnviroPreviewEnabled()) {
    return [];
  }

  return [
    {
      source: '/preview/enviro',
      destination: '/enviro/index.html',
    },
    {
      source: '/preview/enviro/',
      destination: '/enviro/index.html',
    },
    {
      source: '/preview/enviro/:path*',
      destination: '/enviro/:path*',
    },
  ];
}

/**
 * @description Aliases modules based on the environment variables
 * This will speed up the development server by not loading the modules that are not needed
 * @returns {Record<string, string>}
 */
function getModulesAliases() {
  if (process.env.NODE_ENV !== 'development') {
    return {};
  }

  const monitoringProvider = process.env.NEXT_PUBLIC_MONITORING_PROVIDER;
  const billingProvider = process.env.NEXT_PUBLIC_BILLING_PROVIDER;
  const mailerProvider = process.env.MAILER_PROVIDER;
  const captchaProvider = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;

  // exclude the modules that are not needed
  const excludeSentry = monitoringProvider !== 'sentry';
  const excludeStripe = billingProvider !== 'stripe';
  const excludeNodemailer = mailerProvider !== 'nodemailer';
  const excludeTurnstile = !captchaProvider;

  /** @type {Record<string, string>} */
  const aliases = {};

  // the path to the noop module
  const noopPath = '~/lib/dev-mock-modules';

  if (excludeSentry) {
    aliases['@sentry/nextjs'] = noopPath;
  }

  if (excludeStripe) {
    aliases['stripe'] = noopPath;
    aliases['@stripe/stripe-js'] = noopPath;
  }

  if (excludeNodemailer) {
    aliases['nodemailer'] = noopPath;
  }

  if (excludeTurnstile) {
    aliases['@marsidev/react-turnstile'] = noopPath;
  }

  return aliases;
}
