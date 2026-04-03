import { BarChart3, Factory, Leaf, Recycle, Scale } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { formatVolume, type NationalStat } from './explorer-data';

export async function CategoryKpis({ stat }: { stat: NationalStat }) {
  const t = await getTranslations('marketing');

  const kpis = [
    {
      icon: Scale,
      label: t('explorer.kpiVolume'),
      value: `${formatVolume(stat.total_volume_tonnes)} t/an`,
    },
    {
      icon: Factory,
      label: t('explorer.kpiSources'),
      value: stat.nb_sources.toLocaleString('fr-FR'),
    },
    {
      icon: BarChart3,
      label: t('explorer.kpiPrice'),
      value: `${stat.avg_price_min}–${stat.avg_price_max} €/t`,
    },
    {
      icon: Leaf,
      label: t('explorer.kpiCO2'),
      value: `${formatVolume(stat.co2_potential_tonnes)} t CO₂`,
    },
    {
      icon: Recycle,
      label: t('explorer.kpiRecycling'),
      value: `${stat.recycling_rate}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="border-metal-chrome rounded-xl border bg-white p-4 text-center"
        >
          <kpi.icon className="text-primary mx-auto mb-2 h-5 w-5" />
          <p className="text-metal-900 text-lg font-bold">{kpi.value}</p>
          <p className="text-metal-500 text-xs">{kpi.label}</p>
        </div>
      ))}
    </div>
  );
}
