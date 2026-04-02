'use client';

import { cn } from '@kit/ui/utils';

import { useChat } from '~/components/ai/chat-context';

export function TeamChatAwareContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chatOpen } = useChat();

  return (
    <div
      className={cn(
        'min-w-0 flex-1 transition-[margin] duration-300 ease-out',
        chatOpen && 'lg:mr-[380px]',
      )}
    >
      {children}
    </div>
  );
}
