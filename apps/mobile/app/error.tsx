'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const t = useTranslations('common');

  useEffect(() => {
    // Log to your error tracking service (Sentry, etc.)
    console.error('[GEG Mobile Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A2F1F] px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-[#F5F5F0]">
        {t('errorTitle')}
      </h2>
      <p className="mb-6 max-w-xs text-sm text-[#F5F5F0]/60">
        {t('errorDescription')}
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-full bg-[#B8D4E3] px-6 py-3 text-sm font-semibold text-[#0A2F1F] transition-all active:scale-95"
      >
        <RotateCw className="h-4 w-4" />
        {t('retry')}
      </button>
    </div>
  );
}
