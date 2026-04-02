'use client';

import { useEffect } from 'react';

import { useSidebar } from '@kit/ui/sidebar';

import { useChat } from './chat-context';

/**
 * Invisible component that bridges the sidebar's setOpen
 * to the chat context so the chat can collapse the sidebar.
 */
export function SidebarChatBridge() {
  const { setOpen } = useSidebar();
  const { setSidebarControl } = useChat();

  useEffect(() => {
    setSidebarControl({ setOpen });
  }, [setOpen, setSidebarControl]);

  return null;
}
