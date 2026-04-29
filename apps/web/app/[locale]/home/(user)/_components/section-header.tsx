import { getTranslations } from 'next-intl/server';

interface SectionHeaderProps {
  titleKey: string;
  descKey: string;
  ns?: string;
}

export async function SectionHeader({
  titleKey,
  descKey,
  ns = 'dashboard',
}: SectionHeaderProps) {
  const t = await getTranslations(ns);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F5F5F0]">{t(titleKey)}</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-[#F5F5F0]/50">{t(descKey)}</p>
    </div>
  );
}
