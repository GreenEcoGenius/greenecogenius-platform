'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Award,
  BarChart3,
  FileText,
  Home,
  Leaf,
  Link2,
  Recycle,
  Search,
  Shield,
  X,
} from 'lucide-react';

const SEARCH_ITEMS = [
  {
    category: 'Sections',
    items: [
      {
        label: 'Dashboard',
        icon: <Home className="h-4 w-4" />,
        href: '/home',
      },
      {
        label: 'Le Comptoir Circulaire',
        icon: <Recycle className="h-4 w-4" />,
        href: '/home/marketplace',
      },
      {
        label: 'Impact Carbone',
        icon: <Leaf className="h-4 w-4" />,
        href: '/home/carbon',
      },
      {
        label: 'Reporting ESG',
        icon: <BarChart3 className="h-4 w-4" />,
        href: '/home/esg',
      },
      {
        label: 'Tracabilite',
        icon: <Link2 className="h-4 w-4" />,
        href: '/home/traceability',
      },
      {
        label: 'RSE & Labels',
        icon: <Award className="h-4 w-4" />,
        href: '/home/rse',
      },
      {
        label: 'Conformite',
        icon: <Shield className="h-4 w-4" />,
        href: '/home/compliance',
      },
    ],
  },
  {
    category: 'Actions rapides',
    items: [
      {
        label: 'Creer une annonce',
        icon: <Recycle className="h-4 w-4" />,
        href: '/home/marketplace/new',
      },
      {
        label: 'Generer un rapport ESG',
        icon: <FileText className="h-4 w-4" />,
        href: '/home/esg',
      },
      {
        label: 'Lancer un diagnostic RSE',
        icon: <Award className="h-4 w-4" />,
        href: '/home/rse',
      },
      {
        label: 'Emettre un certificat',
        icon: <Link2 className="h-4 w-4" />,
        href: '/home/traceability',
      },
    ],
  },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [open]);

  // Lock body scroll
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

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const filtered = query.trim()
    ? SEARCH_ITEMS.map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()),
        ),
      })).filter((group) => group.items.length > 0)
    : SEARCH_ITEMS;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="bg-metal-900/40 absolute inset-0 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="border-metal-chrome relative w-full max-w-lg overflow-hidden rounded-2xl border bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="border-metal-chrome flex items-center gap-3 border-b px-4 py-3">
          <Search className="text-metal-steel h-5 w-5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher dans GreenEcoGenius..."
            className="text-metal-900 placeholder:text-metal-steel flex-1 border-none bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-metal-steel hover:text-metal-700 shrink-0 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-metal-500 py-8 text-center text-sm">
              Aucun resultat pour &laquo; {query} &raquo;
            </p>
          ) : (
            filtered.map((group) => (
              <div key={group.category} className="mb-2">
                <p className="text-metal-500 px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                  {group.category}
                </p>
                {group.items.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => navigate(item.href)}
                    className="text-metal-700 hover:bg-metal-frost hover:text-metal-900 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors"
                  >
                    <span className="text-metal-500">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="border-metal-chrome text-metal-steel flex items-center justify-between border-t px-4 py-2 text-[11px]">
          <span>Naviguer avec les fleches</span>
          <span>
            <kbd className="border-metal-chrome bg-metal-50 rounded border px-1 py-0.5">
              Esc
            </kbd>{' '}
            pour fermer
          </span>
        </div>
      </div>
    </div>
  );
}

export function useGlobalSearch() {
  const [, setForceOpen] = useState(false);

  const openSearch = useCallback(() => {
    // Dispatch a keyboard event to trigger the ⌘K handler
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      }),
    );
  }, []);

  return { openSearch };
}
