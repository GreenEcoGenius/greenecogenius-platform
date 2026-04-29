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
  Minimize2,
  PackageSearch,
  Send,
  Shield,
  Sparkles,
  Store,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  comptoir: <Store className="h-4 w-4" />,
  listings: <PackageSearch className="h-4 w-4" />,
  carbon: <Leaf className="h-4 w-4" />,
  esg: <BarChart3 className="h-4 w-4" />,
  traceability: <Link2 className="h-4 w-4" />,
  rse: <Award className="h-4 w-4" />,
  compliance: <Shield className="h-4 w-4" />,
  wallet: <Wallet className="h-4 w-4" />,
  billing: <CreditCard className="h-4 w-4" />,
  profile: <User className="h-4 w-4" />,
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
      icon: <Home className="h-4 w-4" />,
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

/* ─── Streaming text hook ─── */

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
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {displayed}
      {displayed.length < content.length && (
        <span className="bg-metal-400 ml-0.5 inline-block h-3 w-0.5 animate-pulse" />
      )}
    </div>
  );
}

/* ─── Main component ─── */

const MOBILE_BREAKPOINT = 768;

export function AIAssistant() {
  const pathname = usePathname();
  const t = useTranslations('common');
  const section = useSectionContext(pathname ?? '');

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lastAgent, setLastAgent] = useState<AgentType>(section.agent);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Hide on mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Reset conversation when section changes
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
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const handleSend = useCallback(
    async (text?: string) => {
      const trimmed = (text ?? input).trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      if (inputRef.current) inputRef.current.style.height = 'auto';
      setLoading(true);

      try {
        // Build conversation history for context
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
            context: { previousMessages },
          }),
        });

        if (!res.ok) {
          throw new Error('Erreur serveur');
        }

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
    [input, loading, messages, section.agent, t],
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

  if (isMobile) return null;

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* ─── Floating trigger button ─── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="from-primary to-primary-hover shadow-primary/30 hover:shadow-primary/40 fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          aria-label={t('ai.open')}
        >
          <Sparkles className="h-5 w-5" />
        </button>
      )}

      {/* ─── Chat panel ─── */}
      {open && (
        <div className="border-[#1A5C3E] shadow-metal-900/12 fixed right-6 bottom-6 z-50 flex w-[400px] flex-col overflow-hidden rounded-2xl border bg-[#0D3A26] shadow-2xl">
          {/* Header */}
          <div className="from-primary to-primary-hover flex items-center justify-between bg-gradient-to-r px-5 py-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4" />
                {t('ai.title')}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/80">
                {section.icon}
                {section.name}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([]);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                aria-label={t('ai.newConversation')}
                title={t('ai.newConversation')}
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                aria-label={t('ai.close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex max-h-[400px] min-h-[300px] flex-1 flex-col gap-3 overflow-y-auto p-4">
            {!hasMessages && !loading ? (
              /* Welcome screen */
              <div className="flex flex-1 flex-col">
                {/* Welcome message */}
                <div className="bg-[#0D3A26] text-[#E0E7E3] mb-4 rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed">
                  {section.welcome}
                </div>

                {/* Quick suggestions */}
                <div className="mt-auto flex flex-col gap-2">
                  {section.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="border-[#1A5C3E] text-[#E0E7E3] hover:border-primary/30 hover:bg-[#1A5C3E]/50 hover:text-primary flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-[13px] transition-all duration-150"
                    >
                      <span className="text-primary">&#8599;</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Conversation */
              <>
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.role === 'user' ? (
                      <div className="flex justify-end">
                        <div className="bg-primary max-w-[85%] rounded-xl rounded-br-sm px-4 py-2.5 text-sm text-white">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="bg-[#1A5C3E] flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
                          <Sparkles className="text-primary h-3 w-3" />
                        </div>
                        <div className="bg-[#0D3A26] text-[#F5F5F0] max-w-[85%] rounded-xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed">
                          {msg.streaming ? (
                            <StreamingMessage content={msg.content} />
                          ) : (
                            <div className="whitespace-pre-wrap">
                              {msg.content}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2">
                    <div className="bg-[#1A5C3E] flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
                      <Sparkles className="text-primary h-3 w-3" />
                    </div>
                    <div className="bg-[#0D3A26] rounded-xl rounded-tl-sm px-4 py-3">
                      <AILoadingState lines={1} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Disclaimer */}
          <div className="text-[#7DC4A0] px-4 text-center text-[10px]">
            {t('ai.disclaimer')}
          </div>

          {/* Input */}
          <div className="border-[#1A5C3E] border-t p-3">
            <div className="border-metal-silver bg-[#0D3A26] flex items-end gap-2 rounded-xl border px-3 py-2">
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
                className="text-[#F5F5F0] placeholder:text-[#7DC4A0] max-h-[100px] min-h-[24px] flex-1 resize-none border-none bg-transparent text-sm leading-relaxed outline-none"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="bg-primary hover:bg-primary-hover flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white transition-all duration-150 disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
