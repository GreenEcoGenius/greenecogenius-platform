'use client';

import { MapPin, Clock, User } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import { type GeolocationStep } from '~/lib/queries/traceability';

interface GeolocationTrailProps {
  steps: GeolocationStep[];
}

export function GeolocationTrail({ steps }: GeolocationTrailProps) {
  const t = useTranslations('traceability');
  const locale = useLocale();

  if (steps.length === 0) {
    return (
      <p className="rounded-xl bg-[#F5F5F0]/5 px-4 py-3 text-center text-[11px] text-[#F5F5F0]/50">
        {t('trailEmpty')}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {steps.map((step, idx) => {
        const date = step.timestamp
          ? new Date(step.timestamp).toLocaleDateString(locale, {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : null;

        const isLast = idx === steps.length - 1;

        return (
          <div key={idx} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B8D4E3]/15">
                <MapPin className="h-4 w-4 text-[#B8D4E3]" />
              </div>
              {!isLast && (
                <div className="mt-1 h-full w-px flex-1 bg-[#F5F5F0]/10" />
              )}
            </div>

            <div className="flex-1 pb-3">
              {step.step && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#B8D4E3]">
                  {step.step}
                </p>
              )}
              {step.location && (
                <p className="text-[13px] font-semibold text-[#F5F5F0]">
                  {step.location}
                </p>
              )}
              <div className="mt-0.5 space-y-0.5 text-[10px] text-[#F5F5F0]/50">
                {date && (
                  <p className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {date}
                  </p>
                )}
                {step.actor && (
                  <p className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {step.actor}
                  </p>
                )}
                {step.latitude != null && step.longitude != null && (
                  <p className="font-mono text-[10px]">
                    {step.latitude.toFixed(4)}, {step.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
