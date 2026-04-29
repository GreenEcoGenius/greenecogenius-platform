'use client';

import { useTranslations } from 'next-intl';
import { ShoppingBag, RotateCw, Plus, Search } from 'lucide-react';
import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';
import { CategoryFilter } from '~/components/marketplace/category-filter';
import { ListingCard } from '~/components/marketplace/listing-card';
import { useListings } from '~/hooks/use-listings';
import { useState } from 'react';
import Link from 'next/link';

function MarketplaceContent() {
  const t = useTranslations('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredListings = searchQuery.trim()
    ? listings.filter(
        (l) =>
          l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.material_categories?.name_fr?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : listings;

  return (
    <AppShell
      title={t('title')}
      subtitle={t('subtitle')}
      rightAction={
        <Link
          href="/marketplace/create"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B8D4E3] text-[#0A2F1F] active:opacity-80 transition-opacity"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      }
    >
      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F0]/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une matière..."
          className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-2.5 pl-9 pr-4 text-[13px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/30 focus:border-[#B8D4E3]/30 focus:outline-none transition-colors"
        />
      </div>

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {loading && listings.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16">
          <RotateCw className="h-5 w-5 animate-spin text-[#B8D4E3]/60" />
          <p className="text-[12px] text-[#F5F5F0]/40">{t('loading')}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <p className="text-center text-[13px] text-red-300/80">{error}</p>
          <button
            onClick={() => void refetch()}
            className="rounded-full border border-[#F5F5F0]/10 px-4 py-1.5 text-[12px] text-[#F5F5F0]/70 active:bg-[#F5F5F0]/5 transition-colors"
          >
            {t('retry')}
          </button>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8D4E3]/10">
            <ShoppingBag className="h-6 w-6 text-[#B8D4E3]/60" />
          </div>
          <p className="text-center text-[13px] text-[#F5F5F0]/50">
            {searchQuery ? 'Aucun résultat pour cette recherche' : selectedCategory ? t('emptyCategory') : t('emptyAll')}
          </p>
          <p className="max-w-[260px] text-center text-[11px] text-[#F5F5F0]/30">
            {t('emptyHint')}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              {filteredListings.length} {t('listingsCount')}
            </p>
            <button
              onClick={() => void refetch()}
              disabled={refreshing}
              aria-label={t('refresh')}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#F5F5F0]/40 active:bg-[#F5F5F0]/5 disabled:opacity-30 transition-colors"
            >
              <RotateCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="space-y-2 pb-2">
            {filteredListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}

export default function MarketplacePage() {
  return (
    <AuthGuard>
      <MarketplaceContent />
    </AuthGuard>
  );
}
