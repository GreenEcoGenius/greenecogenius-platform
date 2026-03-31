'use client';

import { useState } from 'react';

import { FileText, Loader2 } from 'lucide-react';

import { Button } from '@kit/ui/button';

export function GenerateEsgReportButton({
  format = 'ghg_protocol',
}: {
  format?: 'ghg_protocol' | 'csrd' | 'gri';
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleClick = async () => {
    setLoading(true);
    setStatus('loading');

    try {
      const response = await fetch('/api/reports/esg-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportingYear: new Date().getFullYear(),
          format,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const disposition = response.headers.get('Content-Disposition');
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      a.download = filenameMatch?.[1] ?? 'Rapport-ESG-GreenEcoGenius.pdf';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
      ) : (
        <FileText className="mr-1.5 h-4 w-4" />
      )}
      {status === 'loading'
        ? 'Generation en cours...'
        : status === 'success'
          ? 'Rapport telecharge !'
          : status === 'error'
            ? 'Erreur, reessayez'
            : 'Generer le rapport PDF'}
    </Button>
  );
}
