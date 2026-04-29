'use client';

import { useState } from 'react';

import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function NewsletterForm() {
  const t = useTranslations('marketing');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      // TODO: Replace with actual server action / API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-primary-foreground flex items-center gap-3 rounded-full bg-white/10 px-6 py-4">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium">{t('newsletterSuccess')}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('newsletterPlaceholder')}
        required
        className="text-primary-foreground placeholder:text-primary-foreground/50 flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        aria-label={t('newsletterButton')}
        className="text-primary inline-flex items-center gap-2 rounded-full bg-[#0D3A26] px-6 py-3 text-sm font-semibold transition-all hover:bg-white/90 hover:shadow-lg disabled:opacity-70"
      >
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {t('newsletterButton')}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
