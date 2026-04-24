import { Award, Check, ExternalLink, X } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

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
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 shrink-0 text-[#00A86B]" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              {t('labelSectionTitle')}
            </h2>
          </div>
          <Badge
            variant="secondary"
            className="w-fit border-[#8FDAB5] bg-[#E6F7EF] text-[#008F5A]"
          >
            {t('labelsAccessible', {
              eligible: eligibleCount,
              total: labels.length,
            })}
          </Badge>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {labels.map((l) => (
            <div
              key={l.id}
              className="rounded-xl border border-gray-100 bg-white p-3 sm:p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                    {l.label}
                  </h3>
                  <p className="text-[11px] text-gray-500 sm:text-xs">{l.organism}</p>
                </div>
                {l.eligible ? (
                  <Badge className="shrink-0 border-[#8FDAB5] bg-[#E6F7EF] text-[11px] text-[#008F5A] sm:text-xs">
                    {t('eligible')}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="shrink-0 border-gray-200 text-[11px] text-gray-500 sm:text-xs"
                  >
                    {t('inProgress')}
                  </Badge>
                )}
              </div>

              <div className="mb-2 sm:mb-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500 sm:text-xs">
                  <span>{t('labelCoverage')}</span>
                  <span className="font-medium">{l.coverage}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full transition-all ${
                      l.coverage >= 80
                        ? 'bg-[#E6F7EF]0'
                        : l.coverage >= 50
                          ? 'bg-amber-500'
                          : 'bg-gray-300'
                    }`}
                    style={{ width: `${l.coverage}%` }}
                  />
                </div>
              </div>

              <p className="mb-2 text-xs text-gray-600 sm:mb-3 sm:text-sm">
                {l.message}
              </p>

              {(l.criteria_met.length > 0 ||
                l.criteria_missing.length > 0) && (
                <ul className="mb-2 space-y-1 text-[11px] sm:mb-3 sm:text-xs">
                  {l.criteria_met.map((c) => (
                    <li
                      key={`met-${c}`}
                      className="flex items-start gap-1.5 text-[#008F5A]"
                    >
                      <Check
                        className="mt-0.5 h-3 w-3 shrink-0"
                        strokeWidth={2}
                      />
                      <span>{c}</span>
                    </li>
                  ))}
                  {l.criteria_missing.map((c) => (
                    <li
                      key={`miss-${c}`}
                      className="flex items-start gap-1.5 text-gray-400"
                    >
                      <X className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2} />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs sm:text-sm"
                nativeButton={false}
                render={
                  <a href={l.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink
                      className="mr-1.5 h-3.5 w-3.5"
                      strokeWidth={1.5}
                    />
                    {t('learnMore')}
                  </a>
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
