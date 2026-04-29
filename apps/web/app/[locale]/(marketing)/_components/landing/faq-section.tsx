'use client';

import { useState } from 'react';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FAQ_KEYS = ['faq1', 'faq2', 'faq3', 'faq4'];

export function FaqSection() {
  const t = useTranslations('marketing');
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="gradient-text-verdure-leaf mb-3 text-center text-3xl font-bold sm:text-4xl">
          {t('landing.faqTitle')}
        </h2>
        <p className="text-metal-600 mx-auto mb-14 max-w-xl text-center text-lg">
          {t('landing.faqSub')}
        </p>

        <div className="space-y-3">
          {FAQ_KEYS.map((key, i) => {
            const isOpen = open === i;
            return (
              <div
                key={key}
                className="overflow-hidden rounded-xl border bg-card transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-metal-900 pr-4 text-sm font-semibold">
                    {t(`landing.${key}Q`)}
                  </span>
                  <ChevronDown
                    className={`text-metal-400 h-5 w-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="text-metal-600 border-t px-6 py-4 text-sm leading-relaxed">
                    {t(`landing.${key}A`)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
