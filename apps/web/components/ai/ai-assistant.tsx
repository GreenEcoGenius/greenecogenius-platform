'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Send, Sparkles, X } from 'lucide-react';

import { Button } from '@kit/ui/button';

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
  comptoir: 'Assistant Comptoir',
  carbon: 'Assistant Carbone',
  esg: 'Assistant ESG',
  traceability: 'Assistant Tracabilite',
  rse: 'Assistant RSE',
  compliance: 'Assistant Conformite',
};

export function AIAssistant({ section, context }: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { ask, loading } = useAI(section);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: trimmed },
    ]);
    setInput('');

    const result = await ask(trimmed, { context });
    if (result) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: result.content },
      ]);
    }
  }, [input, loading, ask, context]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <>
      {/* Trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-700 sm:right-6 sm:bottom-6 sm:h-14 sm:w-14"
          style={{ animation: 'ai-pulse 2s ease-in-out infinite' }}
          aria-label="Ouvrir l'assistant IA"
        >
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      {open && (
        <div
          className="fixed right-0 bottom-0 left-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-2xl sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[400px] sm:rounded-none sm:border-l dark:bg-gray-950"
          role="dialog"
          aria-label={AGENT_NAMES[section]}
        >
          {/* Handle bar (mobile only) */}
          <div className="flex justify-center py-2 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <Sparkles className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">
                  {AGENT_NAMES[section]}
                </h2>
                <p className="text-muted-foreground text-[11px]">
                  GreenEcoGenius IA
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && !loading && (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center text-sm">
                <Sparkles className="mb-3 h-8 w-8 text-emerald-500 opacity-50" />
                <p>
                  Posez une question a votre
                  <br />
                  {AGENT_NAMES[section]}
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
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
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-gray-100 px-3 py-2 dark:bg-gray-800">
                  <AILoadingState lines={2} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t p-3">
            <div className="text-muted-foreground mb-1.5 text-center text-[9px]">
              IA GreenEcoGenius — les reponses peuvent contenir des
              inexactitudes
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                className="min-w-0 flex-1 rounded-full border bg-gray-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:bg-gray-900"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
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
