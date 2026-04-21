'use client';

import { type FormEventHandler, useState } from 'react';

import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Input } from '@kit/ui/input';
import { cn } from '@kit/ui/utils';

import { EnviroButton } from '~/components/enviro';

/**
 * Compact newsletter form rendered as the right-hand column of
 * `EnviroFooter`. Same submit semantics as the existing landing
 * `NewsletterForm` (no real backend wired yet — placeholder success
 * after a 1 s delay), only the visual layer is migrated to Enviro
 * tokens. Replace the placeholder with a Server Action when the
 * mailer is ready.
 */
export function FooterNewsletterForm() {
  const t = useTranslations('marketing');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>(
    'idle',
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!email || status !== 'idle') return;

    setStatus('loading');
    try {
      // TODO: replace with the real subscribe Server Action.
      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm uppercase tracking-[0.08em] font-medium text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
        {t('newsletterHeading')}
      </h3>
      <p className="text-sm leading-relaxed text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
        {t('newsletterSubheading')}
      </p>

      {status === 'success' ? (
        <div className="inline-flex items-center gap-2 rounded-[--radius-enviro-pill] border border-[--color-enviro-lime-400] bg-[--color-enviro-lime-300]/15 px-4 py-2 text-sm font-medium text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-sans)]">
          <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
          {t('newsletterSuccess')}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
          aria-label={t('newsletterHeading')}
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('newsletterPlaceholder')}
            disabled={status === 'loading'}
            className={cn(
              'h-10 flex-1 rounded-[--radius-enviro-pill] border-[1.5px] border-[--color-enviro-forest-700] bg-[--color-enviro-forest-800] px-4 text-sm text-[--color-enviro-fg-inverse] placeholder:text-[--color-enviro-fg-inverse-muted] focus:outline-none font-[family-name:var(--font-enviro-sans)]',
            )}
          />
          <EnviroButton
            type="submit"
            variant="primary"
            size="sm"
            disabled={status === 'loading'}
            aria-label={t('newsletterButton')}
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {t('newsletterButton')}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </>
            )}
          </EnviroButton>
        </form>
      )}

      <p className="text-xs text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-sans)]">
        {t('newsletterDisclaimer')}
      </p>
    </div>
  );
}
