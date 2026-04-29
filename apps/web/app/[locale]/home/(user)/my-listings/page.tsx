import Link from 'next/link';

import { Plus, Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Button } from '@kit/ui/button';
import { PageBody } from '@kit/ui/page';
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
        .select(
          '*, material_categories(*), listing_images(storage_path, position)',
        )
        .eq('account_id', userId)
        .order('created_at', { ascending: false })
    : { data: [] };

  return (
    <PageBody>
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
          {listings.map((listing) => {
            const images = ((listing as Record<string, unknown>).listing_images ??
              []) as Array<{ storage_path: string; position: number | null }>;
            const sortedImages = [...images].sort(
              (a, b) => (a.position ?? 0) - (b.position ?? 0),
            );
            const firstImage = sortedImages[0]?.storage_path ?? null;
            return (
              <ListingCard
                key={listing.id}
                listing={listing}
                account=""
                showDelete
                imageUrl={firstImage}
                imageCount={images.length}
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Search className="text-[#B8D4E3] h-12 w-12" />
          <p className="text-[#B8D4E3]">
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
