'use client';

import { Bell, Globe, Menu, Search, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@kit/i18n/navigation';
import { useSidebar } from '@kit/ui/sidebar';
import { cn } from '@kit/ui/utils';

import { AppLogo } from '~/components/app-logo';

import { useChat } from '../ai/chat-context';

export function AppHeader() {
  const { chatOpen, toggleChat } = useChat();

  return (
    <header className="border-metal-chrome fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b bg-white px-3 lg:px-5">
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-2">
        <div className="lg:hidden">
          <MobileMenuButton />
        </div>
        <AppLogo href="/" className="h-14 w-auto lg:h-12" />
      </div>

      {/* Right: search + genius + locale + notifications */}
      <div className="flex items-center gap-1.5">
        {/* Search (desktop only) */}
        <button
          type="button"
          className="border-metal-silver bg-metal-50 text-metal-steel hover:border-metal-400 hidden items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-colors md:flex"
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
            'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
            chatOpen
              ? 'bg-primary text-white'
              : 'text-metal-600 hover:bg-metal-frost',
          )}
          aria-label="Genius"
          title="Genius"
        >
          <Sparkles className="h-4 w-4" />
        </button>

        {/* Language toggle */}
        <LocaleToggle />

        {/* Notifications */}
        <button
          type="button"
          className="text-metal-600 hover:bg-metal-frost flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function LocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    const next = locale === 'fr' ? 'en' : 'fr';
    router.push(pathname, { locale: next });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-metal-600 hover:bg-metal-frost flex h-9 items-center gap-1 rounded-xl px-2 text-xs font-semibold uppercase transition-colors"
      aria-label="Changer de langue"
      title="Changer de langue"
    >
      <Globe className="h-3.5 w-3.5" />
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
      className="text-metal-700 hover:bg-metal-frost flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
      aria-label="Menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
