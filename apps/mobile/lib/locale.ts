'use client';

import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'gec.locale';
export const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export async function detectInitialLocale(): Promise<Locale> {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    if (isSupportedLocale(value)) return value;
  } catch {}

  if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
    try {
      const { Device } = await import('@capacitor/device');
      const info = await Device.getLanguageCode();
      const code = info.value?.split('-')[0]?.toLowerCase();
      if (isSupportedLocale(code)) return code;
    } catch {}
  }

  if (typeof navigator !== 'undefined') {
    const code = navigator.language?.split('-')[0]?.toLowerCase();
    if (isSupportedLocale(code)) return code;
  }

  return DEFAULT_LOCALE;
}

export async function setLocale(locale: Locale): Promise<void> {
  await Preferences.set({ key: STORAGE_KEY, value: locale });
}

export async function getLocale(): Promise<Locale | null> {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    return isSupportedLocale(value) ? value : null;
  } catch {
    return null;
  }
}
