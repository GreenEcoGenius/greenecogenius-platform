'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';

import { ArrowRight, X } from 'lucide-react';

export interface ServiceData {
  id: string;
  label: string;
  badge: string;
  badgeColor: string;
  headline: string;
  description: string;
  heroImage: string;
  ctaLabel: string;
  ctaHref: string;
}

export const SERVICES: ServiceData[] = [
  {
    id: 'recycler',
    label: 'Recycler',
    badge: 'Marketplace',
    badgeColor: '#1D9E75',
    headline: 'Le Comptoir Circulaire',
    description:
      'Achetez et vendez des matieres recyclables entre professionnels sur notre marketplace B2B. Notre algorithme de Smart Matching connecte vendeurs et acheteurs selon le type de materiau, la localisation et le volume.',
    heroImage: '/images/normes/circular-zero-waste.png',
    ctaLabel: 'Acceder a la marketplace',
    ctaHref: '/auth/sign-up',
  },
  {
    id: 'tracer',
    label: 'Tracer',
    badge: 'Blockchain',
    badgeColor: '#534AB7',
    headline: 'Tracabilite Blockchain',
    description:
      "Suivez chaque materiau de bout en bout grace a la blockchain Polygon. Transparence totale et registres immuables pour l'ensemble de votre chaine d'approvisionnement.",
    heroImage: '/images/normes/traceability-blockchain-chain.png',
    ctaLabel: 'Decouvrir la tracabilite',
    ctaHref: '/auth/sign-up',
  },
  {
    id: 'mesurer',
    label: 'Mesurer',
    badge: 'IA & Data',
    badgeColor: '#185FA5',
    headline: 'AI Carbon & CSR',
    description:
      'Calculez votre empreinte carbone et generez des rapports RSE automatiquement. Notre IA analyse vos donnees en temps reel pour des rapports conformes CSRD et taxonomie verte.',
    heroImage: '/images/normes/reporting-esg-meeting.png',
    ctaLabel: 'Calculer mon impact',
    ctaHref: '/auth/sign-up',
  },
  {
    id: 'reduire',
    label: 'Reduire',
    badge: 'Optimisation',
    badgeColor: '#BA7517',
    headline: 'Reduction des dechets',
    description:
      "Identifiez les gisements de valeur caches dans vos flux de matieres. Notre plateforme vous fournit un plan d'action concret pour reduire vos dechets jusqu'a 45%.",
    heroImage: '/images/normes/carbon-footprint-green.png',
    ctaLabel: 'Reduire mes dechets',
    ctaHref: '/auth/sign-up',
  },
  {
    id: 'optimiser',
    label: 'Optimiser',
    badge: 'Logistique',
    badgeColor: '#0F6E56',
    headline: 'Logistique optimisee',
    description:
      "Reduisez vos couts logistiques jusqu'a 30% grace a notre reseau de collecte et transport mutualise. Optimisation des tournees par IA et suivi en temps reel.",
    heroImage: '/images/normes/saas-multi-device.png',
    ctaLabel: 'Optimiser ma logistique',
    ctaHref: '/auth/sign-up',
  },
  {
    id: 'connecter',
    label: 'Connecter',
    badge: 'Integration',
    badgeColor: '#993C1D',
    headline: 'Ecosysteme connecte',
    description:
      'Integrez GreenEcoGenius a votre ERP existant via nos APIs REST et webhooks. Compatible SAP, Oracle, Microsoft Dynamics et autres systemes populaires.',
    heroImage: '/images/normes/labels-globe-recycle.png',
    ctaLabel: 'Voir les integrations',
    ctaHref: '/auth/sign-up',
  },
];

export function ServiceOverlay({
  service,
  onClose,
}: {
  service: ServiceData;
  onClose: () => void;
}) {
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
    // Trigger staggered animations
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-400"
        style={{ opacity: show ? 1 : 0 }}
      />

      {/* Modal */}
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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/80 backdrop-blur transition-colors hover:bg-gray-100"
          aria-label="Fermer"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        <div className="max-h-[90svh] overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
          {/* Image bandeau ~40% */}
          <div className="relative h-[200px] overflow-hidden sm:h-[240px]">
            <img
              src={service.heroImage}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
          </div>

          {/* Content */}
          <div className="relative -mt-6 px-6 pb-8 sm:px-8">
            {/* Badge */}
            <div
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white transition-all duration-500"
              style={{
                backgroundColor: service.badgeColor,
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: '150ms',
              }}
            >
              {service.badge}
            </div>

            {/* Title */}
            <h2
              className="mt-3 text-2xl font-semibold text-gray-900 transition-all duration-500"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: '250ms',
              }}
            >
              {service.headline}
            </h2>

            {/* Description */}
            <p
              className="mt-3 text-base leading-relaxed text-gray-600 transition-all duration-500"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: '350ms',
              }}
            >
              {service.description}
            </p>

            {/* CTA */}
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
                className="inline-flex items-center rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0F6E56]"
              >
                {service.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
