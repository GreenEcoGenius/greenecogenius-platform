'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';

interface MaterialRow {
  category: string;
  weight: number;
  avoided: number;
  transport: number;
  net: number;
}

interface CarbonByMaterialProps {
  materials: MaterialRow[];
}

function fmt(value: number, decimals = 2): string {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CarbonByMaterial({ materials }: CarbonByMaterialProps) {
  if (!materials.length) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">
        <Trans i18nKey="carbon:byMaterial" />
      </h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Trans i18nKey="carbon:materialCol" />
              </TableHead>
              <TableHead className="text-right">
                <Trans i18nKey="carbon:weightCol" />
              </TableHead>
              <TableHead className="text-right">
                <Trans i18nKey="carbon:avoidedCol" />
              </TableHead>
              <TableHead className="text-right">
                <Trans i18nKey="carbon:transportCol" />
              </TableHead>
              <TableHead className="text-right">
                <Trans i18nKey="carbon:netCol" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((row) => (
              <TableRow key={row.category}>
                <TableCell className="font-medium">{row.category}</TableCell>
                <TableCell className="text-right">
                  {fmt(row.weight / 1000)}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {fmt(row.avoided, 0)}
                </TableCell>
                <TableCell className="text-right">{fmt(row.transport, 0)}</TableCell>
                <TableCell className="text-right font-medium">
                  {fmt(row.net, 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
