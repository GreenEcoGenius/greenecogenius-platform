'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface ChatContextValue {
  chatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setSidebarControl: (control: { setOpen: (open: boolean) => void }) => void;
}

const ChatContext = createContext<ChatContextValue>({
  chatOpen: false,
  openChat: () => {},
  closeChat: () => {},
  toggleChat: () => {},
  setSidebarControl: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarControl, setSidebarControlState] = useState<{
    setOpen: (open: boolean) => void;
  } | null>(null);

  const openChat = useCallback(() => {
    setChatOpen(true);
    sidebarControl?.setOpen(false);
  }, [sidebarControl]);

  const closeChat = useCallback(() => {
    setChatOpen(false);
    sidebarControl?.setOpen(true);
  }, [sidebarControl]);

  const toggleChat = useCallback(() => {
    setChatOpen((prev) => {
      const next = !prev;
      if (next) {
        sidebarControl?.setOpen(false);
      } else {
        sidebarControl?.setOpen(true);
      }
      return next;
    });
  }, [sidebarControl]);

  const setSidebarControl = useCallback(
    (control: { setOpen: (open: boolean) => void }) => {
      setSidebarControlState(control);
    },
    [],
  );

  return (
    <ChatContext.Provider
      value={{ chatOpen, openChat, closeChat, toggleChat, setSidebarControl }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
