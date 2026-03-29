import { use } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft, MapPin, Package, Tag } from 'lucide-react';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

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
      : listing.listing_type === 'buy'
        ? 'marketplace.typeBuy'
        : 'marketplace.typeCollect';

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

        <div className="mt-8">
          <Button className="w-full">
            <Trans i18nKey="marketplace.contactSeller" />
          </Button>
        </div>
      </div>
    </PageBody>
  );
}

export default ListingDetailPage;
