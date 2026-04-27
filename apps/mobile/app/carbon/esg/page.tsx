'use client';

import { useTranslations } from 'next-intl';

export default function CarbonEsgPage() {
  const t = useTranslations('carbon');
  return (
    <div className="py-8 text-center text-sm text-[#F5F5F0]/60">
      {t('comingSoonEsg')}
    </div>
  );
}
