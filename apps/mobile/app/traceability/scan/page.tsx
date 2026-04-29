'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Camera, X, ScanLine, AlertCircle } from 'lucide-react';
import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';

function ScanContent() {
  const t = useTranslations('traceability');
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const jsQRRef = useRef<typeof import('jsqr').default | null>(null);

  const [permError, setPermError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(false);

  // Load jsQR dynamically
  useEffect(() => {
    import('jsqr').then((mod) => {
      jsQRRef.current = mod.default;
    });
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const parseQrValue = useCallback((raw: string): string => {
    try {
      const url = new URL(raw);
      const parts = url.pathname.split('/').filter(Boolean);
      const last = parts[parts.length - 1];
      if (last) return last;
    } catch {
      // not a URL — use raw value
    }
    return raw;
  }, []);

  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const jsQR = jsQRRef.current;

    if (!video || !canvas || !jsQR || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      setFound(true);
      stopCamera();
      const id = parseQrValue(code.data);
      router.replace(`/traceability/detail?id=${encodeURIComponent(id)}`);
      return;
    }

    rafRef.current = requestAnimationFrame(scanFrame);
  }, [stopCamera, parseQrValue, router]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setScanning(true);
        rafRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Camera access denied';
      if (msg.includes('NotAllowed') || msg.includes('Permission')) {
        setPermError(t('permDeniedHint'));
      } else {
        setPermError(msg);
      }
    }
  }, [scanFrame, t]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Permission error state
  if (permError) {
    return (
      <AppShell title={t('scanTitle')} showBack hideTabBar>
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <Camera className="h-7 w-7 text-red-400" />
          </div>
          <p className="text-center text-[14px] font-medium text-red-300">
            {t('permDeniedHint')}
          </p>
          <p className="max-w-[260px] text-center text-[12px] text-[#F5F5F0]/40">
            Activez la caméra pour cette app dans Réglages iOS pour utiliser le scanner.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-2 rounded-xl border border-[#F5F5F0]/[0.08] px-5 py-2.5 text-[13px] text-[#F5F5F0]/70 active:bg-[#F5F5F0]/[0.04] transition-colors"
          >
            {t('back')}
          </button>
        </div>
      </AppShell>
    );
  }

  // Active scan UI
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Camera video feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        autoPlay
      />
      {/* Hidden canvas for QR processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
        >
          <button
            onClick={() => {
              stopCamera();
              router.back();
            }}
            aria-label={t('cancel')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md active:bg-black/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Reticle */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative h-64 w-64">
            <div className="absolute left-0 top-0 h-10 w-10 border-l-[3px] border-t-[3px] border-[#B8D4E3] rounded-tl-2xl" />
            <div className="absolute right-0 top-0 h-10 w-10 border-r-[3px] border-t-[3px] border-[#B8D4E3] rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 h-10 w-10 border-b-[3px] border-l-[3px] border-[#B8D4E3] rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 h-10 w-10 border-b-[3px] border-r-[3px] border-[#B8D4E3] rounded-br-2xl" />
            {/* Animated scan line */}
            <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#B8D4E3] to-transparent opacity-80 animate-pulse" />
            {found && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <ScanLine className="h-8 w-8 text-emerald-400 animate-ping" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hint */}
        <div
          className="px-6"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        >
          <div className="mx-auto flex max-w-xs items-center gap-3 rounded-2xl bg-black/50 px-4 py-3 backdrop-blur-md">
            <ScanLine className="h-5 w-5 shrink-0 text-[#B8D4E3]" />
            <p className="flex-1 text-[12px] text-white/90">
              {scanning ? t('scanHint') : 'Initialisation de la caméra...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TraceabilityScanPage() {
  return (
    <AuthGuard>
      <ScanContent />
    </AuthGuard>
  );
}
