import Link from 'next/link';

import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { formatVolume, regionToSlug, type RegionStat } from './explorer-data';

export async function RegionTable({
  stats,
  trend,
}: {
  stats: RegionStat[];
  trend?: number;
}) {
  const t = await getTranslations('marketing');

  const sorted = [...stats].sort(
    (a, b) => b.total_volume_tonnes - a.total_volume_tonnes,
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-metal-50 text-metal-500 border-b text-xs font-medium uppercase tracking-wider">
            <th className="px-4 py-3">{t('explorer.tableRegion')}</th>
            <th className="px-4 py-3 text-right">{t('explorer.tableVolume')}</th>
            <th className="hidden px-4 py-3 text-right sm:table-cell">
              {t('explorer.tableSources')}
            </th>
            <th className="hidden px-4 py-3 text-right md:table-cell">
              {t('explorer.tablePrice')}
            </th>
            <th className="px-4 py-3 text-right">{t('explorer.tableTrend')}</th>
          </tr>
        </thead>
        <tbody className="divide-metal-chrome divide-y">
          {sorted.map((s) => {
            const TrendIcon =
              (trend ?? 0) > 0 ? ArrowUp : (trend ?? 0) < 0 ? ArrowDown : Minus;

            const trendColor =
              (trend ?? 0) > 0
                ? 'text-emerald-600'
                : (trend ?? 0) < 0
                  ? 'text-red-500'
                  : 'text-gray-400';

            return (
              <tr key={s.region} className="hover:bg-metal-50/50 transition-colors">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/explorer/region/${regionToSlug(s.region)}`}
                    className="text-primary hover:underline"
                  >
                    {s.region}
                  </Link>
                </td>
                <td className="text-metal-900 px-4 py-3 text-right font-semibold">
                  {formatVolume(s.total_volume_tonnes)} t
                </td>
                <td className="text-metal-600 hidden px-4 py-3 text-right sm:table-cell">
                  {s.nb_sources?.toLocaleString('fr-FR')}
                </td>
                <td className="text-metal-600 hidden px-4 py-3 text-right md:table-cell">
                  {s.avg_price_per_tonne?.toLocaleString('fr-FR')} €/t
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-medium ${trendColor}`}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {(trend ?? 0) > 0 ? '+' : ''}
                    {trend ?? 0}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
