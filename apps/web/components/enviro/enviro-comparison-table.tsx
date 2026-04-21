import type { ReactNode } from 'react';

import { Check, Minus } from 'lucide-react';

import { cn } from '@kit/ui/utils';

export interface EnviroComparisonRow {
  /** Already-translated feature label (first column). */
  feature: ReactNode;
  /** Cell values, in the same order as `headers`. Use `true` / `false` for
   * automatic check / minus icons, or any ReactNode for custom content. */
  cells: Array<ReactNode | boolean>;
}

interface EnviroComparisonTableProps {
  /** Already-translated header labels. The first one is the feature column. */
  headers: ReactNode[];
  rows: EnviroComparisonRow[];
  /** Column index to highlight (typically the GEG column). 0-based, NOT
   * counting the feature column. Default: 0 (first non-feature column). */
  highlightColumnIndex?: number;
  /** Tone of the surrounding section. */
  tone?: 'forest' | 'cream';
  className?: string;
}

/**
 * Pricing / feature comparison table. Sticky header on tall pages, alternated
 * row backgrounds, and a highlighted column with a lime border.
 */
export function EnviroComparisonTable({
  headers,
  rows,
  highlightColumnIndex = 0,
  tone = 'cream',
  className,
}: EnviroComparisonTableProps) {
  const isInverse = tone === 'forest';

  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-[--radius-enviro-lg] border',
        isInverse
          ? 'border-[--color-enviro-forest-700]'
          : 'border-[--color-enviro-cream-300]',
        className,
      )}
    >
      <table className="w-full border-collapse text-left">
        <thead
          className={cn(
            'sticky top-0 z-10',
            isInverse
              ? 'bg-[--color-enviro-forest-800] text-[--color-enviro-fg-inverse]'
              : 'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse]',
          )}
        >
          <tr>
            {headers.map((header, idx) => {
              const isHighlight = idx === highlightColumnIndex + 1;

              return (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    'px-4 py-4 text-sm font-semibold uppercase tracking-[0.04em] font-[family-name:var(--font-enviro-mono)]',
                    isHighlight &&
                      'border-l-2 border-r-2 border-[--color-enviro-lime-300] bg-[--color-enviro-forest-700]',
                  )}
                >
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody
          className={cn(
            isInverse
              ? 'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse]'
              : 'bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]',
          )}
        >
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={cn(
                rIdx % 2 === 1 &&
                  (isInverse
                    ? 'bg-[--color-enviro-forest-800]/50'
                    : 'bg-[--color-enviro-cream-100]/40'),
              )}
            >
              <th
                scope="row"
                className={cn(
                  'px-4 py-4 text-sm font-medium font-[family-name:var(--font-enviro-sans)]',
                )}
              >
                {row.feature}
              </th>
              {row.cells.map((cell, cIdx) => {
                const isHighlight = cIdx === highlightColumnIndex;

                return (
                  <td
                    key={cIdx}
                    className={cn(
                      'px-4 py-4 text-sm font-[family-name:var(--font-enviro-sans)]',
                      isHighlight &&
                        'border-l-2 border-r-2 border-[--color-enviro-lime-300] bg-[--color-enviro-lime-300]/10',
                    )}
                  >
                    {renderCell(cell, isHighlight, isInverse)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCell(
  cell: ReactNode | boolean,
  isHighlight: boolean,
  isInverse: boolean,
) {
  if (cell === true) {
    return (
      <span
        aria-label="yes"
        className={cn(
          'inline-flex h-6 w-6 items-center justify-center rounded-full',
          isHighlight
            ? 'bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900]'
            : isInverse
              ? 'bg-[--color-enviro-forest-700] text-[--color-enviro-lime-300]'
              : 'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse]',
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    );
  }

  if (cell === false) {
    return (
      <span
        aria-label="no"
        className={cn(
          'inline-flex h-6 w-6 items-center justify-center rounded-full',
          isInverse
            ? 'bg-[--color-enviro-forest-700] text-[--color-enviro-fg-inverse-muted]'
            : 'bg-[--color-enviro-cream-200] text-[--color-enviro-forest-700]',
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </span>
    );
  }

  return cell;
}
