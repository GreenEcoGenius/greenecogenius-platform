'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ChevronDown,
  Paperclip,
  Send,
  Sparkles,
  X,
} from 'lucide-react';

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

interface Attachment {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  streaming?: boolean;
}

const QUICK_ACTIONS: Record<AIAssistantProps['section'], string[]> = {
  comptoir: ['Comment publier une annonce ?', 'Quels materiaux acceptes ?'],
  carbon: ['Reduire mes emissions', 'Expliquer Scopes 1/2/3'],
  esg: ['Generer un rapport ESG', 'Normes CSRD ?'],
  traceability: ['Emettre un certificat', 'Verifier un lot'],
  rse: ['Diagnostic RSE', 'Labels disponibles ?'],
  compliance: ['Lancer un pre-audit', 'Normes pour mon secteur ?'],
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Simulate streaming by revealing text progressively
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
      indexRef.current += 3; // 3 chars at a time
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
    <div className="max-w-[85%] rounded-2xl bg-gray-100 px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap dark:bg-gray-800 dark:text-gray-100">
      {displayed}
      {displayed.length < content.length && (
        <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-gray-400" />
      )}
    </div>
  );
}

export function AIAssistant({ section, context }: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ask, loading } = useAI(section);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if ((!trimmed && attachments.length === 0) || loading) return;

    const msgAttachments = attachments.length > 0 ? [...attachments] : undefined;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: trimmed || `[${msgAttachments?.length} fichier(s)]`, attachments: msgAttachments },
    ]);
    setInput('');
    setAttachments([]);
    if (inputRef.current) inputRef.current.style.height = 'auto';

    const attachmentInfo = msgAttachments
      ? msgAttachments.map((a) => `Fichier: ${a.name} (${a.type}, ${formatFileSize(a.size)})`).join('\n')
      : '';
    const fullMessage = attachmentInfo ? `${trimmed}\n\n[Pieces jointes]\n${attachmentInfo}` : trimmed;

    const result = await ask(fullMessage, { context });
    if (result) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: result.content, streaming: true },
      ]);
    }
  }, [input, attachments, loading, ask, context]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-medium text-white shadow-lg transition-all hover:bg-emerald-700 sm:right-6 sm:bottom-6 sm:px-5 sm:py-3 sm:text-sm"
          style={{ animation: 'ai-pulse 2s ease-in-out infinite' }}
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Discuter avec Kodee</span>
          <span className="sm:hidden">Kodee</span>
        </button>
      )}

      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-50 bg-black/10" onClick={() => setOpen(false)} />}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-0 right-0 left-0 z-50 flex h-[60vh] flex-col rounded-t-2xl bg-white shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:h-[520px] sm:w-[380px] sm:rounded-2xl dark:bg-gray-950">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold">Kodee</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            {!hasMessages && !loading ? (
              <div className="flex flex-col items-center py-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                  <Sparkles className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-semibold">Bonjour !</p>
                <p className="text-muted-foreground mt-0.5 text-xs">Comment puis-je vous aider ?</p>

                <div className="mt-5 w-full space-y-1.5">
                  {QUICK_ACTIONS[section]?.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleSend(action)}
                      className="flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <span className="text-emerald-500">&#8599;</span>
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="mr-1.5 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                        <Sparkles className="h-3 w-3 text-emerald-600" />
                      </div>
                    )}
                    <div className="max-w-[85%]">
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mb-1 flex flex-wrap justify-end gap-1">
                          {msg.attachments.map((att) => (
                            <span key={att.id} className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-700">
                              {att.name}
                            </span>
                          ))}
                        </div>
                      )}
                      {msg.role === 'assistant' && msg.streaming ? (
                        <StreamingMessage content={msg.content} />
                      ) : (
                        <div className={`rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                        }`}>
                          {msg.content}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start">
                    <div className="mr-1.5 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <Sparkles className="h-3 w-3 text-emerald-600" />
                    </div>
                    <div className="rounded-2xl bg-gray-100 px-3 py-2 dark:bg-gray-800">
                      <AILoadingState lines={1} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="shrink-0 border-t px-3 pt-2">
              <div className="flex flex-wrap gap-1.5">
                {attachments.map((att) => (
                  <span key={att.id} className="inline-flex items-center gap-1 rounded-md border bg-gray-50 px-2 py-1 text-[10px] dark:bg-gray-800">
                    {att.name.length > 15 ? att.name.slice(0, 15) + '...' : att.name}
                    <button type="button" onClick={() => removeAttachment(att.id)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-muted-foreground shrink-0 px-3 pt-1 text-center text-[8px]">
            L&apos;IA peut generer des informations inexactes
          </div>

          {/* Input */}
          <div className="shrink-0 p-2">
            <div className="flex items-end gap-1.5 rounded-xl border bg-gray-50 px-2 py-1.5 focus-within:ring-1 focus-within:ring-emerald-500 dark:bg-gray-900">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 hover:text-gray-600"
              >
                <Paperclip className="h-3.5 w-3.5" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                onChange={(e) => { handleFileSelect(e.target.files); e.target.value = ''; }}
                className="hidden"
              />

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); const el = e.target; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 80) + 'px'; }}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question"
                rows={1}
                className="min-h-[22px] max-h-[80px] min-w-0 flex-1 resize-none bg-transparent text-xs leading-5 focus:outline-none"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || (!input.trim() && attachments.length === 0)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-30"
              >
                <Send className="h-3 w-3" />
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
