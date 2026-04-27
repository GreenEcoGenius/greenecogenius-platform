'use client';

import { ReactNode, useEffect } from 'react';
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

  // Ensure scanner body class is cleaned up on every page (defensive)
  useEffect(() => {
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0A2F1F] overflow-hidden">
      <header
        className="shrink-0 border-b border-[#F5F5F0]/10 bg-[#0A2F1F]"
        style={{ paddingTop: "max(8px, calc(env(safe-area-inset-top) - 18px))" }}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-1">
          <div className="flex flex-1 items-center gap-2 min-w-0">
            {showBack ? (
              <button
                onClick={() => router.back()}
                className="-ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#F5F5F0] active:bg-[#F5F5F0]/10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            ) : null}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-bold leading-tight text-[#F5F5F0]">{title}</h1>
              {subtitle ? (
                <p className="truncate text-[11px] leading-tight text-[#F5F5F0]/60">{subtitle}</p>
              ) : null}
            </div>
          </div>
          {rightAction ? <div className="shrink-0">{rightAction}</div> : null}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="animate-fade-in px-4 py-2">{children}</div>
      </main>

      {!hideTabBar ? (
        <div className="shrink-0">
          <TabBar />
        </div>
      ) : null}
    </div>
  );
}
