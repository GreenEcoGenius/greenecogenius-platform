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
    <html lang="fr" className="dark" style={{ backgroundColor: '#0A2F1F' }}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className="min-h-screen bg-[#0A2F1F] text-[#F5F5F0] antialiased"
        style={{ backgroundColor: '#0A2F1F', margin: 0 }}
      >
        <CapacitorInit />
        <LocaleProvider>
          {children}
          <Toaster
            theme="dark"
            position="top-center"
            richColors
            toastOptions={{
              style: {
                background: '#1a3f2f',
                color: '#F5F5F0',
                border: '1px solid rgba(245,245,240,0.1)',
                borderRadius: '12px',
                fontSize: '13px',
              },
            }}
          />
        </LocaleProvider>
      </body>
    </html>
  );
}
