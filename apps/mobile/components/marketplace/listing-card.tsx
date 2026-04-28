'use client';

import { memo } from 'react';
import Link from 'next/link';
import { MapPin, Package, Truck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import type { ListingWithCategory } from '~/lib/queries/listings';
import { ListingImage } from './listing-image';

interface ListingCardProps {
  listing: ListingWithCategory;
}

export const ListingCard = memo(function ListingCard({ listing }: ListingCardProps) {
  const t = useTranslations('marketplace');
  const locale = useLocale();

  const sortedImages = [...(listing.listing_images ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );
  const firstImagePath = sortedImages[0]?.storage_path ?? null;
  const extraImages = sortedImages.length > 1 ? sortedImages.length - 1 : 0;

  const categoryLabel =
    locale === 'fr'
      ? listing.material_categories?.name_fr ?? listing.material_categories?.name
      : listing.material_categories?.name;

  const price = listing.price_per_unit
    ? `${Number(listing.price_per_unit).toFixed(2)} ${listing.currency} / ${listing.unit}`
    : t('priceOnRequest');

  const location = [listing.location_city, listing.location_country]
    .filter(Boolean)
    .join(', ');

  const isCollect = listing.listing_type === 'collect';

  return (
    <Link
      href={`/marketplace/detail?id=${listing.id}`}
      className="block overflow-hidden rounded-2xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 transition-all active:scale-[0.99] active:bg-[#F5F5F0]/8"
    >
      <div className="flex gap-3">
        {/* Image with badge for extra images */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden">
          <ListingImage
            storagePath={firstImagePath}
            alt={listing.title ?? ''}
            className="h-full w-full"
          />
          {extraImages > 0 && (
            <div className="absolute bottom-1 right-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
              +{extraImages}
            </div>
          )}
          {isCollect && (
            <div className="absolute left-1 top-1 flex items-center gap-0.5 rounded-full bg-[#B8D4E3] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#0A2F1F]">
              <Truck className="h-2.5 w-2.5" />
              {t('badgeCollect')}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-2.5 pr-3">
          <div>
            {categoryLabel && (
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#B8D4E3]">
                {categoryLabel}
              </p>
            )}
            <p className="line-clamp-2 text-[13px] font-semibold text-[#F5F5F0]">
              {listing.title}
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] font-semibold text-[#F5F5F0]">{price}</p>
            <div className="flex items-center gap-2 text-[10px] text-[#F5F5F0]/50">
              <span className="flex items-center gap-0.5">
                <Package className="h-3 w-3" />
                {Number(listing.quantity).toFixed(0)} {listing.unit}
              </span>
              {location && (
                <span className="flex items-center gap-0.5 truncate">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{location}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});
