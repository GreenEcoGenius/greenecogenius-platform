import { Database } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function DataSourceBadge() {
  const t = await getTranslations('marketing');

  return (
    <div className="text-[#7DC4A0] inline-flex items-center gap-1.5 text-xs">
      <Database className="h-3.5 w-3.5" />
      <span>{t('explorer.dataSource')}</span>
    </div>
  );
}
