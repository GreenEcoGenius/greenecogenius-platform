'use client';

import Link from 'next/link';

import { MapPin, Package, Tag } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Trans } from '@kit/ui/trans';

interface ListingCardProps {
  listing: Record<string, unknown> & {
    id: string;
    title: string;
    description: string | null;
    quantity: number;
    unit: string;
    price_per_unit: number | null;
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
}

const typeColors: Record<string, string> = {
  sell: 'bg-[#1B9E77]/10 text-[#1B9E77] dark:bg-[#1B9E77]/20 dark:text-[#3BB54A]',
  buy: 'bg-[#457B9D]/10 text-[#457B9D] dark:bg-[#457B9D]/20 dark:text-[#457B9D]',
  collect:
    'bg-[#F4A261]/10 text-[#F4A261] dark:bg-[#F4A261]/20 dark:text-[#F4A261]',
};

export function ListingCard({ listing, account }: ListingCardProps) {
  const typeLabel =
    listing.listing_type === 'sell'
      ? 'marketplace.typeSell'
      : listing.listing_type === 'buy'
        ? 'marketplace.typeBuy'
        : 'marketplace.typeCollect';

  const detailHref = account
    ? `/home/${account}/marketplace/${listing.id}`
    : `/home/marketplace/${listing.id}`;

  return (
    <Link
      href={detailHref}
      className="group bg-card rounded-lg border p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <Badge className={typeColors[listing.listing_type] ?? 'bg-muted'}>
          <Trans i18nKey={typeLabel} />
        </Badge>

        <span className="text-muted-foreground text-xs">
          {listing.created_at
            ? new Date(listing.created_at).toLocaleDateString('fr-FR')
            : ''}
        </span>
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
        <div className="text-primary mt-3 text-sm font-semibold">
          {listing.price_per_unit} {listing.currency}/{listing.unit}
        </div>
      )}
    </Link>
  );
}
