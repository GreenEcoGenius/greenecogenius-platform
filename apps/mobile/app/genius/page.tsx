'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Send,
  Square,
  Sparkles,
  Trash2,
  Leaf,
  Recycle,
  FileText,
  ShieldCheck,
  Award,
  Scale,
} from 'lucide-react';

import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';
import {
  streamGenius,
  type AgentType,
  type GeniusMessage,
} from '~/lib/genius-stream';

type ChatMessage = GeniusMessage & {
  id: string;
  agent?: AgentType | null;
  partial?: boolean;
  errored?: boolean;
};

const AGENT_ICONS: Record<AgentType, React.ComponentType<{ className?: string }>> = {
  comptoir: Recycle,
  carbon: Leaf,
  esg: FileText,
  traceability: ShieldCheck,
  rse: Award,
  compliance: Scale,
};

export default function GeniusPage() {
  return (
    <AuthGuard>
      <GeniusChat />
    </AuthGuard>
  );
}

function GeniusChat() {
  const t = useTranslations('genius');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Cleanup abort on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
      setInput('');

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
      };

      const assistantId = `a-${Date.now() + 1}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        partial: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        // Build history excluding the placeholder we just added
        const history: GeniusMessage[] = messages
          .filter((m) => !m.errored && !m.partial)
          .map(({ role, content }) => ({ role, content }));

        const { agent } = await streamGenius({
          message: trimmed,
          history,
          locale,
          signal: ctrl.signal,
          onChunk: (chunk) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + chunk }
                  : m,
              ),
            );
          },
        });

        // Mark as final
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, partial: false, agent } : m,
          ),
        );
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // User pressed stop. Keep what we have but mark non-partial.
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, partial: false } : m,
            ),
          );
          return;
        }

        const msg = (err as Error).message;
        let userFacing = t('errorGeneric');
        if (msg === 'not_authenticated' || msg.includes('Invalid or expired')) {
          userFacing = t('errorAuth');
        } else if (msg.toLowerCase().includes('network')) {
          userFacing = t('errorOffline');
        }

        setError(userFacing);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, partial: false, errored: true, content: userFacing }
              : m,
          ),
        );

        if (msg === 'not_authenticated') {
          // Redirect to sign-in after a brief delay so user reads the message
          setTimeout(() => router.replace('/auth/sign-in'), 1500);
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, locale, isStreaming, t, router],
  );

  const handleStop = () => {
    abortRef.current?.abort();
  };

  const handleClear = () => {
    if (messages.length === 0) return;
    if (typeof window !== 'undefined' && !window.confirm(t('clearConfirm'))) {
      return;
    }
    setMessages([]);
    setError(null);
  };

  const suggestions = [
    { key: 'suggestion1', icon: Leaf },
    { key: 'suggestion2', icon: FileText },
    { key: 'suggestion3', icon: Recycle },
    { key: 'suggestion4', icon: Award },
  ] as const;

  const showIntro = messages.length === 0;

  return (
    <AppShell
      title={t('title')}
      subtitle={t('subtitle')}
      rightAction={
        messages.length > 0 ? (
          <button
            onClick={handleClear}
            aria-label={t('newChat')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#F5F5F0]/70 active:bg-[#F5F5F0]/10"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        ) : undefined
      }
    >
      <div className="flex flex-col" style={{ minHeight: 'calc(100dvh - 180px)' }}>
        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto"
        >
          {showIntro ? (
            <IntroView t={t} suggestions={suggestions} onPick={sendMessage} />
          ) : (
            messages.map((m) => (
              <MessageBubble key={m.id} msg={m} t={t} />
            ))
          )}
        </div>

        {/* Composer */}
        <div className="sticky bottom-0 mt-3">
          {error && (
            <div className="mb-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </div>
          )}
          <Composer
            input={input}
            setInput={setInput}
            onSend={() => sendMessage(input)}
            onStop={handleStop}
            isStreaming={isStreaming}
            placeholder={t('placeholder')}
            stopLabel={tCommon('stop')}
            inputRef={inputRef}
          />
        </div>
      </div>
    </AppShell>
  );
}

// ----------------------------------------------------------------
// Intro view (suggestions)
// ----------------------------------------------------------------

function IntroView({
  t,
  suggestions,
  onPick,
}: {
  t: ReturnType<typeof useTranslations>;
  suggestions: ReadonlyArray<{
    key: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  onPick: (text: string) => void;
}) {
  return (
    <div className="flex flex-col items-center pt-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8D4E3]/15 ring-1 ring-[#B8D4E3]/30">
        <Sparkles className="h-7 w-7 text-[#B8D4E3]" />
      </div>
      <h2 className="mt-4 text-center text-base font-semibold text-[#F5F5F0]">
        {t('intro')}
      </h2>
      <p className="mt-1 max-w-xs text-center text-xs text-[#F5F5F0]/60">
        {t('introTip')}
      </p>

      <p className="mt-6 self-start text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
        {t('suggestionsTitle')}
      </p>
      <div className="mt-2 grid w-full grid-cols-1 gap-2">
        {suggestions.map(({ key, icon: Icon }) => {
          const text = t(key as 'suggestion1');
          return (
            <button
              key={key}
              onClick={() => onPick(text)}
              className="flex items-center gap-3 rounded-xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/5 px-3 py-3 text-left text-sm text-[#F5F5F0] transition-all active:scale-[0.98] active:bg-[#F5F5F0]/10"
            >
              <Icon className="h-4 w-4 shrink-0 text-[#B8D4E3]" />
              <span className="flex-1">{text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Message bubble
// ----------------------------------------------------------------

function MessageBubble({
  msg,
  t,
}: {
  msg: ChatMessage;
  t: ReturnType<typeof useTranslations>;
}) {
  const isUser = msg.role === 'user';
  const Icon = msg.agent ? AGENT_ICONS[msg.agent] : null;
  const agentLabel = msg.agent
    ? t(`agentLabel.${msg.agent}` as 'agentLabel.carbon')
    : null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
          isUser
            ? 'rounded-br-md bg-[#B8D4E3] text-[#0A2F1F]'
            : msg.errored
              ? 'rounded-bl-md border border-red-400/30 bg-red-500/10 text-red-200'
              : 'rounded-bl-md bg-[#F5F5F0]/8 text-[#F5F5F0]'
        }`}
      >
        {!isUser && agentLabel && Icon && (
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#B8D4E3]">
            <Icon className="h-3 w-3" />
            <span>{agentLabel}</span>
          </div>
        )}
        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
          {msg.content}
          {msg.partial && (
            <span className="ml-0.5 inline-block h-3 w-[2px] animate-pulse bg-current align-middle" />
          )}
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Composer (textarea + send button)
// ----------------------------------------------------------------

function Composer({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  placeholder,
  stopLabel,
  inputRef,
}: {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
  placeholder: string;
  stopLabel: string;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    // Cmd/Ctrl+Enter sends
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSend();
    }
  };

  // Auto-resize textarea (max 5 lines)
  const handleInput: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const canSend = input.trim().length > 0 && !isStreaming;

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-[#F5F5F0]/15 bg-[#0A2F1F]/80 px-3 py-2 backdrop-blur-xl">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={isStreaming}
        className="flex-1 resize-none bg-transparent py-1.5 text-[15px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/40 focus:outline-none disabled:opacity-50"
      />
      {isStreaming ? (
        <button
          onClick={onStop}
          aria-label={stopLabel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F5F0]/15 text-[#F5F5F0] active:scale-95"
        >
          <Square className="h-4 w-4 fill-current" />
        </button>
      ) : (
        <button
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${
            canSend
              ? 'bg-[#B8D4E3] text-[#0A2F1F] active:scale-95'
              : 'bg-[#F5F5F0]/10 text-[#F5F5F0]/30'
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
