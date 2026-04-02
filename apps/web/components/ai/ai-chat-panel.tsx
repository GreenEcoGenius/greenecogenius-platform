'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

import { useLocale } from 'next-intl';

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

/* ─── Section detection (locale-aware) ─── */

type SectionDef = {
  match: string[];
  agent: AgentType;
  name: string;
  iconEl: React.ReactNode;
  fr: { welcome: string; suggestions: string[] };
  en: { welcome: string; suggestions: string[] };
};

const SECTIONS: SectionDef[] = [
  {
    match: ['/marketplace', '/comptoir'],
    agent: 'comptoir',
    name: 'Le Comptoir Circulaire',
    iconEl: <Store className="h-3.5 w-3.5" />,
    fr: {
      welcome: 'Je suis votre assistant Comptoir Circulaire. Je peux analyser vos annonces, estimer des prix et trouver des acheteurs.',
      suggestions: ['Analyser mes annonces actives', 'Estimer le prix de ma matiere', 'Creer une nouvelle annonce', 'Trouver des acheteurs'],
    },
    en: {
      welcome: 'I am your Circular Marketplace assistant. I can analyze your listings, estimate prices, and find buyers.',
      suggestions: ['Analyze my active listings', 'Estimate my material price', 'Create a new listing', 'Find buyers'],
    },
  },
  {
    match: ['/my-listings', '/annonces'],
    agent: 'comptoir',
    name: 'Mes Annonces',
    iconEl: <PackageSearch className="h-3.5 w-3.5" />,
    fr: {
      welcome: 'Je suis votre assistant Annonces. Je peux analyser la performance de vos annonces.',
      suggestions: ['Performance de mes annonces', 'Pourquoi pas de vues ?', 'Ameliorer mes annonces', 'Publier un nouveau lot'],
    },
    en: {
      welcome: 'I am your Listings assistant. I can analyze your listing performance.',
      suggestions: ['My listings performance', 'Why no views?', 'Improve my listings', 'Publish a new lot'],
    },
  },
  {
    match: ['/carbon', '/impact'],
    agent: 'carbon',
    name: 'Impact Carbone',
    iconEl: <Leaf className="h-3.5 w-3.5" />,
    fr: {
      welcome: 'Je suis votre assistant Impact Carbone. Je peux vous guider pour completer votre bilan et generer des recommandations.',
      suggestions: ['Completer mon bilan carbone', 'Expliquer mes emissions Scope 3', 'Recommandations pour reduire', 'Generer le rapport carbone'],
    },
    en: {
      welcome: 'I am your Carbon Impact assistant. I can guide you through your carbon assessment and generate recommendations.',
      suggestions: ['Complete my carbon assessment', 'Explain my Scope 3 emissions', 'Reduction recommendations', 'Generate carbon report'],
    },
  },
  {
    match: ['/esg', '/reporting'],
    agent: 'esg',
    name: 'Reporting ESG',
    iconEl: <BarChart3 className="h-3.5 w-3.5" />,
    fr: {
      welcome: 'Je suis votre assistant Reporting ESG. Je peux completer les champs manquants et generer vos rapports CSRD/GRI.',
      suggestions: ['Completer les champs manquants', 'Generer mon rapport CSRD', 'Expliquer ma conformite ESRS', 'Comparer avec le trimestre precedent'],
    },
    en: {
      welcome: 'I am your ESG Reporting assistant. I can complete missing fields and generate your CSRD/GRI reports.',
      suggestions: ['Complete missing fields', 'Generate my CSRD report', 'Explain my ESRS compliance', 'Compare with last quarter'],
    },
  },
  {
    match: ['/traceability', '/tracabilite'],
    agent: 'traceability',
    name: 'Tracabilite',
    iconEl: <Link2 className="h-3.5 w-3.5" />,
    fr: {
      welcome: 'Je suis votre assistant Tracabilite. Je peux emettre des certificats et verifier des lots on-chain.',
      suggestions: ['Emettre les certificats en attente', 'Verifier un lot sur la blockchain', 'Resume de mes alertes', "Historique d'un lot"],
    },
    en: {
      welcome: 'I am your Traceability assistant. I can issue certificates and verify lots on-chain.',
      suggestions: ['Issue pending certificates', 'Verify a lot on blockchain', 'Summary of my alerts', 'Lot history'],
    },
  },
  {
    match: ['/rse', '/labels'],
    agent: 'rse',
    name: 'RSE & Labels',
    iconEl: <Award className="h-3.5 w-3.5" />,
    fr: {
      welcome: 'Je suis votre assistant RSE & Labels. Je peux lancer un diagnostic complet et evaluer votre eligibilite aux labels.',
      suggestions: ['Lancer un diagnostic complet', 'Comment obtenir B Corp ?', 'Que dois-je ameliorer en priorite ?', 'Generer ma feuille de route'],
    },
    en: {
      welcome: 'I am your CSR & Labels assistant. I can run a full diagnostic and evaluate your label eligibility.',
      suggestions: ['Run a full diagnostic', 'How to get B Corp?', 'What should I improve first?', 'Generate my roadmap'],
    },
  },
  {
    match: ['/compliance', '/conformite'],
    agent: 'compliance',
    name: 'Conformite',
    iconEl: <Shield className="h-3.5 w-3.5" />,
    fr: {
      welcome: 'Je suis votre assistant Conformite. Je peux lancer un pre-audit et verifier les 42 normes integrees.',
      suggestions: ['Lancer un pre-audit', 'Expliquer mes non-conformites', 'Veille reglementaire', 'Comment me conformer au RGPD ?'],
    },
    en: {
      welcome: 'I am your Compliance assistant. I can run a pre-audit and check all 42 integrated standards.',
      suggestions: ['Run a pre-audit', 'Explain my non-compliances', 'Regulatory watch', 'How to comply with GDPR?'],
    },
  },
  {
    match: ['/wallet', '/portefeuille'],
    agent: 'comptoir',
    name: 'Portefeuille',
    iconEl: <Wallet className="h-3.5 w-3.5" />,
    fr: {
      welcome: 'Je suis votre assistant Portefeuille. Je peux vous aider avec vos transactions et commissions.',
      suggestions: ['Resume de mes transactions', 'Combien ai-je gagne ce mois ?', 'Detail des commissions', 'Expliquer le systeme de commissions'],
    },
    en: {
      welcome: 'I am your Wallet assistant. I can help with your transactions and commissions.',
      suggestions: ['Summary of my transactions', 'How much did I earn this month?', 'Commission details', 'Explain the commission system'],
    },
  },
  {
    match: ['/billing', '/facturation'],
    agent: 'general',
    name: 'Facturation',
    iconEl: <CreditCard className="h-3.5 w-3.5" />,
    fr: {
      welcome: 'Je suis votre assistant Facturation. Je peux comparer les plans et vous guider.',
      suggestions: ['Comparer les plans', 'Que debloque le Plan Avance ?', 'Expliquer mon plan actuel', 'Comment changer de plan ?'],
    },
    en: {
      welcome: 'I am your Billing assistant. I can compare plans and guide you.',
      suggestions: ['Compare plans', 'What does the Advanced Plan unlock?', 'Explain my current plan', 'How to change my plan?'],
    },
  },
  {
    match: ['/settings', '/profil', '/profile'],
    agent: 'general',
    name: 'Profil',
    iconEl: <User className="h-3.5 w-3.5" />,
    fr: {
      welcome: 'Je suis votre assistant Profil. Comment puis-je vous aider avec votre compte ?',
      suggestions: ['Comment modifier mes informations ?', 'Quel est mon plan actuel ?', 'Configurer mes notifications', 'Inviter un collaborateur'],
    },
    en: {
      welcome: 'I am your Profile assistant. How can I help with your account?',
      suggestions: ['How to update my information?', 'What is my current plan?', 'Configure notifications', 'Invite a team member'],
    },
  },
];

