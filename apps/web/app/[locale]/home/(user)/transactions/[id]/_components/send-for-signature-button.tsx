'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { FileSignature, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';

import { Button } from '@kit/ui/button';

import { sendContractForSignature } from '../../_lib/server/server-actions';

export function SendForSignatureButton({
  transactionId,
}: {
  transactionId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { execute, isPending } = useAction(sendContractForSignature, {
    onSuccess: () => {
      setError(null);
      router.refresh();
    },
    onError: ({ error: e }) => {
      setError(
        String(
          e.serverError ??
            e.thrownError?.message ??
            'Impossible de generer le contrat.',
        ),
      );
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        disabled={isPending}
        onClick={() => execute({ transactionId })}
        className="bg-[#2D8C6A] hover:bg-[#224E3F]"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generation du contrat…
          </>
        ) : (
          <>
            <FileSignature className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Generer et envoyer pour signature
          </>
        )}
      </Button>
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : null}
    </div>
  );
}
