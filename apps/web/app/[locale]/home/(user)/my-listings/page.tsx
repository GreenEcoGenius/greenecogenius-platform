import Link from 'next/link';

import { Plus, Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { ListingCard } from '~/home/_components/listing-card';

export const generateMetadata = async () => {
  const t = await getTranslations('common');

  return { title: t('routes.myListings') };
};

async function MyListingsPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);

  const userId = user.data?.id;

  const { data: listings } = userId
    ? await client
        .from('listings')
        .select('*, material_categories(*)')
        .eq('account_id', userId)
        .order('created_at', { ascending: false })
    : { data: [] };

  return (
    <PageBody>
      <PageHeader description="">
        <Heading level={3}>
          <Trans i18nKey={'common.routes.myListings'} />
        </Heading>
      </PageHeader>

      <div className="flex items-center justify-end">
        <Button
          render={
            <Link href="/home/marketplace/new">
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
              account=""
              showDelete
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
              <Link href="/home/marketplace/new">
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
