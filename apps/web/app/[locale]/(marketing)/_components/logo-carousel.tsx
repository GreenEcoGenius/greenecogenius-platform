'use client';

import { cn } from '@kit/ui/utils';

const partners = [
  { name: 'EcoMetal', accent: '#065F46' },
  { name: 'VeoliaGreen', accent: '#0D9488' },
  { name: 'CircuLoop', accent: '#059669' },
  { name: 'ReNova', accent: '#065F46' },
  { name: 'GreenTrace', accent: '#0D9488' },
  { name: 'BioRecycle', accent: '#059669' },
  { name: 'TraceWaste', accent: '#065F46' },
  { name: 'NeoCircular', accent: '#0D9488' },
];

function LogoItem({ name, accent }: { name: string; accent: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-8">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="8" fill={accent} fillOpacity="0.12" />
        <path
          d="M16 8C11.58 8 8 11.58 8 16s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1 13l-4-4 1.41-1.41L15 18.17l4.59-4.58L21 15l-6 6z"
          fill={accent}
        />
      </svg>
      <span
        className="whitespace-nowrap text-lg font-semibold tracking-tight"
        style={{ color: accent }}
      >
        {name}
      </span>
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
          <LogoItem key={`${p.name}-${i}`} name={p.name} accent={p.accent} />
        ))}
      </div>
    </div>
  );
}
