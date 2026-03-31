import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { Button } from '@kit/ui/button';

import { AnimateOnScroll } from '../_components/animate-on-scroll';
import { AnimatedCounter } from '../_components/animated-counter';
import { NormsTabbedContent } from './_components/norms-tabbed-content';

export async function generateMetadata() {
  return {
    title: 'Normes & Standards -- 42 normes integrees | GreenEcoGenius',
    description:
      'GreenEcoGenius integre 42 normes ISO, reglementations europeennes et francaises, et frameworks ESG pour garantir votre conformite. CSRD, GHG Protocol, ISO 14064, Loi AGEC, RGPD.',
  };
}

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

      {/* Tabbed content */}
      <NormsTabbedContent />
    </>
  );
}
