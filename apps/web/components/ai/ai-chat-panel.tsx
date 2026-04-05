'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

import {
  Award,
  BarChart3,
  CreditCard,
  Home,
  Leaf,
  Link2,
  PackageSearch,
  Paperclip,
  PenLine,
  Send,
  Shield,
  Sparkles,
  Store,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

import { useChat } from './chat-context';
import { AILoadingState } from './shared/ai-loading-state';

/* ─── Types ─── */

type AgentType =
  | 'comptoir'
  | 'carbon'
  | 'esg'
  | 'traceability'
  | 'rse'
  | 'compliance'
  | 'general';

interface SectionContext {
  agent: AgentType;
  name: string;
  icon: React.ReactNode;
  welcome: string;
  suggestions: string[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

/* ─── Section detection ─── */

type SectionKey =
  | 'comptoir'
  | 'listings'
  | 'carbon'
  | 'esg'
  | 'traceability'
  | 'rse'
  | 'compliance'
  | 'wallet'
  | 'billing'
  | 'profile';

const SECTION_MATCHES: { match: string[]; key: SectionKey; agent: AgentType }[] =
  [
    { match: ['/marketplace', '/comptoir'], key: 'comptoir', agent: 'comptoir' },
    { match: ['/my-listings', '/annonces'], key: 'listings', agent: 'comptoir' },
    { match: ['/carbon', '/impact'], key: 'carbon', agent: 'carbon' },
    { match: ['/esg', '/reporting'], key: 'esg', agent: 'esg' },
    {
      match: ['/traceability', '/tracabilite'],
      key: 'traceability',
      agent: 'traceability',
    },
    { match: ['/rse', '/labels'], key: 'rse', agent: 'rse' },
    {
      match: ['/compliance', '/conformite'],
      key: 'compliance',
      agent: 'compliance',
    },
    { match: ['/wallet', '/portefeuille'], key: 'wallet', agent: 'comptoir' },
    { match: ['/billing', '/facturation'], key: 'billing', agent: 'general' },
    {
      match: ['/settings', '/profil', '/profile'],
      key: 'profile',
      agent: 'general',
    },
  ];

const ICONS: Record<SectionKey, React.ReactNode> = {
  comptoir: <Store className="h-3.5 w-3.5" />,
  listings: <PackageSearch className="h-3.5 w-3.5" />,
  carbon: <Leaf className="h-3.5 w-3.5" />,
  esg: <BarChart3 className="h-3.5 w-3.5" />,
  traceability: <Link2 className="h-3.5 w-3.5" />,
  rse: <Award className="h-3.5 w-3.5" />,
  compliance: <Shield className="h-3.5 w-3.5" />,
  wallet: <Wallet className="h-3.5 w-3.5" />,
  billing: <CreditCard className="h-3.5 w-3.5" />,
  profile: <User className="h-3.5 w-3.5" />,
};

function useSectionContext(pathname: string): SectionContext {
  const t = useTranslations('common');

  return useMemo(() => {
    for (const s of SECTION_MATCHES) {
      if (s.match.some((m) => pathname.includes(m))) {
        return {
          agent: s.agent,
          name: t(`ai.${s.key}Name`),
          icon: ICONS[s.key],
          welcome: t(`ai.${s.key}Welcome`),
          suggestions: [
            t(`ai.${s.key}Suggestion1`),
            t(`ai.${s.key}Suggestion2`),
            t(`ai.${s.key}Suggestion3`),
            t(`ai.${s.key}Suggestion4`),
          ],
        };
      }
    }
    return {
      agent: 'general',
      name: t('ai.sectionHome'),
      icon: <Home className="h-3.5 w-3.5" />,
      welcome: t('ai.homeWelcome'),
      suggestions: [
        t('ai.homeSuggestion1'),
        t('ai.homeSuggestion2'),
        t('ai.homeSuggestion3'),
        t('ai.homeSuggestion4'),
      ],
    };
  }, [pathname, t]);
}

/* ─── Streaming ─── */

function useStreamingText(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active || !text) {
      setDisplayed(text);
      return;
    }
    indexRef.current = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      indexRef.current += 3;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text, active]);

  return displayed;
}

function StreamingMessage({ content }: { content: string }) {
  const displayed = useStreamingText(content, true);
  return (
    <div className="text-[13px] leading-relaxed whitespace-pre-wrap">
      {displayed}
      {displayed.length < content.length && (
        <span className="bg-metal-400 ml-0.5 inline-block h-3 w-0.5 animate-pulse" />
      )}
    </div>
  );
}

