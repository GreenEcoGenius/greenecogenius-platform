'use client';

import { useState } from 'react';

import { Download, FileText } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

export function CarbonExportButton() {
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  async function handleExportCsv() {
    setLoadingCsv(true);
    try {
      const res = await fetch('/api/carbon/export/csv');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      downloadBlob(blob, `carbon-export-${today()}.csv`);
    } catch {
      // Silently handle error
    } finally {
      setLoadingCsv(false);
    }
  }

  async function handleExportPdf() {
    setLoadingPdf(true);
    try {
      const res = await fetch('/api/carbon/export/pdf');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      downloadBlob(blob, `carbon-report-${today()}.pdf`);
    } catch {
      // Silently handle error
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPdf}
        disabled={loadingPdf}
      >
        <FileText className="mr-2 h-4 w-4" />
        <Trans i18nKey="carbon:exportPdf" defaults="Rapport PDF" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCsv}
        disabled={loadingCsv}
      >
        <Download className="mr-2 h-4 w-4" />
        <Trans i18nKey="carbon:exportCsv" defaults="Export CSV" />
      </Button>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
