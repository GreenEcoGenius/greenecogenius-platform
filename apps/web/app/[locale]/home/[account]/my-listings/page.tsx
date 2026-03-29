import { use } from 'react';

import Link from 'next/link';

import { Plus, Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { TeamAccountLayoutPageHeader } from '../_components/team-account-layout-page-header';
import { ListingCard } from '../marketplace/_components/listing-card';

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

  return (
    <PageBody>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'common.routes.myListings'} />}
        description={<AppBreadcrumbs />}
      />

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {listings?.length ?? 0} <Trans i18nKey="marketplace.totalListings" />
        </p>

        <Button
          render={
            <Link href={`/home/${account}/marketplace/new`}>
              <Plus className="mr-2 h-4 w-4" />
              <Trans i18nKey="marketplace.createListing" />
            </Link>
          }
          nativeButton={false}
        />
      </div>

      {listings && listings.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              account={account}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Search className="text-muted-foreground h-12 w-12" />
          <p className="text-muted-foreground">
            <Trans i18nKey="marketplace.noOwnListings" />
          </p>
          <Button
            render={
              <Link href={`/home/${account}/marketplace/new`}>
                <Plus className="mr-2 h-4 w-4" />
                <Trans i18nKey="marketplace.createFirstListing" />
              </Link>
            }
            nativeButton={false}
          />
        </div>
      )}
    </PageBody>
  );
}

export default MyListingsPage;
