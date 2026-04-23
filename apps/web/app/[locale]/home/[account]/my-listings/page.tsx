import { use } from 'react';

import Link from 'next/link';

import { Plus, Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  EnviroDashboardSectionHeader,
  EnviroEmptyState,
} from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';

import { ListingCard } from '~/home/_components/listing-card';

interface MyListingsPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const t = await getTranslations('common');

  return { title: t('routes.myListings') };
};

async function MyListingsPage({ params }: MyListingsPageProps) {
  const account = use(params).account;
  const client = getSupabaseServerClient();
  const t = await getTranslations('marketplace');
  const tCommon = await getTranslations('common');

  const { data: accountData } = await client
    .from('accounts')
    .select('id')
    .eq('slug', account)
    .single();

  const { data: listings } = accountData
    ? await client
        .from('listings')
        .select('*, material_categories(*)')
        .eq('account_id', accountData.id)
        .order('created_at', { ascending: false })
    : { data: [] };

  const rows = listings ?? [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.application')}
        title={tCommon('routes.myListings')}
        subtitle={`${rows.length} ${t('totalListings')}`}
        actions={
          <EnviroButton
            variant="primary"
            size="sm"
            render={(buttonProps) => (
              <Link
                {...buttonProps}
                href={`/home/${account}/marketplace/new`}
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
                {t('createListing')}
              </Link>
            )}
          />
        }
      />

      {rows.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              account={account}
              showDelete
            />
          ))}
        </div>
      ) : (
        <EnviroEmptyState
          icon={<Search aria-hidden="true" className="h-10 w-10" />}
          title={t('noOwnListings')}
          actions={
            <EnviroButton
              variant="primary"
              size="sm"
              render={(buttonProps) => (
                <Link
                  {...buttonProps}
                  href={`/home/${account}/marketplace/new`}
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  {t('createFirstListing')}
                </Link>
              )}
            />
          }
        />
      )}
    </div>
  );
}

export default MyListingsPage;
