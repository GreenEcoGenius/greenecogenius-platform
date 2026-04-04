import Image from 'next/image';

import { Code2, Database, ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from '../animate-on-scroll';

interface LogoItem {
  name: string;
  src: string | null;
  url: string;
  size?: string;
  removeBg?: boolean;
}

const techLogos: LogoItem[] = [
  { name: 'Next.js', src: '/images/logos/nextjs.svg', url: 'https://nextjs.org' },
  { name: 'Supabase', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/supabase.svg', url: 'https://supabase.com', size: 'h-20 sm:h-24' },
  { name: 'Vercel', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/b3ed1049-ffc5-4fc8-ab50-67af7fe74f0b.png', url: 'https://vercel.com' },
  { name: 'Polygon', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Polygon_blockchain_logo.svg.png', url: 'https://polygon.technology', size: 'h-12 sm:h-14' },
  { name: 'Stripe', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Stripe_Logo,_revised_2016.svg.png', url: 'https://stripe.com', size: 'h-10 sm:h-12' },
  { name: 'Anthropic', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Anthropic-Logo.wine.png', url: 'https://anthropic.com' },
  { name: 'GitHub', src: '/images/logos/github.svg', url: 'https://github.com' },
  { name: 'Cursor', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Cursor_logo.svg.png', url: 'https://cursor.com', size: 'h-8 sm:h-10' },
  { name: 'Alchemy', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/a5c0742e-793f-4358-9ab5-38221f77375e.png', url: 'https://www.alchemy.com' },
];

const sourceLogos: LogoItem[] = [
  { name: 'ADEME', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/logo-ademe-removebg-preview.png.webp', url: 'https://www.ademe.fr' },
  { name: 'SINOE', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/77fd6085-0309-4069-8da9-af4890068fd3.png', url: 'https://www.sinoe.org', size: 'h-10 sm:h-12' },
  { name: 'Eurostat', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Eurostat_Newlogo.png', url: 'https://ec.europa.eu/eurostat', size: 'h-8 sm:h-10' },
  { name: 'EPA', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/EPA_logo.svg', url: 'https://www.epa.gov', size: 'h-8 sm:h-10' },
  { name: 'FEDEREC', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Logo_FEDEREC.png', url: 'https://federec.com' },
];

const frameworkLogos: LogoItem[] = [
  { name: 'ISO 14001', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/29ba5962-b575-4db3-92d0-c092399d843b.png', url: 'https://www.iso.org' },
  { name: 'GHG Protocol', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/ghg_protocol_logo_clear_1_2.png', url: 'https://ghgprotocol.org', size: 'h-20 sm:h-24' },
  { name: 'GRI', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/17dc64b5-7ac4-46cb-93f2-a074804f05ea.png', url: 'https://www.globalreporting.org' },
  { name: 'CSRD / ESRS', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/esrsicon1.png', url: 'https://finance.ec.europa.eu' },
  { name: 'B Corp', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Certified_B_Corporation_B_Corp_Logo_2022_Black_RGB.svg.png', url: 'https://www.bcorporation.net' },
  { name: 'GreenTech', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/8eddffa9-ea2d-4c20-bbb1-20bb0e0a20e5.png', url: 'https://greentechinnovation.fr/' },
  { name: 'NR (INR)', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/a22d5f61-e78e-459b-8839-efe5f1f833ae.png', url: 'https://institutnr.org' },
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
          <div className="flex h-20 items-center transition-all duration-300 group-hover:scale-110">
            {logo.src ? (
              <Image
                src={logo.src}
                alt={logo.name}
                width={200}
                height={80}
                className={`w-auto object-contain ${logo.size ?? 'h-16 sm:h-20'} ${logo.removeBg ? 'mix-blend-multiply' : ''}`}
                unoptimized
              />
            ) : (
              <span className="text-metal-400 group-hover:text-metal-800 rounded-lg border border-current/20 px-4 py-2 text-base font-bold transition-colors">
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
