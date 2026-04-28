'use client';

import { WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNetworkStatus } from '~/hooks/use-network-status';

/**
 * A fixed banner displayed at the top of the screen when the device
 * has no network connectivity. Automatically hides when back online.
 */
export function OfflineBanner() {
  const { connected } = useNetworkStatus();
  const t = useTranslations('common');

  if (connected) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-2 bg-red-600/90 px-4 py-2 pt-[calc(env(safe-area-inset-top)+8px)] backdrop-blur-sm">
      <WifiOff className="h-4 w-4 text-white" />
      <p className="text-xs font-medium text-white">
        {t('offline')}
      </p>
    </div>
  );
}
