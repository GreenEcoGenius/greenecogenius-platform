'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, LayoutGrid, Sparkles, Leaf, Settings } from 'lucide-react';

export function TabBar() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const tabs = [
    { href: '/home', label: t('home'), icon: Home },
    { href: '/more', label: t('more'), icon: LayoutGrid },
    { href: '/genius', label: t('genius'), icon: Sparkles, prominent: true },
    { href: '/carbon', label: t('carbon'), icon: Leaf },
    { href: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <nav
      className="z-50 bg-[#0A2F1F] border-t border-[#F5F5F0]/[0.06]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-12">
        {tabs.map(({ href, label, icon: Icon, prominent }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 h-full transition-colors"
            >
              {prominent ? (
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    active
                      ? 'bg-[#B8D4E3] text-[#0A2F1F] shadow-[0_2px_12px_rgba(184,212,227,0.35)]'
                      : 'bg-[#F5F5F0]/8 text-[#F5F5F0]/60'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </span>
              ) : (
                <Icon
                  className={`h-[22px] w-[22px] transition-colors ${
                    active
                      ? 'text-[#F5F5F0] stroke-[2.2]'
                      : 'text-[#F5F5F0]/45 stroke-[1.8]'
                  }`}
                />
              )}
              <span
                className={`text-[9px] font-medium tracking-wide transition-colors ${
                  active ? 'text-[#F5F5F0]' : 'text-[#F5F5F0]/45'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
