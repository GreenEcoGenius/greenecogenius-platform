import { Badge } from '@kit/ui/badge';

import {
  NORMS_DATABASE,
  PILLAR_INFO,
  PILLAR_ORDER,
  PRIORITY_COLORS,
  type Norm,
} from '~/lib/data/norms-database';

import { AnimateOnScroll } from '../../_components/animate-on-scroll';

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

export function NormsPillarSections() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {PILLAR_ORDER.map((pillarKey) => {
          const info = PILLAR_INFO[pillarKey];
          const norms = NORMS_DATABASE.filter((n) => n.pillar === pillarKey);

          return (
            <div
              key={pillarKey}
              id={`pillar-${info.label.toLowerCase().replace(/[^a-z]/g, '-')}`}
              className="mb-16 last:mb-0"
            >
              <AnimateOnScroll animation="fade-up">
                <h2 className="text-xl font-bold sm:text-2xl">{info.label}</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {norms.length} normes integrees
                </p>
                <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
                  {info.description}
                </p>
              </AnimateOnScroll>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {norms.map((norm, i) => (
                  <AnimateOnScroll
                    key={norm.id}
                    animation="fade-up"
                    delay={i * 50}
                  >
                    <NormCard norm={norm} />
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
