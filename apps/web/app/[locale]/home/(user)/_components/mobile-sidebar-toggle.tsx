'use client';

import { Menu } from 'lucide-react';

import { useSidebar } from '@kit/ui/sidebar';

export function MobileSidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="text-foreground hover:text-primary h-8 w-8 cursor-pointer"
      aria-label="Menu"
    >
      <Menu className="h-6 w-6" strokeWidth={1.5} />
    </button>
  );
}
