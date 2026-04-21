import { ShieldCheck } from 'lucide-react';

import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EnviroFooter, EnviroNavbar } from '~/components/enviro';
import { AppLogo } from '~/components/app-logo';
import appConfig from '~/config/app.config';

import { FooterNewsletterForm } from './_components/footer-newsletter-form';
import { SiteNavbarCtas } from './_components/site-navbar-ctas';

/**
 * Marketing layout shell for the public segment of the platform.
 *
 * Wraps every `/(marketing)` page in:
 *  - `EnviroNavbar` (sticky, cream tone, with auth-aware CTAs)
 *  - `EnviroFooter` (forest tone, 3 link columns + inline newsletter)
 *
 * Logic preserved from the previous shell:
 *  - `requireUser` on the server to detect the auth state.
 *  - The user is forwarded to the auth-aware CTAs that decide between
 *    Sign in / Sign up / Dashboard.
 *  - The page chrome (RootProviders, Toaster, CookieBanner, fonts,
 *    analytics, i18n) lives one layer up in `apps/web/app/[locale]/layout.tsx`
 *    and is intentionally untouched.
 */
async function SiteLayout({ children }: React.PropsWithChildren) {
  const client = getSupabaseServerClient();
  const user = await requireUser(client, { verifyMfa: false });

  const t = await getTranslations('marketing');
  const tCommon = await getTranslations('common');

  // 7 menu items + the logo home link = 8 navigation entry points.
  // Order is locked per Phase 5 spec: about, solutions, explorer,
  // normes, blog (Actualités), pricing, contact.
  const links = [
    { href: '/about', label: t('about') },
    { href: '/solutions', label: t('solutions') },
    { href: '/explorer', label: t('explorerNav') },
    { href: '/normes', label: t('normes') },
    { href: '/blog', label: t('blog') },
    { href: '/pricing', label: t('pricing') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <div className="flex min-h-[100vh] flex-col overflow-x-hidden bg-[--color-enviro-cream-50]">
      <EnviroNavbar
        brand={
          <AppLogo
            href="/"
            label={appConfig.name}
            className="h-10 w-auto invert brightness-0 md:h-12"
          />
        }
        links={links}
        tone="forest"
        sticky
        showLocaleSwitcher
        ctaSecondary={<SiteNavbarCtas user={user.data} slot="secondary" />}
        ctaPrimary={<SiteNavbarCtas user={user.data} slot="primary" />}
        mobileMenuLabel={tCommon('openMenu')}
        closeMenuLabel={tCommon('closeMenu')}
      />

      <main className="flex-1">{children}</main>

      <EnviroFooter
        brand={
          <AppLogo
            href="/"
            label={appConfig.name}
            className="h-12 w-auto invert brightness-0"
          />
        }
        description={t('footerDescription')}
        sections={[
          {
            heading: t('about'),
            links: [
              { href: '/about', label: t('about') },
              { href: '/solutions', label: t('solutions') },
              { href: '/normes', label: t('normes') },
              { href: '/contact', label: t('contact') },
            ],
          },
          {
            heading: t('product'),
            links: [
              { href: '/explorer', label: t('explorerNav') },
              { href: '/pricing', label: t('pricing') },
              { href: '/faq', label: t('faq') },
              { href: '/blog', label: t('blog') },
              { href: '/changelog', label: t('changelog') },
            ],
          },
          {
            heading: t('legal'),
            links: [
              { href: '/terms-of-service', label: t('termsOfService') },
              { href: '/privacy-policy', label: t('privacyPolicy') },
              { href: '/cookie-policy', label: t('cookiePolicy') },
            ],
          },
        ]}
        newsletter={<FooterNewsletterForm />}
        copyright={
          <span className="flex flex-wrap items-center gap-3">
            <span>
              {t('copyright', {
                product: appConfig.name,
                year: new Date().getFullYear(),
              })}
            </span>
            <span
              aria-hidden="true"
              className="hidden text-[--color-enviro-forest-700] md:inline"
            >
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck
                className="h-3.5 w-3.5 text-[--color-enviro-lime-300]"
                strokeWidth={1.5}
              />
              {t('footerSecurityBadge')}
            </span>
          </span>
        }
        tone="forest"
      />
    </div>
  );
}

export default SiteLayout;
