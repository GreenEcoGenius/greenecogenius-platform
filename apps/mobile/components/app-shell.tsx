'use client';

import { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TabBar } from './tab-bar';

interface AppShellProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: ReactNode;
  children: ReactNode;
  hideTabBar?: boolean;
}

export function AppShell({
  title,
  subtitle,
  showBack = false,
  rightAction,
  children,
  hideTabBar = false,
}: AppShellProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#0A2F1F]">
      <header className="sticky top-0 z-40 border-b border-[#F5F5F0]/10 bg-[#0A2F1F]/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-1 items-center gap-2 min-w-0">
            {showBack && (
              <button
                onClick={() => router.back()}
                className="-ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#F5F5F0] active:bg-[#F5F5F0]/10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-[#F5F5F0]">{title}</h1>
              {subtitle && (
                <p className="truncate text-xs text-[#F5F5F0]/60">{subtitle}</p>
              )}
            </div>
          </div>
          {rightAction && <div className="shrink-0">{rightAction}</div>}
        </div>
      </header>

      <main className={`flex-1 ${hideTabBar ? '' : 'pb-24'}`}>
        <div className="animate-fade-in px-4 py-4">{children}</div>
      </main>

      {!hideTabBar && <TabBar />}
    </div>
  );
}
