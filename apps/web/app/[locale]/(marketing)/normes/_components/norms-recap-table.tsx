'use client';

import { useMemo, useState } from 'react';

import { Search } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Input } from '@kit/ui/input';

import {
  NORMS_DATABASE,
  PRIORITY_COLORS,
  type NormType,
} from '~/lib/data/norms-database';

const TYPE_FILTERS: Array<{ value: NormType | 'all'; label: string }> = [
  { value: 'all', label: 'Tous' },
  { value: 'iso', label: 'ISO' },
  { value: 'regulation_eu', label: 'UE' },
  { value: 'law_fr', label: 'France' },
  { value: 'framework', label: 'Frameworks' },
  { value: 'label', label: 'Labels' },
];

export function NormsRecapTable() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<NormType | 'all'>('all');

  const filtered = useMemo(() => {
    let results = NORMS_DATABASE;

    if (typeFilter !== 'all') {
      results = results.filter((n) => n.type === typeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (n) =>
          n.reference.toLowerCase().includes(q) ||
          n.title.toLowerCase().includes(q) ||
          n.pillarLabel.toLowerCase().includes(q),
      );
    }

    return results;
  }, [search, typeFilter]);

  return (
    <section className="bg-gray-50 py-16 sm:py-20 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Referentiel complet -- {NORMS_DATABASE.length} normes
        </h2>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setTypeFilter(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  typeFilter === f.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Chercher une norme..."
              className="h-8 pl-9 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left dark:bg-gray-800">
                <th className="px-4 py-3 font-medium">Norme</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                  Pilier
                </th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">
                  Type
                </th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-medium">Plateforme</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((norm) => (
                <tr
                  key={norm.id}
                  className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium">{norm.reference}</span>
                  </td>
                  <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell">
                    {norm.pillarLabel}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="text-muted-foreground text-xs">
                      {norm.typeLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`text-[10px] ${PRIORITY_COLORS[norm.priority]}`}
                    >
                      {norm.priorityLabel}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {norm.platformIntegration === 'integrated' ? (
                      <span className="text-xs text-emerald-600">
                        Integree{norm.blockchainVerified ? ' On-chain' : ''}
                      </span>
                    ) : norm.platformIntegration === 'anticipated' ? (
                      <span className="text-xs text-amber-600">Anticipee</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        Planifiee
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-muted-foreground px-4 py-8 text-center"
                  >
                    Aucune norme trouvee
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-muted-foreground mt-4 text-xs">
          {NORMS_DATABASE.length} normes --{' '}
          {NORMS_DATABASE.filter((n) => n.type === 'iso').length} ISO --{' '}
          {
            NORMS_DATABASE.filter(
              (n) =>
                n.type === 'regulation_eu' ||
                n.type === 'directive_eu' ||
                n.type === 'standard_eu',
            ).length
          }{' '}
          reglementations UE --{' '}
          {NORMS_DATABASE.filter((n) => n.type === 'law_fr').length} lois
          francaises --{' '}
          {NORMS_DATABASE.filter((n) => n.type === 'framework').length}{' '}
          frameworks --{' '}
          {NORMS_DATABASE.filter((n) => n.type === 'label').length} labels
        </p>
      </div>
    </section>
  );
}
