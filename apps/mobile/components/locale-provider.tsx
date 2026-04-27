'use client';

import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { detectInitialLocale, type Locale } from '~/lib/locale';

import frMessages from '~/i18n/messages/fr.json';
import enMessages from '~/i18n/messages/en.json';

const messagesByLocale: Record<Locale, Record<string, unknown>> = {
  fr: frMessages,
  en: enMessages,
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    detectInitialLocale().then((detected) => {
      setLocaleState(detected);
      setReady(true);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = detected;
      }
    });
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A2F1F]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F5F5F0] border-t-transparent" />
      </div>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}
