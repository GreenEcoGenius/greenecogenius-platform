'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Award,
  ChevronRight,
  FileText,
  Globe,
  Link as LinkIcon,
  Recycle,
  Search,
  Shield,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { cn } from '@kit/ui/utils';

import {
  NORMS_DATABASE,
  PILLAR_INFO,
  PRIORITY_COLORS,
  type Norm,
  type NormPillar,
  type NormType,
} from '~/lib/data/norms-database';

// ── Tab definitions ──

interface TabDef {
  id: string;
  label: string;
  count?: number;
  icon: React.ReactNode;
  pillar?: NormPillar;
}

const TABS: TabDef[] = [
  {
    id: 'circular_economy',
    label: 'Economie circulaire',
    count: 11,
    icon: <Recycle className="h-4 w-4" />,
    pillar: 'circular_economy',
  },
  {
    id: 'carbon',
    label: 'Bilan carbone',
    count: 7,
    icon: <Globe className="h-4 w-4" />,
    pillar: 'carbon',
  },
  {
    id: 'reporting',
    label: 'Reporting ESG',
    count: 9,
    icon: <FileText className="h-4 w-4" />,
    pillar: 'reporting',
  },
  {
    id: 'traceability',
    label: 'Tracabilite',
    count: 6,
    icon: <LinkIcon className="h-4 w-4" />,
    pillar: 'traceability',
  },
  {
    id: 'data',
    label: 'Donnees & SaaS',
    count: 5,
    icon: <Shield className="h-4 w-4" />,
    pillar: 'data',
  },
  {
    id: 'labels',
    label: 'Labels',
    count: 4,
    icon: <Award className="h-4 w-4" />,
    pillar: 'labels',
  },
];

// ── Pillar hero images ──

const PILLAR_HERO: Record<NormPillar, string> = {
  circular_economy: '/images/normes/circular-infinity-aerial.png',
  carbon: '/images/normes/carbon-counter-1000t.png',
  reporting: '/images/normes/reporting-esg-meeting.png',
  traceability: '/images/normes/traceability-blockchain-chain.png',
  data: '/images/normes/saas-multi-device.png',
  labels: '/images/normes/labels-globe-recycle.png',
};

// ── Animated norm card ──

function NormCard({ norm, index }: { norm: Norm; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'group rounded-xl border bg-white p-5 transition-all duration-700 dark:bg-gray-900',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        'hover:-translate-y-1 hover:shadow-lg',
      )}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
            {norm.reference}
          </p>
          <h4 className="mt-1 text-sm leading-snug font-semibold">
            {norm.title}
          </h4>
        </div>
        <Badge
          className={`shrink-0 text-[10px] ${PRIORITY_COLORS[norm.priority]}`}
        >
          {norm.priorityLabel}
        </Badge>
      </div>

      <p className="text-muted-foreground mt-3 line-clamp-3 text-xs leading-relaxed">
        {norm.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px]">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {norm.typeLabel}
        </span>
        <span className="text-muted-foreground">{norm.statusLabel}</span>
        {norm.blockchainVerified && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            On-chain
          </span>
        )}
      </div>

      <div className="mt-3 border-t pt-3">
        <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-400">
          {norm.gegApplication}
        </p>
      </div>
    </div>
  );
}

