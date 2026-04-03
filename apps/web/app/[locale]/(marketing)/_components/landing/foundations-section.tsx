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
  { name: 'Next.js', src: '/images/logos/nextjs.svg', url: 'https://nextjs.org' },
  { name: 'Supabase', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/supabase.svg', url: 'https://supabase.com' },
  { name: 'Vercel', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/png-transparent-vercel-hd-logo.png', url: 'https://vercel.com' },
  { name: 'Polygon', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Polygon_blockchain_logo.svg.png', url: 'https://polygon.technology' },
  { name: 'Stripe', src: null, url: 'https://stripe.com' },
  { name: 'Anthropic', src: null, url: 'https://anthropic.com' },
  { name: 'GitHub', src: '/images/logos/github.svg', url: 'https://github.com' },
  { name: 'Cursor', src: null, url: 'https://cursor.com' },
  { name: 'Alchemy', src: null, url: 'https://www.alchemy.com' },
];

const sourceLogos: LogoItem[] = [
  { name: 'ADEME', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/logo-ademe-removebg-preview.png.webp', url: 'https://www.ademe.fr' },
  { name: 'SINOE', src: null, url: 'https://www.sinoe.org' },
  { name: 'Eurostat', src: null, url: 'https://ec.europa.eu/eurostat' },
  { name: 'EPA', src: null, url: 'https://www.epa.gov' },
  { name: 'FEDEREC', src: null, url: 'https://federec.com' },
];

const frameworkLogos: LogoItem[] = [
  { name: 'ISO 14001', src: null, url: 'https://www.iso.org' },
  { name: 'GHG Protocol', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/ghg_protocol_logo_clear_1_2.png', url: 'https://ghgprotocol.org' },
  { name: 'GRI', src: null, url: 'https://www.globalreporting.org' },
  { name: 'CSRD / ESRS', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/esrsicon1.png', url: 'https://finance.ec.europa.eu' },
  { name: 'B Corp', src: null, url: 'https://www.bcorporation.net' },
  { name: 'GreenTech', src: null, url: 'https://greentechverte.fr' },
  { name: 'NR (INR)', src: null, url: 'https://institutnr.org' },
];

function LogoRow({ logos }: { logos: LogoItem[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
      {logos.map((logo) => (
        <a
          key={logo.name}
          href={logo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2"
        >
          <div className="flex h-12 items-center transition-all duration-300 group-hover:scale-110">
            {logo.src ? (
              <Image
                src={logo.src}
                alt={logo.name}
                width={140}
                height={48}
                className="h-10 w-auto object-contain sm:h-12"
                unoptimized
              />
            ) : (
              <span className="text-metal-400 group-hover:text-metal-800 rounded-lg border border-current/20 px-3 py-1.5 text-sm font-bold transition-colors">
                {logo.name}
              </span>
            )}
          </div>
          {logo.src && (
            <span className="text-metal-400 group-hover:text-metal-600 text-[11px] transition-colors">
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
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-16 text-center">
            <h2 className="text-metal-900 text-3xl font-bold tracking-tight">
              {t('landing.foundationsTitle')}
            </h2>
            <p className="text-metal-500 mx-auto mt-3 max-w-2xl text-lg">
              {t('landing.foundationsSub')}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="space-y-16">
          {/* Technologies */}
          <AnimateOnScroll animation="fade-up">
            <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-8">
              <div className="mb-6 flex items-center justify-center gap-2">
                <Code2 className="h-5 w-5 text-teal-600" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-teal-800">
                  {t('landing.foundationsTech')}
                </h3>
              </div>
              <LogoRow logos={techLogos} />
            </div>
          </AnimateOnScroll>

          {/* Sources + Referentiels side by side */}
          <div className="grid gap-8 md:grid-cols-2">
            <AnimateOnScroll animation="fade-up">
              <div className="h-full rounded-2xl border border-emerald-100 bg-emerald-50/30 p-8">
                <div className="mb-6 flex items-center justify-center gap-2">
                  <Database className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-emerald-800">
                    {t('landing.foundationsSources')}
                  </h3>
                </div>
                <LogoRow logos={sourceLogos} />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={100}>
              <div className="h-full rounded-2xl border border-green-100 bg-green-50/30 p-8">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-green-800">
                    {t('landing.foundationsFrameworks')}
                  </h3>
                </div>
                <p className="text-metal-400 mb-6 text-center text-xs">
                  {t('landing.foundationsFrameworksSub')}
                </p>
                <LogoRow logos={frameworkLogos} />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
