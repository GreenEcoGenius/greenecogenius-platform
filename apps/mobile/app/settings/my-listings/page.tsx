'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Package,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { ListingImage } from '~/components/marketplace/listing-image';
import { supabase } from '~/lib/supabase-client';


interface MyListing {
  id: string;
  title: string;
  listing_type: string;
  status: string;
  price_per_unit: number | null;
  currency: string;
  created_at: string;
  listing_images: { id: string; storage_path: string; position: number }[];
  material_categories: { name: string; name_fr: string } | null;
}

function MyListingsContent() {
  const t = useTranslations('marketplace');
  const locale = useLocale();
  const router = useRouter();
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyListings() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: memberships } = await supabase
          .from('accounts_memberships')
          .select('account_id')
          .eq('user_id', user.id)
          .limit(1);

        if (!memberships || memberships.length === 0) return;

        const accountId = memberships[0].account_id;

        const { data, error } = await supabase
          .from('listings')
          .select(`
            id, title, listing_type, status, price_per_unit, currency, created_at,
            listing_images ( id, storage_path, position ),
            material_categories ( name, name_fr )
          `)
          .eq('account_id', accountId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching my listings:', error);
          return;
        }

        setListings((data as unknown as MyListing[]) ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMyListings();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      locale === 'fr'
        ? 'Voulez-vous vraiment supprimer cette annonce ?'
        : 'Are you sure you want to delete this listing?'
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (!error) {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  }

  function getStatusBadge(status: string, listingType: string) {
    if (status === 'sold' || status === 'collected') {
      return (
        <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          {listingType === 'collect' ? t('listingCollected') : t('listingSold')}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 rounded-full bg-[#B8D4E3]/15 px-2 py-0.5 text-[10px] font-semibold text-[#B8D4E3]">
        <Clock className="h-3 w-3" />
        {t('listingActive')}
      </span>
    );
  }

  if (loading) {
    return (
      <AppShell title={t('myListingsTitle')} showBack>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#F5F5F0]/[0.04]" />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t('myListingsTitle')} showBack>
      <div className="space-y-4 pb-6">
        {/* Create new listing button */}
        <button
          onClick={() => router.push('/marketplace/create')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#F5F5F0]/[0.12] py-4 text-[13px] font-medium text-[#F5F5F0]/50 active:bg-[#F5F5F0]/[0.02] transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('createListing')}
        </button>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="h-10 w-10 text-[#F5F5F0]/20 mb-3" />
            <p className="text-[13px] text-[#F5F5F0]/40">{t('noListings')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => {
              const firstImage = listing.listing_images
                ?.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0];
              const categoryLabel = locale === 'fr'
                ? listing.material_categories?.name_fr ?? listing.material_categories?.name
                : listing.material_categories?.name;

              return (
                <div
                  key={listing.id}
                  className="flex gap-3 rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-3"
                >
                  {/* Image thumbnail */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#0A2F1F]">
                    <ListingImage
                      storagePath={firstImage?.storage_path ?? null}
                      alt={listing.title}
                      className="h-full w-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-[13px] font-semibold text-[#F5F5F0]">
                        {listing.title}
                      </p>
                      {getStatusBadge(listing.status, listing.listing_type)}
                    </div>

                    {categoryLabel && (
                      <p className="mt-0.5 text-[11px] text-[#F5F5F0]/40 uppercase tracking-wider">
                        {categoryLabel}
                      </p>
                    )}

                    {listing.price_per_unit && (
                      <p className="mt-1 text-[12px] font-medium text-[#B8D4E3]">
                        {Number(listing.price_per_unit).toFixed(2)} {listing.currency}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/marketplace/detail?id=${listing.id}`)}
                        className="flex items-center gap-1 rounded-lg bg-[#B8D4E3]/10 px-2.5 py-1 text-[10px] font-medium text-[#B8D4E3] active:opacity-80"
                      >
                        <Eye className="h-3 w-3" />
                        {t('viewListing')}
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="flex items-center gap-1 rounded-lg bg-red-400/10 px-2.5 py-1 text-[10px] font-medium text-red-400 active:opacity-80"
                      >
                        <Trash2 className="h-3 w-3" />
                        {t('deleteListing')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function MyListingsPage() {
  return (
    <AuthGuard>
      <MyListingsContent />
    </AuthGuard>
  );
}