// Pillar tabs only (overview removed)
function _unused() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<NormType | 'all'>('all');

  const filtered = NORMS_DATABASE.filter((n) => {
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        n.reference.toLowerCase().includes(q) ||
        n.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const TYPE_FILTERS: Array<{ value: NormType | 'all'; label: string }> = [
    { value: 'all', label: 'Tous' },
    { value: 'iso', label: 'ISO' },
    { value: 'regulation_eu', label: 'UE' },
    { value: 'law_fr', label: 'France' },
    { value: 'framework', label: 'Frameworks' },
    { value: 'label', label: 'Labels' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Stats strip */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { value: '42', label: 'Normes integrees', color: 'text-emerald-600' },
          { value: '6', label: 'Piliers couverts', color: 'text-teal-600' },
          { value: '15', label: 'Normes ISO', color: 'text-green-600' },
          {
            value: '100%',
            label: 'Conformite auto',
            color: 'text-emerald-600',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-white p-4 text-center dark:bg-gray-900"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-muted-foreground mt-1 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* How it works - visual cards */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: 'Automatique',
            desc: "Les normes s'appliquent dans chaque fonctionnalite. Zero configuration.",
            gradient: 'from-teal-500 to-teal-700',
          },
          {
            title: 'Verifiable',
            desc: "Chaque donnee est tracable jusqu'a sa preuve blockchain sur Polygon.",
            gradient: 'from-emerald-500 to-emerald-700',
          },
          {
            title: 'Evolutif',
            desc: 'Quand une norme evolue, la plateforme se met a jour automatiquement.',
            gradient: 'from-green-500 to-green-700',
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl bg-gradient-to-br ${card.gradient} p-6 text-white`}
          >
            <p className="text-2xl font-bold">{card.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chercher une norme..."
            className="h-9 pl-9 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setTypeFilter(f.value)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                typeFilter === f.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Norm cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((norm, i) => (
          <NormCard key={norm.id} norm={norm} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">
          Aucune norme trouvee
        </p>
      )}

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-center text-white sm:p-12">
        <h2 className="text-2xl font-bold sm:text-3xl">42 normes, 0 effort</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
          GreenEcoGenius applique automatiquement ces normes dans chaque
          transaction, chaque calcul, chaque rapport.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            className="bg-white text-emerald-700 hover:bg-white/90"
            render={
              <Link href="/home">
                Demarrer gratuitement
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            }
            nativeButton={false}
          />
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            render={<Link href="/contact">Nous contacter</Link>}
            nativeButton={false}
          />
        </div>
      </div>
    </div>
  );
}

// ── Pillar tab ──

function PillarContent({ pillar }: { pillar: NormPillar }) {
  const info = PILLAR_INFO[pillar];
  const norms = NORMS_DATABASE.filter((n) => n.pillar === pillar);
  const heroImage = PILLAR_HERO[pillar];

  return (
    <div>
      {/* Immersive hero */}
      <div className="relative h-64 overflow-hidden sm:h-80">
        <Image src={heroImage} alt={info.label} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
            {norms.length} normes integrees
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            {info.label}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            {info.description}
          </p>
        </div>
      </div>

      {/* Norm cards */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {norms.map((norm, i) => (
            <NormCard key={norm.id} norm={norm} index={i} />
          ))}
        </div>

        {pillar === 'labels' && (
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white sm:p-8">
            <h3 className="text-lg font-bold">Label GreenEcoGenius</h3>
            <p className="mt-2 text-sm text-white/80">
              Notre programme de labellisation recompense les entreprises qui
              atteignent un score RSE superieur a 80 points avec preuves
              blockchain. Engagement verifiable, zero greenwashing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ──

export function NormsTabbedContent() {
  const [activeTab, setActiveTab] = useState('circular_economy');
  const tabBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const matched = TABS.find((t) => t.id === hash || t.pillar === hash);
      if (matched) setActiveTab(matched.id);
    }
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    const newHash = `#${tabId}`;
    window.history.replaceState(null, '', newHash || window.location.pathname);
    if (tabBarRef.current) {
      const top =
        tabBarRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const activeTabDef = TABS.find((t) => t.id === activeTab);

  return (
    <>
      {/* Sticky tabs */}
      <div
        ref={tabBarRef}
        className="sticky top-[64px] z-30 border-b bg-white/95 backdrop-blur-sm dark:bg-gray-950/95"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="scrollbar-none -mb-px flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400',
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'text-[11px]',
                      activeTab === tab.id
                        ? 'text-emerald-500'
                        : 'text-gray-400',
                    )}
                  >
                    ({tab.count})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[60vh]">
        {activeTabDef?.pillar && <PillarContent pillar={activeTabDef.pillar} />}
      </div>
    </>
  );
}
