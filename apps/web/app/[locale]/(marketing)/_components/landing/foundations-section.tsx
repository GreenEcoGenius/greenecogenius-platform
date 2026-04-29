'use client';

import Image from 'next/image';

import { Code2, Database, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LogoItem {
  name: string;
  src: string | null;
  url: string;
  /** Override the section-level logoClass for this specific logo. */
  sizeClass?: string;
}

const techLogos: LogoItem[] = [
  { name: 'Next.js', src: '/images/logos/nextjs.svg', url: 'https://nextjs.org' },
  { name: 'Supabase', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/supabase.svg', url: 'https://supabase.com', sizeClass: 'h-28 max-h-32' },
  { name: 'Vercel', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/b3ed1049-ffc5-4fc8-ab50-67af7fe74f0b.png', url: 'https://vercel.com', sizeClass: 'h-20 max-h-24' },
  { name: 'Polygon', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Polygon_blockchain_logo.svg.png', url: 'https://polygon.technology' },
  { name: 'Stripe', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Stripe_Logo,_revised_2016.svg.png', url: 'https://stripe.com', sizeClass: 'h-7 max-h-8' },
  { name: 'Anthropic', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Anthropic-Logo.wine.png', url: 'https://anthropic.com', sizeClass: 'h-20 max-h-24' },
  { name: 'GitHub', src: '/images/logos/github.svg', url: 'https://github.com' },
  { name: 'Cursor', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Cursor_logo.svg.png', url: 'https://cursor.com', sizeClass: 'h-7 max-h-8' },
  { name: 'Alchemy', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/a5c0742e-793f-4358-9ab5-38221f77375e.png', url: 'https://www.alchemy.com', sizeClass: 'h-20 max-h-24' },
  { name: 'Docusign', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Home%20Page/a31b8a42-d341-40c9-b0d8-a29ffbc45a41.png', url: 'https://www.docusign.com' },
];

const sourceLogos: LogoItem[] = [
  { name: 'ADEME', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/logo-ademe-removebg-preview.png.webp', url: 'https://www.ademe.fr' },
  { name: 'SINOE', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/77fd6085-0309-4069-8da9-af4890068fd3.png', url: 'https://www.sinoe.org' },
  { name: 'Eurostat', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Eurostat_Newlogo.png', url: 'https://ec.europa.eu/eurostat' },
  { name: 'EPA', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/EPA_logo.svg', url: 'https://www.epa.gov', sizeClass: 'h-8 max-h-10' },
  { name: 'FEDEREC', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Logo_FEDEREC.png', url: 'https://federec.com' },
];

const frameworkLogos: LogoItem[] = [
  { name: 'ISO 14001', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/29ba5962-b575-4db3-92d0-c092399d843b.png', url: 'https://www.iso.org' },
  { name: 'GHG Protocol', src: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/ghg_protocol_logo_clear_1_2.png', url: 'https://ghgprotocol.org', sizeClass: 'h-28 max-h-32' },
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
      className="group flex h-36 flex-col items-center justify-center rounded-xl border border-[#1A5C3E] bg-[#0D3A26] px-5 py-4 shadow-lg shadow-black/20 transition-all duration-200 hover:border-[#1A5C3E] hover:shadow-xl shadow-black/25"
    >
      {logo.src ? (
        <Image
          src={logo.src}
          alt={logo.name}
          width={300}
          height={120}
          className={`w-auto max-w-[90%] object-contain brightness-0 invert opacity-70 transition-all duration-200 group-hover:scale-105 group-hover:opacity-100 ${logo.sizeClass ?? logoClass}`}
          unoptimized
        />
      ) : (
        <span className="text-[#7DC4A0] text-sm font-bold">{logo.name}</span>
      )}
      <span className="text-[#5A9E7D] group-hover:text-[#B8D4E3] mt-2 text-[11px] font-medium transition-colors">
        {logo.name}
      </span>
    </a>
  );
}

function LogoMarquee({
  logos,
  logoClass,
  speed = 40,
}: {
  logos: LogoItem[];
  logoClass: string;
  speed?: number;
}) {
  const loop = [...logos, ...logos];
  return (
    <div
      className="group relative overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className="flex w-max gap-4 [animation:marquee_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ ['--marquee-duration' as string]: `${speed}s` }}
      >
        {loop.map((logo, idx) => (
          <div
            key={`${logo.name}-${idx}`}
            className="w-56 shrink-0 sm:w-64"
          >
            <LogoCard logo={logo} logoClass={logoClass} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechCarousel() {
  const t = useTranslations('marketing');

  return (
    <section className="py-10 sm:py-14">
      <div className="mb-8 flex items-center justify-center gap-2 px-4">
        <Code2 className="h-5 w-5 text-[#00A86B]" strokeWidth={1.5} />
        <p className="text-[#7DC4A0] text-sm font-medium uppercase tracking-wider">
          {t('landing.foundationsTech')}
        </p>
      </div>
      <div className="mx-auto max-w-7xl">
        <LogoMarquee logos={techLogos} logoClass="h-16 max-h-20" speed={50} />
      </div>
    </section>
  );
}

export function SourcesCarousel() {
  const t = useTranslations('marketing');

  return (
    <section className="py-10 sm:py-14">
      <div className="mb-8 flex items-center justify-center gap-2 px-4">
        <Database className="h-5 w-5 text-[#00A86B]" strokeWidth={1.5} />
        <p className="text-[#7DC4A0] text-sm font-medium uppercase tracking-wider">
          {t('landing.foundationsSources')}
        </p>
      </div>
      <div className="mx-auto max-w-7xl">
        <LogoMarquee logos={sourceLogos} logoClass="h-14 max-h-18" speed={35} />
      </div>
    </section>
  );
}

export function FrameworksCarousel() {
  const t = useTranslations('marketing');

  return (
    <section className="py-10 sm:py-14">
      <div className="mb-2 flex items-center justify-center gap-2 px-4">
        <ShieldCheck className="h-5 w-5 text-verdure-600" strokeWidth={1.5} />
        <p className="text-[#7DC4A0] text-sm font-medium uppercase tracking-wider">
          {t('landing.foundationsFrameworks')}
        </p>
      </div>
      <p className="text-[#5A9E7D] mb-6 px-4 text-center text-xs">
        {t('landing.foundationsFrameworksSub')}
      </p>
      <div className="mx-auto max-w-7xl">
        <LogoMarquee logos={frameworkLogos} logoClass="h-14 max-h-18" speed={45} />
      </div>
    </section>
  );
}
