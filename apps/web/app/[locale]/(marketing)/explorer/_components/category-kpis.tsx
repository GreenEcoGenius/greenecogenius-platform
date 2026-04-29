import { BarChart3, Factory, Leaf, Recycle, Scale } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  formatPrice,
  formatRate,
  formatVolume,
  type NationalStat,
} from './explorer-data';

export async function CategoryKpis({ stat }: { stat: NationalStat }) {
  const t = await getTranslations('marketing');

  const kpis = [
    {
      icon: Scale,
      label: t('explorer.kpiVolume'),
      value: `${formatVolume(stat.annual_volume_tonnes)}${t('explorer.perYear')}`,
    },
    {
      icon: Recycle,
      label: t('explorer.kpiRecycling'),
      value: formatRate(stat.recycling_rate),
    },
    {
      icon: Leaf,
      label: t('explorer.recoveryLabel'),
      value: formatRate(stat.recovery_rate),
    },
    {
      icon: BarChart3,
      label: t('explorer.kpiPrice'),
      value: formatPrice(stat.avg_price_per_tonne, stat.price_currency),
    },
    { icon: Factory, label: t('explorer.sourceLabel'), value: stat.data_source },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="border-[#1A5C3E] rounded-xl border bg-[#0D3A26] p-4 text-center"
        >
          <kpi.icon className="text-primary mx-auto mb-2 h-5 w-5" />
          <p className="text-[#F5F5F0] text-lg font-bold">{kpi.value}</p>
          <p className="text-[#7DC4A0] text-xs">{kpi.label}</p>
        </div>
      ))}
    </div>
  );
}
