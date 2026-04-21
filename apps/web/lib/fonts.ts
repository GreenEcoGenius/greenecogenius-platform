import { Inter, Plus_Jakarta_Sans as SansFont } from 'next/font/google';

import { cn } from '@kit/ui/utils';

const sans = SansFont({
  subsets: ['latin'],
  variable: '--font-sans-fallback',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
});

const heading = sans;

const enviroDisplay = Inter({
  subsets: ['latin'],
  variable: '--font-enviro-display',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const enviroSans = Inter({
  subsets: ['latin'],
  variable: '--font-enviro-sans',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export { sans, heading, enviroDisplay, enviroSans };

export function getFontsClassName(theme?: string) {
  const dark = theme === 'dark';
  const light = !dark;

  const font = [
    sans.variable,
    heading.variable,
    enviroDisplay.variable,
    enviroSans.variable,
  ].reduce<string[]>((acc, curr) => {
    if (acc.includes(curr)) return acc;

    return [...acc, curr];
  }, []);

  return cn(...font, {
    dark,
    light,
  });
}
