import { Award, Check, ExternalLink, X } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { cn } from '@kit/ui/utils';

import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
} from '~/components/enviro/enviro-card';
import type { LabelEligibility } from '~/lib/services/label-eligibility-service';

interface LabelEligibilitySectionProps {
  labels: LabelEligibility[];
}

export async function LabelEligibilitySection({
  labels,
}: LabelEligibilitySectionProps) {
  const t = await getTranslations('rse');
  const eligibleCount = labels.filter((l) => l.eligible).length;

  return (
    <EnviroCard variant="cream" hover="none" padding="md">
      <EnviroCardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Award
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-[--color-enviro-lime-700]"
              strokeWidth={1.5}
            />
            <h2 className="text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)] sm:text-xl">
              {t('labelSectionTitle')}
            </h2>
          </div>
          <span className="inline-flex w-fit items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-100] px-2.5 py-0.5 text-[11px] font-semibold text-[--color-enviro-lime-800]">
            {t('labelsAccessible', {
              eligible: eligibleCount,
              total: labels.length,
            })}
          </span>
        </div>
      </EnviroCardHeader>
      <EnviroCardBody className="grid gap-3 pt-5 sm:gap-4 md:grid-cols-2">
        {labels.map((l) => (
          <div
            key={l.id}
            className="flex flex-col gap-2 rounded-[--radius-enviro-md] border border-[--color-enviro-cream-200] bg-[--color-enviro-bg-elevated] p-3 sm:p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-[--color-enviro-forest-900] sm:text-base">
                  {l.label}
                </h3>
                <p className="text-[11px] text-[--color-enviro-forest-700] sm:text-xs">
                  {l.organism}
                </p>
              </div>
              {l.eligible ? (
                <span className="inline-flex shrink-0 items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-100] px-2 py-0.5 text-[11px] font-semibold text-[--color-enviro-lime-800] sm:text-xs">
                  {t('eligible')}
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] px-2 py-0.5 text-[11px] font-semibold text-[--color-enviro-forest-700] sm:text-xs">
                  {t('inProgress')}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] text-[--color-enviro-forest-700] sm:text-xs">
                <span>{t('labelCoverage')}</span>
                <span className="font-medium tabular-nums">{l.coverage}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-[--radius-enviro-pill] bg-[--color-enviro-cream-200]">
                <div
                  className={cn(
                    'h-full rounded-[--radius-enviro-pill] transition-all duration-700',
                    l.coverage >= 80
                      ? 'bg-[--color-enviro-lime-500]'
                      : l.coverage >= 50
                        ? 'bg-[--color-enviro-ember-400]'
                        : 'bg-[--color-enviro-cream-300]',
                  )}
                  style={{ width: `${l.coverage}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-[--color-enviro-forest-700] sm:text-sm">
              {l.message}
            </p>

            {l.criteria_met.length > 0 || l.criteria_missing.length > 0 ? (
              <ul className="flex flex-col gap-1 text-[11px] sm:text-xs">
                {l.criteria_met.map((c) => (
                  <li
                    key={`met-${c}`}
                    className="flex items-start gap-1.5 text-[--color-enviro-lime-700]"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-3 w-3 shrink-0"
                      strokeWidth={2}
                    />
                    <span>{c}</span>
                  </li>
                ))}
                {l.criteria_missing.map((c) => (
                  <li
                    key={`miss-${c}`}
                    className="flex items-start gap-1.5 text-[--color-enviro-forest-700]/70"
                  >
                    <X
                      aria-hidden="true"
                      className="mt-0.5 h-3 w-3 shrink-0"
                      strokeWidth={2}
                    />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <EnviroButton
              variant="secondary"
              size="sm"
              className="w-full"
              render={(buttonProps) => (
                <a
                  {...buttonProps}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    strokeWidth={1.5}
                  />
                  {t('learnMore')}
                </a>
              )}
            />
          </div>
        ))}
      </EnviroCardBody>
    </EnviroCard>
  );
}
