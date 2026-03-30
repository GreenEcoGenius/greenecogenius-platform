'use client';

import Link from 'next/link';

import { Lock, Sparkles } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface UpgradePromptProps {
  feature: string;
  requiredPlan: string;
}

const planNames: Record<string, string> = {
  essentiel: 'Essentiel',
  avance: 'Avancé',
  enterprise: 'Enterprise',
};

export function UpgradePrompt({ feature, requiredPlan }: UpgradePromptProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="bg-muted rounded-full p-4">
          <Lock className="text-muted-foreground h-8 w-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{feature}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            <Trans i18nKey="wallet.upgradeRequired" />
          </p>
        </div>
        <Button
          render={
            <Link href="/pricing">
              <Sparkles className="mr-2 h-4 w-4" />
              <Trans i18nKey="wallet.upgradeTo" />{' '}
              {planNames[requiredPlan] ?? requiredPlan}
            </Link>
          }
          nativeButton={false}
        />
      </CardContent>
    </Card>
  );
}
