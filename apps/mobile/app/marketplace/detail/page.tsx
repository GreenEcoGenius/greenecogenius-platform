'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  MapPin,
  Package,
  Truck,
  Calendar,
  RotateCw,
  Tag,
} from 'lucide-react';

import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';
import { ListingImage } from '~/components/marketplace/listing-image';
import {
  fetchListingById,
  type ListingWithCategory,
} from '~/lib/queries/listings';

export default function ListingDetailPage() {
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <ListingDetailContent />
      </Suspense>
    </AuthGuard>
  );
}

function ListingDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const t = useTranslations('marketplace');
  const locale = useLocale();

  const [listing, setListing] = useState<ListingWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchListingById(id!);
        if (!cancelled) setListing(data);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Erreur';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <AppShell title={t('detailTitle')} showBack>
        <div className="flex flex-col items-center gap-2 py-12">
          <RotateCw className="h-5 w-5 animate-spin text-[#F5F5F0]/40" />
          <p className="text-xs text-[#F5F5F0]/50">{t('loading')}</p>
        </div>
      </AppShell>
    );
  }

  if (error || !listing) {
    return (
      <AppShell title={t('detailTitle')} showBack>
        <div className="flex flex-col items-center gap-3 py-12">
          <p className="text-center text-sm text-red-300">
            {error ?? t('notFound')}
          </p>
        </div>
      </AppShell>
    );
  }

  const sortedImages = [...(listing.listing_images ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );
  const activeImage = sortedImages[activeImageIdx] ?? sortedImages[0];

  const categoryLabel =
    locale === 'fr'
      ? listing.material_categories?.name_fr ?? listing.material_categories?.name
      : listing.material_categories?.name;

  const price = listing.price_per_unit
    ? `${Number(listing.price_per_unit).toFixed(2)} ${listing.currency}`
    : t('priceOnRequest');

  const location = [listing.location_city, listing.location_postal_code, listing.location_country]
    .filter(Boolean)
    .join(' · ');

  const createdDate = listing.created_at
    ? new Date(listing.created_at).toLocaleDateString(locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const isCollect = listing.listing_type === 'collect';

  return (
    <AppShell title={t('detailTitle')} showBack>
      <div className="-mx-4 mb-3 aspect-[4/3] overflow-hidden bg-[#0A2F1F]">
        <ListingImage
          storagePath={activeImage?.storage_path ?? null}
          alt={listing.title ?? ''}
          className="h-full w-full"
        />
      </div>

      {sortedImages.length > 1 && (
        <div className="mb-3 flex gap-1.5 overflow-x-auto">
          {sortedImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveImageIdx(idx)}
              className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 ${
                idx === activeImageIdx
                  ? 'border-[#B8D4E3]'
                  : 'border-transparent opacity-60'
              }`}
            >
              <ListingImage
                storagePath={img.storage_path}
                alt=""
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      )}

      <div className="mb-3">
        <div className="flex items-center gap-2">
          {categoryLabel && (
            <span className="rounded-full bg-[#B8D4E3]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#B8D4E3]">
              {categoryLabel}
            </span>
          )}
          {isCollect && (
            <span className="flex items-center gap-1 rounded-full bg-[#FFD54F]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#FFD54F]">
              <Truck className="h-2.5 w-2.5" />
              {t('badgeCollect')}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-xl font-bold text-[#F5F5F0]">{listing.title}</h1>
      </div>

      <div className="mb-3 rounded-2xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
          {t('price')}
        </p>
        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[#F5F5F0]">{price}</span>
          {listing.price_per_unit && (
            <span className="text-xs text-[#F5F5F0]/60">
              / {listing.unit}
            </span>
          )}
        </div>
        {listing.transport_price && (
          <p className="mt-1 text-[11px] text-[#F5F5F0]/50">
            +{Number(listing.transport_price).toFixed(2)} {listing.currency}{' '}
            {t('transport')}
          </p>
        )}
      </div>

      <div className="mb-3 space-y-2 rounded-2xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 p-1">
        <InfoRow
          icon={Package}
          label={t('quantity')}
          value={`${Number(listing.quantity).toFixed(2)} ${listing.unit}`}
        />
        {location && <InfoRow icon={MapPin} label={t('location')} value={location} />}
        {createdDate && (
          <InfoRow icon={Calendar} label={t('listedOn')} value={createdDate} />
        )}
        <InfoRow
          icon={Tag}
          label={t('type')}
          value={t(isCollect ? 'typeCollect' : 'typeSell')}
        />
      </div>

      {listing.description && (
        <div className="mb-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            {t('description')}
          </p>
          <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[#F5F5F0]/80">
            {listing.description}
          </p>
        </div>
      )}

      {listing.material_details && (
        <div className="mb-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            {t('materialDetails')}
          </p>
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#F5F5F0]/70">
            {listing.material_details}
          </p>
        </div>
      )}

      <p className="pb-4 pt-2 text-center text-[10px] text-[#F5F5F0]/40">
        {t('readOnlyFootnote')}
      </p>
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
    <div className="flex items-center gap-3 rounded-xl px-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B8D4E3]/15">
        <Icon className="h-4 w-4 text-[#B8D4E3]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-[#F5F5F0]/50">
          {label}
        </p>
        <p className="truncate text-[13px] text-[#F5F5F0]">{value}</p>
      </div>
    </div>
  );
}
