import Link from 'next/link';

import { getTranslations } from 'next-intl/server';

import {
  formatPrice,
  formatRate,
  formatVolume,
  regionToSlug,
  type RegionStat,
} from './explorer-data';
import { SourceBadge } from './source-badge';

export async function RegionTable({ stats }: { stats: RegionStat[] }) {
  const t = await getTranslations('marketing');

  const sorted = [...stats].sort(
    (a, b) => b.annual_volume_tonnes - a.annual_volume_tonnes,
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-[#0D3A26]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-[#0D3A26] text-[#7DC4A0] border-b text-xs font-medium tracking-wider uppercase">
            <th className="px-4 py-3">{t('explorer.tableRegion')}</th>
            <th className="px-4 py-3 text-right">
              {t('explorer.tableVolume')}
            </th>
            <th className="hidden px-4 py-3 text-right sm:table-cell">
              {t('explorer.recyclingLabel')}
            </th>
            <th className="hidden px-4 py-3 text-right md:table-cell">
              {t('explorer.tablePrice')}
            </th>
            <th className="px-4 py-3 text-right">
              {t('explorer.sourceLabel')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-metal-chrome divide-y">
          {sorted.map((s) => (
            <tr
              key={s.region}
              className="hover:bg-[#0D3A26]/50 transition-colors"
            >
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/explorer/region/${regionToSlug(s.region)}`}
                  className="text-primary hover:underline"
                >
                  {s.region}
                </Link>
              </td>
              <td className="text-[#F5F5F0] px-4 py-3 text-right font-semibold">
                {formatVolume(s.annual_volume_tonnes)}
              </td>
              <td className="text-[#B8D4E3] hidden px-4 py-3 text-right sm:table-cell">
                {formatRate(s.recycling_rate)}
              </td>
              <td className="text-[#B8D4E3] hidden px-4 py-3 text-right md:table-cell">
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
