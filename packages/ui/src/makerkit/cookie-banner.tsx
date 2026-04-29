'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '../shadcn/button';
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
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="bg-background animate-in fade-in slide-in-from-bottom-full fixed inset-x-0 bottom-0 z-[100] border-t shadow-2xl duration-500"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8 lg:px-8">
        <div className="flex-1">
          <h3
            id="cookie-banner-title"
            className="text-[#F5F5F0] text-base font-semibold"
          >
            <Trans
              i18nKey={'common.cookieBanner.title'}
              defaults={'Nous utilisons des cookies 🍪'}
            />
          </h3>
          <p
            id="cookie-banner-description"
            className="text-[#B8D4E3] mt-1 text-sm leading-relaxed"
          >
            <Trans
              i18nKey={'common.cookieBanner.description'}
              defaults={
                'Ce site utilise des cookies pour vous offrir la meilleure expérience possible et améliorer nos services.'
              }
            />
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center md:flex-shrink-0">
          <Button
            variant={'outline'}
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
