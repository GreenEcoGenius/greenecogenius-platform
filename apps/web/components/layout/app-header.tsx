'use client';

import { Bell, Search, Sparkles } from 'lucide-react';

import { cn } from '@kit/ui/utils';

import { AppLogo } from '~/components/app-logo';

import { useChat } from '../ai/chat-context';

export function AppHeader() {
  const { chatOpen, toggleChat } = useChat();

  return (
    <header className="border-metal-chrome fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b bg-white px-4 lg:px-5">
      {/* Logo */}
      <div className="flex min-w-[140px] items-center">
        <AppLogo href="/home" className="h-10 w-auto" />
      </div>

      {/* Search bar (desktop) */}
      <div className="mx-4 hidden max-w-[480px] flex-1 md:block">
        <button
          type="button"
          className="border-metal-silver bg-metal-50 text-metal-steel hover:border-metal-400 flex w-full items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Rechercher...</span>
          <kbd className="border-metal-chrome text-metal-steel rounded border bg-white px-1.5 py-0.5 text-[11px]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Actions */}
      <div className="flex min-w-[140px] items-center justify-end gap-1">
        {/* Chat IA toggle */}
        <button
          type="button"
          onClick={toggleChat}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
            chatOpen
              ? 'bg-primary text-white'
              : 'text-metal-600 hover:bg-metal-frost',
          )}
          aria-label="Assistant IA"
          title="Assistant IA"
        >
          <Sparkles className="h-4 w-4" />
        </button>

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
