'use client';

import { useTranslations } from 'next-intl';
import { FileText, RotateCw, Sparkles } from 'lucide-react';

import { ScopeCard } from '~/components/carbon/scope-card';
import { useEsgData } from '~/hooks/use-esg-data';

export default function CarbonEsgPage() {
  const t = useTranslations('carbon');
  const { esg, totals, loading, refreshing, error, refetch } = useEsgData();

  if (loading && !esg) {
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <RotateCw className="h-5 w-5 animate-spin text-[#F5F5F0]/40" />
        <p className="text-xs text-[#F5F5F0]/50">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-center text-sm text-red-300">{error}</p>
        <button
          onClick={() => void refetch()}
          className="rounded-full border border-[#F5F5F0]/15 px-4 py-1.5 text-xs text-[#F5F5F0]/80 active:bg-[#F5F5F0]/10"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  if (!esg || !totals.hasData) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8D4E3]/15">
          <FileText className="h-5 w-5 text-[#B8D4E3]" />
        </div>
        <p className="text-center text-sm text-[#F5F5F0]/60">
          {t('emptyEsg')}
        </p>
        <p className="max-w-xs text-center text-[11px] text-[#F5F5F0]/40">
          {t('emptyEsgHint')}
        </p>
      </div>
    );
  }

  const totalT = totals.total / 1000;
  const platformAvoidedT = Number(esg.platform_co2_avoided ?? 0) / 1000;

  return (
    <div className="space-y-3">
      {/* Year + total header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            {t('reportingYear')}
          </p>
          <p className="text-2xl font-bold text-[#F5F5F0]">{esg.reporting_year}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            {t('totalEmissions')}
          </p>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-bold text-[#F5F5F0]">
              {totalT.toFixed(1)}
            </span>
            <span className="text-xs text-[#F5F5F0]/60">tCO₂e</span>
          </div>
        </div>
      </div>

      {/* Refresh button */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => void refetch()}
          disabled={refreshing}
          aria-label={t('refresh')}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#F5F5F0]/50 active:bg-[#F5F5F0]/10 disabled:opacity-30"
        >
          <RotateCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Scope cards */}
      <ScopeCard
        scope={1}
        value={totals.scope1}
        label={t('scope1Label')}
        description={t('scope1Desc')}
      />
      <ScopeCard
        scope={2}
        value={totals.scope2}
        label={t('scope2Label')}
        description={t('scope2Desc')}
      />
      <ScopeCard
        scope={3}
        value={totals.scope3}
        label={t('scope3Label')}
        description={t('scope3Desc')}
      />

      {/* Platform avoided bonus */}
      {platformAvoidedT > 0 && (
        <div className="rounded-2xl border border-[#B8D4E3]/20 bg-[#B8D4E3]/8 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#B8D4E3]">
                <Sparkles className="h-3 w-3" />
                <span>{t('platformAvoidedTitle')}</span>
              </div>
              <p className="text-[11px] text-[#F5F5F0]/60">
                {t('platformAvoidedDesc')}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-lg font-semibold text-[#B8D4E3]">
                  -{platformAvoidedT.toFixed(1)}
                </span>
                <span className="text-[10px] text-[#F5F5F0]/60">tCO₂e</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footnote */}
      <p className="pt-2 text-center text-[10px] text-[#F5F5F0]/40">
        {t('esgFootnote')}
      </p>
    </div>
  );
}
