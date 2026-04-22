'use client';

import { Menu } from 'lucide-react';

import { useEnviroDocsSidebar } from './enviro-docs-sidebar';

interface EnviroFloatingDocsNavButtonProps {
  /** Already-translated aria-label for the trigger. */
  ariaLabel: string;
}

/**
 * Mobile FAB that opens the docs sidebar drawer. Hidden on `lg` and up since
 * the rail is permanently visible on desktop. Lives in the bottom-right
 * corner with the standard Enviro pill+forest treatment used by floating
 * actions across the dashboard.
 */
export function EnviroFloatingDocsNavButton({
  ariaLabel,
}: EnviroFloatingDocsNavButtonProps) {
  const { openMobile } = useEnviroDocsSidebar();

  return (
    <button
      type="button"
      onClick={openMobile}
      aria-label={ariaLabel}
      className="fixed bottom-5 right-5 z-[--z-enviro-sticky] inline-flex h-14 w-14 items-center justify-center rounded-[--radius-enviro-pill] bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse] shadow-[--shadow-enviro-elevated] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-forest-300]/60 lg:hidden"
    >
      <Menu aria-hidden="true" className="h-6 w-6" />
    </button>
  );
}
