'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';

import { Button } from '@kit/ui/button';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

import { recalculateComplianceAction } from '~/lib/compliance/recalculate-compliance-action';

export function RecalculateButton() {
  const t = useTranslations('compliance');
  const { execute, isPending } = useAction(recalculateComplianceAction, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success(
          t('recalculateSuccess', {
            compliant: data.compliant,
            total: data.total,
            score: data.score,
          }),
        );
      }
    },
    onError: () => {
      toast.error(t('recalculateError'));
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => execute()}
    >
      <RefreshCw
        className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`}
      />
      {isPending ? (
        <Trans
          i18nKey="compliance:recalculating"
          defaults="Recalcul en cours..."
        />
      ) : (
        <Trans
          i18nKey="compliance:recalculate"
          defaults="Recalculer la conformité"
        />
      )}
    </Button>
  );
}
