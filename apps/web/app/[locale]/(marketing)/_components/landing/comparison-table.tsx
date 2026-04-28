'use client';

import Link from 'next/link';

import { ArrowRight, Check, Lightbulb, Minus, Star, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FEATURES = [
  { key: 'marketplace', geg: 'yes', greenly: 'no', sweep: 'no', internal: 'no' },
  { key: 'blockchain', geg: 'yes', greenly: 'no', sweep: 'no', internal: 'no' },
  { key: 'carbonScopes', geg: 'yes', greenly: 'yes', sweep: 'yes', internal: 'partial' },
  { key: 'csrdReport', geg: 'yes', greenly: 'yes', sweep: 'yes', internal: 'no' },
  { key: 'ademeBase', geg: 'yes', greenly: 'yes', sweep: 'partial', internal: 'no' },
  { key: 'agecRep', geg: 'yes', greenly: 'partial', sweep: 'partial', internal: 'no' },
  { key: 'blockchainCerts', geg: 'yes', greenly: 'no', sweep: 'no', internal: 'no' },
  { key: 'csrLabels', geg: 'yes', greenly: 'no', sweep: 'partial', internal: 'no' },
  { key: 'apiWebhooks', geg: 'yes', greenly: 'yes', sweep: 'yes', internal: 'na' },
  { key: 'entryPrice', geg: 'price', greenly: 'price', sweep: 'price', internal: 'price' },
] as const;

const PRICES: Record<string, string> = {
  geg: '149\u202F\u20AC/mois',
  greenly: '~500\u202F\u20AC/mois',
  sweep: '~800\u202F\u20AC/mois',
  internal: '\u2014',
};

type CellValue = 'yes' | 'no' | 'partial' | 'na' | 'price';

function CellIcon({ value, col }: { value: CellValue; col: string }) {
  if (value === 'price') {
    return (
      <span className={`text-xs font-semibold ${col === 'geg' ? 'text-[#008F5A]' : 'text-metal-600'}`}>
        {PRICES[col]}
      </span>
    );
  }

  if (value === 'yes') {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#8FDAB5]">
        <Check className="h-4 w-4 text-[#00A86B]" strokeWidth={2.5} />
      </span>
    );
  }

  if (value === 'partial') {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
        <Minus className="h-4 w-4 text-amber-600" strokeWidth={2.5} />
      </span>
    );
  }

  if (value === 'no') {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-50">
        <X className="h-4 w-4 text-red-400" strokeWidth={2.5} />
      </span>
    );
  }

  return <span className="text-metal-300">&mdash;</span>;
}

function LegendDot({ type, label }: { type: 'yes' | 'partial' | 'no'; label: string }) {
  const styles = {
    yes: 'bg-[#8FDAB5] text-[#00A86B]',
    partial: 'bg-amber-100 text-amber-600',
    no: 'bg-red-50 text-red-400',
  };
  const icons = {
    yes: <Check className="h-3 w-3" strokeWidth={2.5} />,
    partial: <Minus className="h-3 w-3" strokeWidth={2.5} />,
    no: <X className="h-3 w-3" strokeWidth={2.5} />,
  };

  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${styles[type]}`}>
        {icons[type]}
      </span>
      <span>{label}</span>
    </span>
  );
}

export function ComparisonTable() {
  const t = useTranslations('marketing');

  const columns = ['geg', 'greenly', 'sweep', 'internal'] as const;
  const columnHeaders: Record<string, string> = {
    geg: 'GreenEcoGenius',
    greenly: 'Greenly',
    sweep: 'Sweep',
    internal: t('landing.compInternal'),
  };

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="gradient-text-verdure-leaf mb-3 text-center text-3xl font-bold sm:text-4xl">
          {t('landing.compTitle')}
        </h2>
        <p className="text-metal-600 mx-auto mb-14 max-w-2xl text-center text-lg">
          {t('landing.compSub')}
        </p>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-2xl border bg-white shadow-sm md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  {t('landing.compFeature')}
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className={`px-4 py-4 text-center text-xs font-semibold tracking-wider uppercase ${
                      col === 'geg'
                        ? 'bg-[#E6F7EF] text-[#008F5A]'
                        : 'text-gray-500'
                    }`}
                  >
                    {col === 'geg' && (
                      <span className="mb-1 flex items-center justify-center gap-1 text-[10px] font-bold">
                        <Star className="h-3 w-3" />
                        {t('landing.compRecommended')}
                      </span>
                    )}
                    {columnHeaders[col]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {FEATURES.map((row) => (
                <tr
                  key={row.key}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <td className="text-metal-800 px-5 py-3.5 text-sm font-medium">
                    {t(`landing.comp_${row.key}`)}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col}
                      className={`px-4 py-3.5 text-center ${col === 'geg' ? 'bg-[#E6F7EF]/50' : ''}`}
                    >
                      <CellIcon value={row[col]} col={col} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {FEATURES.map((row) => (
            <div key={row.key} className="rounded-xl border bg-white p-4">
              <p className="text-metal-900 mb-3 text-sm font-semibold">
                {t(`landing.comp_${row.key}`)}
              </p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {columns.map((col) => (
                  <div key={col}>
                    <p className={`mb-1 text-[10px] font-medium ${col === 'geg' ? 'text-[#008F5A]' : 'text-metal-400'}`}>
                      {col === 'geg'
                        ? 'GEG'
                        : col === 'internal'
                          ? 'Int.'
                          : columnHeaders[col]}
                    </p>
                    <CellIcon value={row[col]} col={col} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="text-metal-500 mt-6 flex flex-wrap items-center justify-center gap-5 text-xs">
          <LegendDot type="yes" label={t('landing.compLegendYes')} />
          <LegendDot type="partial" label={t('landing.compLegendPartial')} />
          <LegendDot type="no" label={t('landing.compLegendNo')} />
        </div>

        {/* Differentiator callout */}
        <div className="mt-8 rounded-xl border-l-4 border-l-[#008F5A] bg-[#E6F7EF] p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[#008F5A]" />
            <p className="text-metal-800 text-sm leading-relaxed">
              {t('landing.compCallout')}
            </p>
          </div>
        </div>

        {/* Price disclaimer */}
        <p className="text-metal-400 mt-3 text-center text-[10px]">
          {t('landing.compPriceDisclaimer')}
        </p>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/solutions"
            className="text-primary hover:text-primary-hover inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4"
          >
            {t('landing.compCta')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
