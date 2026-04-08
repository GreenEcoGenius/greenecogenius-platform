import {
  Cloud,
  Droplets,
  Leaf,
  Plane,
  ShieldCheck,
  TreePine,
  Trees,
  Zap,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@kit/ui/badge';

import { calculateTransactionImpact } from '~/lib/services/impact-calculator';

interface TransactionImpactPanelProps {
  /** Canonical material category or alias (e.g. "Plastiques", "plastique") */
  material: string;
  /** Volume in tonnes */
  volumeTonnes: number;
  /** Optional current compliance score, used to show before/after */
  currentScore?: number | null;
  /** Optional polygon scan URL for the certified hash */
  blockchainUrl?: string | null;
}

export async function TransactionImpactPanel({
  material,
  volumeTonnes,
  currentScore = null,
  blockchainUrl = null,
}: TransactionImpactPanelProps) {
  const t = await getTranslations('common');

  let impact;
  try {
    impact = calculateTransactionImpact(material, volumeTonnes, currentScore);
  } catch {
    return null;
  }

  const kpis = [
    {
      icon: Cloud,
      label: t('impact.co2Avoided'),
      value: `${impact.co2_avoided_tonnes.toFixed(2)} tCO₂e`,
      accent: 'text-[#159B5C] bg-[#E8F8F0]',
    },
    {
      icon: Droplets,
      label: t('impact.waterSaved'),
      value: `${(impact.water_saved_liters / 1000).toFixed(0)} m³`,
      accent: 'text-sky-700 bg-sky-50',
    },
    {
      icon: Zap,
      label: t('impact.energySaved'),
      value: `${(impact.energy_saved_kwh / 1000).toFixed(1)} MWh`,
      accent: 'text-amber-700 bg-amber-50',
    },
    {
      icon: TreePine,
      label: t('impact.rawMaterialSaved'),
      value: `${impact.raw_material_saved_tonnes.toFixed(2)} t`,
      hint: impact.raw_material_type,
      accent: 'text-green-700 bg-green-50',
    },
  ];

  return (
    <div className="w-full max-w-2xl rounded-xl border border-[#A8E6C8] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Leaf className="h-5 w-5 text-[#1BAF6A]" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold text-gray-900">
          {t('impact.title')}
        </h3>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        {impact.volume_tonnes.toLocaleString('fr-FR', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        })}{' '}
        {t('impact.tonnesOf', { material: impact.material })}
      </p>

      <div className="mb-4 grid grid-cols-2 gap-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`rounded-lg p-3 ${k.accent}`}
          >
            <div className="mb-1 flex items-center gap-2 text-xs font-medium opacity-80">
              <k.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              {k.label}
            </div>
            <div className="text-base font-semibold">{k.value}</div>
            {k.hint ? (
              <div className="mt-0.5 text-[11px] opacity-70">{k.hint}</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-lg bg-gray-50 p-3">
        <p className="mb-2 text-xs font-medium text-gray-500">
          {t('impact.equivalentOf')}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          <span className="inline-flex items-center gap-1.5">
            <Plane className="h-3.5 w-3.5 text-gray-500" strokeWidth={1.5} />
            {impact.equivalences.flights_paris_ny} {t('impact.flightsParisNy')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Trees className="h-3.5 w-3.5 text-gray-500" strokeWidth={1.5} />
            {impact.equivalences.trees_needed} {t('impact.treesPerYear')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Droplets className="h-3.5 w-3.5 text-gray-500" strokeWidth={1.5} />
            {impact.equivalences.swimming_pools_water}{' '}
            {t('impact.swimmingPools')}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-gray-500">
          {t('impact.normsUpdated')}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {impact.norms_impacted.map((n) => (
            <Badge
              key={n.norm_id}
              variant="secondary"
              className="border-[#A8E6C8] bg-[#E8F8F0] text-[#159B5C]"
            >
              {n.norm_name}
            </Badge>
          ))}
        </div>
      </div>

      {impact.score_before !== null && impact.score_after !== null ? (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-[#E8F8F0] p-3">
          <span className="text-sm font-medium text-[#159B5C]">
            {t('impact.complianceScore')}
          </span>
          <span className="text-base font-semibold text-[#159B5C]">
            {impact.score_before}% → {impact.score_after.toFixed(0)}% (+
            {impact.score_gain})
          </span>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>{t('impact.calculatedFrom', { source: impact.source })}</span>
        </div>
        {blockchainUrl ? (
          <a
            href={blockchainUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1BAF6A] hover:underline"
          >
            {t('impact.verifyOnChain')}
          </a>
        ) : null}
      </div>
    </div>
  );
}
