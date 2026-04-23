import type { ReactNode } from 'react';

import {
  Table as KitTable,
  TableBody as KitTableBody,
  TableCell as KitTableCell,
  TableHead as KitTableHead,
  TableHeader as KitTableHeader,
  TableRow as KitTableRow,
} from '@kit/ui/table';
import { cn } from '@kit/ui/utils';

interface EnviroDataTableProps {
  children: ReactNode;
  className?: string;
  /** Wrap the table in a horizontally scrollable container. Default: true. */
  scrollable?: boolean;
}

/**
 * Wrapper around `@kit/ui/table` (shadcn) that injects Enviro-flavoured
 * styling: forest header, lime hover, and cream alternating rows. The
 * underlying primitives are exported as `EnviroTableHeader`, `EnviroTableRow`
 * etc. so callers compose the markup just like the legacy table.
 *
 * Why not auto-render rows from data props? Because pages already paginate,
 * sort, filter and group rows via Server Components and the simplest way to
 * preserve all that logic is to keep the JSX surface identical to `@kit/ui`.
 */
export function EnviroDataTable({
  children,
  className,
  scrollable = true,
}: EnviroDataTableProps) {
  const table = (
    <KitTable
      className={cn(
        'border-separate border-spacing-0 font-[family-name:var(--font-enviro-sans)]',
        '[&_tbody_tr:nth-child(even)]:bg-[--color-enviro-cream-50]',
        '[&_tbody_tr:hover]:bg-[--color-enviro-lime-100]',
        '[&_tbody_tr]:transition-colors [&_tbody_tr]:duration-150',
        className,
      )}
    >
      {children}
    </KitTable>
  );

  if (!scrollable) return table;

  return (
    <div className="overflow-x-auto rounded-[--radius-enviro-md] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated]">
      {table}
    </div>
  );
}

/**
 * Forest-themed header row. Use as a drop-in replacement for `<TableHeader>`.
 */
export function EnviroTableHeader({
  className,
  ...props
}: React.ComponentProps<typeof KitTableHeader>) {
  return (
    <KitTableHeader
      className={cn(
        '[&_tr]:border-b-0 bg-[--color-enviro-forest-900]',
        className,
      )}
      {...props}
    />
  );
}

export function EnviroTableHead({
  className,
  ...props
}: React.ComponentProps<typeof KitTableHead>) {
  return (
    <KitTableHead
      className={cn(
        'h-11 px-4 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-mono)]',
        className,
      )}
      {...props}
    />
  );
}

export function EnviroTableBody({
  className,
  ...props
}: React.ComponentProps<typeof KitTableBody>) {
  return <KitTableBody className={cn(className)} {...props} />;
}

export function EnviroTableRow({
  className,
  ...props
}: React.ComponentProps<typeof KitTableRow>) {
  return (
    <KitTableRow
      className={cn(
        'border-b border-[--color-enviro-cream-200]',
        className,
      )}
      {...props}
    />
  );
}

export function EnviroTableCell({
  className,
  ...props
}: React.ComponentProps<typeof KitTableCell>) {
  return (
    <KitTableCell
      className={cn(
        'px-4 py-3 text-sm text-[--color-enviro-forest-900]',
        className,
      )}
      {...props}
    />
  );
}
