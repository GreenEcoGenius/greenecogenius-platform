'use client';

import { Menu } from 'lucide-react';

import { useSidebar } from '@kit/ui/sidebar';

export function MobileSidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="text-foreground hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center"
      aria-label="Menu"
    >
      <Menu className="h-7 w-7" strokeWidth={1.5} />
    </button>
  );
}
