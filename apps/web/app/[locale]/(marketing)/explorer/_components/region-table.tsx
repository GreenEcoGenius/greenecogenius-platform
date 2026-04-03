import Link from 'next/link';

import { getTranslations } from 'next-intl/server';

import {
  formatPrice,
  formatVolume,
  regionToSlug,
  type RegionStat,
} from './explorer-data';

export async function RegionTable({ stats }: { stats: RegionStat[] }) {
  const t = await getTranslations('marketing');

  const sorted = [...stats].sort(
    (a, b) => b.total_volume_tonnes - a.total_volume_tonnes,
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-metal-50 text-metal-500 border-b text-xs font-medium tracking-wider uppercase">
            <th className="px-4 py-3">{t('explorer.tableRegion')}</th>
            <th className="px-4 py-3 text-right">
              {t('explorer.tableVolume')}
            </th>
            <th className="hidden px-4 py-3 text-right sm:table-cell">
              Sources
            </th>
            <th className="hidden px-4 py-3 text-right md:table-cell">
              {t('explorer.tablePrice')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-metal-chrome divide-y">
          {sorted.map((s) => (
            <tr
              key={s.region}
              className="hover:bg-metal-50/50 transition-colors"
            >
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/explorer/region/${regionToSlug(s.region)}`}
                  className="text-primary hover:underline"
                >
                  {s.region}
                </Link>
              </td>
              <td className="text-metal-900 px-4 py-3 text-right font-semibold">
                {formatVolume(s.total_volume_tonnes)}
              </td>
              <td className="text-metal-600 hidden px-4 py-3 text-right sm:table-cell">
                {s.nb_sources}
              </td>
              <td className="text-metal-600 hidden px-4 py-3 text-right md:table-cell">
                {formatPrice(s.avg_price_per_tonne)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
