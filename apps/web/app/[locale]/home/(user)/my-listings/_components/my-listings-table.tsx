'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { ArrowRight, MapPin, PackagePlus, PackageSearch } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

import {
  EnviroDataTable,
  EnviroEmptyState,
  EnviroFilterChips,
  EnviroTableBody,
  EnviroTableCell,
  EnviroTableHead,
  EnviroTableHeader,
  EnviroTableRow,
} from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import { DeleteListingButton } from '~/home/_components/delete-listing-button';

type FilterValue = 'all' | 'active' | 'draft' | 'sold' | 'expired';

export interface MyListingRow {
  id: string;
  title: string;
  listing_type: string;
  status: string;
  quantity: number | null;
  unit: string | null;
  price_per_unit: number | null;
  currency: string | null;
  location_city: string | null;
  location_country: string | null;
  created_at: string | null;
  category_label: string | null;
}

interface MyListingsTableProps {
  listings: MyListingRow[];
}

/**
 * Client component that holds the active filter state and renders the
 * filtered listings either as `EnviroDataTable` rows (default) or as
 * `EnviroEmptyState` when no row matches.
 *
 * Data is fetched server-side and passed in as a stable prop so RLS,
 * sorting and the existing Supabase access pattern stay untouched. The
 * delete action keeps the legacy `DeleteListingButton` (which uses
 * `useSupabase` + RLS direct delete + `router.refresh()`).
 */
