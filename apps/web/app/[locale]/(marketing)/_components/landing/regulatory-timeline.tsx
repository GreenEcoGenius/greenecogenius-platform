'use client';

import Link from 'next/link';

import { AlertTriangle, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

const MILESTONES = [
  { year: '2024', key: 'milestone1', urgency: 'past' as const },
  { year: '2025', key: 'milestone2', urgency: 'urgent' as const },
  { year: '2026', key: 'milestone3', urgency: 'urgent' as const },
  { year: '2026', key: 'milestone4', urgency: 'urgent' as const },
  { year: '2030', key: 'milestone5', urgency: 'future' as const },
];

const URGENCY_STYLES = {
  past: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-600',
    icon: CheckCircle,
  },
  urgent: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    icon: AlertTriangle,
  },
  future: {
    bg: 'bg-[#E6F7EF]',
    border: 'border-[#8FDAB5]',
    text: 'text-[#008F5A]',
    icon: Clock,
  },
};

export function RegulatoryTimeline() {
  const t = useTranslations('marketing');

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="gradient-text-verdure-leaf mb-3 text-center text-3xl font-bold sm:text-4xl">
          {t('landing.timelineTitle')}
        </h2>
        <p className="text-metal-600 mx-auto mb-14 max-w-2xl text-center text-lg">
          {t('landing.timelineSub')}
        </p>

        {/* Desktop: horizontal */}
        <div className="hidden gap-4 md:flex">
          {MILESTONES.map((m, i) => {
            const style = URGENCY_STYLES[m.urgency];
            const Icon = style.icon;
            return (
              <div
                key={i}
                className={`flex-1 rounded-xl border ${style.border} ${style.bg} p-5`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${style.text}`} />
                  <span className={`text-sm font-bold ${style.text}`}>
                    {m.year}
                  </span>
                  {m.urgency === 'urgent' && (
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-metal-800 text-sm font-medium">
                  {t(`landing.${m.key}`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical */}
        <div className="space-y-3 md:hidden">
          {MILESTONES.map((m, i) => {
            const style = URGENCY_STYLES[m.urgency];
            const Icon = style.icon;
            return (
              <div
                key={i}
                className={`rounded-xl border ${style.border} ${style.bg} p-4`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${style.text}`} />
                  <span className={`text-sm font-bold ${style.text}`}>
                    {m.year}
                  </span>
                  {m.urgency === 'urgent' && (
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-metal-800 text-sm">
                  {t(`landing.${m.key}`)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/home/compliance"
            className="bg-primary hover:bg-primary-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
          >
            {t('landing.timelineCta')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
