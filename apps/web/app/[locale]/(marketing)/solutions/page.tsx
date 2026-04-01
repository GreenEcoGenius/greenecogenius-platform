import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  FileText,
  Globe,
  Leaf,
  Link2,
  Recycle,
  Shield,
  Sparkles,
  TrendingDown,
} from 'lucide-react';

import { AnimateOnScroll } from '../_components/animate-on-scroll';

export async function generateMetadata() {
  return {
    title: 'Nos Solutions | GreenEcoGenius',
    description:
      'Marketplace B2B, tracabilite blockchain, bilan carbone IA, reporting ESG. Decouvrez nos solutions pour accelerer votre transition circulaire.',
  };
}

const SOLUTIONS = [
  {
    id: 'marketplace',
    icon: <Recycle className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Le Comptoir Circulaire',
    subtitle: 'Marketplace B2B',
    description:
      'Achetez, vendez et collectez des matieres recyclables entre professionnels. Notre algorithme Smart Matching connecte les bons partenaires instantanement.',
    features: [
      'Matching intelligent par materiau, volume et localisation',
      "Commission transparente, pas d'abonnement obligatoire",
      'Impact CO2 calcule automatiquement par transaction',
    ],
    image: '/images/normes/circular-zero-waste.png',
    color: 'from-teal-600 to-teal-800',
    href: '/auth/sign-up',
  },
  {
    id: 'traceability',
    icon: <Link2 className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Tracabilite Blockchain',
    subtitle: 'Polygon Mainnet',
    description:
      'Chaque lot est enregistre sur la blockchain avec un hash SHA-256 immuable. Preuve anti-greenwashing verifiable par QR code.',
    features: [
      'Enregistrement on-chain Polygon en temps reel',
      'Certificats PDF avec QR code verifiable',
      'Conforme ISO 59014:2024',
    ],
    image: '/images/normes/traceability-blockchain-chain.png',
    color: 'from-emerald-600 to-emerald-800',
    href: '/auth/sign-up',
  },
  {
    id: 'carbon',
    icon: <Leaf className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Impact Carbone',
    subtitle: 'Bilan Scope 1/2/3',
    description:
      "Mesurez vos emissions avec les facteurs ADEME. L'IA guide votre saisie et genere des recommandations de reduction personnalisees.",
    features: [
      "Saisie guidee par l'IA en 15 minutes",
      'Facteurs ADEME Base Carbone 2024',
      'Rapport PDF GHG Protocol telechargeable',
    ],
    image: '/images/normes/carbon-counter-1000t.png',
    color: 'from-green-600 to-green-800',
    href: '/auth/sign-up',
  },
  {
    id: 'reporting',
    icon: <BarChart3 className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Reporting ESG',
    subtitle: 'CSRD / GRI / GHG',
    description:
      'Generez des rapports conformes aux standards europeens. 42 champs auto-remplis depuis vos donnees plateforme, 6 restants a completer.',
    features: [
      '87% des champs remplis automatiquement',
      'Formats CSRD, GRI Standards, GHG Protocol',
      'Tableau CSRD interactif avec 12 normes ESRS',
    ],
    image: '/images/normes/reporting-esg-meeting.png',
    color: 'from-teal-700 to-emerald-700',
    href: '/auth/sign-up',
  },
  {
    id: 'compliance',
    icon: <Shield className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Conformite & RSE',
    subtitle: '42 normes integrees',
    description:
      'Pre-audit de conformite en 6 appels IA paralleles. Diagnostic RSE avec eligibilite aux labels B Corp, Lucie 26000, Label NR.',
    features: [
      'Pre-audit conformite 42 normes en < 10 secondes',
      'Diagnostic RSE avec score et feuille de route',
      'Eligibilite labels : B Corp, Lucie 26000, GreenTech',
    ],
    image: '/images/normes/labels-globe-recycle.png',
    color: 'from-emerald-700 to-green-700',
    href: '/auth/sign-up',
  },
];

export default function SolutionsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-28 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="bg-primary/10 text-primary mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />6 modules integres
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Nos Solutions
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
              De la marketplace au reporting ESG, chaque module fonctionne
              ensemble pour automatiser votre transition circulaire.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Solutions - alternating layout */}
      {SOLUTIONS.map((solution, index) => {
        const isEven = index % 2 === 0;

        return (
          <section
            key={solution.id}
            className={`py-16 sm:py-24 ${index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div
                className={`grid items-center gap-12 lg:grid-cols-2 ${
                  isEven ? '' : 'lg:[direction:rtl]'
                }`}
              >
                {/* Image */}
                <AnimateOnScroll
                  animation={isEven ? 'fade-right' : 'fade-left'}
                >
                  <div className="relative overflow-hidden rounded-2xl lg:[direction:ltr]">
                    <Image
                      src={solution.image}
                      alt={solution.title}
                      width={800}
                      height={500}
                      className="w-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${solution.color} opacity-20`}
                    />
                  </div>
                </AnimateOnScroll>

                {/* Content */}
                <div className="lg:[direction:ltr]">
                  <AnimateOnScroll
                    animation={isEven ? 'fade-left' : 'fade-right'}
                    delay={100}
                  >
                    <div className="text-primary mb-4 inline-flex items-center gap-3">
                      <div className="bg-primary/10 rounded-xl p-3">
                        {solution.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-wider text-emerald-600 uppercase">
                          {solution.subtitle}
                        </p>
                        <h2 className="text-2xl font-bold sm:text-3xl">
                          {solution.title}
                        </h2>
                      </div>
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll
                    animation={isEven ? 'fade-left' : 'fade-right'}
                    delay={200}
                  >
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {solution.description}
                    </p>
                  </AnimateOnScroll>

                  <AnimateOnScroll
                    animation={isEven ? 'fade-left' : 'fade-right'}
                    delay={300}
                  >
                    <ul className="mt-6 space-y-3">
                      {solution.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </AnimateOnScroll>

                  <AnimateOnScroll
                    animation={isEven ? 'fade-left' : 'fade-right'}
                    delay={400}
                  >
                    <Link
                      href={solution.href}
                      className="bg-primary text-primary-foreground mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:shadow-lg"
                    >
                      Commencer gratuitement
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </AnimateOnScroll>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Integration banner */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Image
          src="/images/normes/saas-multi-device.png"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/80" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <Globe
              className="mx-auto mb-6 h-12 w-12 text-emerald-400"
              strokeWidth={1}
            />
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Un ecosysteme connecte
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
              Chaque module alimente les autres. Le Comptoir genere les donnees
              carbone, la tracabilite alimente le reporting ESG, le diagnostic
              RSE verifie la conformite.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                {
                  icon: <TrendingDown className="h-6 w-6" />,
                  value: '-45%',
                  label: 'Dechets reduits',
                },
                {
                  icon: <Leaf className="h-6 w-6" />,
                  value: '545t',
                  label: 'CO2 evite',
                },
                {
                  icon: <FileText className="h-6 w-6" />,
                  value: '42',
                  label: 'Normes integrees',
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  value: '87%',
                  label: 'Champs auto',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm"
                >
                  <div className="mx-auto mb-2 text-emerald-400">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={400}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-gray-900 transition-all hover:shadow-xl"
              >
                Demarrer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/normes"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Voir les 42 normes
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
