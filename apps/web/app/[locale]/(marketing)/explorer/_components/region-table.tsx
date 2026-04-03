import Link from 'next/link';

import { getTranslations } from 'next-intl/server';

import { formatPrice, formatRate, formatVolume, regionToSlug, type RegionStat } from './explorer-data';
import { SourceBadge } from './source-badge';

export async function RegionTable({ stats }: { stats: RegionStat[] }) {
  const t = await getTranslations('marketing');

  const sorted = [...stats].sort((a, b) => b.annual_volume_tonnes - a.annual_volume_tonnes);

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-metal-50 text-metal-500 border-b text-xs font-medium uppercase tracking-wider">
            <th className="px-4 py-3">{t('explorer.tableRegion')}</th>
            <th className="px-4 py-3 text-right">{t('explorer.tableVolume')}</th>
            <th className="hidden px-4 py-3 text-right sm:table-cell">Recyclage</th>
            <th className="hidden px-4 py-3 text-right md:table-cell">{t('explorer.tablePrice')}</th>
            <th className="px-4 py-3 text-right">Source</th>
          </tr>
        </thead>
        <tbody className="divide-metal-chrome divide-y">
          {sorted.map((s) => (
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
                {formatVolume(s.annual_volume_tonnes)}
              </td>
              <td className="text-metal-600 hidden px-4 py-3 text-right sm:table-cell">
                {formatRate(s.recycling_rate)}
              </td>
              <td className="text-metal-600 hidden px-4 py-3 text-right md:table-cell">
                {formatPrice(s.avg_price_per_tonne)}
              </td>
              <td className="px-4 py-3 text-right">
                <SourceBadge source={s.data_source} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
