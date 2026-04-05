'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface ChatContextValue {
  chatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setSidebarControl: (control: { setOpen: (open: boolean) => void }) => void;
  pendingPrompt: string | null;
  openChatWithPrompt: (prompt: string) => void;
  consumePrompt: () => string | null;
}

const ChatContext = createContext<ChatContextValue>({
  chatOpen: false,
  openChat: () => {},
  closeChat: () => {},
  toggleChat: () => {},
  setSidebarControl: () => {},
  pendingPrompt: null,
  openChatWithPrompt: () => {},
  consumePrompt: () => null,
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarControl, setSidebarControlState] = useState<{
    setOpen: (open: boolean) => void;
  } | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

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

  const openChatWithPrompt = useCallback(
    (prompt: string) => {
      setPendingPrompt(prompt);
      setChatOpen(true);
      sidebarControl?.setOpen(false);
    },
    [sidebarControl],
  );

  const consumePrompt = useCallback(() => {
    const p = pendingPrompt;
    setPendingPrompt(null);
    return p;
  }, [pendingPrompt]);

  const setSidebarControl = useCallback(
    (control: { setOpen: (open: boolean) => void }) => {
      setSidebarControlState(control);
    },
    [],
  );

  return (
    <ChatContext.Provider
      value={{
        chatOpen,
        openChat,
        closeChat,
        toggleChat,
        setSidebarControl,
        pendingPrompt,
        openChatWithPrompt,
        consumePrompt,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
