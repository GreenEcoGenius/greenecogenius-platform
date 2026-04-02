'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

function detectSection(pathname: string): SectionContext {
  if (pathname.includes('/marketplace') || pathname.includes('/comptoir')) {
    return {
      agent: 'comptoir',
      name: 'Le Comptoir Circulaire',
      icon: <Store className="h-4 w-4" />,
      welcome:
        'Je suis votre assistant Comptoir Circulaire. Je peux analyser vos annonces, estimer des prix, trouver des acheteurs, et vous guider pour publier un lot.',
      suggestions: [
        'Analyser mes annonces actives',
        'Estimer le prix de ma matiere',
        'Creer une nouvelle annonce',
        'Trouver des acheteurs',
      ],
    };
  }

  if (pathname.includes('/my-listings') || pathname.includes('/annonces')) {
    return {
      agent: 'comptoir',
      name: 'Mes Annonces',
      icon: <PackageSearch className="h-4 w-4" />,
      welcome:
        'Je suis votre assistant Annonces. Je peux analyser la performance de vos annonces et suggerer des ameliorations.',
      suggestions: [
        'Performance de mes annonces',
        'Pourquoi pas de vues ?',
        'Ameliorer mes annonces',
        'Publier un nouveau lot',
      ],
    };
  }

  if (pathname.includes('/carbon') || pathname.includes('/impact')) {
    return {
      agent: 'carbon',
      name: 'Impact Carbone',
      icon: <Leaf className="h-4 w-4" />,
      welcome:
        'Je suis votre assistant Impact Carbone. Je peux vous guider pour completer votre bilan, expliquer vos emissions, et generer des recommandations de reduction.',
      suggestions: [
        'Completer mon bilan carbone',
        'Expliquer mes emissions Scope 3',
        'Recommandations pour reduire',
        'Generer le rapport carbone',
      ],
    };
  }

  if (pathname.includes('/esg') || pathname.includes('/reporting')) {
    return {
      agent: 'esg',
      name: 'Reporting ESG',
      icon: <BarChart3 className="h-4 w-4" />,
      welcome:
        'Je suis votre assistant Reporting ESG. Je peux vous aider a completer les champs manquants, expliquer les indicateurs ESRS, et generer vos rapports CSRD/GRI.',
      suggestions: [
        'Completer les champs manquants',
        'Generer mon rapport CSRD',
        'Expliquer ma conformite ESRS',
        'Comparer avec le trimestre precedent',
      ],
    };
  }

  if (pathname.includes('/traceability') || pathname.includes('/tracabilite')) {
    return {
      agent: 'traceability',
      name: 'Tracabilite',
      icon: <Link2 className="h-4 w-4" />,
      welcome:
        'Je suis votre assistant Tracabilite. Je peux emettre des certificats, verifier des lots on-chain, et analyser vos alertes actives.',
      suggestions: [
        'Emettre les certificats en attente',
        'Verifier un lot sur la blockchain',
        'Resume de mes alertes',
        "Historique d'un lot",
      ],
    };
  }

  if (pathname.includes('/rse') || pathname.includes('/labels')) {
    return {
      agent: 'rse',
      name: 'RSE & Labels',
      icon: <Award className="h-4 w-4" />,
      welcome:
        'Je suis votre assistant RSE & Labels, propulse par Claude Opus. Je peux lancer un diagnostic complet, evaluer votre eligibilite aux labels, et generer votre feuille de route.',
      suggestions: [
        'Lancer un diagnostic complet',
        'Comment obtenir B Corp ?',
        'Que dois-je ameliorer en priorite ?',
        'Generer ma feuille de route',
      ],
    };
  }

  if (pathname.includes('/compliance') || pathname.includes('/conformite')) {
    return {
      agent: 'compliance',
      name: 'Conformite',
      icon: <Shield className="h-4 w-4" />,
      welcome:
        'Je suis votre assistant Conformite. Je peux lancer un pre-audit, expliquer vos non-conformites, et verifier les 42 normes integrees.',
      suggestions: [
        'Lancer un pre-audit',
        'Expliquer mes non-conformites',
        'Veille reglementaire',
        'Comment me conformer au RGPD ?',
      ],
    };
  }

  if (pathname.includes('/wallet') || pathname.includes('/portefeuille')) {
    return {
      agent: 'comptoir',
      name: 'Portefeuille',
      icon: <Wallet className="h-4 w-4" />,
      welcome:
        'Je suis votre assistant Portefeuille. Je peux vous aider avec vos transactions, commissions, et solde.',
      suggestions: [
        'Resume de mes transactions',
        'Combien ai-je gagne ce mois ?',
        'Detail des commissions',
        'Expliquer le systeme de commissions',
      ],
    };
  }

  if (pathname.includes('/billing') || pathname.includes('/facturation')) {
    return {
      agent: 'general',
      name: 'Facturation',
      icon: <CreditCard className="h-4 w-4" />,
      welcome:
        'Je suis votre assistant Facturation. Je peux comparer les plans, expliquer les fonctionnalites, et vous guider.',
      suggestions: [
        'Comparer les plans',
        'Que debloque le Plan Avance ?',
        'Expliquer mon plan actuel',
        'Comment changer de plan ?',
      ],
    };
  }

  if (
    pathname.includes('/settings') ||
    pathname.includes('/profil') ||
    pathname.includes('/profile')
  ) {
    return {
      agent: 'general',
      name: 'Profil',
      icon: <User className="h-4 w-4" />,
      welcome:
        'Je suis votre assistant Profil. Comment puis-je vous aider avec votre compte ?',
      suggestions: [
        'Comment modifier mes informations ?',
        'Quel est mon plan actuel ?',
        'Configurer mes notifications',
        'Inviter un collaborateur',
      ],
    };
  }

  return {
    agent: 'general',
    name: 'Accueil',
    icon: <Home className="h-4 w-4" />,
    welcome:
      'Bonjour ! Je suis votre assistant GreenEcoGenius. Je peux vous orienter vers la bonne section, resumer votre activite, ou repondre a vos questions sur la plateforme.',
    suggestions: [
      'Resume de mon activite',
      'Que dois-je faire en priorite ?',
      'Guide-moi vers la bonne section',
      'Comment fonctionne la plateforme ?',
    ],
  };
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
  const section = detectSection(pathname ?? '');

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
            content: data.content || data.message || 'Pas de reponse.',
            streaming: true,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content:
              'Desole, je rencontre une difficulte technique. Veuillez reessayer dans quelques instants.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, section.agent],
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
          aria-label="Ouvrir l'assistant IA"
        >
          <Sparkles className="h-5 w-5" />
        </button>
      )}

      {/* ─── Chat panel ─── */}
      {open && (
        <div className="border-metal-chrome shadow-metal-900/12 fixed right-6 bottom-6 z-50 flex w-[400px] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
          {/* Header */}
          <div className="from-primary to-primary-hover flex items-center justify-between bg-gradient-to-r px-5 py-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4" />
                Assistant GreenEcoGenius
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
                aria-label="Nouvelle conversation"
                title="Nouvelle conversation"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Fermer"
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
                <div className="bg-metal-50 text-metal-700 mb-4 rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed">
                  {section.welcome}
                </div>

                {/* Quick suggestions */}
                <div className="mt-auto flex flex-col gap-2">
                  {section.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="border-metal-chrome text-metal-700 hover:border-primary/30 hover:bg-primary-light/50 hover:text-primary flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-[13px] transition-all duration-150"
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
                        <div className="bg-primary-light flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
                          <Sparkles className="text-primary h-3 w-3" />
                        </div>
                        <div className="bg-metal-50 text-metal-800 max-w-[85%] rounded-xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed">
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
                    <div className="bg-primary-light flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
                      <Sparkles className="text-primary h-3 w-3" />
                    </div>
                    <div className="bg-metal-50 rounded-xl rounded-tl-sm px-4 py-3">
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
            L&apos;IA peut generer des informations inexactes
          </div>

          {/* Input */}
          <div className="border-metal-chrome border-t p-3">
            <div className="border-metal-silver bg-metal-50 flex items-end gap-2 rounded-xl border px-3 py-2">
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
                placeholder="Posez votre question..."
                rows={1}
                className="text-metal-900 placeholder:text-metal-steel max-h-[100px] min-h-[24px] flex-1 resize-none border-none bg-transparent text-sm leading-relaxed outline-none"
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
