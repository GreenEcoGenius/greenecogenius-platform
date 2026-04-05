'use client';

import Image from 'next/image';

import { cn } from '@kit/ui/utils';

const partners = [
  {
    name: 'Supabase',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/supabase.svg',
  },
  {
    name: 'Polygon',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Polygon_blockchain_logo.svg.png',
  },
  {
    name: 'Vercel',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/png-transparent-vercel-hd-logo.png',
  },
  {
    name: 'GHG Protocol',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/ghg_protocol_logo_clear_1_2.png',
  },
  {
    name: 'ESRS',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/esrsicon1.png',
  },
  {
    name: 'ADEME',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/logo-ademe-removebg-preview.png.webp',
  },
  {
    name: 'Docusign',
    logo: 'https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Home%20Page/a31b8a42-d341-40c9-b0d8-a29ffbc45a41.png',
  },
];

function LogoItem({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-10">
      <Image
        src={logo}
        alt={name}
        width={120}
        height={48}
        className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-110 sm:h-16"
        unoptimized
      />
    </div>
  );
}

export function LogoCarousel({ className }: { className?: string }) {
  const items = [...partners, ...partners];

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      aria-label="Trusted partners"
    >
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent" />
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent" />

      <div className="animate-marquee flex w-max items-center gap-0 py-4">
        {items.map((p, i) => (
          <LogoItem key={`${p.name}-${i}`} name={p.name} logo={p.logo} />
        ))}
      </div>
    </div>
  );
}
