'use client';

import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Hook providing haptic feedback helpers.
 * All methods are no-ops on non-native platforms (web).
 */
export function useHaptics() {
  const isNative =
    typeof window !== 'undefined' && Capacitor.isNativePlatform();

  /** Light tap — use for button presses, toggles, selections. */
  const tapLight = useCallback(async () => {
    if (!isNative) return;
    await Haptics.impact({ style: ImpactStyle.Light });
  }, [isNative]);

  /** Medium tap — use for confirmations, card presses. */
  const tapMedium = useCallback(async () => {
    if (!isNative) return;
    await Haptics.impact({ style: ImpactStyle.Medium });
  }, [isNative]);

  /** Heavy tap — use for destructive actions, long-press. */
  const tapHeavy = useCallback(async () => {
    if (!isNative) return;
    await Haptics.impact({ style: ImpactStyle.Heavy });
  }, [isNative]);

  /** Success notification — use after successful operations. */
  const notifySuccess = useCallback(async () => {
    if (!isNative) return;
    await Haptics.notification({ type: NotificationType.Success });
  }, [isNative]);

  /** Warning notification — use for validation errors, warnings. */
  const notifyWarning = useCallback(async () => {
    if (!isNative) return;
    await Haptics.notification({ type: NotificationType.Warning });
  }, [isNative]);

  /** Error notification — use for failures, destructive confirmations. */
  const notifyError = useCallback(async () => {
    if (!isNative) return;
    await Haptics.notification({ type: NotificationType.Error });
  }, [isNative]);

  return {
    tapLight,
    tapMedium,
    tapHeavy,
    notifySuccess,
    notifyWarning,
    notifyError,
  };
}
