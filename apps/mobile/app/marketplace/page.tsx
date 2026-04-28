'use client';

import { useTranslations } from 'next-intl';
import { ShoppingBag, RotateCw } from 'lucide-react';

import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';
import { CategoryFilter } from '~/components/marketplace/category-filter';
import { ListingCard } from '~/components/marketplace/listing-card';
import { ListingCardSkeleton } from '~/components/ui/skeleton';
import { useListings } from '~/hooks/use-listings';

export default function MarketplacePage() {
  return (
    <AuthGuard>
      <MarketplaceContent />
    </AuthGuard>
  );
}

function MarketplaceContent() {
  const t = useTranslations('marketplace');
  const {
    listings,
    categories,
    loading,
    refreshing,
    error,
    selectedCategory,
    setSelectedCategory,
    refetch,
  } = useListings();

  return (
    <AppShell title={t('title')} subtitle={t('subtitle')}>
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {loading && listings.length === 0 ? (
        <div className="space-y-3 py-2">
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <p className="text-center text-sm text-red-300">{error}</p>
          <button
            onClick={() => void refetch()}
            className="rounded-full border border-[#F5F5F0]/15 px-4 py-1.5 text-xs text-[#F5F5F0]/80 active:bg-[#F5F5F0]/10"
          >
            {t('retry')}
          </button>
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8D4E3]/15">
            <ShoppingBag className="h-5 w-5 text-[#B8D4E3]" />
          </div>
          <p className="text-center text-sm text-[#F5F5F0]/60">
            {selectedCategory ? t('emptyCategory') : t('emptyAll')}
          </p>
          <p className="max-w-xs text-center text-[11px] text-[#F5F5F0]/40">
            {t('emptyHint')}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
              {listings.length} {t('listingsCount')}
            </p>
            <button
              onClick={() => void refetch()}
              disabled={refreshing}
              aria-label={t('refresh')}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#F5F5F0]/50 active:bg-[#F5F5F0]/10 disabled:opacity-30"
            >
              <RotateCw
                className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
          <div className="space-y-2">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
