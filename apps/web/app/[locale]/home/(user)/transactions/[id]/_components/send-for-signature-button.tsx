'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { FileSignature, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useTranslations } from 'next-intl';

import { EnviroButton } from '~/components/enviro/enviro-button';

import { sendContractForSignature } from '../../_lib/server/server-actions';

export function SendForSignatureButton({
  transactionId,
}: {
  transactionId: string;
}) {
  const t = useTranslations('transactions.actions');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { execute, isPending } = useAction(sendContractForSignature, {
    onSuccess: () => {
      setError(null);
      router.refresh();
    },
    onError: ({ error: e }) => {
      setError(
        String(e.serverError ?? e.thrownError?.message ?? t('sendError')),
      );
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <EnviroButton
        type="button"
        variant="primary"
        size="md"
        magnetic
        disabled={isPending}
        onClick={() => execute({ transactionId })}
      >
        {isPending ? (
          <>
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            {t('sending')}
          </>
        ) : (
          <>
            <FileSignature aria-hidden="true" className="h-4 w-4" />
            {t('send')}
          </>
        )}
      </EnviroButton>
      {error ? (
        <p className="text-xs text-[--color-enviro-ember-700]">{error}</p>
      ) : null}
    </div>
  );
}
