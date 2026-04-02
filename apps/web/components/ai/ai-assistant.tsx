'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { ArrowRight, Paperclip, Send, Sparkles, X } from 'lucide-react';

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
  const [headerPortal, setHeaderPortal] = useState<HTMLElement | null>(null);
  const [viewport, setViewport] = useState<{
    height: number;
    offsetTop: number;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ask, loading } = useAI(section);

  // Find the header portal target
  useEffect(() => {
    const el = document.getElementById('mobile-header-right');
    if (el) setHeaderPortal(el);
  }, []);

  // Track visual viewport to handle mobile keyboard correctly
  // This prevents the chat from resizing/expanding when keyboard opens/closes
  useEffect(() => {
    if (!open) {
      setViewport(null);
      return;
    }

    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      setViewport({ height: vv.height, offsetTop: vv.offsetTop });
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, [open]);

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

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    ]);
  }, []);

  const handleSend = useCallback(
    async (text?: string) => {
      const trimmed = (text ?? input).trim();
      if ((!trimmed && attachments.length === 0) || loading) return;

      const msgAttachments =
        attachments.length > 0 ? [...attachments] : undefined;
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: trimmed || `[${msgAttachments?.length} fichier(s)]`,
          attachments: msgAttachments,
        },
      ]);
      setInput('');
      setAttachments([]);
      if (inputRef.current) inputRef.current.style.height = 'auto';

      const attachmentInfo = msgAttachments
        ? msgAttachments
            .map(
              (a) =>
                `Fichier: ${a.name} (${a.type}, ${formatFileSize(a.size)})`,
            )
            .join('\n')
        : '';

      const result = await ask(
        attachmentInfo
          ? `${trimmed}\n\n[Pieces jointes]\n${attachmentInfo}`
          : trimmed,
        { context },
      );
      if (result) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: result.content,
            streaming: true,
          },
        ]);
      }
    },
    [input, attachments, loading, ask, context],
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

  const triggerButton = !open ? (
    <button
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition-all hover:shadow-md dark:border-emerald-800 dark:bg-gray-950 dark:text-emerald-400"
    >
      <Sparkles className="h-4 w-4" />
      Kodee
    </button>
  ) : null;

  return (
    <>
      {/* Trigger button - rendered in header portal if available, otherwise fixed */}
      {triggerButton && headerPortal
        ? createPortal(triggerButton, headerPortal)
        : triggerButton && (
            <div className="fixed top-20 right-4 z-50 sm:right-6">
              {triggerButton}
            </div>
          )}

      {/* Full screen chat - uses visualViewport height to stay stable with mobile keyboard */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: viewport?.offsetTop ?? 0,
            left: 0,
            right: 0,
            height: viewport ? `${viewport.height}px` : '100dvh',
            zIndex: 9999,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid #e5e7eb',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <span
                style={{
                  backgroundColor: '#f3f4f6',
                  borderRadius: 9999,
                  padding: '6px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                Discussion
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles style={{ width: 16, height: 16, color: '#059669' }} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 9999,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <ArrowRight
                  style={{
                    width: 18,
                    height: 18,
                    color: '#6b7280',
                    transform: 'rotate(90deg)',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div
            style={{ flex: 1, overflowY: 'auto', padding: 16, minHeight: 0 }}
          >
            {!hasMessages && !loading ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Sparkles
                    style={{ width: 28, height: 28, color: '#059669' }}
                  />
                </div>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#111827',
                    margin: 0,
                  }}
                >
                  Bonjour !
                </p>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                  Comment puis-je vous aider ?
                </p>

                <div
                  style={{
                    marginTop: 32,
                    width: '100%',
                    maxWidth: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {QUICK_ACTIONS[section]?.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleSend(action)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        fontSize: 13,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = '#f9fafb')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = '#fff')
                      }
                    >
                      <span style={{ color: '#059669' }}>&#8599;</span>
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.role === 'user' ? (
                      <div
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <div
                          style={{
                            maxWidth: '80%',
                            backgroundColor: '#f3f4f6',
                            borderRadius: 16,
                            padding: '10px 16px',
                            fontSize: 14,
                            color: '#111827',
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 6,
                          }}
                        >
                          <Sparkles
                            style={{ width: 16, height: 16, color: '#059669' }}
                          />
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: '#111827',
                            }}
                          >
                            Kodee
                          </span>
                        </div>
                        <div style={{ paddingLeft: 24 }}>
                          {msg.streaming ? (
                            <StreamingMessage content={msg.content} />
                          ) : (
                            <p
                              style={{
                                fontSize: 14,
                                lineHeight: 1.6,
                                color: '#374151',
                                margin: 0,
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {msg.content}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <Sparkles
                        style={{ width: 16, height: 16, color: '#059669' }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        Kodee
                      </span>
                    </div>
                    <div style={{ paddingLeft: 24 }}>
                      <AILoadingState lines={1} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div
              style={{
                padding: '8px 16px',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                flexShrink: 0,
              }}
            >
              {attachments.map((att) => (
                <span
                  key={att.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    borderRadius: 6,
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    padding: '4px 8px',
                    fontSize: 11,
                  }}
                >
                  {att.name.length > 20
                    ? att.name.slice(0, 20) + '...'
                    : att.name}
                  <button
                    type="button"
                    onClick={() =>
                      setAttachments((p) => p.filter((a) => a.id !== att.id))
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                    }}
                  >
                    <X style={{ width: 12, height: 12, color: '#9ca3af' }} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div
            style={{
              textAlign: 'center',
              fontSize: 10,
              color: '#9ca3af',
              padding: '4px 0',
              flexShrink: 0,
            }}
          >
            L&apos;IA peut generer des informations inexactes
          </div>

          {/* Input */}
          <div
            style={{
              padding: '8px 12px 12px',
              flexShrink: 0,
              borderTop: '1px solid #f3f4f6',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 8,
                borderRadius: 16,
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                padding: '8px 12px',
              }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 9999,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Paperclip
                  style={{ width: 16, height: 16, color: '#9ca3af' }}
                />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                onChange={(e) => {
                  handleFileSelect(e.target.files);
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
              />

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
                placeholder="Posez votre question"
                rows={1}
                style={{
                  flex: 1,
                  minHeight: 24,
                  maxHeight: 100,
                  resize: 'none',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 14,
                  lineHeight: '22px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={
                  loading || (!input.trim() && attachments.length === 0)
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  border: 'none',
                  backgroundColor: '#059669',
                  color: '#fff',
                  cursor: 'pointer',
                  flexShrink: 0,
                  opacity:
                    loading || (!input.trim() && attachments.length === 0)
                      ? 0.3
                      : 1,
                }}
              >
                <Send style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
