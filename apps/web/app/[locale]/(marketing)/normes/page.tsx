import Link from 'next/link';

import {
  Award,
  ChevronRight,
  FileText,
  Globe,
  Link as LinkIcon,
  Recycle,
  Shield,
} from 'lucide-react';

import { Button } from '@kit/ui/button';

import { AnimateOnScroll } from '../_components/animate-on-scroll';
import { AnimatedCounter } from '../_components/animated-counter';
import { NormsPillarSections } from './_components/norms-pillar-sections';
import { NormsRecapTable } from './_components/norms-recap-table';
import { NormsRoadmap } from './_components/norms-roadmap';

export async function generateMetadata() {
  return {
    title: 'Normes & Standards -- 42 normes integrees | GreenEcoGenius',
    description:
      'GreenEcoGenius integre 42 normes ISO, reglementations europeennes et francaises, et frameworks ESG pour garantir votre conformite. CSRD, GHG Protocol, ISO 14064, Loi AGEC, RGPD.',
  };
}

const PILLAR_ICONS = [
  {
    icon: <Recycle className="h-5 w-5" />,
    label: 'Economie circulaire',
    count: 11,
  },
  { icon: <Globe className="h-5 w-5" />, label: 'Bilan carbone', count: 7 },
  { icon: <FileText className="h-5 w-5" />, label: 'Reporting ESG', count: 9 },
  { icon: <LinkIcon className="h-5 w-5" />, label: 'Tracabilite', count: 6 },
  { icon: <Shield className="h-5 w-5" />, label: 'Donnees & SaaS', count: 5 },
  { icon: <Award className="h-5 w-5" />, label: 'Labels RSE', count: 4 },
];

export default function NormesPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Normes & Standards -- GreenEcoGenius',
    description: '42 normes, reglementations et frameworks integres',
    publisher: {
      '@type': 'Organization',
      name: 'GreenEcoGenius OU',
      url: 'https://greenecogenius.tech',
    },
  };

  return (
    <>
      <script
        key="ld:json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-28 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Normes & Standards
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
              42 normes, reglementations et frameworks integres a notre
              plateforme pour garantir votre conformite.
            </p>
            <p className="text-muted-foreground mx-auto mt-3 max-w-3xl text-sm">
              GreenEcoGenius est la seule plateforme B2B d&apos;economie
              circulaire qui integre nativement les normes ISO, les
              reglementations europeennes et francaises, et les frameworks de
              reporting ESG dans chaque fonctionnalite.
            </p>
          </AnimateOnScroll>

          {/* Counters */}
          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-5">
              {[
                { target: 42, label: 'normes integrees' },
                { target: 6, label: 'piliers couverts' },
                { target: 15, label: 'normes ISO' },
                { target: 12, label: 'reglementations' },
                { target: 4, label: 'labels vises' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    <AnimatedCounter target={item.target} />
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          {/* CTAs */}
          <AnimateOnScroll animation="fade-up" delay={400}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                render={
                  <Link href="/home">
                    Decouvrir la plateforme
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                }
                nativeButton={false}
              />
              <Button
                variant="outline"
                render={<Link href="/home/billing">Voir les tarifs</Link>}
                nativeButton={false}
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Pourquoi 42 normes */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Pourquoi 42 normes ?
            </h2>
            <div className="text-muted-foreground mt-6 space-y-4 text-sm leading-relaxed sm:text-base">
              <p>
                La transition vers l&apos;economie circulaire n&apos;est pas
                qu&apos;un choix ethique -- c&apos;est une obligation
                reglementaire croissante. Avec la CSRD, le Decret 9 flux, la loi
                AGEC, et les nouvelles normes ISO 59000, les entreprises doivent
                prouver leur engagement avec des donnees verifiables.
              </p>
              <p>
                GreenEcoGenius integre ces normes directement dans sa
                plateforme. Pas de consultant externe, pas de tableur Excel.
                Chaque transaction, chaque calcul, chaque rapport est
                automatiquement conforme.
              </p>
              <p>
                Et grace a notre tracabilite blockchain, vos donnees sont
                immuables et verifiables -- la preuve ultime anti-greenwashing.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Pillar navigation */}
      <section className="border-y bg-gray-50/50 py-8 dark:bg-gray-950/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PILLAR_ICONS.map((p) => (
              <a
                key={p.label}
                href={`#pillar-${p.label.toLowerCase().replace(/[^a-z]/g, '-')}`}
                className="flex items-center gap-2 rounded-lg border bg-white p-3 text-sm transition-shadow hover:shadow-md dark:bg-gray-900"
              >
                <span className="text-emerald-600">{p.icon}</span>
                <span>
                  <span className="block text-xs font-medium">{p.label}</span>
                  <span className="text-muted-foreground text-[10px]">
                    {p.count} normes
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* All pillar sections */}
      <NormsPillarSections />

      {/* How it works */}
      <section className="bg-gray-50 py-16 sm:py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Comment ca fonctionne concretement ?
            </h2>
          </AnimateOnScroll>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Automatique',
                desc: "Les normes s'appliquent automatiquement dans chaque fonctionnalite de la plateforme. Pas de configuration.",
              },
              {
                title: 'Verifiable',
                desc: "Chaque donnee est tracable jusqu'a sa preuve blockchain sur Polygon. Anti-greenwashing garanti.",
              },
              {
                title: 'Evolutif',
                desc: "Quand une norme evolue ou qu'une nouvelle entre en vigueur, la plateforme se met a jour automatiquement.",
              },
            ].map((card, i) => (
              <AnimateOnScroll
                key={card.title}
                animation="fade-up"
                delay={i * 100}
              >
                <div className="rounded-xl border bg-white p-6 dark:bg-gray-900">
                  <h3 className="font-semibold">{card.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {card.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll animation="fade-up" delay={300}>
            <div className="mt-8 rounded-xl border bg-white p-6 dark:bg-gray-900">
              <p className="text-sm font-medium">Exemple concret :</p>
              <p className="text-muted-foreground mt-2 text-sm">
                Quand vous publiez un lot sur Le Comptoir Circulaire, la
                plateforme applique automatiquement le Decret 9 flux
                (classification matiere), l&apos;ISO 59014 (tracabilite
                blockchain), le GHG Protocol (calcul CO2), et prepare les
                donnees pour votre rapport CSRD. En un clic.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Roadmap */}
      <NormsRoadmap />

      {/* Recap table */}
      <NormsRecapTable />

      {/* Final CTA */}
      <section className="bg-gray-50 py-16 sm:py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Pret a etre conforme sans effort ?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-sm">
              GreenEcoGenius applique automatiquement ces 42 normes dans chaque
              transaction, chaque calcul, chaque rapport. Essayez gratuitement
              pendant 14 jours.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                render={
                  <Link href="/home">
                    Demarrer l&apos;essai gratuit
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                }
                nativeButton={false}
              />
              <Button
                variant="outline"
                render={<Link href="/home/billing">Voir les tarifs</Link>}
                nativeButton={false}
              />
              <Button
                variant="ghost"
                render={<Link href="/contact">Nous contacter</Link>}
                nativeButton={false}
              />
            </div>
            <p className="text-muted-foreground mt-6 text-xs italic">
              &quot;La seule plateforme qui combine marketplace, blockchain et
              reporting ESG -- avec 42 normes integrees nativement.&quot;
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
