'use client';

import { useEffect, useRef, useState } from 'react';

import { Globe, Menu, Search, Sparkles } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { usePathname } from '@kit/i18n/navigation';
import { useSidebar } from '@kit/ui/sidebar';
import { cn } from '@kit/ui/utils';

import { AppLogo } from '~/components/app-logo';
import { useChat } from '../ai/chat-context';
import { useGlobalSearch } from './global-search';

export function AppHeader() {
  const t = useTranslations('common');
  const { chatOpen, toggleChat } = useChat();
  const { openSearch } = useGlobalSearch();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const LG_BREAKPOINT = 1024;

    const getScrollTarget = (): HTMLElement | Window => {
      if (window.innerWidth >= LG_BREAKPOINT) {
        const el = document.querySelector(
          '[data-scroll-root]',
        ) as HTMLElement | null;
        if (el) return el;
      }
      return window;
    };

    const readScrollY = (target: HTMLElement | Window): number => {
      return target instanceof HTMLElement ? target.scrollTop : window.scrollY;
    };

    let currentTarget = getScrollTarget();

    const onScroll = () => {
      const currentY = readScrollY(currentTarget);
      if (currentY < 100) {
        setVisible(true);
      } else if (currentY < lastScrollY.current) {
        setVisible(true);
      } else if (currentY > lastScrollY.current) {
        setVisible(false);
      }
      lastScrollY.current = currentY;
    };

    const onResize = () => {
      const newTarget = getScrollTarget();
      if (newTarget !== currentTarget) {
        currentTarget.removeEventListener('scroll', onScroll);
        currentTarget = newTarget;
        lastScrollY.current = readScrollY(currentTarget);
        currentTarget.addEventListener('scroll', onScroll, { passive: true });
      }
    };

    currentTarget.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      currentTarget.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 flex h-20 items-center justify-between overflow-visible border-b border-[#1A5C3E]/20 bg-[#0D3A26]/95 px-2 backdrop-blur-md transition-transform duration-300 md:h-24 md:px-3 md:!translate-y-0 lg:px-5',
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
          className="text-[#F5F5F0]/60 hover:bg-[#1A5C3E]/50 hover:text-emerald-400 flex h-11 w-11 items-center justify-center rounded-xl transition-colors md:hidden"
          aria-label={t('search.ariaLabel')}
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Search (desktop expanded) */}
        <button
          type="button"
          onClick={openSearch}
          className="border-[#1A5C3E]/40 bg-[#12472F]/50 text-[#F5F5F0]/50 hover:border-emerald-400/40 hidden items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors md:flex"
        >
          <Search className="h-4 w-4" />
          <span>{t('search.placeholder')}</span>
          <kbd className="border-[#1A5C3E]/40 text-[#F5F5F0]/40 ml-4 rounded border bg-[#0D3A26] px-1.5 py-0.5 text-[11px]">
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
              ? 'bg-emerald-400 text-[#0D3A26]'
              : 'text-[#F5F5F0]/60 hover:bg-[#1A5C3E]/50 hover:text-emerald-400',
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
  const t = useTranslations('common');

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
      className="text-[#F5F5F0]/60 hover:bg-[#1A5C3E]/50 hover:text-emerald-400 flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold uppercase transition-colors"
      aria-label={
        locale === 'fr'
          ? t('locale.switchToEnglish')
          : t('locale.switchToFrench')
      }
      title={
        locale === 'fr'
          ? t('locale.switchToEnglish')
          : t('locale.switchToFrench')
      }
    >
      <Globe className="h-4 w-4" />
      {locale === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}

function MobileMenuButton() {
  const t = useTranslations('common');

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
      className="text-[#F5F5F0]/70 hover:bg-[#1A5C3E]/50 hover:text-emerald-400 flex h-11 w-11 items-center justify-center rounded-xl transition-colors lg:hidden"
      aria-label={t('menu')}
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
