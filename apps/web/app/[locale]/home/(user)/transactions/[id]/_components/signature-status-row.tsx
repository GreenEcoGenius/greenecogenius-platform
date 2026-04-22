'use client';

import { CheckCircle2, Clock, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export interface SignatureStatusRowProps {
  /** "seller" or "buyer", drives the localized role label. */
  role: 'seller' | 'buyer';
  name: string;
  signed: boolean;
  signedAt: string | null;
}

export function SignatureStatusRow({
  role,
  name,
  signed,
  signedAt,
}: SignatureStatusRowProps) {
  const t = useTranslations('transactions');
  const locale = useLocale();

  return (
    <div className="flex items-center justify-between gap-3 rounded-[--radius-enviro-md] border border-[--color-enviro-cream-200] bg-[--color-enviro-bg-elevated] p-3 font-[family-name:var(--font-enviro-sans)]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-100]">
          <User
            aria-hidden="true"
            className="h-4 w-4 text-[--color-enviro-lime-700]"
            strokeWidth={1.5}
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
            {t(`parties.${role}`)}
          </p>
          <p className="truncate text-sm font-medium text-[--color-enviro-forest-900]">
            {name}
          </p>
        </div>
      </div>
      {signed ? (
        <div className="inline-flex items-center gap-1.5 rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-100] px-2.5 py-1 text-xs font-semibold text-[--color-enviro-lime-800]">
          <CheckCircle2
            aria-hidden="true"
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
          {t('signature.signed')}
          {signedAt ? (
            <span className="text-[10px] text-[--color-enviro-lime-700]">
              · {new Date(signedAt).toLocaleDateString(locale)}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 rounded-[--radius-enviro-pill] bg-[--color-enviro-ember-100] px-2.5 py-1 text-xs font-semibold text-[--color-enviro-ember-700]">
          <Clock
            aria-hidden="true"
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
          {t('signature.pending')}
        </div>
      )}
    </div>
  );
}
