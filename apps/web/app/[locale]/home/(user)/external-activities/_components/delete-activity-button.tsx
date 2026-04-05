'use client';

import { useRouter } from 'next/navigation';

import { Trash2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';

import { Button } from '@kit/ui/button';

import { deleteExternalActivity } from '../_lib/server/server-actions';

export function DeleteActivityButton({ id }: { id: string }) {
  const router = useRouter();
  const { execute, isPending } = useAction(deleteExternalActivity, {
    onSuccess: () => router.refresh(),
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => execute({ id })}
      aria-label="Supprimer"
    >
      <Trash2 className="h-4 w-4 text-red-500" strokeWidth={1.5} />
    </Button>
  );
}
