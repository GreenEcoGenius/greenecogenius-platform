'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Award,
  ChevronRight,
  Download,
  FileText,
  Globe,
  Link as LinkIcon,
  Recycle,
  Shield,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { cn } from '@kit/ui/utils';

import {
  NORMS_DATABASE,
  PILLAR_INFO,
  PRIORITY_COLORS,
  type Norm,
  type NormPillar,
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

const PILLAR_HERO: Record<NormPillar, string> = {
  circular_economy: '/images/normes/circular-infinity-aerial.png',
  carbon: '/images/normes/carbon-counter-1000t.png',
  reporting: '/images/normes/reporting-esg-meeting.png',
  traceability: '/images/normes/traceability-blockchain-chain.png',
  data: '/images/normes/saas-multi-device.png',
  labels: '/images/normes/labels-globe-recycle.png',
};

// ── Animated norm card with PDF download ──

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

      <div className="mt-3 flex items-end justify-between border-t pt-3">
        <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-400">
          {norm.gegApplication}
        </p>
        <button
          type="button"
          onClick={() => window.open(`/api/normes/pdf?id=${norm.id}`, '_blank')}
          className="ml-2 shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-emerald-600 dark:hover:bg-gray-800"
          title="Telecharger le PDF"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

// ── Pillar tab content ──

function PillarContent({ pillar }: { pillar: NormPillar }) {
  const info = PILLAR_INFO[pillar];
  const norms = NORMS_DATABASE.filter((n) => n.pillar === pillar);
  const heroImage = PILLAR_HERO[pillar];

  return (
    <div>
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

// ── Main tabbed component ──

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
    window.history.replaceState(null, '', `#${tabId}`);
    if (tabBarRef.current) {
      const top =
        tabBarRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const activeTabDef = TABS.find((t) => t.id === activeTab);

  return (
    <>
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

      <div className="min-h-[60vh]">
        {activeTabDef?.pillar && <PillarContent pillar={activeTabDef.pillar} />}
      </div>
    </>
  );
}
