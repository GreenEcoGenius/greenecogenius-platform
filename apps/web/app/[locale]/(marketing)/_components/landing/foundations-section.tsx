'use client';

import Image from 'next/image';

import { Code2, Database, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LogoItem {
  name: string;
  src: string | null;
  url: string;
}

const techLogos: LogoItem[] = [
  { name: 'Next.js', src: '/images/logos/nextjs.svg', url: 'https://nextjs.org' },
  { name: 'Supabase', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/supabase.svg', url: 'https://supabase.com' },
  { name: 'Vercel', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/b3ed1049-ffc5-4fc8-ab50-67af7fe74f0b.png', url: 'https://vercel.com' },
  { name: 'Polygon', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Polygon_blockchain_logo.svg.png', url: 'https://polygon.technology' },
  { name: 'Stripe', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Stripe_Logo,_revised_2016.svg.png', url: 'https://stripe.com' },
  { name: 'Anthropic', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Anthropic-Logo.wine.png', url: 'https://anthropic.com' },
  { name: 'GitHub', src: '/images/logos/github.svg', url: 'https://github.com' },
  { name: 'Cursor', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Cursor_logo.svg.png', url: 'https://cursor.com' },
  { name: 'Alchemy', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/a5c0742e-793f-4358-9ab5-38221f77375e.png', url: 'https://www.alchemy.com' },
  { name: 'Docusign', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Home%20Page/a31b8a42-d341-40c9-b0d8-a29ffbc45a41.png', url: 'https://www.docusign.com' },
];

const sourceLogos: LogoItem[] = [
  { name: 'ADEME', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/logo-ademe-removebg-preview.png.webp', url: 'https://www.ademe.fr' },
  { name: 'SINOE', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/77fd6085-0309-4069-8da9-af4890068fd3.png', url: 'https://www.sinoe.org' },
  { name: 'Eurostat', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Eurostat_Newlogo.png', url: 'https://ec.europa.eu/eurostat' },
  { name: 'EPA', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/EPA_logo.svg', url: 'https://www.epa.gov' },
  { name: 'FEDEREC', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Logo_FEDEREC.png', url: 'https://federec.com' },
];

const frameworkLogos: LogoItem[] = [
  { name: 'ISO 14001', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/29ba5962-b575-4db3-92d0-c092399d843b.png', url: 'https://www.iso.org' },
  { name: 'GHG Protocol', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/ghg_protocol_logo_clear_1_2.png', url: 'https://ghgprotocol.org' },
  { name: 'GRI', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/8eddffa9-ea2d-4c20-bbb1-20bb0e0a20e5.png', url: 'https://www.globalreporting.org' },
  { name: 'CSRD / ESRS', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/esrsicon1.png', url: 'https://finance.ec.europa.eu' },
  { name: 'B Corp', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Certified_B_Corporation_B_Corp_Logo_2022_Black_RGB.svg.png', url: 'https://www.bcorporation.net' },
  { name: 'GreenTech Innovation', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/17dc64b5-7ac4-46cb-93f2-a074804f05ea.png', url: 'https://greentechinnovation.fr/' },
  { name: 'NR (INR)', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/a22d5f61-e78e-459b-8839-efe5f1f833ae.png', url: 'https://institutnr.org' },
];

/**
 * Uniform logo card — all logos share the same visual height within a section.
 * `logoClass` controls the fixed height so every card looks even.
 */
function LogoCard({
  logo,
  logoClass,
}: {
  logo: LogoItem;
  logoClass: string;
}) {
  return (
    <a
      href={logo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex aspect-square flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md"
    >
      {logo.src ? (
        <Image
          src={logo.src}
          alt={logo.name}
          width={200}
          height={80}
          className={`w-auto max-w-[80%] object-contain transition-transform duration-200 group-hover:scale-105 ${logoClass}`}
          unoptimized
        />
      ) : (
        <span className="text-metal-500 text-sm font-bold">{logo.name}</span>
      )}
      <span className="text-metal-400 group-hover:text-metal-600 mt-2 text-[11px] font-medium transition-colors">
        {logo.name}
      </span>
    </a>
  );
}

function LogoGrid({
  logos,
  logoClass,
}: {
  logos: LogoItem[];
  logoClass: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {logos.map((logo) => (
        <LogoCard key={logo.name} logo={logo} logoClass={logoClass} />
      ))}
    </div>
  );
}

export function TechCarousel() {
  const t = useTranslations('marketing');

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Code2 className="h-5 w-5 text-teal-600" strokeWidth={1.5} />
          <p className="text-metal-500 text-sm font-medium uppercase tracking-wider">
            {t('landing.foundationsTech')}
          </p>
        </div>
        <LogoGrid logos={techLogos} logoClass="h-8 min-h-8 max-h-10" />
      </div>
    </section>
  );
}

export function SourcesCarousel() {
  const t = useTranslations('marketing');

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Database className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
          <p className="text-metal-500 text-sm font-medium uppercase tracking-wider">
            {t('landing.foundationsSources')}
          </p>
        </div>
        <LogoGrid logos={sourceLogos} logoClass="h-8 min-h-8 max-h-10" />
      </div>
    </section>
  );
}

export function FrameworksCarousel() {
  const t = useTranslations('marketing');

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-center justify-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-600" strokeWidth={1.5} />
          <p className="text-metal-500 text-sm font-medium uppercase tracking-wider">
            {t('landing.foundationsFrameworks')}
          </p>
        </div>
        <p className="text-metal-400 mb-6 text-center text-xs">
          {t('landing.foundationsFrameworksSub')}
        </p>
        <LogoGrid logos={frameworkLogos} logoClass="h-10 min-h-10 max-h-12" />
      </div>
    </section>
  );
}
