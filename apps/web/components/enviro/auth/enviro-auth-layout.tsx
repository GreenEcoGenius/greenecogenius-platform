import type { ReactNode } from 'react';

import { cn } from '@kit/ui/utils';

interface EnviroAuthLayoutProps {
  /**
   * Hero block rendered on the right side of the desktop split-screen and
   * as a compressed banner-top on mobile. Typically `<EnviroAuthHero />`.
   */
  hero: ReactNode;
  /** Form content (heading + kit auth container + footer link). */
  children: ReactNode;
  /** Forwarded for layout overrides at the page level. */
  className?: string;
}

/**
 * Split-screen Enviro shell for the auth segment. Replaces the legacy
 * `AuthLayoutShell` from `@kit/auth/shared` (which is a centred card on a
 * frosted background). Owns no auth logic: the kit containers
 * (SignInMethodsContainer, SignUpMethodsContainer, etc.) render exactly the
 * same way inside `children`, only the surrounding chrome changes.
 *
 * Responsive behaviour:
 *   - lg (>= 1024 px): 50/50 grid, form left, hero right.
 *   - md (>= 768 px): 60/40 grid, form left, hero right.
 *   - mobile: stack vertical, hero compressed to a banner-top, form below.
 *
 * Accessibility: full viewport scroll on mobile, only the form column
 * scrolls on desktop so the hero stays anchored.
 */
export function EnviroAuthLayout({
  hero,
  children,
  className,
}: EnviroAuthLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-dvh bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-sans)]',
        className,
      )}
    >
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <main className="order-2 flex min-h-[60dvh] flex-col items-stretch justify-center px-4 py-10 md:px-8 md:py-14 lg:order-1 lg:min-h-dvh lg:overflow-y-auto lg:px-12 lg:py-16">
          <div className="mx-auto flex w-full max-w-[26rem] flex-col gap-6 md:max-w-md">
            {children}
          </div>
        </main>

        <div className="order-1 lg:order-2 lg:sticky lg:top-0 lg:h-dvh">
          {hero}
        </div>
      </div>
    </div>
  );
}
