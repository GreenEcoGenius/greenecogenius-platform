'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Globe } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import {
  detectInitialLocale,
  setLocale,
  SUPPORTED_LOCALES,
  type Locale,
} from '~/lib/locale';

const labels: Record<Locale, { native: string; english: string; flag: string }> = {
  fr: { native: 'Français', english: 'French', flag: '🇫🇷' },
  en: { native: 'English', english: 'English', flag: '🇬🇧' },
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
    <AppShell title="Langue" subtitle="Choisissez votre langue" showBack hideTabBar>
      <div className="space-y-4 pb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8D4E3]/10 mx-auto mb-2">
          <Globe className="h-6 w-6 text-[#B8D4E3]" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04]">
          {SUPPORTED_LOCALES.map((locale, i) => (
            <button
              key={locale}
              onClick={() => handleSelect(locale)}
              className={`flex w-full items-center justify-between px-4 py-4 text-left active:bg-[#F5F5F0]/[0.04] transition-colors ${
                i > 0 ? 'border-t border-[#F5F5F0]/[0.06]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[20px]">{labels[locale].flag}</span>
                <div>
                  <p className="text-[14px] font-medium text-[#F5F5F0]">
                    {labels[locale].native}
                  </p>
                  <p className="text-[12px] text-[#F5F5F0]/40">{labels[locale].english}</p>
                </div>
              </div>
              {current === locale && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B8D4E3]/15">
                  <Check className="h-4 w-4 text-[#B8D4E3]" />
                </div>
              )}
            </button>
          ))}
        </div>

        <p className="px-2 text-center text-[12px] text-[#F5F5F0]/30 leading-relaxed">
          L&apos;application redémarrera automatiquement après le changement de langue.
        </p>
      </div>
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
