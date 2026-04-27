import { getRequestConfig } from 'next-intl/server';

export const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

export default getRequestConfig(async () => {
  const locale: Locale =
    (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale) || DEFAULT_LOCALE;
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
