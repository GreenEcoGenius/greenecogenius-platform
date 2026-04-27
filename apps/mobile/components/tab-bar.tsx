'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, BarChart3, Sparkles, Leaf, Settings } from 'lucide-react';

export function TabBar() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const tabs = [
    { href: '/home', label: t('home'), icon: Home },
    { href: '/dashboard', label: t('dashboard'), icon: BarChart3 },
    { href: '/genius', label: t('genius'), icon: Sparkles, prominent: true },
    { href: '/carbon', label: t('carbon'), icon: Leaf },
    { href: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#F5F5F0]/10 bg-[#0A2F1F]/90 backdrop-blur-xl">
      <div className="flex items-center justify-around pb-[env(safe-area-inset-bottom)] pt-2">
        {tabs.map(({ href, label, icon: Icon, prominent }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 transition-colors ${
                active ? 'text-[#F5F5F0]' : 'text-[#F5F5F0]/50'
              }`}
            >
              {prominent ? (
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    active
                      ? 'bg-[#B8D4E3] text-[#0A2F1F] shadow-[0_4px_16px_rgba(184,212,227,0.4)]'
                      : 'bg-[#F5F5F0]/10 text-[#F5F5F0]/70'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
              ) : (
                <Icon
                  className={`h-6 w-6 ${active ? 'stroke-[2.5]' : 'stroke-[2]'}`}
                />
              )}
              <span
                className={`text-[10px] font-medium tracking-wide ${active ? 'opacity-100' : 'opacity-70'}`}
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
