'use client';

import Link from 'next/link';

import { ArrowRight, Leaf, MapPin, Package, Tag, Truck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

interface ListingShape {
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
}

interface EnviroListingCardProps {
  listing: ListingShape;
  /** Show the "CO2 avoided estimated" lime footer. */
  showCo2Footer?: boolean;
}

/**
 * Marketplace listing card with the Enviro design tokens. This is a
 * dashboard-only re-skin of the legacy `~/home/_components/listing-card`
 * used by the user marketplace at `/home/marketplace`. The legacy card
 * stays untouched because it is also consumed by the team-accounts
 * segment (`/home/[account]/marketplace`), which is out of scope for
 * Phase 6.
 *
 * The whole card is a `<Link>` so the underlying anchor must remain
 * leaf-clean: any nested interactive element would trigger a hydration
 * warning. The CO2 footer is intentionally a sibling of the link so it
 * does not capture clicks.
 */
export function EnviroListingCard({
  listing,
  showCo2Footer,
}: EnviroListingCardProps) {
  const t = useTranslations('marketplace');
  const locale = useLocale();

  const typeLabel =
    listing.listing_type === 'sell'
      ? t('typeSell')
      : listing.listing_type === 'buy'
        ? t('typeBuy')
        : t('typeCollect');

  const typeTone: Record<string, string> = {
    sell: 'bg-[--color-enviro-lime-100] text-[--color-enviro-lime-800]',
    buy: 'bg-[--color-enviro-forest-100] text-[--color-enviro-forest-700]',
    collect: 'bg-[--color-enviro-ember-100] text-[--color-enviro-ember-700]',
  };

  const totalPrice =
    listing.price_per_unit !== null && listing.price_per_unit > 0
      ? listing.price_per_unit * listing.quantity
      : null;

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

  const categoryLabel =
    listing.material_categories?.[locale === 'fr' ? 'name_fr' : 'name'] ??
    listing.material_categories?.name_fr ??
    listing.material_categories?.name ??
    null;

  const co2Tonnes = ((listing.quantity ?? 0) * 0.8) / 1000;

  return (
    <div className="group flex flex-col overflow-hidden rounded-[--radius-enviro-xl] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] shadow-[--shadow-enviro-card] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[--shadow-enviro-lg] font-[family-name:var(--font-enviro-sans)]">
      <Link
        href={`/home/marketplace/${listing.id}`}
        className="flex flex-1 flex-col p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60"
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-[--radius-enviro-pill] px-2.5 py-0.5 text-[11px] font-semibold',
              typeTone[listing.listing_type] ??
                'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]',
            )}
          >
            {typeLabel}
          </span>

          <span className="text-xs text-[--color-enviro-forest-700]/70">
            {listing.created_at
              ? new Date(listing.created_at).toLocaleDateString(locale)
              : ''}
          </span>
        </div>

        <h3 className="mt-3 text-base font-semibold leading-tight text-[--color-enviro-forest-900] transition-colors duration-200 group-hover:text-[--color-enviro-cta] font-[family-name:var(--font-enviro-display)]">
          {listing.title}
        </h3>

        {listing.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-[--color-enviro-forest-700]">
            {listing.description}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[--color-enviro-forest-700]">
          {categoryLabel ? (
            <span className="inline-flex items-center gap-1">
              <Tag aria-hidden="true" className="h-3 w-3" />
              {categoryLabel}
            </span>
          ) : null}

          <span className="inline-flex items-center gap-1 tabular-nums">
            <Package aria-hidden="true" className="h-3 w-3" />
            {listing.quantity} {listing.unit}
          </span>

          {listing.location_city ? (
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="h-3 w-3" />
              {listing.location_city}
            </span>
          ) : null}
        </div>

        {listing.price_per_unit !== null && listing.price_per_unit > 0 ? (
          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <p className="text-sm font-semibold tabular-nums text-[--color-enviro-forest-900]">
                {formatCurrency(listing.price_per_unit)}{' '}
                <span className="text-[11px] font-normal text-[--color-enviro-forest-700]">
                  / {listing.unit}
                </span>
              </p>
              {totalPrice !== null ? (
                <p className="text-[11px] text-[--color-enviro-forest-700]">
                  {t('totalLabel')}: {formatCurrency(totalPrice)}
                </p>
              ) : null}
            </div>
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[--color-enviro-forest-700] opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>
        ) : null}

        {listing.listing_type === 'collect' &&
        listing.transport_price != null &&
        listing.transport_price > 0 ? (
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[--color-enviro-ember-700]">
            <Truck aria-hidden="true" className="h-3 w-3" />
            {t('transportLabel')}: {formatCurrency(listing.transport_price)}
          </div>
        ) : null}
      </Link>

      {showCo2Footer ? (
        <div className="flex items-center gap-1.5 border-t border-[--color-enviro-cream-200] bg-[--color-enviro-lime-50] px-5 py-2 text-xs text-[--color-enviro-lime-800]">
          <Leaf aria-hidden="true" className="h-3 w-3" />
          {t('co2AvoidedEstimated')} {co2Tonnes.toFixed(1)} t
        </div>
      ) : null}
    </div>
  );
}
