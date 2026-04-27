'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function CapacitorInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!Capacitor.isNativePlatform()) return;

    (async () => {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: true });

        const { SplashScreen } = await import('@capacitor/splash-screen');
        await SplashScreen.hide({ fadeOutDuration: 300 });

        const { Keyboard } = await import('@capacitor/keyboard');
        await Keyboard.setAccessoryBarVisible({ isVisible: false }).catch(() => {});
      } catch (err) {
        console.warn('Capacitor init partial failure:', err);
      }
    })();
  }, []);

  return null;
}
