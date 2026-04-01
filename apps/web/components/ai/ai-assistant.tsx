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
  const panelRef = useRef<HTMLDivElement>(null);
  const { ask, loading } = useAI(section);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Lock body scroll when open on mobile
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

  // Handle mobile keyboard: resize panel with visualViewport
  useEffect(() => {
    if (!open) return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    function onResize() {
      const panel = panelRef.current;
      if (!panel || !viewport) return;
      // Set panel height to visual viewport height (excludes keyboard)
      panel.style.height = `${viewport.height}px`;
      panel.style.top = `${viewport.offsetTop}px`;
    }

    viewport.addEventListener('resize', onResize);
    viewport.addEventListener('scroll', onResize);
    onResize();

    return () => {
      viewport.removeEventListener('resize', onResize);
      viewport.removeEventListener('scroll', onResize);
    };
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

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
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none sm:right-6 sm:bottom-6 sm:h-14 sm:w-14"
          style={{
            animation: 'ai-pulse 2s ease-in-out infinite',
          }}
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
          aria-hidden="true"
        />
      )}

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed left-0 top-0 z-50 flex w-full flex-col bg-white shadow-xl dark:bg-gray-950 sm:left-auto sm:right-0 sm:w-[400px] sm:border-l"
          style={{ height: '100dvh' }}
          role="dialog"
          aria-label={AGENT_NAMES[section]}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">{AGENT_NAMES[section]}</h2>
                <p className="text-muted-foreground text-xs">GreenEcoGenius IA</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </div>

          {/* Messages area */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && !loading && (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center text-center text-sm">
                <Sparkles className="mb-3 h-8 w-8 text-emerald-500 opacity-50" />
                <p>
                  Posez une question a votre assistant
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
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950/50">
                  <AILoadingState lines={2} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Disclaimer */}
          <div className="text-muted-foreground shrink-0 border-t px-4 py-1 text-center text-[10px]">
            Genere par IA — les reponses peuvent contenir des inexactitudes
          </div>

          {/* Input area */}
          <div className="shrink-0 border-t p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                className="min-w-0 flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                disabled={loading}
              />
              <Button
                size="sm"
                className="h-9 w-9 shrink-0 rounded-lg bg-emerald-600 p-0 hover:bg-emerald-700"
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Envoyer</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CSS animation for pulse */}
      <style>{`
        @keyframes ai-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(5, 150, 105, 0); }
        }
      `}</style>
    </>
  );
}
