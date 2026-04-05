import { Award, Check, ExternalLink, X } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import type { LabelEligibility } from '~/lib/services/label-eligibility-service';

interface LabelEligibilitySectionProps {
  labels: LabelEligibility[];
}

export function LabelEligibilitySection({
  labels,
}: LabelEligibilitySectionProps) {
  const eligibleCount = labels.filter((l) => l.eligible).length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-gray-900">
              Eligibilite aux labels
            </h2>
          </div>
          <Badge
            variant="secondary"
            className="border-emerald-100 bg-emerald-50 text-emerald-700"
          >
            {eligibleCount}/{labels.length} labels accessibles
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {labels.map((l) => (
            <div
              key={l.id}
              className="rounded-xl border border-gray-100 bg-white p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-900">
                    {l.label}
                  </h3>
                  <p className="text-xs text-gray-500">{l.organism}</p>
                </div>
                {l.eligible ? (
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    Eligible
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-gray-200 text-gray-500"
                  >
                    En progression
                  </Badge>
                )}
              </div>

              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                  <span>Couverture</span>
                  <span className="font-medium">{l.coverage}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full transition-all ${
                      l.coverage >= 80
                        ? 'bg-emerald-500'
                        : l.coverage >= 50
                          ? 'bg-amber-500'
                          : 'bg-gray-300'
                    }`}
                    style={{ width: `${l.coverage}%` }}
                  />
                </div>
              </div>

              <p className="mb-3 text-sm text-gray-600">{l.message}</p>

              {(l.criteria_met.length > 0 ||
                l.criteria_missing.length > 0) && (
                <ul className="mb-3 space-y-1 text-xs">
                  {l.criteria_met.map((c) => (
                    <li
                      key={`met-${c}`}
                      className="flex items-start gap-1.5 text-emerald-700"
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
                className="w-full"
                nativeButton={false}
                render={
                  <a href={l.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink
                      className="mr-1.5 h-3.5 w-3.5"
                      strokeWidth={1.5}
                    />
                    En savoir plus
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
