'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function CarbonTabs() {
  const pathname = usePathname();
  const t = useTranslations('carbon');

  const tabs = [
    { href: '/carbon/records', label: t('tabComptoir') },
    { href: '/carbon/esg', label: t('tabBilan') },
  ];

  return (
    <div className="mb-3 flex gap-1 rounded-full bg-[#F5F5F0]/8 p-1">
      {tabs.map(({ href, label }) => {
        const active = pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 rounded-full px-4 py-1.5 text-center text-[13px] font-medium transition-all ${
              active
                ? 'bg-[#B8D4E3] text-[#0A2F1F] shadow-sm'
                : 'text-[#F5F5F0]/70 active:bg-[#F5F5F0]/5'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
