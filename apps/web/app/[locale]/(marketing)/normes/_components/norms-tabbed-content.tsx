'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import {
  Award,
  ChevronRight,
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

import { AnimateOnScroll } from '../../_components/animate-on-scroll';
import { NormsRecapTable } from './norms-recap-table';
import { NormsRoadmap } from './norms-roadmap';

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
    id: 'overview',
    label: "Vue d'ensemble",
    icon: <FileText className="h-4 w-4" />,
  },
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

// ── Norm card ──

function NormCard({ norm }: { norm: Norm }) {
  return (
    <div className="rounded-lg border bg-white p-5 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold">{norm.reference}</h4>
          <p className="text-muted-foreground mt-0.5 text-xs">{norm.title}</p>
        </div>
        <Badge
          className={`shrink-0 text-[10px] ${PRIORITY_COLORS[norm.priority]}`}
        >
          {norm.priorityLabel}
        </Badge>
      </div>

      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        {norm.description}
      </p>

      <div className="mt-3 space-y-1">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground">
            Type : <span className="text-foreground">{norm.typeLabel}</span>
          </span>
          <span className="text-muted-foreground">
            Statut : <span className="text-foreground">{norm.statusLabel}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground">
            Plateforme :{' '}
            <span className="text-foreground">{norm.platformSection}</span>
          </span>
          {norm.blockchainVerified && (
            <Badge
              variant="outline"
              className="border-indigo-200 bg-indigo-50 text-[10px] text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300"
            >
              On-chain
            </Badge>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
        {norm.gegApplication}
      </p>
    </div>
  );
}

// ── Overview tab content ──

function OverviewContent() {
  return (
    <>
      {/* Recap table */}
      <NormsRecapTable />

      {/* How it works */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Comment ca fonctionne concretement ?
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Automatique',
                desc: "Les normes s'appliquent automatiquement dans chaque fonctionnalite de la plateforme. Pas de configuration.",
              },
              {
                title: 'Verifiable',
                desc: "Chaque donnee est tracable jusqu'a sa preuve blockchain sur Polygon. Anti-greenwashing garanti.",
              },
              {
                title: 'Evolutif',
                desc: "Quand une norme evolue ou qu'une nouvelle entre en vigueur, la plateforme se met a jour automatiquement.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border bg-white p-6 dark:bg-gray-900"
              >
                <h3 className="font-semibold">{card.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border bg-white p-6 dark:bg-gray-900">
            <p className="text-sm font-medium">Exemple concret :</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Quand vous publiez un lot sur Le Comptoir Circulaire, la
              plateforme applique automatiquement le Decret 9 flux
              (classification matiere), l&apos;ISO 59014 (tracabilite
              blockchain), le GHG Protocol (calcul CO2), et prepare les donnees
              pour votre rapport CSRD. En un clic.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <NormsRoadmap />

      {/* CTA */}
      <section className="bg-gray-50 py-16 sm:py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Pret a etre conforme sans effort ?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-sm">
            GreenEcoGenius applique automatiquement ces 42 normes dans chaque
            transaction, chaque calcul, chaque rapport. Essayez gratuitement
            pendant 14 jours.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              render={
                <Link href="/home">
                  Demarrer l&apos;essai gratuit
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              }
              nativeButton={false}
            />
            <Button
              variant="outline"
              render={<Link href="/home/billing">Voir les tarifs</Link>}
              nativeButton={false}
            />
            <Button
              variant="ghost"
              render={<Link href="/contact">Nous contacter</Link>}
              nativeButton={false}
            />
          </div>
        </div>
      </section>
    </>
  );
}

// ── Pillar tab content ──

function PillarContent({ pillar }: { pillar: NormPillar }) {
  const info = PILLAR_INFO[pillar];
  const norms = NORMS_DATABASE.filter((n) => n.pillar === pillar);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <h2 className="text-xl font-bold sm:text-2xl">{info.label}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {norms.length} normes integrees
          </p>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
            {info.description}
          </p>
        </AnimateOnScroll>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {norms.map((norm, i) => (
            <AnimateOnScroll key={norm.id} animation="fade-up" delay={i * 50}>
              <NormCard norm={norm} />
            </AnimateOnScroll>
          ))}
        </div>

        {pillar === 'labels' && (
          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="mt-8 rounded-xl border bg-emerald-50 p-6 dark:bg-emerald-950/20">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
                Label GreenEcoGenius
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                GreenEcoGenius developpe son propre programme de labellisation
                pour les entreprises qui utilisent la plateforme et atteignent
                un score RSE superieur a 80 points. Ce label atteste de
                l&apos;engagement verifiable de l&apos;entreprise dans
                l&apos;economie circulaire, avec preuves blockchain a
                l&apos;appui.
              </p>
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
}

// ── Main tabbed component ──

export function NormsTabbedContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Sync hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const matchedTab = TABS.find((t) => t.id === hash || t.pillar === hash);
      if (matchedTab) {
        setActiveTab(matchedTab.id);
      }
    }
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);

    // Update URL hash without scroll
    const newHash = tabId === 'overview' ? '' : `#${tabId}`;
    window.history.replaceState(null, '', newHash || window.location.pathname);

    // Scroll to content top
    if (tabBarRef.current) {
      const top =
        tabBarRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const activeTabDef = TABS.find((t) => t.id === activeTab);

  return (
    <>
      {/* Sticky tab bar */}
      <div
        ref={tabBarRef}
        className="sticky top-[64px] z-30 border-b bg-white/95 backdrop-blur-sm dark:bg-gray-950/95"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'text-[11px]',
                      activeTab === tab.id
                        ? 'text-emerald-500'
                        : 'text-gray-400 dark:text-gray-500',
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

      {/* Tab content */}
      <div ref={contentRef}>
        {activeTab === 'overview' && <OverviewContent />}
        {activeTabDef?.pillar && <PillarContent pillar={activeTabDef.pillar} />}
      </div>
    </>
  );
}