/* ─── Panel ─── */

export function AIChatPanel() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('common');
  const { chatOpen, closeChat } = useChat();
  const section = useSectionContext(pathname ?? '');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAgent, setLastAgent] = useState<AgentType>(section.agent);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset on section change
  useEffect(() => {
    if (section.agent !== lastAgent) {
      setMessages([]);
      setLastAgent(section.agent);
    }
  }, [section.agent, lastAgent]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [chatOpen]);

  const handleSend = useCallback(
    async (text?: string) => {
      const trimmed = (text ?? input).trim();
      if (!trimmed || loading) return;

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', content: trimmed },
      ]);
      setInput('');
      if (inputRef.current) inputRef.current.style.height = 'auto';
      setLoading(true);

      try {
        const previousMessages = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            agentType: section.agent === 'general' ? undefined : section.agent,
            locale,
            context: { previousMessages, locale },
          }),
        });

        if (!res.ok) throw new Error('Server error');
        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.content || data.message || t('ai.noResponse'),
            streaming: true,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: t('ai.errorFallback'),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, locale, messages, section.agent, t],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const hasMessages = messages.length > 0;

  if (!chatOpen) return null;

  return (
    <div className="border-metal-chrome fixed top-14 right-0 bottom-0 z-30 flex w-[380px] flex-col border-l bg-white">
      {/* Header */}
      <div className="border-metal-chrome flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="bg-primary-light rounded-lg p-1.5">
            <Sparkles className="text-primary h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-metal-900 text-sm font-semibold">Genius</p>
            <div className="text-metal-500 flex items-center gap-1 text-[11px]">
              {section.icon}
              {section.name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-metal-500 hover:bg-metal-frost hover:text-metal-700 flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            title={t('ai.importDocument')}
          >
            <Paperclip className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-metal-500 hover:bg-metal-frost hover:text-metal-700 flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            title={t('ai.newConversation')}
          >
            <PenLine className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={closeChat}
            className="text-metal-500 hover:bg-metal-frost hover:text-metal-700 flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            title={t('ai.close')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {!hasMessages && !loading ? (
          <div className="flex flex-1 flex-col">
            {/* Welcome */}
            <div className="mb-4 flex gap-2">
              <div className="bg-primary-light flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
                <Sparkles className="text-primary h-3 w-3" />
              </div>
              <div className="bg-metal-50 text-metal-700 rounded-xl rounded-tl-sm px-3 py-2.5 text-[13px] leading-relaxed">
                {section.welcome}
              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-auto flex flex-col gap-1.5">
              {section.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSend(suggestion)}
                  className="border-metal-chrome text-metal-600 hover:border-primary/30 hover:bg-primary-light/50 hover:text-primary flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[12px] transition-all duration-150"
                >
                  <span className="text-primary">&#8599;</span>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-primary max-w-[85%] rounded-xl rounded-br-sm px-3 py-2 text-[13px] text-white">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="bg-primary-light flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
                      <Sparkles className="text-primary h-3 w-3" />
                    </div>
                    <div className="bg-metal-50 text-metal-800 max-w-[85%] rounded-xl rounded-tl-sm px-3 py-2.5 text-[13px] leading-relaxed">
                      {msg.streaming ? (
                        <StreamingMessage content={msg.content} />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="bg-primary-light flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
                  <Sparkles className="text-primary h-3 w-3" />
                </div>
                <div className="bg-metal-50 rounded-xl rounded-tl-sm px-3 py-3">
                  <AILoadingState lines={1} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Disclaimer */}
      <div className="text-metal-steel px-4 text-center text-[10px]">
        {t('ai.disclaimer')}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.csv,.xlsx,.xls,.docx,.doc,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleSend(t('ai.importedDocument', { name: file.name }));
          }
          e.target.value = '';
        }}
      />

      {/* Input */}
      <div className="border-metal-chrome border-t p-3">
        <div className="border-metal-silver bg-metal-50 flex items-end gap-2 rounded-xl border px-3 py-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-metal-steel hover:text-metal-600 flex h-8 w-8 shrink-0 items-center justify-center transition-colors"
            title={t('ai.attachFile')}
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              const el = e.target;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 100) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder={t('ai.askQuestion')}
            rows={1}
            className={cn(
              'text-metal-900 placeholder:text-metal-steel max-h-[100px] min-h-[24px] flex-1 resize-none border-none bg-transparent text-[13px] leading-relaxed outline-none',
            )}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary-hover flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white transition-all duration-150 disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
