import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { CapacitorInit } from '~/components/capacitor-init';
import { LocaleProvider } from '~/components/locale-provider';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-[#0A2F1F] text-[#F5F5F0] antialiased">
        <CapacitorInit />
        <LocaleProvider>
          <div className="min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            {children}
          </div>
          <Toaster theme="dark" position="top-center" richColors />
        </LocaleProvider>
      </body>
    </html>
  );
}
