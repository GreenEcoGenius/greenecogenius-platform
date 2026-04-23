'use client';

import { type FormEventHandler, type ReactNode, useState } from 'react';

import { Input } from '@kit/ui/input';
import { cn } from '@kit/ui/utils';

import { EnviroButton } from './enviro-button';

interface EnviroNewsletterCtaProps {
  /** Already-translated title. */
  title: ReactNode;
  /** Already-translated subtitle. */
  subtitle?: ReactNode;
  /** Already-translated input placeholder. */
  placeholder: string;
  /** Already-translated CTA label. */
  ctaLabel: ReactNode;
  /** Already-translated consent / fine print. */
  consent?: ReactNode;
  /**
   * Submit handler. Receives the entered email. Should resolve when done.
   * If unspecified, the form is rendered in a "demo" mode that just logs.
   */
  onSubmit?: (email: string) => Promise<void> | void;
  /** Tone of the surrounding section. */
  tone?: 'forest' | 'cream' | 'lime';
  /** Wraps the button in a magnetic effect. Default: true. */
  magnetic?: boolean;
  className?: string;
}

/**
 * Final CTA block: heading + email input + submit button. Submit handler is
 * fully delegated to the caller (typically a Server Action wired through
 * `react-hook-form`).
 */
export function EnviroNewsletterCta({
  title,
  subtitle,
  placeholder,
  ctaLabel,
  consent,
  onSubmit,
  tone = 'forest',
  magnetic = true,
  className,
}: EnviroNewsletterCtaProps) {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    try {
      if (onSubmit) {
        await onSubmit(email);
      }
    } finally {
      setPending(false);
    }
  };

  const surface =
    tone === 'lime'
      ? 'bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900]'
      : tone === 'cream'
        ? 'bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]'
        : 'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse]';
  const isInverse = tone === 'forest';

  return (
    <section
      className={cn(
        'rounded-[--radius-enviro-3xl] px-6 py-12 lg:px-12 lg:py-16',
        surface,
        className,
      )}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <h3 className="text-3xl md:text-4xl font-semibold leading-tight tracking-[-0.02em] font-[family-name:var(--font-enviro-display)]">
          {title}
        </h3>

        {subtitle ? (
          <p
            className={cn(
              'max-w-2xl text-base md:text-lg leading-relaxed font-[family-name:var(--font-enviro-sans)]',
              isInverse
                ? 'text-[--color-enviro-fg-inverse-muted]'
                : 'text-[--color-enviro-forest-700]',
            )}
          >
            {subtitle}
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="mt-2 flex w-full max-w-xl flex-col items-stretch gap-3 sm:flex-row"
          aria-label="Newsletter signup"
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={placeholder}
            disabled={pending}
            className={cn(
              'h-12 flex-1 rounded-[--radius-enviro-pill] border-[1.5px] px-5 text-base font-[family-name:var(--font-enviro-sans)] focus:outline-none',
              isInverse
                ? 'border-[--color-enviro-forest-700] bg-[--color-enviro-forest-800] text-[--color-enviro-fg-inverse] placeholder:text-[--color-enviro-fg-inverse-muted]'
                : 'border-[--color-enviro-cream-300] bg-white text-[--color-enviro-forest-900] placeholder:text-[--color-enviro-forest-600]',
            )}
          />
          <EnviroButton
            type="submit"
            variant="primary"
            size="pill"
            magnetic={magnetic}
            disabled={pending}
          >
            {ctaLabel}
          </EnviroButton>
        </form>

        {consent ? (
          <p
            className={cn(
              'max-w-md text-xs font-[family-name:var(--font-enviro-sans)]',
              isInverse
                ? 'text-[--color-enviro-fg-inverse-muted]'
                : 'text-[--color-enviro-forest-700]',
            )}
          >
            {consent}
          </p>
        ) : null}
      </div>
    </section>
  );
}