function detectSection(pathname: string, locale: string): SectionContext {
  const lang = locale === 'fr' ? 'fr' : 'en';

  for (const s of SECTIONS) {
    if (s.match.some((m) => pathname.includes(m))) {
      return {
        agent: s.agent,
        name: s.name,
        icon: s.iconEl,
        welcome: s[lang].welcome,
        suggestions: s[lang].suggestions,
      };
    }
  }

  return {
    agent: 'general',
    name: lang === 'fr' ? 'Accueil' : 'Home',
    icon: <Home className="h-3.5 w-3.5" />,
    welcome:
      lang === 'fr'
        ? 'Bonjour ! Je suis Genius, votre assistant GreenEcoGenius. Posez-moi une question precise et je vous donnerai une reponse concrete.'
        : 'Hello! I am Genius, your GreenEcoGenius assistant. Ask me a specific question and I will give you a concrete answer.',
    suggestions:
      lang === 'fr'
        ? ['Resume de mon activite', 'Que dois-je faire en priorite ?', 'Guide-moi vers la bonne section', 'Comment fonctionne la plateforme ?']
        : ['Summary of my activity', 'What should I prioritize?', 'Guide me to the right section', 'How does the platform work?'],
  };
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
  const { chatOpen, closeChat } = useChat();
  const section = detectSection(pathname ?? '', locale);

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
              locale === 'fr'
                ? 'Desole, je rencontre une difficulte technique. Veuillez reessayer.'
                : 'Sorry, I encountered a technical issue. Please try again.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, locale, messages, section.agent],
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
            title={locale === 'fr' ? 'Importer un document' : 'Import a document'}
          >
            <Paperclip className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-metal-500 hover:bg-metal-frost hover:text-metal-700 flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            title={locale === 'fr' ? 'Nouvelle conversation' : 'New conversation'}
          >
            <PenLine className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={closeChat}
            className="text-metal-500 hover:bg-metal-frost hover:text-metal-700 flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            title={locale === 'fr' ? 'Fermer' : 'Close'}
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
        {locale === 'fr'
          ? "L'IA peut generer des informations inexactes"
          : 'AI may generate inaccurate information'}
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
            handleSend(
              locale === 'fr'
                ? `[Document importe : ${file.name}]`
                : `[Imported document: ${file.name}]`,
            );
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
            title={locale === 'fr' ? 'Joindre un fichier' : 'Attach a file'}
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
            placeholder={locale === 'fr' ? 'Posez votre question...' : 'Ask your question...'}
            rows={1}
            className="text-metal-900 placeholder:text-metal-steel max-h-[100px] min-h-[24px] flex-1 resize-none border-none bg-transparent text-[13px] leading-relaxed outline-none"
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
