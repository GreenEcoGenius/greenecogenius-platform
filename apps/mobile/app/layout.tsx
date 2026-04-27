import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';
import '~/styles/globals.css';

export const metadata: Metadata = {
  title: 'GreenEcoGenius',
  description: 'Circular economy platform with blockchain traceability',
  applicationName: 'GreenEcoGenius',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GreenEcoGenius',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A2F1F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen safe-top safe-bottom bg-[#0A2F1F] text-[#F5F5F0]">
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster theme="dark" position="top-center" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
