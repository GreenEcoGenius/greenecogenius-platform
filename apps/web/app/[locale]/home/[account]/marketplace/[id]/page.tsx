import { use } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft, MapPin, Package, Tag, Truck } from 'lucide-react';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { BuyListingButton } from '~/home/_components/buy-listing-button';

interface ListingDetailPageProps {
  params: Promise<{ account: string; id: string }>;
}

export async function generateMetadata({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const client = getSupabaseServerClient();

  const { data } = await client
    .from('listings')
    .select('title')
    .eq('id', id)
    .single();

  return { title: data?.title ?? 'Listing' };
}

async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { account, id } = use(params);
  const client = getSupabaseServerClient();

  const { data: user } = await requireUser(client);
  const currentUserId = user?.id;

  const { data: listing } = await client
    .from('listings')
    .select('*, material_categories(*)')
    .eq('id', id)
    .single();

  if (!listing) {
    notFound();
  }

  const typeLabel =
    listing.listing_type === 'sell'
      ? 'marketplace.typeSell'
      : listing.listing_type === 'collect'
        ? 'marketplace.typeCollect'
        : 'marketplace.typeSell';

  const totalPrice =
    listing.price_per_unit !== null && listing.price_per_unit > 0
      ? listing.price_per_unit * listing.quantity
      : null;

  const transportPrice = (listing as Record<string, unknown>).transport_price as
    | number
    | null;

  const isOwner = currentUserId === listing.account_id;
  const hasPrice =
    (listing.price_per_unit !== null && listing.price_per_unit > 0) ||
    (transportPrice !== null && transportPrice > 0);

  return (
    <PageBody>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link href={`/home/${account}/marketplace`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <Trans i18nKey="marketplace.backToMarketplace" />
            </Link>
          }
          nativeButton={false}
        />
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between">
          <div>
            <Badge>
              <Trans i18nKey={typeLabel} />
            </Badge>

            <h1 className="mt-3 text-2xl font-bold">{listing.title}</h1>
          </div>

          {listing.price_per_unit !== null && listing.price_per_unit > 0 && (
            <div className="text-right">
              <div className="text-primary text-2xl font-bold">
                {listing.price_per_unit} {listing.currency}
              </div>
              <div className="text-muted-foreground text-sm">
                / {listing.unit}
              </div>
              {totalPrice !== null && (
                <div className="text-muted-foreground mt-1 text-xs">
                  <Trans i18nKey="marketplace.totalLabel" />
                  {' : '}
                  {totalPrice.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  {listing.currency}
                </div>
              )}
            </div>
          )}
        </div>

        {listing.description && (
          <div className="mt-6">
            <h2 className="text-muted-foreground text-sm font-semibold uppercase">
              <Trans i18nKey="marketplace.descriptionLabel" />
            </h2>
            <p className="mt-2 whitespace-pre-wrap">{listing.description}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-4">
          <div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Tag className="h-3 w-3" />
              <Trans i18nKey="marketplace.category" />
            </div>
            <div className="mt-1 text-sm font-medium">
              {listing.material_categories?.name_fr}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Package className="h-3 w-3" />
              <Trans i18nKey="marketplace.quantity" />
            </div>
            <div className="mt-1 text-sm font-medium">
              {listing.quantity} {listing.unit}
            </div>
          </div>

          {listing.location_city && (
            <div>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3" />
                <Trans i18nKey="marketplace.location" />
              </div>
              <div className="mt-1 text-sm font-medium">
                {listing.location_city}, {listing.location_country}
              </div>
            </div>
          )}

          <div>
            <div className="text-muted-foreground text-xs">
              <Trans i18nKey="marketplace.publishedOn" />
            </div>
            <div className="mt-1 text-sm font-medium">
              {listing.created_at
                ? new Date(listing.created_at).toLocaleDateString('fr-FR')
                : ''}
            </div>
          </div>
        </div>

        {listing.listing_type === 'collect' &&
          transportPrice !== null &&
          transportPrice > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#e8943a]/30 bg-[#e8943a]/5 p-3">
              <Truck className="h-4 w-4 text-[#e8943a]" />
              <span className="text-sm font-medium">
                <Trans i18nKey="marketplace.transportLabel" />
                {' : '}
                {transportPrice} {listing.currency}
              </span>
            </div>
          )}

        <div className="mt-8">
          <BuyListingButton
            listingId={listing.id}
            isOwner={isOwner}
            hasPrice={hasPrice}
          />
        </div>
      </div>
    </PageBody>
  );
}

export default ListingDetailPage;
