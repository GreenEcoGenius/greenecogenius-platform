'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '../shadcn/button';
import { Heading } from '../shadcn/heading';
import { Trans } from './trans';

// configure this as you wish
const COOKIE_CONSENT_STATUS = 'cookie_consent_status';

enum ConsentStatus {
  Accepted = 'accepted',
  Rejected = 'rejected',
  Unknown = 'unknown',
}

export function CookieBanner() {
  const { status, accept, reject } = useCookieConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (status !== ConsentStatus.Unknown) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="animate-in fade-in fixed inset-0 bg-black/50 backdrop-blur-sm duration-300"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="bg-background animate-in fade-in zoom-in-95 slide-in-from-bottom-4 relative w-full max-w-xl rounded-2xl border p-8 shadow-2xl duration-300 sm:p-10">
        <div className="flex flex-col space-y-5">
          <div id="cookie-banner-title">
            <Heading level={2}>
              <Trans
                i18nKey={'common.cookieBanner.title'}
                defaults={'Nous utilisons des cookies 🍪'}
              />
            </Heading>
          </div>

          <p className="text-muted-foreground text-base leading-relaxed">
            <Trans
              i18nKey={'common.cookieBanner.description'}
              defaults={
                'Ce site utilise des cookies pour vous offrir la meilleure expérience possible et améliorer nos services.'
              }
            />
          </p>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              variant={'outline'}
              size={'lg'}
              onClick={reject}
              data-test="cookie-banner-reject"
            >
              <Trans
                i18nKey={'common.cookieBanner.reject'}
                defaults={'Refuser'}
              />
            </Button>

            <Button
              autoFocus
              size={'lg'}
              onClick={accept}
              data-test="cookie-banner-accept"
            >
              <Trans
                i18nKey={'common.cookieBanner.accept'}
                defaults={'Accepter'}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useCookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>(ConsentStatus.Unknown);

  useEffect(() => {
    setStatus(getStatusFromLocalStorage());
  }, []);

  const accept = useCallback(() => {
    const status = ConsentStatus.Accepted;

    setStatus(status);
    storeStatusInLocalStorage(status);
  }, []);

  const reject = useCallback(() => {
    const status = ConsentStatus.Rejected;

    setStatus(status);
    storeStatusInLocalStorage(status);
  }, []);

  const clear = useCallback(() => {
    const status = ConsentStatus.Unknown;

    setStatus(status);
    storeStatusInLocalStorage(status);
  }, []);

  return useMemo(() => {
    return {
      clear,
      status,
      accept,
      reject,
    };
  }, [clear, status, accept, reject]);
}

function storeStatusInLocalStorage(status: ConsentStatus) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(COOKIE_CONSENT_STATUS, status);
}

function getStatusFromLocalStorage() {
  if (!isBrowser()) {
    return ConsentStatus.Unknown;
  }

  const status = localStorage.getItem(COOKIE_CONSENT_STATUS) as ConsentStatus;

  return status ?? ConsentStatus.Unknown;
}

function isBrowser() {
  return typeof window !== 'undefined';
}
