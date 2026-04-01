'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ChevronDown,
  FileIcon,
  ImageIcon,
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
  comptoir: ['Comment publier une annonce ?', 'Quels materiaux sont acceptes ?'],
  carbon: ['Comment reduire mes emissions ?', 'Expliquer les Scopes 1/2/3'],
  esg: ['Generer un rapport ESG', 'Quelles normes CSRD ?'],
  traceability: ['Comment emettre un certificat ?', 'Verifier un lot blockchain'],
  rse: ['Lancer un diagnostic RSE', 'Labels disponibles ?'],
  compliance: ['Lancer un pre-audit', 'Quelles normes pour mon secteur ?'],
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(type: string): boolean {
  return type.startsWith('image/');
}

function AttachmentPreview({
  attachment,
  onRemove,
  compact,
}: {
  attachment: Attachment;
  onRemove?: () => void;
  compact?: boolean;
}) {
  if (isImageFile(attachment.type) && attachment.previewUrl) {
    return (
      <div className={`group relative overflow-hidden rounded-lg border ${compact ? 'h-16 w-16' : 'h-20 w-20'}`}>
        <img
          src={attachment.previewUrl}
          alt={attachment.name}
          className="h-full w-full object-cover"
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`group relative flex items-center gap-2 rounded-lg border bg-gray-50 px-3 dark:bg-gray-800 ${compact ? 'py-1.5' : 'py-2'}`}>
      <FileIcon className="h-4 w-4 shrink-0 text-emerald-500" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">{attachment.name}</p>
        <p className="text-muted-foreground text-[10px]">{formatFileSize(attachment.size)}</p>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
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

  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, messages.length]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
    };
  }, [attachments]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: isImageFile(file.type) ? URL.createObjectURL(file) : undefined,
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
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed || (msgAttachments ? `[${msgAttachments.length} fichier(s) joint(s)]` : ''),
        attachments: msgAttachments,
      },
    ]);
    setInput('');
    setAttachments([]);

    if (inputRef.current) inputRef.current.style.height = 'auto';

    // Build context with attachment info
    const attachmentInfo = msgAttachments
      ? msgAttachments.map((a) => `Fichier: ${a.name} (${a.type}, ${formatFileSize(a.size)})`).join('\n')
      : '';

    const fullMessage = attachmentInfo
      ? `${trimmed}\n\n[Pieces jointes]\n${attachmentInfo}`
      : trimmed;

    const result = await ask(fullMessage, { context });
    if (result) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: result.content },
      ]);
    }
  }, [input, attachments, loading, ask, context]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    },
    [handleSend],
  );

  const handleTextareaInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

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
        <div className="fixed inset-0 z-50 bg-black/10" onClick={() => setOpen(false)} />
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-0 right-0 left-0 z-50 flex max-h-[90vh] flex-col rounded-t-3xl bg-white shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-h-[600px] sm:w-[400px] sm:rounded-2xl dark:bg-gray-950"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Header */}
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
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
                  <Sparkles className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold">Bonjour !</h3>
                <p className="text-muted-foreground mt-1 text-center text-sm">
                  Comment puis-je vous aider ?
                </p>

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
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                    )}
                    <div className="max-w-[80%]">
                      {/* Attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mb-1.5 flex flex-wrap gap-1.5 justify-end">
                          {msg.attachments.map((att) => (
                            <AttachmentPreview key={att.id} attachment={att} compact />
                          ))}
                        </div>
                      )}
                      {msg.content && (
                        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
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
                    <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
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

          {/* Attachment previews */}
          {attachments.length > 0 && (
            <div className="shrink-0 border-t px-3 pt-2">
              <div className="flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <AttachmentPreview
                    key={att.id}
                    attachment={att}
                    onRemove={() => removeAttachment(att.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="shrink-0 p-3">
            <div className="flex items-end gap-2 rounded-2xl border bg-gray-50 px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 dark:bg-gray-900">
              {/* File upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700"
                title="Joindre un fichier"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.json"
                onChange={(e) => { handleFileSelect(e.target.files); e.target.value = ''; }}
                className="hidden"
              />

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); handleTextareaInput(); }}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question"
                rows={1}
                className="min-h-[24px] max-h-[120px] min-w-0 flex-1 resize-none bg-transparent text-sm leading-6 focus:outline-none"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || (!input.trim() && attachments.length === 0)}
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
