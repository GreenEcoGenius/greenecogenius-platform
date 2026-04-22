import { ServerDataLoader } from '@makerkit/data-loader-supabase-nextjs';
import { getTranslations } from 'next-intl/server';

import { AdminAccountsTable } from '@kit/admin/components/admin-accounts-table';
import { AdminCreateUserDialog } from '@kit/admin/components/admin-create-user-dialog';
import { AdminGuard } from '@kit/admin/components/admin-guard';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';

interface SearchParams {
  page?: string;
  account_type?: 'all' | 'team' | 'personal';
  query?: string;
}

interface AdminAccountsPageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata = {
  title: `Accounts`,
};

async function AccountsPage(props: AdminAccountsPageProps) {
  const client = getSupabaseServerClient();
  const t = await getTranslations('admin');

  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={t('tag')}
        title={t('accountsTitle')}
        subtitle={t('accountsSubtitle')}
        actions={
          <AdminCreateUserDialog>
            <EnviroButton
              variant="primary"
              size="sm"
              magnetic
              data-test="admin-create-user-button"
            >
              {t('createUser')}
            </EnviroButton>
          </AdminCreateUserDialog>
        }
      />

      <ServerDataLoader
        table={'accounts'}
        client={client}
        page={page}
        where={(queryBuilder) => {
          const { account_type: type, query } = searchParams;

          if (type && type !== 'all') {
            queryBuilder.eq('is_personal_account', type === 'personal');
          }

          if (query) {
            queryBuilder.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
          }

          return queryBuilder;
        }}
      >
        {({ data, page, pageSize, pageCount }) => {
          return (
            <AdminAccountsTable
              page={page}
              pageSize={pageSize}
              pageCount={pageCount}
              data={data}
              filters={{
                type: searchParams.account_type ?? 'all',
                query: searchParams.query ?? '',
              }}
            />
          );
        }}
      </ServerDataLoader>
    </div>
  );
}

export default AdminGuard(AccountsPage);
