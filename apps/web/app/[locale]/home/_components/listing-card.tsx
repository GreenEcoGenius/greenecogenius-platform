'use client';

import Link from 'next/link';

import { MapPin, Package, Tag, Truck } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Trans } from '@kit/ui/trans';

import { DeleteListingButton } from './delete-listing-button';

interface ListingCardProps {
  listing: Record<string, unknown> & {
    id: string;
    title: string;
    description: string | null;
    quantity: number;
    unit: string;
    price_per_unit: number | null;
    transport_price?: number | null;
    currency: string;
    location_city: string | null;
    location_country: string | null;
    listing_type: string;
    status: string;
    created_at: string | null;
    material_categories:
      | (Record<string, unknown> & {
          name: string;
          name_fr: string;
          slug: string;
        })
      | null;
  };
  account: string;
  showDelete?: boolean;
}

const typeColors: Record<string, string> = {
  sell: 'bg-[#1b9e77]/10 text-[#1b9e77] dark:bg-[#1b9e77]/20 dark:text-[#2e8b6e]',
  buy: 'bg-[#457b9d]/10 text-[#457b9d] dark:bg-[#457b9d]/20 dark:text-[#5a9abf]',
  collect:
    'bg-[#e8943a]/10 text-[#c47a2a] dark:bg-[#e8943a]/20 dark:text-[#e8943a]',
};

function computeTotalPrice(listing: ListingCardProps['listing']) {
  if (listing.price_per_unit === null || listing.price_per_unit <= 0) {
    return null;
  }

  return listing.price_per_unit * listing.quantity;
}

export function ListingCard({
  listing,
  account,
  showDelete,
}: ListingCardProps) {
  const typeLabel =
    listing.listing_type === 'sell'
      ? 'marketplace.typeSell'
      : listing.listing_type === 'buy'
        ? 'marketplace.typeBuy'
        : 'marketplace.typeCollect';

  const detailHref = account
    ? `/home/${account}/marketplace/${listing.id}`
    : `/home/marketplace/${listing.id}`;

  const totalPrice = computeTotalPrice(listing);

  return (
    <Link
      href={detailHref}
      className="group bg-card border-border/40 relative rounded-lg border p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge className={typeColors[listing.listing_type] ?? 'bg-muted'}>
          <Trans i18nKey={typeLabel} />
        </Badge>

        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-xs">
            {listing.created_at
              ? new Date(listing.created_at).toLocaleDateString('fr-FR')
              : ''}
          </span>
          {showDelete && <DeleteListingButton listingId={listing.id} />}
        </div>
      </div>

      <h3 className="group-hover:text-primary mt-3 text-sm font-semibold">
        {listing.title}
      </h3>

      {listing.description && (
        <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
          {listing.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        {listing.material_categories && (
          <span className="text-muted-foreground flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {listing.material_categories.name_fr}
          </span>
        )}

        <span className="text-muted-foreground flex items-center gap-1">
          <Package className="h-3 w-3" />
          {listing.quantity} {listing.unit}
        </span>

        {listing.location_city && (
          <span className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {listing.location_city}
          </span>
        )}
      </div>

      {listing.price_per_unit !== null && listing.price_per_unit > 0 && (
        <div className="mt-3 space-y-0.5">
          <div className="text-primary text-sm font-semibold">
            {listing.price_per_unit} {listing.currency}/{listing.unit}
          </div>
          {totalPrice !== null && (
            <div className="text-muted-foreground text-xs">
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

      {listing.listing_type === 'collect' &&
        listing.transport_price != null &&
        listing.transport_price > 0 && (
          <div className="mt-1 flex items-center gap-1 text-xs text-[#e8943a]">
            <Truck className="h-3 w-3" />
            <Trans i18nKey="marketplace.transportLabel" />
            {' : '}
            {listing.transport_price} {listing.currency}
          </div>
        )}
    </Link>
  );
}
