import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const IS_MOBILE_BUILD = process.env.NEXT_PUBLIC_MOBILE === 'true';

const INTERNAL_PACKAGES = [
  '@kit/ui',
  '@kit/auth',
  '@kit/accounts',
  '@kit/team-accounts',
  '@kit/shared',
  '@kit/supabase',
  '@kit/i18n',
];

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: INTERNAL_PACKAGES,
  ...(IS_MOBILE_BUILD
    ? {
        output: 'export',
        distDir: 'out',
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {
        images: {
          remotePatterns: [
            { protocol: 'https', hostname: 'fnlenvefzwlncgorsmib.supabase.co' },
          ],
        },
      }),
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default withNextIntl(config);
