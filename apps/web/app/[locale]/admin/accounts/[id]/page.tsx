import { cache } from 'react';

import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AdminAccountPage } from '@kit/admin/components/admin-account-page';
import { AdminGuard } from '@kit/admin/components/admin-guard';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async (props: Params) => {
  const params = await props.params;
  const account = await loadAccount(params.id);

  return {
    title: `Admin | ${account.name}`,
  };
};

async function AccountPage(props: Params) {
  const params = await props.params;
  const account = await loadAccount(params.id);
  const t = await getTranslations('admin');

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={t('navAccounts')}
        title={t('accountTitle', { name: account.name })}
        actions={
          <EnviroButton
            variant="secondary"
            size="sm"
            render={(buttonProps) => (
              <Link {...buttonProps} href="/admin/accounts">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                {t('backToAccounts')}
              </Link>
            )}
          />
        }
      />

      <AdminAccountPage account={account} />
    </div>
  );
}

export default AdminGuard(AccountPage);

const loadAccount = cache(accountLoader);

async function accountLoader(id: string) {
  const client = getSupabaseServerClient();

  const { data, error } = await client
    .from('accounts')
    .select('*, memberships: accounts_memberships (*)')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
