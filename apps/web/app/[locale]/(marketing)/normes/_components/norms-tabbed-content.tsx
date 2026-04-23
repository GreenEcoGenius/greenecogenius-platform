'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import {
  Award,
  Download,
  FileText,
  Globe,
  Link as LinkIcon,
  Recycle,
  Shield,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@kit/ui/badge';
import { cn } from '@kit/ui/utils';

import { FadeInSection } from '~/components/enviro/animations/fade-in-section';
import {
  StaggerContainer,
  StaggerItem,
} from '~/components/enviro/animations/stagger-container';
import {
  NORMS_DATABASE,
  PRIORITY_COLORS,
  getLocalizedPillarInfo,
  localizeNorm,
  type Norm,
  type NormPillar,
} from '~/lib/data/norms-database';

interface TabDef {
  id: string;
  label: string;
  count?: number;
  icon: React.ReactNode;
  pillar?: NormPillar;
}

const TAB_DEFS: Array<{
  id: string;
  labelKey: string;
  count: number;
  icon: React.ReactNode;
  pillar: NormPillar;
}> = [
  {
    id: 'circular_economy',
    labelKey: 'tabCircular',
    count: 11,
    icon: <Recycle className="h-4 w-4" strokeWidth={1.5} />,
    pillar: 'circular_economy',
  },
  {
    id: 'carbon',
    labelKey: 'tabCarbon',
    count: 7,
    icon: <Globe className="h-4 w-4" strokeWidth={1.5} />,
    pillar: 'carbon',
  },
  {
    id: 'reporting',
    labelKey: 'tabReporting',
    count: 9,
    icon: <FileText className="h-4 w-4" strokeWidth={1.5} />,
    pillar: 'reporting',
  },
  {
    id: 'traceability',
    labelKey: 'tabTraceability',
    count: 6,
    icon: <LinkIcon className="h-4 w-4" strokeWidth={1.5} />,
    pillar: 'traceability',
  },
  {
    id: 'data',
    labelKey: 'tabData',
    count: 5,
    icon: <Shield className="h-4 w-4" strokeWidth={1.5} />,
    pillar: 'data',
  },
  {
    id: 'labels',
    labelKey: 'tabLabels',
    count: 4,
    icon: <Award className="h-4 w-4" strokeWidth={1.5} />,
    pillar: 'labels',
  },
];

const PILLAR_HERO: Record<NormPillar, string> = {
  circular_economy: '/images/normes/circular-recycling-process.png',
  carbon: '/images/normes/carbon-dashboard-dark.png',
  reporting: '/images/normes/reporting-co2-dashboard.png',
  traceability: '/images/normes/traceability-blockchain-dark.png',
  data: '/images/normes/saas-carbon-dashboard.png',
  labels: '/images/normes/labels-csrd-mobile-v2.png',
};

