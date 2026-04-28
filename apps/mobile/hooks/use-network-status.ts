'use client';

import { useCallback, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

interface NetworkStatus {
  /** Whether the device has an active network connection. */
  connected: boolean;
  /** Connection type (wifi, cellular, none, unknown). */
  connectionType: string;
}

/**
 * Hook that monitors network connectivity.
 * Uses the Capacitor Network plugin on native, falls back to
 * navigator.onLine on web.
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    connected: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: 'unknown',
  });

  const handleOnline = useCallback(() => {
    setStatus({ connected: true, connectionType: 'unknown' });
  }, []);

  const handleOffline = useCallback(() => {
    setStatus({ connected: false, connectionType: 'none' });
  }, []);

  useEffect(() => {
    const isNative =
      typeof window !== 'undefined' && Capacitor.isNativePlatform();

    if (isNative) {
      // Dynamically import to avoid bundling on web
      let removeListener: (() => void) | undefined;

      import('@capacitor/network')
        .then(({ Network }) => {
          // Get initial status
          Network.getStatus().then((s) => {
            setStatus({
              connected: s.connected,
              connectionType: s.connectionType,
            });
          });

          // Listen for changes
          Network.addListener('networkStatusChange', (s) => {
            setStatus({
              connected: s.connected,
              connectionType: s.connectionType,
            });
          }).then((handle) => {
            removeListener = () => handle.remove();
          });
        })
        .catch(() => {
          // Fallback if plugin not available
          window.addEventListener('online', handleOnline);
          window.addEventListener('offline', handleOffline);
        });

      return () => {
        removeListener?.();
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // Web fallback
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return status;
}
