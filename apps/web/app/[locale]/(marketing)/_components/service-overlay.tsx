'use client';

import { useCallback, useEffect } from 'react';

import Link from 'next/link';

import { ArrowRight, X } from 'lucide-react';

import { Button } from '@kit/ui/button';

export interface ServiceData {
  id: string;
  label: string;
  headline: string;
  description: string;
  features: string[];
  heroImage: string;
  secondaryImage: string;
  ctaLabel: string;
  ctaHref: string;
  color: string;
}

export const SERVICES: ServiceData[] = [
  {
    id: 'recycler',
    label: 'Recycler',
    headline: 'Le Comptoir Circulaire',
    description:
      'La marketplace B2B ou les entreprises vendent, achetent et collectent leurs matieres recyclables. Chaque transaction est tracee et son impact carbone calcule automatiquement.',
    features: [
      'Marketplace de matieres secondaires',
      'Mise en relation acheteur-vendeur-collecteur',
      'Calcul CO2 automatique par transaction',
      'Classification 9 flux reglementaire',
    ],
    heroImage: '/images/normes/circular-infinity-aerial.png',
    secondaryImage: '/images/normes/circular-zero-waste.png',
    ctaLabel: 'Decouvrir Le Comptoir',
    ctaHref: '/home/marketplace',
    color: '#3BB54A',
  },
  {
    id: 'tracer',
    label: 'Tracer',
    headline: 'Tracabilite Blockchain',
    description:
      'Chaque lot de matieres est enregistre sur la blockchain Polygon avec un hash SHA-256 immuable. Preuve anti-greenwashing verifiable publiquement via QR code.',
    features: [
      'Enregistrement on-chain Polygon',
      'Certificats avec QR code verifiable',
      'Chaine de confiance de bout en bout',
      'Conforme ISO 59014:2024',
    ],
    heroImage: '/images/normes/traceability-blockchain-chain.png',
    secondaryImage: '/images/normes/traceability-supply-chain.png',
    ctaLabel: 'Voir la Tracabilite',
    ctaHref: '/home/traceability',
    color: '#8DC63F',
  },
  {
    id: 'mesurer',
    label: 'Mesurer',
    headline: 'Impact Carbone',
    description:
      'Mesurez vos emissions Scope 1, 2 et 3 avec les facteurs ADEME. Visualisez votre bilan carbone, vos equivalences CO2 et votre trajectoire de reduction.',
    features: [
      'Bilan carbone Scope 1/2/3',
      'Facteurs ADEME Base Carbone 2024',
      'Equivalences visuelles (arbres, km)',
      'Rapport PDF GHG Protocol',
    ],
    heroImage: '/images/normes/carbon-counter-1000t.png',
    secondaryImage: '/images/normes/reporting-co2-dashboard.png',
    ctaLabel: 'Voir Impact Carbone',
    ctaHref: '/home/carbon',
    color: '#87CEEB',
  },
  {
    id: 'reduire',
    label: 'Reduire',
    headline: 'Reduction des Emissions',
    description:
      "L'IA analyse vos donnees et identifie les leviers de reduction les plus impactants. Plan d'action personnalise avec objectifs SBTi et suivi en temps reel.",
    features: [
      'Recommandations IA personnalisees',
      'Objectifs alignes SBTi',
      'Suivi de la trajectoire de reduction',
      'Benchmark sectoriel automatique',
    ],
    heroImage: '/images/normes/carbon-footprint-green.png',
    secondaryImage: '/images/normes/carbon-dashboard-dark.png',
    ctaLabel: 'Voir les recommandations',
    ctaHref: '/home/carbon',
    color: '#1B9E77',
  },
  {
    id: 'optimiser',
    label: 'Optimiser',
    headline: 'Intelligence Artificielle',
    description:
      'Notre IA guide chaque etape : saisie du bilan carbone, diagnostic RSE, pre-audit de conformite, generation de rapports. Vous gagnez des heures de travail.',
    features: [
      'Saisie guidee du bilan carbone',
      'Diagnostic RSE automatise',
      'Pre-audit conformite 42 normes',
      'Generation de rapports PDF',
    ],
    heroImage: '/images/normes/saas-multi-device.png',
    secondaryImage: '/images/normes/reporting-hologram-data.png',
    ctaLabel: "Essayer l'IA",
    ctaHref: '/home/esg/wizard',
    color: '#F4A261',
  },
  {
    id: 'connecter',
    label: 'Connecter',
    headline: 'Ecosysteme Connecte',
    description:
      'Toutes les donnees circulent entre les modules : Le Comptoir alimente le bilan carbone, la tracabilite alimente le reporting ESG, le diagnostic RSE alimente la conformite.',
    features: [
      '42 normes integrees nativement',
      'Donnees auto-remplies entre modules',
      'Reporting CSRD/GRI/GHG Protocol',
      'Labels RSE : B Corp, Lucie 26000',
    ],
    heroImage: '/images/normes/labels-globe-recycle.png',
    secondaryImage: '/images/normes/saas-carbon-dark.png',
    ctaLabel: 'Voir les normes',
    ctaHref: '/normes',
    color: '#87CEEB',
  },
];

export function ServiceOverlay({
  service,
  onClose,
}: {
  service: ServiceData;
  onClose: () => void;
}) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center duration-300"
      onClick={onClose}
    >
      {/* Background image */}
      <img
        src={service.heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="animate-in slide-in-from-bottom-4 fade-in relative z-10 mx-4 w-full max-w-3xl duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
          {/* Hero section */}
          <div className="relative h-48 overflow-hidden sm:h-56">
            <img
              src={service.secondaryImage}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div
                className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{
                  backgroundColor: `${service.color}33`,
                  borderColor: `${service.color}55`,
                  borderWidth: 1,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: service.color }}
                />
                {service.label}
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {service.headline}
              </h2>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {service.description}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {service.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: service.color }}
                  />
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button
                render={
                  <Link href={service.ctaHref}>
                    {service.ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                }
                nativeButton={false}
              />
              <button
                onClick={onClose}
                className="text-muted-foreground text-sm hover:underline"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
