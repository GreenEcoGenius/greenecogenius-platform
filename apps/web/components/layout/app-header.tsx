'use client';

import { useEffect, useRef, useState } from 'react';

import { Globe, Menu, Search, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';

import { usePathname } from '@kit/i18n/navigation';
import { useSidebar } from '@kit/ui/sidebar';
import { cn } from '@kit/ui/utils';

import { AppLogo } from '~/components/app-logo';

import { useChat } from '../ai/chat-context';
import { useGlobalSearch } from './global-search';

export function AppHeader() {
  const { chatOpen, toggleChat } = useChat();
  const { openSearch } = useGlobalSearch();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Use capture phase to catch scroll events on any nested scroll container
    // (the dashboard uses an internal overflow-y-auto, not window scroll).
    const onScroll = (event: Event) => {
      const target = event.target;
      let currentY = 0;

      if (target instanceof Document) {
        currentY = window.scrollY;
      } else if (target instanceof HTMLElement) {
        currentY = target.scrollTop;
      } else {
        return;
      }

      if (currentY < 100) {
        setVisible(true);
      } else if (currentY < lastScrollY.current) {
        setVisible(true);
      } else if (currentY > lastScrollY.current) {
        setVisible(false);
      }

      lastScrollY.current = currentY;
    };

    document.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    });
    return () =>
      document.removeEventListener('scroll', onScroll, { capture: true });
  }, []);

  return (
    <header
      className={cn(
        'border-metal-chrome fixed top-0 right-0 left-0 z-50 flex h-20 items-center justify-between overflow-visible border-b bg-white/95 px-2 backdrop-blur-sm transition-transform duration-300 md:h-24 md:px-3 md:!translate-y-0 lg:px-5',
        visible ? 'translate-y-0' : '-translate-y-full',
      )}
    >
      {/* Left: logo only */}
      <div className="flex items-center">
        <AppLogo href="/" />
      </div>

      {/* Right: all actions grouped */}
      <div className="-mr-1 flex items-center gap-1 md:mr-0 md:gap-2">
        {/* Search (mobile icon) */}
        <button
          type="button"
          onClick={openSearch}
          className="text-metal-600 hover:bg-metal-frost flex h-11 w-11 items-center justify-center rounded-xl transition-colors md:hidden"
          aria-label="Rechercher"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Search (desktop expanded) */}
        <button
          type="button"
          onClick={openSearch}
          className="border-metal-silver bg-metal-50 text-metal-steel hover:border-metal-400 hidden items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors md:flex"
        >
          <Search className="h-4 w-4" />
          <span>Rechercher...</span>
          <kbd className="border-metal-chrome text-metal-steel ml-4 rounded border bg-white px-1.5 py-0.5 text-[11px]">
            ⌘K
          </kbd>
        </button>

        {/* Genius chat toggle */}
        <button
          type="button"
          onClick={toggleChat}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
            chatOpen
              ? 'bg-primary text-white'
              : 'text-metal-600 hover:bg-metal-frost',
          )}
          aria-label="Genius"
          title="Genius"
        >
          <Sparkles className="h-5 w-5" />
        </button>

        {/* Language toggle */}
        <LocaleToggle />

        {/* Sidebar hamburger (mobile only, last position) */}
        <MobileMenuButton />
      </div>
    </header>
  );
}

function LocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === 'fr' ? 'en' : 'fr';

    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    const currentPath = window.location.pathname;
    const stripped = currentPath.replace(/^\/(fr|en)(\/|$)/, '/');
    const newPath =
      next === 'en' ? stripped : `/${next}${stripped === '/' ? '' : stripped}`;

    window.location.href = newPath || '/';
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-metal-600 hover:bg-metal-frost flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold uppercase transition-colors"
      aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
      title={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <Globe className="h-4 w-4" />
      {locale === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}

function MobileMenuButton() {
  let toggleSidebar: (() => void) | undefined;

  try {
    const sidebar = useSidebar();
    toggleSidebar = sidebar.toggleSidebar;
  } catch {
    // Not inside a SidebarProvider (header layout)
  }

  if (!toggleSidebar) return null;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="text-metal-700 hover:bg-metal-frost flex h-11 w-11 items-center justify-center rounded-xl transition-colors lg:hidden"
      aria-label="Menu"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
