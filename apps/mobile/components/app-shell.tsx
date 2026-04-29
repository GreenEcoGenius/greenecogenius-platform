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
  /** If true, content area has no horizontal padding (for full-bleed layouts) */
  noPadding?: boolean;
  /** Optional header background — defaults to transparent for scroll-under effect */
  headerOpaque?: boolean;
  /** Optional logo URL to show before the title */
  logoUrl?: string;
}
export function AppShell({
  title,
  subtitle,
  showBack = false,
  rightAction,
  children,
  hideTabBar = false,
  noPadding = false,
  headerOpaque = true,
  logoUrl,
}: AppShellProps) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 flex flex-col bg-[#0A2F1F] overflow-hidden">
      {/* ── Header ── */}
      <header
        className={`shrink-0 z-30 ${
          headerOpaque
            ? 'bg-[#0A2F1F] border-b border-[#F5F5F0]/[0.06]'
            : 'bg-[#0A2F1F]/80 backdrop-blur-xl'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between gap-2 px-4 h-[100px]">
          <div className="flex flex-1 items-center gap-1.5 min-w-0">
            {showBack && (
              <button
                onClick={() => router.back()}
                className="-ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#F5F5F0]/80 active:bg-[#F5F5F0]/10 transition-colors"
                aria-label="Retour"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-[96px] w-auto shrink-0 object-contain"
              />
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[17px] font-semibold text-[#F5F5F0] leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="truncate text-[11px] text-[#F5F5F0]/50 leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {rightAction && <div className="shrink-0">{rightAction}</div>}
        </div>
      </header>
      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className={`animate-fade-in ${noPadding ? '' : 'px-4 pt-3 pb-2'}`}>
          {children}
        </div>
      </main>
      {/* ── Tab Bar ── */}
      {!hideTabBar && (
        <div className="shrink-0">
          <TabBar />
        </div>
      )}
    </div>
  );
}
