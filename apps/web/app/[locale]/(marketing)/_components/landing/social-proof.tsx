'use client';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

import { AnimateOnScroll } from '../animate-on-scroll';

const PARTNERS = [
  {
    name: 'Supabase',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/supabase.svg',
    size: 'h-28 sm:h-32 max-w-[280px]',
  },
  {
    name: 'Polygon',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Polygon_blockchain_logo.svg.png',
    size: 'h-24 sm:h-28 max-w-[260px]',
  },
  {
    name: 'Vercel',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/png-transparent-vercel-hd-logo.png',
    size: 'h-24 sm:h-28 max-w-[260px]',
  },
  {
    name: 'GHG Protocol',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/ghg_protocol_logo_clear_1_2.png',
    size: 'h-36 sm:h-40 max-w-[320px]',
  },
  {
    name: 'ESRS',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/esrsicon1.png',
    size: 'h-24 sm:h-28 max-w-[260px]',
  },
  {
    name: 'ADEME',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/logo-ademe-removebg-preview.png.webp',
    size: 'h-24 sm:h-28 max-w-[260px]',
  },
];

function LogoItem({
  name,
  logo,
  size,
}: {
  name: string;
  logo: string;
  size: string;
}) {
  return (
    <div className="flex shrink-0 items-center px-8 sm:px-12">
      <Image
        src={logo}
        alt={name}
        width={220}
        height={96}
        className={`w-auto object-contain transition-transform duration-300 hover:scale-110 ${size}`}
        unoptimized
      />
    </div>
  );
}

export function SocialProof({ className }: { className?: string }) {
  const t = useTranslations('marketing');
  const items = [...PARTNERS, ...PARTNERS];

  return (
    <section className={cn('py-16 sm:py-20', className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <p className="text-metal-500 mb-10 text-center text-sm font-medium tracking-wider uppercase">
            {t('landing.socialTitle')}
          </p>
        </AnimateOnScroll>

        <div className="relative overflow-hidden" aria-label="Trusted partners">
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r to-transparent sm:w-32" />
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l to-transparent sm:w-32" />

          <div className="animate-marquee flex w-max items-center gap-0 py-4">
            {items.map((p, i) => (
              <LogoItem
                key={`${p.name}-${i}`}
                name={p.name}
                logo={p.logo}
                size={p.size}
              />
            ))}
          </div>
        </div>

        <p className="text-metal-400 mt-8 text-center text-xs">
          {t('landing.socialDisclaimer')}
        </p>
      </div>
    </section>
  );
}
