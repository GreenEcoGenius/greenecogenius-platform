'use client';

import { useRouter } from 'next/navigation';

import { Trash2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useTranslations } from 'next-intl';

import { deleteExternalActivity } from '../_lib/server/server-actions';

export function DeleteActivityButton({ id }: { id: string }) {
  const t = useTranslations('externalActivities');
  const router = useRouter();
  const { execute, isPending } = useAction(deleteExternalActivity, {
    onSuccess: () => router.refresh(),
  });

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => execute({ id })}
      aria-label={t('list.deleteAria')}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[--radius-enviro-sm] text-[--color-enviro-forest-700] transition-colors hover:bg-[--color-enviro-ember-100] hover:text-[--color-enviro-ember-700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60 disabled:pointer-events-none disabled:opacity-50"
    >
      <Trash2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}
