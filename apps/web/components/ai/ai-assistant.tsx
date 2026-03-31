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
  traceability: 'Assistant Tra\u00e7abilit\u00e9',
  rse: 'Assistant RSE',
  compliance: 'Assistant Conformit\u00e9',
};

export function AIAssistant({ section, context }: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
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
      <button
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
        style={{
          animation: 'ai-pulse 2s ease-in-out infinite',
        }}
        aria-label="Ouvrir l'assistant IA"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-[400px] max-w-[90vw] flex-col border-l bg-white shadow-xl transition-transform duration-300 dark:bg-gray-950 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label={AGENT_NAMES[section]}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
              <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">
                {AGENT_NAMES[section]}
              </h2>
              <p className="text-muted-foreground text-xs">
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
            <span className="sr-only">Fermer</span>
          </Button>
        </div>

        {/* Messages area */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && !loading && (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center text-center text-sm">
              <Sparkles className="mb-3 h-8 w-8 text-green-500 opacity-50" />
              <p>
                Posez une question \u00e0 votre assistant
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
                    : 'bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg bg-green-50 px-3 py-2 dark:bg-green-950/50">
                <AILoadingState lines={2} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Disclaimer */}
        <div className="text-muted-foreground border-t px-4 py-1.5 text-center text-[10px]">
          G\u00e9n\u00e9r\u00e9 par IA — les r\u00e9ponses peuvent contenir
          des inexactitudes
        </div>

        {/* Input area */}
        <div className="border-t p-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question..."
              className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              disabled={loading}
            />
            <Button
              size="sm"
              className="h-9 w-9 shrink-0 bg-green-600 p-0 hover:bg-green-700"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </div>
        </div>
      </div>

      {/* CSS animation for pulse */}
      <style>{`
        @keyframes ai-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(22, 163, 74, 0); }
        }
      `}</style>
    </>
  );
}
