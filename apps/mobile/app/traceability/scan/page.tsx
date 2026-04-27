'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Capacitor } from '@capacitor/core';
import { ScanLine, X, AlertCircle, Camera } from 'lucide-react';

import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';

export default function ScanPage() {
  return (
    <AuthGuard>
      <ScanContent />
    </AuthGuard>
  );
}

function ScanContent() {
  const t = useTranslations('traceability');
  const router = useRouter();

  const [scanning, setScanning] = useState(false);
  const [permError, setPermError] = useState<string | null>(null);
  const [unsupported, setUnsupported] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    // Only run on native iOS, not in browser/SSR
    if (!Capacitor.isNativePlatform()) {
      setUnsupported(true);
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;

    void startScan();

    return () => {
      restoreWebview();
      void stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function restoreWebview() {
    const body = document.body;
    if (!body) return;
    body.classList.remove('barcode-scanner-active');
    // Wipe any inline transparent background that might have leaked
    body.style.background = '';
    body.style.backgroundColor = '';
  }

  async function startScan() {
    try {
      const { BarcodeScanner } = await import(
        '@capacitor-mlkit/barcode-scanning'
      );

      // Check support
      const { supported } = await BarcodeScanner.isSupported();
      if (!supported) {
        setUnsupported(true);
        return;
      }

      // Request permission
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted' && camera !== 'limited') {
        setPermError(t('permDenied'));
        return;
      }

      // Make webview transparent so camera shows
      document.querySelector('body')?.classList.add('barcode-scanner-active');

      setScanning(true);

      // Start single scan
      const result = await BarcodeScanner.scan();
      const value = result.barcodes?.[0]?.rawValue;

      restoreWebview();
      setScanning(false);

      if (value) {
        // Extract certificate ID from URL or use raw value
        const id = parseQrValue(value);
        router.replace(`/traceability/detail?id=${encodeURIComponent(id)}`);
      } else {
        router.back();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Scan failed';
      setPermError(msg);
      setScanning(false);
      restoreWebview();
    }
  }

  async function stopScan() {
    try {
      const { BarcodeScanner } = await import(
        '@capacitor-mlkit/barcode-scanning'
      );
      await BarcodeScanner.stopScan();
    } catch {
      // noop
    } finally {
      restoreWebview();
    }
  }

  function parseQrValue(raw: string): string {
    // If URL like https://greenecogenius.tech/traceability/CERT-12345
    try {
      const url = new URL(raw);
      const parts = url.pathname.split('/').filter(Boolean);
      const last = parts[parts.length - 1];
      if (last) return last;
    } catch {
      // not a URL
    }
    return raw;
  }

  // Web/SSR fallback
  if (unsupported) {
    return (
      <AppShell title={t('scanTitle')} showBack>
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD54F]/15">
            <AlertCircle className="h-5 w-5 text-[#FFD54F]" />
          </div>
          <p className="text-center text-sm text-[#F5F5F0]/60">
            {t('scanUnsupported')}
          </p>
          <p className="max-w-xs text-center text-[11px] text-[#F5F5F0]/40">
            {t('scanUnsupportedHint')}
          </p>
        </div>
      </AppShell>
    );
  }

  if (permError) {
    return (
      <AppShell title={t('scanTitle')} showBack>
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15">
            <Camera className="h-5 w-5 text-red-300" />
          </div>
          <p className="text-center text-sm text-red-200">{permError}</p>
          <p className="max-w-xs text-center text-[11px] text-[#F5F5F0]/40">
            {t('permDeniedHint')}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-2 rounded-full border border-[#F5F5F0]/15 px-4 py-1.5 text-xs text-[#F5F5F0]/80 active:bg-[#F5F5F0]/10"
          >
            {t('back')}
          </button>
        </div>
      </AppShell>
    );
  }

  // Active scan UI: transparent overlay above camera
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-transparent">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
        <button
          onClick={() => {
            void stopScan();
            router.back();
          }}
          aria-label={t('cancel')}
          className="mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md active:bg-black/60"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Reticle */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative h-64 w-64">
          {/* Corners */}
          <div className="absolute left-0 top-0 h-8 w-8 border-l-[3px] border-t-[3px] border-[#B8D4E3] rounded-tl-2xl" />
          <div className="absolute right-0 top-0 h-8 w-8 border-r-[3px] border-t-[3px] border-[#B8D4E3] rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 h-8 w-8 border-b-[3px] border-l-[3px] border-[#B8D4E3] rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 h-8 w-8 border-b-[3px] border-r-[3px] border-[#B8D4E3] rounded-br-2xl" />
          {/* Animated line */}
          <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#B8D4E3] opacity-70" />
        </div>
      </div>

      {/* Hint */}
      <div className="px-6 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto mb-4 flex max-w-xs items-center gap-2 rounded-2xl bg-black/50 px-4 py-3 text-center backdrop-blur-md">
          <ScanLine className="h-5 w-5 shrink-0 text-[#B8D4E3]" />
          <p className="flex-1 text-[12px] text-white/90">{t('scanHint')}</p>
        </div>
      </div>
    </div>
  );
}
