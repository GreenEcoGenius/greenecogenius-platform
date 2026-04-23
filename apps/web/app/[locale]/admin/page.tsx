import { getTranslations } from 'next-intl/server';

import { AdminDashboard } from '@kit/admin/components/admin-dashboard';
import { AdminGuard } from '@kit/admin/components/admin-guard';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';

async function AdminPage() {
  const t = await getTranslations('admin');

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={t('tag')}
        title={t('dashboardTitle')}
        subtitle={t('dashboardSubtitle')}
      />

      <AdminDashboard />
    </div>
  );
}

export default AdminGuard(AdminPage);
