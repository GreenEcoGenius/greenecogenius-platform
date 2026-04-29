'use client';

import Link from 'next/link';

import { Trans } from '@kit/ui/trans';

interface Transaction {
  created_at: string;
  listing_title: string;
  material_category: string;
  weight_tonnes: number;
  co2_avoided: number;
  co2_transport: number;
  co2_net_benefit: number;
  blockchain_hash?: string;
}

interface CarbonTransactionsTableProps {
  transactions: Transaction[];
}

function fmt(value: number, decimals = 0): string {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function truncateHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function CarbonTransactionsTable({
  transactions,
}: CarbonTransactionsTableProps) {
  if (!transactions.length) return null;

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">
        <Trans i18nKey="carbon:recentTx" />
      </h3>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-[#E8F5EE] dark:bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 font-medium">
                <Trans i18nKey="carbon:txDate" />
              </th>
              <th className="px-4 py-3 font-medium">
                <Trans i18nKey="carbon:txListing" />
              </th>
              <th className="px-4 py-3 font-medium">
                <Trans i18nKey="carbon:txMaterial" />
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <Trans i18nKey="carbon:txWeight" />
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <Trans i18nKey="carbon:txAvoided" />
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <Trans i18nKey="carbon:txTransport" />
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <Trans i18nKey="carbon:txNet" />
              </th>
              <th className="px-4 py-3 font-medium">
                <Trans i18nKey="carbon:txHash" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((tx, idx) => (
              <tr
                key={`${tx.created_at}-${idx}`}
                className="hover:bg-[#E8F5EE] dark:hover:bg-gray-800/30"
              >
                <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {new Date(tx.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 font-medium">
                  {tx.listing_title}
                </td>
                <td className="px-4 py-3 capitalize">{tx.material_category}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {tx.weight_tonnes.toLocaleString('fr-FR', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap text-verdure-600">
                  {fmt(tx.co2_avoided)} kg
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap text-[#E6F7EF]0">
                  {fmt(tx.co2_transport)} kg
                </td>
                <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                  {fmt(tx.co2_net_benefit)} kg
                </td>
                <td className="px-4 py-3">
                  {tx.blockchain_hash ? (
                    <Link
                      href={`/verify/${tx.blockchain_hash}`}
                      className="text-primary text-xs hover:underline"
                    >
                      <code>{truncateHash(tx.blockchain_hash)}</code>
                    </Link>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
