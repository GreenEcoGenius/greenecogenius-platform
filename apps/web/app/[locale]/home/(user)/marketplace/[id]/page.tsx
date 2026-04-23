import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft, MapPin, Package, Tag, Truck } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { cn } from '@kit/ui/utils';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
} from '~/components/enviro/enviro-card';
import { BuyListingButton } from '~/home/_components/buy-listing-button';
import { ListingImage } from '~/home/_components/listing-image';

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
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
  const { id } = await params;
  const client = getSupabaseServerClient();
  const t = await getTranslations('marketplace');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: images } = await (client as any)
    .from('listing_images')
    .select('storage_path')
    .eq('listing_id', id)
    .order('position', { ascending: true })
    .limit(1);

  const listingImageUrl: string | null = images?.[0]?.storage_path ?? null;
  const categorySlug: string | null =
    ((listing.material_categories as Record<string, unknown>)
      ?.slug as string | null) ?? null;
  const categoryName: string | null =
    ((listing.material_categories as Record<string, unknown>)
      ?.name_fr as string | null) ?? null;

  const typeLabel =
    listing.listing_type === 'sell'
      ? t('typeSell')
      : listing.listing_type === 'collect'
        ? t('typeCollect')
        : t('typeBuy');

  const typeTone: Record<string, string> = {
    sell: 'bg-[--color-enviro-lime-100] text-[--color-enviro-lime-800]',
    buy: 'bg-[--color-enviro-forest-100] text-[--color-enviro-forest-700]',
    collect: 'bg-[--color-enviro-ember-100] text-[--color-enviro-ember-700]',
  };

  const totalPrice =
    listing.price_per_unit !== null && listing.price_per_unit > 0
      ? listing.price_per_unit * listing.quantity
      : null;

  const transportPrice = (listing as Record<string, unknown>)
    .transport_price as number | null;

  const isOwner = currentUserId === listing.account_id;
  const hasPrice =
    (listing.price_per_unit !== null && listing.price_per_unit > 0) ||
    (transportPrice !== null && transportPrice > 0);

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: listing.currency || 'EUR',
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${listing.currency || 'EUR'}`;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.marketplace')}
        title={listing.title}
        subtitle={
          <span className="inline-flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-[--radius-enviro-pill] px-2.5 py-0.5 text-[11px] font-semibold',
                typeTone[listing.listing_type] ??
                  'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]',
              )}
            >
              {typeLabel}
            </span>
            {categoryName ? <span>{categoryName}</span> : null}
          </span>
        }
        actions={
          <EnviroButton
            variant="secondary"
            size="sm"
            render={(buttonProps) => (
              <Link {...buttonProps} href="/home/marketplace">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                {t('backToMarketplace')}
              </Link>
            )}
          />
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <EnviroCard
          variant="cream"
          hover="none"
          padding="none"
          className="lg:col-span-3 overflow-hidden"
        >
          <div className="aspect-video w-full">
            <ListingImage
              imageUrl={listingImageUrl}
              categorySlug={categorySlug}
              categoryName={categoryName}
              title={listing.title}
            />
          </div>

          {listing.description ? (
            <div className="px-6 pb-6 -mt-2">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
                {t('descriptionLabel')}
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[--color-enviro-forest-900]">
                {listing.description}
              </p>
            </div>
          ) : null}
        </EnviroCard>

        <div className="flex flex-col gap-4 lg:col-span-2">
          {listing.price_per_unit !== null && listing.price_per_unit > 0 ? (
            <EnviroCard variant="dark" hover="none" padding="md">
              <EnviroCardBody>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[--color-enviro-fg-inverse-muted] font-[family-name:var(--font-enviro-mono)]">
                  {t('pricePerUnit')}
                </p>
                <p className="mt-2 text-3xl font-semibold tabular-nums text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-display)]">
                  {formatCurrency(listing.price_per_unit)}
                </p>
                <p className="mt-1 text-xs text-[--color-enviro-fg-inverse-muted]">
                  / {listing.unit}
                </p>
                {totalPrice !== null ? (
                  <p className="mt-3 inline-flex items-center gap-1 rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-300] px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-[--color-enviro-forest-900]">
                    {t('totalLabel')}: {formatCurrency(totalPrice)}
                  </p>
                ) : null}
              </EnviroCardBody>
            </EnviroCard>
          ) : null}

          <EnviroCard variant="cream" hover="none" padding="md">
            <EnviroCardBody className="grid grid-cols-2 gap-4 text-sm">
              <AttributeRow
                icon={<Tag aria-hidden="true" className="h-3 w-3" />}
                label={t('category')}
                value={listing.material_categories?.name_fr ?? '-'}
              />
              <AttributeRow
                icon={<Package aria-hidden="true" className="h-3 w-3" />}
                label={t('quantity')}
                value={`${listing.quantity} ${listing.unit}`}
              />
              {listing.location_city ? (
                <AttributeRow
                  icon={<MapPin aria-hidden="true" className="h-3 w-3" />}
                  label={t('location')}
                  value={`${listing.location_city}, ${listing.location_country ?? ''}`}
                />
              ) : null}
              <AttributeRow
                label={t('publishedOn')}
                value={
                  listing.created_at
                    ? new Date(listing.created_at).toLocaleDateString(locale)
                    : ''
                }
              />
            </EnviroCardBody>
          </EnviroCard>

          {listing.listing_type === 'collect' &&
          transportPrice !== null &&
          transportPrice > 0 ? (
            <div className="inline-flex items-center gap-2 rounded-[--radius-enviro-md] border border-[--color-enviro-ember-200] bg-[--color-enviro-ember-50] px-4 py-3 text-sm font-medium text-[--color-enviro-ember-700]">
              <Truck aria-hidden="true" className="h-4 w-4" />
              {t('transportLabel')}: {formatCurrency(transportPrice)}
            </div>
          ) : null}

          <BuyListingButton
            listingId={listing.id}
            isOwner={isOwner}
            hasPrice={hasPrice}
          />
        </div>
      </div>
    </div>
  );
}

function AttributeRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-[--color-enviro-forest-900]">
        {value}
      </span>
    </div>
  );
}

export default ListingDetailPage;
