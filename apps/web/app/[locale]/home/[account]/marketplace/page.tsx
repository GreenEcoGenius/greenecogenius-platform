import { use } from 'react';

import Link from 'next/link';

import { Plus, Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { Button } from '@kit/ui/button';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { ListingCard } from '~/home/_components/listing-card';

import { TeamAccountLayoutPageHeader } from '../_components/team-account-layout-page-header';

interface MarketplacePageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const t = await getTranslations('common');

  return { title: t('routes.marketplace') };
};

async function MarketplacePage({ params }: MarketplacePageProps) {
  const account = use(params).account;
  const client = getSupabaseServerClient();

  const { data: listings } = await client
    .from('listings')
    .select('*, material_categories(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <PageBody>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'common.routes.marketplace'} />}
        description={<AppBreadcrumbs />}
      />

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {listings?.length ?? 0}{' '}
          <Trans i18nKey="marketplace.listingsAvailable" />
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
            <ListingCard key={listing.id} listing={listing} account={account} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Search className="text-muted-foreground h-12 w-12" />
          <p className="text-muted-foreground">
            <Trans i18nKey="marketplace.noListings" />
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

export default MarketplacePage;
