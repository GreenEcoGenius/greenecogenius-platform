'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import {
  detectInitialLocale,
  setLocale,
  SUPPORTED_LOCALES,
  type Locale,
} from '~/lib/locale';

const labels: Record<Locale, { native: string; english: string }> = {
  fr: { native: 'Français', english: 'French' },
  en: { native: 'English', english: 'English' },
};

function LanguageContent() {
  const router = useRouter();
  const [current, setCurrent] = useState<Locale | null>(null);

  useEffect(() => {
    detectInitialLocale().then(setCurrent);
  }, []);

  async function handleSelect(locale: Locale) {
    await setLocale(locale);
    setCurrent(locale);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  return (
    <AppShell title="Langue" subtitle="Choisissez votre langue" showBack>
      <div className="overflow-hidden rounded-2xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03]">
        {SUPPORTED_LOCALES.map((locale, i) => (
          <button
            key={locale}
            onClick={() => handleSelect(locale)}
            className={`flex w-full items-center justify-between px-4 py-3.5 text-left active:bg-[#F5F5F0]/5 ${
              i > 0 ? 'border-t border-[#F5F5F0]/10' : ''
            }`}
          >
            <div>
              <div className="text-sm font-medium text-[#F5F5F0]">
                {labels[locale].native}
              </div>
              <div className="text-xs text-[#F5F5F0]/50">{labels[locale].english}</div>
            </div>
            {current === locale && <Check className="h-5 w-5 text-[#B8D4E3]" />}
          </button>
        ))}
      </div>
      <p className="mt-4 px-2 text-xs text-[#F5F5F0]/40">
        L&apos;application redémarrera automatiquement après le changement.
      </p>
    </AppShell>
  );
}

export default function LanguagePage() {
  return (
    <AuthGuard>
      <LanguageContent />
    </AuthGuard>
  );
}
