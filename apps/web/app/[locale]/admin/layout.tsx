import { cookies } from 'next/headers';

import { getTranslations } from 'next-intl/server';

import { EnviroAdminShell } from '~/components/enviro/admin';
import {
  ENVIRO_SIDEBAR_COOKIE_NAME,
  EnviroSidebarProvider,
} from '~/components/enviro/dashboard';

import { EnviroAdminSidebar } from './_components/enviro-admin-sidebar';

export const metadata = {
  title: `Super Admin`,
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout(props: React.PropsWithChildren) {
  const [collapsed, t] = await Promise.all([
    readSidebarCollapsed(),
    getTranslations('admin'),
  ]);

  return (
    <EnviroSidebarProvider initialCollapsed={collapsed}>
      <EnviroAdminShell
        sidebar={<EnviroAdminSidebar />}
        mobileMenuLabel={t('menuOpenLabel')}
        topbarLabel={t('tag')}
      >
        {props.children}
      </EnviroAdminShell>
    </EnviroSidebarProvider>
  );
}

/**
 * Read the same cookie used by the user dashboard so the collapsed state
 * is shared when an operator switches between /home and /admin in the
 * same session. Defaults to OPEN (collapsed = false) on first visit.
 */
async function readSidebarCollapsed(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ENVIRO_SIDEBAR_COOKIE_NAME);
  return cookie?.value === '1';
}
