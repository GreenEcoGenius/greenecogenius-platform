import Image from 'next/image';

import { Code2, Database, ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from '../animate-on-scroll';

interface LogoItem {
  name: string;
  src: string | null;
  url: string;
}

const techLogos: LogoItem[] = [
  {
    name: 'Next.js',
    src: '/images/logos/nextjs.svg',
    url: 'https://nextjs.org',
  },
  {
    name: 'Supabase',
    src: '/images/logos/supabase.svg',
    url: 'https://supabase.com',
  },
  {
    name: 'Vercel',
    src: '/images/logos/vercel.svg',
    url: 'https://vercel.com',
  },
  {
    name: 'Polygon',
    src: '/images/logos/polygon.svg',
    url: 'https://polygon.technology',
  },
  { name: 'Stripe', src: null, url: 'https://stripe.com' },
  { name: 'Anthropic', src: null, url: 'https://anthropic.com' },
  {
    name: 'GitHub',
    src: '/images/logos/github.svg',
    url: 'https://github.com',
  },
  { name: 'Cursor', src: null, url: 'https://cursor.com' },
  { name: 'Alchemy', src: null, url: 'https://www.alchemy.com' },
];

const sourceLogos: LogoItem[] = [
  { name: 'ADEME', src: null, url: 'https://www.ademe.fr' },
  { name: 'SINOE', src: null, url: 'https://www.sinoe.org' },
  { name: 'Eurostat', src: null, url: 'https://ec.europa.eu/eurostat' },
  { name: 'EPA', src: null, url: 'https://www.epa.gov' },
  { name: 'FEDEREC', src: null, url: 'https://federec.com' },
];

const frameworkLogos: LogoItem[] = [
  { name: 'ISO 14001', src: null, url: 'https://www.iso.org' },
  { name: 'GHG Protocol', src: null, url: 'https://ghgprotocol.org' },
  { name: 'GRI', src: null, url: 'https://www.globalreporting.org' },
  { name: 'CSRD / ESRS', src: null, url: 'https://finance.ec.europa.eu' },
  { name: 'B Corp', src: null, url: 'https://www.bcorporation.net' },
  { name: 'GreenTech', src: null, url: 'https://greentechverte.fr' },
  { name: 'NR (INR)', src: null, url: 'https://institutnr.org' },
];

function LogoGrid({ logos }: { logos: LogoItem[] }) {
  return (
    <div className="grid grid-cols-2 items-center justify-items-center gap-5 sm:grid-cols-3">
      {logos.map((logo) => (
        <a
          key={logo.name}
          href={logo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 p-3"
        >
          <div className="flex h-10 items-center opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0">
            {logo.src ? (
              <Image
                src={logo.src}
                alt={logo.name}
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="text-metal-400 group-hover:text-metal-700 text-sm font-bold transition-colors">
                {logo.name}
              </span>
            )}
          </div>
          {logo.src && (
            <span className="text-metal-400 group-hover:text-metal-600 text-xs transition-colors">
              {logo.name}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}

export async function FoundationsSection() {
  const t = await getTranslations('marketing');

  return (
    <section className="bg-metal-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-16 text-center">
            <h2 className="text-metal-900 text-3xl font-bold">
              {t('landing.foundationsTitle')}
            </h2>
            <p className="text-metal-500 mx-auto mt-3 max-w-3xl text-lg">
              {t('landing.foundationsSub')}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
          <AnimateOnScroll animation="fade-up">
            <div>
              <div className="mb-8 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-teal-600" strokeWidth={1.5} />
                <h3 className="text-metal-800 text-lg font-semibold">
                  {t('landing.foundationsTech')}
                </h3>
              </div>
              <LogoGrid logos={techLogos} />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <div>
              <div className="mb-8 flex items-center gap-2">
                <Database
                  className="h-5 w-5 text-emerald-600"
                  strokeWidth={1.5}
                />
                <h3 className="text-metal-800 text-lg font-semibold">
                  {t('landing.foundationsSources')}
                </h3>
              </div>
              <LogoGrid logos={sourceLogos} />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck
                  className="h-5 w-5 text-green-600"
                  strokeWidth={1.5}
                />
                <h3 className="text-metal-800 text-lg font-semibold">
                  {t('landing.foundationsFrameworks')}
                </h3>
              </div>
              <p className="text-metal-400 mb-8 ml-7 text-xs">
                {t('landing.foundationsFrameworksSub')}
              </p>
              <LogoGrid logos={frameworkLogos} />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
