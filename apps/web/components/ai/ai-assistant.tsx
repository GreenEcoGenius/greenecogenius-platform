'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ChevronDown, Mic, Send, Sparkles } from 'lucide-react';

import { useAI } from '~/lib/hooks/use-ai';

import { AILoadingState } from './shared/ai-loading-state';

interface AIAssistantProps {
  section:
    | 'comptoir'
    | 'carbon'
    | 'esg'
    | 'traceability'
    | 'rse'
    | 'compliance';
  context?: Record<string, unknown>;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AGENT_NAMES: Record<AIAssistantProps['section'], string> = {
  comptoir: 'Comptoir',
  carbon: 'Carbone',
  esg: 'ESG',
  traceability: 'Tracabilite',
  rse: 'RSE',
  compliance: 'Conformite',
};

const QUICK_ACTIONS: Record<AIAssistantProps['section'], string[]> = {
  comptoir: [
    'Comment publier une annonce ?',
    'Quels materiaux sont acceptes ?',
  ],
  carbon: ['Comment reduire mes emissions ?', 'Expliquer les Scopes 1/2/3'],
  esg: ['Generer un rapport ESG', 'Quelles normes CSRD ?'],
  traceability: [
    'Comment emettre un certificat ?',
    'Verifier un lot blockchain',
  ],
  rse: ['Lancer un diagnostic RSE', 'Labels disponibles ?'],
  compliance: ['Lancer un pre-audit', 'Quelles normes pour mon secteur ?'],
};

export function AIAssistant({ section, context }: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { ask, loading } = useAI(section);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, messages.length]);

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

      const result = await ask(trimmed, { context });
      if (result) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: result.content,
          },
        ]);
      }
    },
    [input, loading, ask, context],
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

  const handleTextareaInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl sm:right-6 sm:bottom-6"
          style={{ animation: 'ai-pulse 2s ease-in-out infinite' }}
        >
          <Sparkles className="h-4 w-4" />
          Discuter avec Kodee
        </button>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/10"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed right-0 bottom-0 left-0 z-50 flex max-h-[90vh] flex-col rounded-t-3xl bg-white shadow-2xl sm:right-6 sm:bottom-6 sm:left-auto sm:max-h-[600px] sm:w-[400px] sm:rounded-2xl dark:bg-gray-950">
          {/* Header tabs */}
          <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-2">
            <div className="flex gap-1">
              <span className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                Discussion
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages / Welcome */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            {!hasMessages && !loading ? (
              <div className="flex flex-col items-center py-8">
                {/* Logo */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
                  <Sparkles className="h-7 w-7 text-emerald-600" />
                </div>

                <h3 className="text-lg font-semibold">Bonjour !</h3>
                <p className="text-muted-foreground mt-1 text-center text-sm">
                  Comment puis-je vous aider ?
                </p>

                {/* Quick actions */}
                <div className="mt-8 w-full space-y-2">
                  {QUICK_ACTIONS[section]?.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleSend(action)}
                      className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <span className="text-muted-foreground">&#8599;</span>
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="mt-1 mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start">
                    <div className="mt-1 mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-2.5 dark:bg-gray-800">
                      <AILoadingState lines={2} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="text-muted-foreground shrink-0 px-4 text-center text-[9px]">
            L&apos;IA peut generer des informations inexactes
          </div>

          {/* Input */}
          <div className="shrink-0 p-3">
            <div className="flex items-end gap-2 rounded-2xl border bg-gray-50 px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 dark:bg-gray-900">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  handleTextareaInput();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question"
                rows={1}
                className="max-h-[120px] min-h-[24px] min-w-0 flex-1 resize-none bg-transparent text-sm leading-6 focus:outline-none"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-30"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ai-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(5, 150, 105, 0); }
        }
      `}</style>
    </>
  );
}
