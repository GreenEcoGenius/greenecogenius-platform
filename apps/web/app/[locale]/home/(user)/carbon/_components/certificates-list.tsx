'use client';

import Link from 'next/link';

import { ExternalLink } from 'lucide-react';

import { Button } from '@kit/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';

interface Certificate {
  id: string;
  certificate_number: string;
  material_summary: string;
  weight_tonnes: number;
  co2_avoided: number;
  blockchain_hash: string;
  issued_at: string;
}

interface CertificatesListProps {
  certificates: Certificate[];
}

function truncateHash(hash: string): string {
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export function CertificatesList({ certificates }: CertificatesListProps) {
  if (!certificates.length) {
    return (
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          <Trans i18nKey="carbon:certificates" />
        </h3>
        <p className="text-muted-foreground text-sm">
          <Trans i18nKey="carbon:noCertificates" />
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">
        <Trans i18nKey="carbon:certificates" />
      </h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Trans i18nKey="carbon:certNumber" />
              </TableHead>
              <TableHead>
                <Trans i18nKey="carbon:certMaterial" />
              </TableHead>
              <TableHead className="text-right">
                <Trans i18nKey="carbon:certWeight" />
              </TableHead>
              <TableHead className="text-right">
                <Trans i18nKey="carbon:certCO2" />
              </TableHead>
              <TableHead>
                <Trans i18nKey="carbon:certHash" />
              </TableHead>
              <TableHead>
                <Trans i18nKey="carbon:certDate" />
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">
                  {cert.certificate_number}
                </TableCell>
                <TableCell>{cert.material_summary}</TableCell>
                <TableCell className="text-right">
                  {cert.weight_tonnes.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  t
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {cert.co2_avoided.toLocaleString('fr-FR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{' '}
                  kg
                </TableCell>
                <TableCell>
                  <code className="text-muted-foreground text-xs">
                    {truncateHash(cert.blockchain_hash)}
                  </code>
                </TableCell>
                <TableCell>
                  {new Date(cert.issued_at).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    render={
                      <Link href={`/verify/${cert.blockchain_hash}`}>
                        <ExternalLink className="mr-1 h-3 w-3" />
                        <Trans i18nKey="carbon:verify" />
                      </Link>
                    }
                    nativeButton={false}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
