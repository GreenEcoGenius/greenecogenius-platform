'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Package,
  MapPin,
  Calendar,
  Tag,
  Truck,
  ShoppingCart,
  Recycle,
  Share2,
  Heart,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { ListingImage } from '~/components/marketplace/listing-image';
import { fetchListingById, type ListingWithCategory } from '~/lib/queries/listings';
import { supabase } from '~/lib/supabase-client';

function DetailContent() {
  const t = useTranslations('marketplace');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [listing, setListing] = useState<ListingWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadData() {
      try {
        // Fetch listing
        const listingData = await fetchListingById(id!);
        setListing(listingData);

        // Check if current user is the owner
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: memberships } = await supabase
            .from('accounts_memberships')
            .select('account_id')
            .eq('user_id', user.id)
            .limit(1);
          if (memberships && memberships.length > 0) {
            const accountId = memberships[0].account_id;
            setCurrentAccountId(accountId);
            if (listingData && listingData.account_id === accountId) {
              setIsOwner(true);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <AppShell title={t('detailTitle')} showBack hideTabBar>
        <div className="space-y-4 animate-pulse">
          <div className="aspect-[4/3] rounded-2xl bg-[#F5F5F0]/[0.04]" />
          <div className="h-6 w-2/3 rounded-lg bg-[#F5F5F0]/[0.04]" />
          <div className="h-4 w-1/2 rounded-lg bg-[#F5F5F0]/[0.04]" />
          <div className="h-20 rounded-2xl bg-[#F5F5F0]/[0.04]" />
        </div>
      </AppShell>
    );
  }

  if (!listing) {
    return (
      <AppShell title={t('detailTitle')} showBack hideTabBar>
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="h-10 w-10 text-[#F5F5F0]/20 mb-3" />
          <p className="text-[14px] text-[#F5F5F0]/50">Annonce introuvable</p>
        </div>
      </AppShell>
    );
  }

  const sortedImages = [...(listing.listing_images ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );
  const activeImage = sortedImages[activeImageIdx] ?? null;

  const categoryLabel =
    locale === 'fr'
      ? listing.material_categories?.name_fr ?? listing.material_categories?.name
      : listing.material_categories?.name;

  const totalPrice = (listing.price_per_unit && listing.quantity)
    ? Number(listing.price_per_unit) * Number(listing.quantity)
    : null;
  const price = totalPrice
    ? `${totalPrice.toFixed(2)} ${listing.currency}`
    : listing.price_per_unit
      ? `${Number(listing.price_per_unit).toFixed(2)} ${listing.currency}`
      : t('priceOnRequest');
  const unitPriceLabel = listing.price_per_unit
    ? `${Number(listing.price_per_unit).toFixed(2)} ${listing.currency}/${listing.unit}`
    : null;

  const location = [listing.location_city, listing.location_country]
    .filter(Boolean)
    .join(', ');

  const createdDate = listing.created_at
    ? new Date(listing.created_at).toLocaleDateString(locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const isCollect = listing.listing_type === 'collect';

  return (
    <AppShell title={t('detailTitle')} showBack hideTabBar noPadding>
      <div className="pb-24">
        {/* Image gallery */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0A2F1F]">
          <ListingImage
            storagePath={activeImage?.storage_path ?? null}
            alt={listing.title ?? ''}
            className="h-full w-full"
          />

          {/* Image counter */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white">
              {activeImageIdx + 1}/{sortedImages.length}
            </div>
          )}

          {/* Like button */}
          <button
            onClick={() => setLiked(!liked)}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm active:scale-90 transition-transform"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${liked ? 'fill-red-400 text-red-400' : 'text-white'}`}
            />
          </button>
        </div>

        {/* Thumbnail strip */}
        {sortedImages.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto px-4 py-2">
            {sortedImages.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIdx(idx)}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  idx === activeImageIdx
                    ? 'border-[#B8D4E3] opacity-100'
                    : 'border-transparent opacity-50'
                }`}
              >
                <ListingImage storagePath={img.storage_path} alt="" className="h-full w-full" />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="px-4 space-y-4 mt-3">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {categoryLabel && (
              <span className="rounded-full bg-[#B8D4E3]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#B8D4E3]">
                {categoryLabel}
              </span>
            )}
            {isCollect && (
              <span className="flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                <Truck className="h-2.5 w-2.5" />
                {t('badgeCollect')}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-[20px] font-bold text-[#F5F5F0] leading-tight">
            {listing.title}
          </h1>

          {/* Price card */}
          <div className="rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              {t('price')}
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[24px] font-bold text-[#F5F5F0]">{price}</span>
              {unitPriceLabel && (
                <span className="ml-1 text-[12px] text-[#F5F5F0]/50">({unitPriceLabel})</span>
              )}
            </div>
            {listing.transport_price && (
              <p className="mt-1 text-[11px] text-[#F5F5F0]/40">
                + {Number(listing.transport_price).toFixed(2)} {listing.currency} transport
              </p>
            )}
          </div>

          {/* Info rows */}
          <div className="rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] divide-y divide-[#F5F5F0]/[0.06]">
            <InfoRow
              icon={Package}
              label={t('quantity')}
              value={`${Number(listing.quantity).toFixed(2)} ${listing.unit}`}
            />
            {location && <InfoRow icon={MapPin} label={t('location')} value={location} />}
            {createdDate && <InfoRow icon={Calendar} label={t('listedOn')} value={createdDate} />}
            <InfoRow
              icon={Tag}
              label={t('type')}
              value={t(isCollect ? 'typeCollect' : 'typeSell')}
            />
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
                {t('description')}
              </p>
              <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[#F5F5F0]/75">
                {listing.description}
              </p>
            </div>
          )}

          {/* Material details */}
          {listing.material_details && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
                {t('materialDetails')}
              </p>
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#F5F5F0]/60">
                {listing.material_details}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom CTA - hidden for owner */}
      {!isOwner && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#F5F5F0]/[0.06] bg-[#0A2F1F]/95 backdrop-blur-xl"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F5F5F0]/[0.08] text-[#F5F5F0]/60 active:bg-[#F5F5F0]/[0.04] transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            {isCollect ? (
              <button
                onClick={() => window.open(`https://greenecogenius.tech/home/marketplace/${id}`, '_blank')}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 text-[14px] font-semibold text-[#0A2F1F] active:opacity-80 transition-opacity"
              >
                <Recycle className="h-4 w-4" />
                {t('collectBtn')}
              </button>
            ) : (
              <button
                onClick={() => window.open(`https://greenecogenius.tech/home/marketplace/${id}`, '_blank')}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#B8D4E3] py-3 text-[14px] font-semibold text-[#0A2F1F] active:opacity-80 transition-opacity"
              >
                <ShoppingCart className="h-4 w-4" />
                {t('buyBtn')}
              </button>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B8D4E3]/10">
        <Icon className="h-4 w-4 text-[#B8D4E3]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-[#F5F5F0]/40">{label}</p>
        <p className="truncate text-[13px] text-[#F5F5F0]">{value}</p>
      </div>
    </div>
  );
}

export default function MarketplaceDetailPage() {
  return (
    <AuthGuard>
      <DetailContent />
    </AuthGuard>
  );
}