function NormCard({
  norm,
  locale,
  downloadLabel,
  onChainLabel,
}: {
  norm: Norm;
  locale: string;
  downloadLabel: string;
  onChainLabel: string;
}) {
  return (
    <div
      className={cn(
        'group/norm-card flex flex-col rounded-[--radius-enviro-xl] border border-[--color-enviro-cream-300] bg-white p-5 shadow-[--shadow-enviro-card] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[--color-enviro-forest-700] hover:shadow-[--shadow-enviro-lg]',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[--color-enviro-cta] font-[family-name:var(--font-enviro-mono)]">
            {norm.reference}
          </p>
          <h3 className="mt-1 text-sm leading-snug font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
            {norm.title}
          </h3>
        </div>
        <Badge
          className={cn(
            'shrink-0 text-[10px] font-medium font-[family-name:var(--font-enviro-mono)]',
            PRIORITY_COLORS[norm.priority],
          )}
        >
          {norm.priorityLabel}
        </Badge>
      </div>

      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
        {norm.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-[family-name:var(--font-enviro-mono)]">
        <span className="rounded-[--radius-enviro-pill] bg-[--color-enviro-cream-100] px-2 py-0.5 font-medium text-[--color-enviro-forest-700]">
          {norm.typeLabel}
        </span>
        <span className="text-[--color-enviro-forest-600]">{norm.statusLabel}</span>
        {norm.blockchainVerified ? (
          <span className="rounded-[--radius-enviro-pill] border border-[--color-enviro-lime-400] bg-[--color-enviro-lime-300]/30 px-2 py-0.5 font-medium text-[--color-enviro-forest-900]">
            {onChainLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-auto flex items-end justify-between gap-2 border-t border-[--color-enviro-cream-300] pt-3">
        <p className="text-[11px] leading-relaxed text-[--color-enviro-cta] font-[family-name:var(--font-enviro-sans)]">
          {norm.gegApplication}
        </p>
        <button
          type="button"
          onClick={() => {
            window.open(
              `/api/normes/pdf?id=${norm.id}&locale=${locale}`,
              '_blank',
              'noopener,noreferrer',
            );
          }}
          aria-label={downloadLabel}
          className="ml-2 shrink-0 rounded-[--radius-enviro-md] p-1.5 text-[--color-enviro-forest-600] transition-colors hover:bg-[--color-enviro-cream-100] hover:text-[--color-enviro-cta]"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function PillarContent({
  pillar,
  locale,
  downloadLabel,
  onChainLabel,
  labelsPreparationTitle,
  labelsPreparationDesc,
}: {
  pillar: NormPillar;
  locale: string;
  downloadLabel: string;
  onChainLabel: string;
  labelsPreparationTitle: string;
  labelsPreparationDesc: string;
}) {
  const pillarInfo = getLocalizedPillarInfo(locale);
  const info = pillarInfo[pillar];
  const norms = NORMS_DATABASE.filter((n) => n.pillar === pillar).map((n) =>
    localizeNorm(n, locale),
  );
  const heroImage = PILLAR_HERO[pillar];
  const isFr = locale === 'fr';

  return (
    <div>
      <div className="relative h-64 overflow-hidden sm:h-80">
        <Image
          src={heroImage}
          alt={info.label}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,50,50,0.95),rgba(6,50,50,0.4)_60%,transparent)]"
        />
        <div className="absolute inset-x-0 bottom-0 px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
          <div className="mx-auto w-full max-w-[--container-enviro-xl]">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[</span>
              <span className="px-1">
                {norms.length}{' '}
                {isFr ? 'normes intégrées' : 'integrated standards'}
              </span>
              <span aria-hidden="true">]</span>
            </p>
            <h2 className="mt-2 text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-display)]">
              {info.label}
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
              {info.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 py-12 sm:px-6 lg:px-8">
        <StaggerContainer
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {norms.map((norm) => (
            <StaggerItem key={norm.id}>
              <NormCard
                norm={norm}
                locale={locale}
                downloadLabel={downloadLabel}
                onChainLabel={onChainLabel}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {pillar === 'labels' ? (
          <FadeInSection>
            <div className="mt-10 rounded-[--radius-enviro-3xl] bg-[--color-enviro-forest-900] p-6 text-[--color-enviro-fg-inverse] sm:p-8">
              <h3 className="text-lg font-semibold font-[family-name:var(--font-enviro-display)]">
                {labelsPreparationTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
                {labelsPreparationDesc}
              </p>
            </div>
          </FadeInSection>
        ) : null}
      </div>
    </div>
  );
}

export function NormsTabbedContent() {
  const t = useTranslations('normes');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState('circular_economy');
  const tabBarRef = useRef<HTMLDivElement>(null);

  const TABS: TabDef[] = useMemo(
    () =>
      TAB_DEFS.map((td) => ({
        id: td.id,
        label: t(td.labelKey),
        count: td.count,
        icon: td.icon,
        pillar: td.pillar,
      })),
    [t],
  );

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const matched = TABS.find(
        (tab) => tab.id === hash || tab.pillar === hash,
      );
      if (matched) setActiveTab(matched.id);
    }
  }, [TABS]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#${tabId}`);
    if (tabBarRef.current) {
      const top =
        tabBarRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const activeTabDef = TABS.find((tab) => tab.id === activeTab);

  const downloadLabel = t('downloadPdf');
  const onChainLabel = t('onChain');
  const labelsPreparationTitle = t('labelsPreparation');
  const labelsPreparationDesc = t('labelsPreparationDesc');

  return (
    <>
      <div
        ref={tabBarRef}
        className="sticky top-[64px] z-30 border-b border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50]/95 backdrop-blur-sm"
      >
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 sm:px-6 lg:px-8">
          <div
            className="scrollbar-none flex gap-2 overflow-x-auto py-3"
            role="tablist"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-[--radius-enviro-pill] border px-4 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] font-[family-name:var(--font-enviro-sans)]',
                    isActive
                      ? 'border-[--color-enviro-forest-900] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300] shadow-[--shadow-enviro-md]'
                      : 'border-[--color-enviro-cream-300] bg-white text-[--color-enviro-forest-700] hover:border-[--color-enviro-forest-700] hover:bg-[--color-enviro-cream-100]',
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined ? (
                    <span
                      className={cn(
                        'text-[11px]',
                        isActive
                          ? 'text-[--color-enviro-lime-300]'
                          : 'text-[--color-enviro-forest-600]',
                      )}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-h-[60vh] bg-[--color-enviro-cream-50]">
        {activeTabDef?.pillar ? (
          <PillarContent
            pillar={activeTabDef.pillar}
            locale={locale}
            downloadLabel={downloadLabel}
            onChainLabel={onChainLabel}
            labelsPreparationTitle={labelsPreparationTitle}
            labelsPreparationDesc={labelsPreparationDesc}
          />
        ) : null}
      </div>
    </>
  );
}
