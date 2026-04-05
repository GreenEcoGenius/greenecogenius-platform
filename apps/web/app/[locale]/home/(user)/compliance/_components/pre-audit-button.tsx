'use client';

import { useState } from 'react';

import { Loader2, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PreAuditButton() {
  const t = useTranslations('compliance');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleClick = async () => {
    setLoading(true);
    setStatus('loading');

    try {
      const response = await fetch('/api/reports/compliance-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Get the HTML content and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Extract filename from Content-Disposition header
      const disposition = response.headers.get('Content-Disposition');
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      a.download =
        filenameMatch?.[1] ?? 'PreAudit-Conformite-GreenEcoGenius.pdf';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setStatus('success');

      // Reset after 3 seconds
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
      className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="mr-1 inline-block h-4 w-4 animate-spin" />
      ) : (
        <Shield className="mr-1 inline-block h-4 w-4" />
      )}
      {status === 'loading'
        ? t('preAuditLoading')
        : status === 'success'
          ? t('preAuditSuccess')
          : status === 'error'
            ? t('preAuditError')
            : t('launchAudit')}
    </button>
  );
}
