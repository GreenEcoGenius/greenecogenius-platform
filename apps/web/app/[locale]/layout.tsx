import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { PublicEnvScript } from 'next-runtime-env';

import { routing } from '@kit/i18n/routing';
import { CookieBanner } from '@kit/ui/cookie-banner';
import { Toaster } from '@kit/ui/sonner';
import { cn } from '@kit/ui/utils';

import { CrispChat } from '~/components/crisp-chat';
import { RootProviders } from '~/components/root-providers';
import { getFontsClassName } from '~/lib/fonts';
import { generateRootMetadata } from '~/lib/root-metadata';
import { getRootTheme } from '~/lib/root-theme';

export const generateMetadata = () => {
  return generateRootMetadata();
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [theme, nonce, messages] = await Promise.all([
    getRootTheme(),
    getCspNonce(),
    getMessages({ locale }),
  ]);

  const className = getRootClassName(theme);

  return (
    <html lang={locale} className={className} suppressHydrationWarning>
      <head>
        <PublicEnvScript nonce={nonce} />
      </head>

      <body className="overflow-x-hidden max-w-[100vw]">
        <RootProviders
          theme={theme}
          locale={locale}
          nonce={nonce}
          messages={messages}
        >
          {children}

          <Toaster richColors={true} theme={theme} position="top-center" />

          <CookieBanner />

          <CrispChat />
        </RootProviders>
      </body>
    </html>
  );
}

function getRootClassName(theme: string) {
  const fontsClassName = getFontsClassName(theme);

  return cn(
    'bg-background min-h-screen antialiased overflow-x-hidden md:overscroll-y-none',
    fontsClassName,
  );
}

async function getCspNonce() {
  const headersStore = await headers();

  return headersStore.get('x-nonce') ?? undefined;
}
