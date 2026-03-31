'use client';

import { useState } from 'react';

import { FileText, Loader2 } from 'lucide-react';

import { Trans } from '@kit/ui/trans';

export function GenerateEsgReportButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleClick = async () => {
    setLoading(true);
    setStatus('loading');

    try {
      const response = await fetch('/api/reports/esg-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportingYear: new Date().getFullYear(),
          format: 'ghg_protocol',
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
      a.download = filenameMatch?.[1] ?? 'rapport-esg-complet.html';

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
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-md bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      {status === 'loading' ? (
        'Generation en cours...'
      ) : status === 'success' ? (
        'Rapport telecharge !'
      ) : status === 'error' ? (
        'Erreur, reessayez'
      ) : (
        <Trans i18nKey="esg:generateReport" />
      )}
    </button>
  );
}
