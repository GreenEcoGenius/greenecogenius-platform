'use client';

import { useState } from 'react';

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  FileText,
  Link2,
  PackagePlus,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const STEPS = [
  { icon: PackagePlus, key: 'step1', color: 'bg-blue-900/30 text-blue-400' },
  { icon: Link2, key: 'step2', color: 'bg-purple-900/30 text-purple-400' },
  { icon: BarChart3, key: 'step3', color: 'bg-emerald-400/15 text-emerald-400' },
  { icon: FileText, key: 'step4', color: 'bg-amber-900/30 text-amber-400' },
];

export function HowItWorks() {
  const t = useTranslations('marketing');
  const [active, setActive] = useState(0);

  const step = STEPS[active]!;
  const Icon = step.icon;

  return (
    <section className="bg-[#0D3A26] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="gradient-text-verdure-leaf mb-3 text-center text-3xl font-bold sm:text-4xl">
          {t('landing.howTitle')}
        </h2>
        <p className="text-[#B8D4E3] mx-auto mb-14 max-w-xl text-center text-lg">
          {t('landing.howSub')}
        </p>

        {/* Step indicators */}
        <div className="mb-10 flex items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                i === active
                  ? 'bg-brand text-white shadow-xl shadow-black/25'
                  : 'border border-[#1A5C3E] bg-[#12472F] text-[#7DC4A0]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Active step content */}
        <div className="mx-auto max-w-2xl rounded-2xl border bg-[#0D3A26] p-8 shadow-lg shadow-black/20 transition-all sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div
              className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}
            >
              <Icon className="h-8 w-8" />
            </div>
            <p className="text-primary mb-2 text-sm font-semibold tracking-wider uppercase">
              {t('landing.stepLabel', { n: active + 1 })}
            </p>
            <h3 className="text-[#F5F5F0] mb-3 text-xl font-bold sm:text-2xl">
              {t(`landing.${step.key}Title`)}
            </h3>
            <p className="text-[#B8D4E3] text-base leading-relaxed">
              {t(`landing.${step.key}Desc`)}
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setActive((p) => Math.max(0, p - 1))}
            disabled={active === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-[#0D3A26] text-[#7DC4A0] transition-colors hover:bg-[#12472F] disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-[#7DC4A0] text-sm">
            {active + 1} / {STEPS.length}
          </span>
          <button
            type="button"
            onClick={() => setActive((p) => Math.min(STEPS.length - 1, p + 1))}
            disabled={active === STEPS.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-[#0D3A26] text-[#7DC4A0] transition-colors hover:bg-[#12472F] disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
