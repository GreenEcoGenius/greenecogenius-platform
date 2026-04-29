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

const AGENT_COLORS: Record<AgentType, string> = {
  comptoir: 'text-teal-400',
  carbon: 'text-emerald-400',
  esg: 'text-blue-400',
  traceability: 'text-purple-400',
  rse: 'text-amber-400',
  compliance: 'text-rose-400',
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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
      setInput('');

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }

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
                m.id === assistantId ? { ...m, content: m.content + chunk } : m,
              ),
            );
          },
        });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, partial: false, agent } : m,
          ),
        );
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
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
          setTimeout(() => router.replace('/auth/sign-in'), 1500);
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, locale, isStreaming, t, router],
  );

  const handleStop = () => { abortRef.current?.abort(); };

  const handleClear = () => {
    if (messages.length === 0) return;
    if (typeof window !== 'undefined' && !window.confirm(t('clearConfirm'))) return;
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
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#F5F5F0]/50 active:bg-[#F5F5F0]/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : undefined
      }
      hideTabBar
      showBack
    >
      <div className="flex flex-col" style={{ minHeight: 'calc(100dvh - 160px)' }}>
        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-2">
          {showIntro ? (
            <IntroView t={t} suggestions={suggestions} onPick={sendMessage} />
          ) : (
            messages.map((m) => <MessageBubble key={m.id} msg={m} t={t} />)
          )}
        </div>

        {/* Composer */}
        <div className="sticky bottom-0 mt-2 pb-1">
          {error && !isStreaming && (
            <div className="mb-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-[12px] text-red-300">
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

/* ── Intro View ── */
function IntroView({
  t,
  suggestions,
  onPick,
}: {
  t: ReturnType<typeof useTranslations>;
  suggestions: ReadonlyArray<{ key: string; icon: React.ComponentType<{ className?: string }> }>;
  onPick: (text: string) => void;
}) {
  return (
    <div className="flex flex-col items-center pt-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B8D4E3]/10 ring-1 ring-[#B8D4E3]/20">
        <Sparkles className="h-7 w-7 text-[#B8D4E3]" />
      </div>
      <h2 className="mt-4 text-center text-[17px] font-bold text-[#F5F5F0]">
        {t('intro')}
      </h2>
      <p className="mt-1.5 max-w-[280px] text-center text-[13px] text-[#F5F5F0]/50 leading-relaxed">
        {t('introTip')}
      </p>

      <p className="mt-8 self-start text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/30">
        {t('suggestionsTitle')}
      </p>
      <div className="mt-2.5 grid w-full grid-cols-1 gap-2">
        {suggestions.map(({ key, icon: Icon }) => {
          const text = t(key as 'suggestion1');
          return (
            <button
              key={key}
              onClick={() => onPick(text)}
              className="flex items-center gap-3 rounded-xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.03] px-4 py-3 text-left text-[13px] text-[#F5F5F0]/80 transition-all active:scale-[0.98] active:bg-[#F5F5F0]/[0.06]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B8D4E3]/10">
                <Icon className="h-4 w-4 text-[#B8D4E3]" />
              </div>
              <span className="flex-1 leading-snug">{text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Message Bubble ── */
function MessageBubble({
  msg,
  t,
}: {
  msg: ChatMessage;
  t: ReturnType<typeof useTranslations>;
}) {
  const isUser = msg.role === 'user';
  const Icon = msg.agent ? AGENT_ICONS[msg.agent] : null;
  const agentColor = msg.agent ? AGENT_COLORS[msg.agent] : 'text-[#B8D4E3]';
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
              ? 'rounded-bl-md border border-red-400/20 bg-red-500/10 text-red-300'
              : 'rounded-bl-md bg-[#F5F5F0]/[0.06] text-[#F5F5F0]'
        }`}
      >
        {!isUser && agentLabel && Icon && (
          <div className={`mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider ${agentColor}`}>
            <Icon className="h-3 w-3" />
            <span>{agentLabel}</span>
          </div>
        )}
        <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed">
          {msg.content}
          {msg.partial && (
            <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-current align-middle rounded-full" />
          )}
        </p>
      </div>
    </div>
  );
}

/* ── Composer ── */
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
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSend();
    }
  };

  const handleInput: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const canSend = input.trim().length > 0 && !isStreaming;

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#0A2F1F]/90 px-3 py-2 backdrop-blur-xl">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={isStreaming}
        className="flex-1 resize-none bg-transparent py-1.5 text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/30 focus:outline-none disabled:opacity-40"
      />
      {isStreaming ? (
        <button
          onClick={onStop}
          aria-label={stopLabel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F5F0]/10 text-[#F5F5F0] active:scale-90 transition-transform"
        >
          <Square className="h-3.5 w-3.5 fill-current" />
        </button>
      ) : (
        <button
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${
            canSend
              ? 'bg-[#B8D4E3] text-[#0A2F1F] active:scale-90'
              : 'bg-[#F5F5F0]/[0.06] text-[#F5F5F0]/20'
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
