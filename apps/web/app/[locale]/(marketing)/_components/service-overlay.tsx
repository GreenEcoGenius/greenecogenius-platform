'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';

import { ArrowRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface ServiceData {
  id: string;
  labelKey: string;
  badgeKey: string;
  headlineKey: string;
  descriptionKey: string;
  heroImage: string;
  ctaLabelKey: string;
  ctaHref: string;
  badgeColor: string;
}

export const SERVICES: ServiceData[] = [
  {
    id: 'recycler',
    labelKey: 'orbitRecycler',
    badgeKey: 'serviceRecyclerBadge',
    headlineKey: 'serviceRecyclerTitle',
    descriptionKey: 'serviceRecyclerDesc',
    heroImage: '/images/normes/circular-zero-waste.webp',
    ctaLabelKey: 'serviceRecyclerCta',
    ctaHref: '/auth/sign-up',
    badgeColor: 'bg-primary-light text-primary-500',
  },
  {
    id: 'tracer',
    labelKey: 'orbitTracer',
    badgeKey: 'serviceTracerBadge',
    headlineKey: 'serviceTracerTitle',
    descriptionKey: 'serviceTracerDesc',
    heroImage: '/images/normes/traceability-blockchain-chain.webp',
    ctaLabelKey: 'serviceTracerCta',
    ctaHref: '/auth/sign-up',
    badgeColor: 'bg-circuit-ice text-circuit-blue',
  },
  {
    id: 'mesurer',
    labelKey: 'orbitMesurer',
    badgeKey: 'serviceMesurerBadge',
    headlineKey: 'serviceMesurerTitle',
    descriptionKey: 'serviceMesurerDesc',
    heroImage: '/images/normes/reporting-esg-meeting.webp',
    ctaLabelKey: 'serviceMesurerCta',
    ctaHref: '/auth/sign-up',
    badgeColor: 'bg-tech-mint text-tech-emerald',
  },
  {
    id: 'reduire',
    labelKey: 'orbitReduire',
    badgeKey: 'serviceReduireBadge',
    headlineKey: 'serviceReduireTitle',
    descriptionKey: 'serviceReduireDesc',
    heroImage: '/images/normes/carbon-footprint-green.webp',
    ctaLabelKey: 'serviceReduireCta',
    ctaHref: '/auth/sign-up',
    badgeColor: 'bg-badge-amber-bg text-badge-amber-text',
  },
  {
    id: 'optimiser',
    labelKey: 'orbitOptimiser',
    badgeKey: 'serviceOptimiserBadge',
    headlineKey: 'serviceOptimiserTitle',
    descriptionKey: 'serviceOptimiserDesc',
    heroImage: '/images/normes/saas-multi-device.webp',
    ctaLabelKey: 'serviceOptimiserCta',
    ctaHref: '/auth/sign-up',
    badgeColor: 'bg-badge-purple-bg text-badge-purple-text',
  },
  {
    id: 'connecter',
    labelKey: 'orbitConnecter',
    badgeKey: 'serviceConnecterBadge',
    headlineKey: 'serviceConnecterTitle',
    descriptionKey: 'serviceConnecterDesc',
    heroImage: '/images/normes/labels-globe-recycle.webp',
    ctaLabelKey: 'serviceConnecterCta',
    ctaHref: '/auth/sign-up',
    badgeColor: 'bg-red-50 text-red-600',
  },
];

export function ServiceOverlay({
  service,
  onClose,
}: {
  service: ServiceData;
  onClose: () => void;
}) {
  const t = useTranslations('marketing');
  const [show, setShow] = useState(false);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    requestAnimationFrame(() => setShow(true));
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-metal-900/40 absolute inset-0 backdrop-blur-sm transition-opacity duration-400"
        style={{ opacity: show ? 1 : 0 }}
      />

      <div
        className="relative z-10 mx-0 w-full max-w-[600px] transition-all duration-500 ease-out sm:mx-4"
        style={{
          opacity: show ? 1 : 0,
          transform: show
            ? 'translateY(0) scale(1)'
            : 'translateY(40px) scale(0.97)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="border-metal-silver hover:bg-metal-chrome absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border bg-white/80 backdrop-blur transition-colors"
          aria-label="Close"
        >
          <X className="text-metal-600 h-4 w-4" />
        </button>

        <div className="mb-16 max-h-[80svh] overflow-y-auto rounded-t-2xl bg-card shadow-2xl sm:mb-0 sm:max-h-[90svh] sm:rounded-2xl">
          <div className="relative h-[160px] overflow-hidden sm:h-[240px]">
            <img
              src={service.heroImage}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
          </div>

          <div className="relative -mt-6 px-6 pb-10 sm:px-8 sm:pb-8">
            <div
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-500 ${service.badgeColor}`}
              style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: '150ms',
              }}
            >
              {t(service.badgeKey)}
            </div>

            <h2
              className="text-metal-900 mt-3 text-2xl font-semibold transition-all duration-500"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: '250ms',
              }}
            >
              {t(service.headlineKey)}
            </h2>

            <p
              className="text-metal-600 mt-3 text-base leading-relaxed transition-all duration-500"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: '350ms',
              }}
            >
              {t(service.descriptionKey)}
            </p>

            <div
              className="mt-6 transition-all duration-500"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: '450ms',
              }}
            >
              <Link
                href={service.ctaHref}
                className="bg-primary hover:bg-primary-hover inline-flex items-center rounded-xl px-6 py-3 text-sm font-medium text-white transition-colors"
              >
                {t(service.ctaLabelKey)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
