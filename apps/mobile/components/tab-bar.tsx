'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, BarChart3, Users, Settings } from 'lucide-react';

export function TabBar() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const tabs = [
    { href: '/home', label: t('home'), icon: Home },
    { href: '/dashboard', label: t('dashboard'), icon: BarChart3 },
    { href: '/teams', label: t('teams'), icon: Users },
    { href: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#F5F5F0]/10 bg-[#0A2F1F]/90 backdrop-blur-xl">
      <div className="flex items-center justify-around pb-[env(safe-area-inset-bottom)] pt-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 transition-colors ${
                active ? 'text-[#F5F5F0]' : 'text-[#F5F5F0]/50'
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'opacity-100' : 'opacity-70'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