export function MyListingsTable({ listings }: MyListingsTableProps) {
  const t = useTranslations('marketplace');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [filter, setFilter] = useState<FilterValue>('all');

  const counts = useMemo(() => {
    const c: Record<FilterValue, number> = {
      all: listings.length,
      active: 0,
      draft: 0,
      sold: 0,
      expired: 0,
    };
    for (const l of listings) {
      const key = l.status as FilterValue;
      if (key in c && key !== 'all') c[key]++;
    }
    return c;
  }, [listings]);

  const filtered = useMemo(() => {
    if (filter === 'all') return listings;
    return listings.filter((l) => l.status === filter);
  }, [filter, listings]);

  const formatPrice = (
    price: number | null,
    currency: string | null,
    unit: string | null,
  ) => {
    if (price == null || price <= 0) return t('negotiable');
    try {
      return `${new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency ?? 'EUR',
        maximumFractionDigits: 2,
      }).format(price)} / ${unit ?? ''}`.trim();
    } catch {
      return `${price.toFixed(2)} ${currency ?? 'EUR'} / ${unit ?? ''}`.trim();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <EnviroFilterChips
        ariaLabel={t('filterAll')}
        value={filter}
        onChange={(next) => setFilter(next)}
        items={[
          { value: 'all', label: t('filterAll'), count: counts.all },
          {
            value: 'active',
            label: t('status.active'),
            count: counts.active,
          },
          {
            value: 'draft',
            label: t('status.draft'),
            count: counts.draft,
          },
          {
            value: 'sold',
            label: t('status.sold'),
            count: counts.sold,
          },
          {
            value: 'expired',
            label: t('status.expired'),
            count: counts.expired,
          },
        ]}
      />

      {filtered.length === 0 ? (
        <EnviroEmptyState
          icon={<PackageSearch aria-hidden="true" className="h-7 w-7" />}
          title={
            filter === 'all'
              ? t('noOwnListings')
              : t('noFilteredListings')
          }
          actions={
            filter === 'all' ? (
              <EnviroButton
                variant="primary"
                size="sm"
                magnetic
                render={(buttonProps) => (
                  <Link {...buttonProps} href="/home/marketplace/new">
                    <PackagePlus aria-hidden="true" className="h-4 w-4" />
                    {t('createFirstListing')}
                  </Link>
                )}
              />
            ) : null
          }
        />
      ) : (
        <EnviroDataTable>
          <EnviroTableHeader>
            <EnviroTableRow>
              <EnviroTableHead>{t('materialLabel')}</EnviroTableHead>
              <EnviroTableHead>{t('typeLabel')}</EnviroTableHead>
              <EnviroTableHead>{t('quantityLabel')}</EnviroTableHead>
              <EnviroTableHead>{t('priceLabel')}</EnviroTableHead>
              <EnviroTableHead>{t('statusLabel')}</EnviroTableHead>
              <EnviroTableHead>
                <span className="sr-only">{t('actionsLabel')}</span>
              </EnviroTableHead>
            </EnviroTableRow>
          </EnviroTableHeader>
          <EnviroTableBody>
            {filtered.map((listing) => (
              <EnviroTableRow key={listing.id}>
                <EnviroTableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-[--color-enviro-forest-900]">
                      {listing.title}
                    </span>
                    <span className="flex items-center gap-2 text-[11px] text-[--color-enviro-forest-700]">
                      {listing.category_label ? (
                        <span>{listing.category_label}</span>
                      ) : null}
                      {(listing.location_city || listing.location_country) ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin aria-hidden="true" className="h-3 w-3" />
                          {[listing.location_city, listing.location_country]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </EnviroTableCell>
                <EnviroTableCell>
                  <TypePill type={listing.listing_type} t={t} />
                </EnviroTableCell>
                <EnviroTableCell className="tabular-nums text-[--color-enviro-forest-900]">
                  {listing.quantity != null
                    ? `${listing.quantity} ${listing.unit ?? ''}`.trim()
                    : '-'}
                </EnviroTableCell>
                <EnviroTableCell className="tabular-nums">
                  {formatPrice(
                    listing.price_per_unit,
                    listing.currency,
                    listing.unit,
                  )}
                </EnviroTableCell>
                <EnviroTableCell>
                  <StatusPill status={listing.status} t={t} />
                </EnviroTableCell>
                <EnviroTableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/home/marketplace/${listing.id}`}
                      aria-label={t('viewLabel')}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-[--radius-enviro-sm] text-[--color-enviro-forest-700] transition-colors hover:bg-[--color-enviro-cream-100] hover:text-[--color-enviro-forest-900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60"
                    >
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                    <DeleteListingButton listingId={listing.id} />
                  </div>
                </EnviroTableCell>
              </EnviroTableRow>
            ))}
          </EnviroTableBody>
        </EnviroDataTable>
      )}

      <p className="sr-only" aria-live="polite">
        {tCommon('showingRecordCount', {
          pageSize: filtered.length,
          totalCount: listings.length,
        })}
      </p>
    </div>
  );
}

function TypePill({
  type,
  t,
}: {
  type: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const styles: Record<string, string> = {
    sell: 'bg-[--color-enviro-lime-100] text-[--color-enviro-lime-800]',
    buy: 'bg-[--color-enviro-forest-100] text-[--color-enviro-forest-700]',
    collect: 'bg-[--color-enviro-ember-100] text-[--color-enviro-ember-700]',
  };
  const label =
    type === 'sell'
      ? t('typeSell')
      : type === 'buy'
        ? t('typeBuy')
        : type === 'collect'
          ? t('typeCollect')
          : type;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[--radius-enviro-pill] px-2 py-0.5 text-[11px] font-semibold',
        styles[type] ?? 'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]',
      )}
    >
      {label}
    </span>
  );
}

function StatusPill({
  status,
  t,
}: {
  status: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const styles: Record<string, string> = {
    active: 'bg-[--color-enviro-lime-100] text-[--color-enviro-lime-800]',
    draft: 'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]',
    sold: 'bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]',
    expired: 'bg-[--color-enviro-ember-100] text-[--color-enviro-ember-700]',
  };
  const label =
    status === 'active'
      ? t('status.active')
      : status === 'draft'
        ? t('status.draft')
        : status === 'sold'
          ? t('status.sold')
          : status === 'expired'
            ? t('status.expired')
            : status;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[--radius-enviro-pill] px-2 py-0.5 text-[11px] font-semibold',
        styles[status] ?? 'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]',
      )}
    >
      {label}
    </span>
  );
}
