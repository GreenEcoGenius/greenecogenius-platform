import { supabase } from '~/lib/supabase-client';
import type { Database } from '@kit/supabase/database';

export type Listing = Database['public']['Tables']['listings']['Row'];
export type MaterialCategory =
  Database['public']['Tables']['material_categories']['Row'];
export type ListingImage =
  Database['public']['Tables']['listing_images']['Row'];

export interface ListingWithCategory extends Listing {
  material_categories: Pick<MaterialCategory, 'id' | 'name' | 'name_fr' | 'slug' | 'icon'> | null;
  listing_images: Pick<ListingImage, 'id' | 'storage_path' | 'position'>[];
}

export interface FetchListingsOpts {
  /** Filter by category slug (matches material_categories.slug) */
  categorySlug?: string;
  /** Filter by listing type: sell or collect */
  listingType?: 'sell' | 'collect';
  /** Limit (default 30) */
  limit?: number;
}

/**
 * Fetch active listings with their category and images.
 * Only returns listings with status = 'active'.
 */
export async function fetchListings(
  opts: FetchListingsOpts = {},
): Promise<ListingWithCategory[]> {
  const { categorySlug, listingType, limit = 30 } = opts;

  let query = supabase
    .from('listings')
    .select(
      `
      *,
      material_categories ( id, name, name_fr, slug, icon ),
      listing_images ( id, storage_path, position )
    `,
    )
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (listingType) {
    query = query.eq('listing_type', listingType);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  let results = (data ?? []) as unknown as ListingWithCategory[];

  if (categorySlug) {
    results = results.filter(
      (l) => l.material_categories?.slug === categorySlug,
    );
  }

  return results;
}

/**
 * Fetch a single listing with full details.
 */
export async function fetchListingById(
  id: string,
): Promise<ListingWithCategory | null> {
  const { data, error } = await supabase
    .from('listings')
    .select(
      `
      *,
      material_categories ( id, name, name_fr, slug, icon ),
      listing_images ( id, storage_path, position )
    `,
    )
    .eq('id', id)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return (data as unknown as ListingWithCategory) ?? null;
}

/**
 * Fetch all material categories (for filter pills).
 */
export async function fetchMaterialCategories(): Promise<MaterialCategory[]> {
  const { data, error } = await supabase
    .from('material_categories')
    .select('*')
    .order('name_fr', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Get the public URL for a listing image stored in Supabase Storage.
 * Handles both:
 * - Full URLs (from web app): returned as-is
 * - Relative paths (from mobile upload): resolved via 'generated-images' bucket
 */
export function getListingImageUrl(storagePath: string | null): string | null {
  if (!storagePath) return null;
  // If it's already a full URL, return it directly
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }
  // Otherwise, resolve via the generated-images bucket
  const {
    data: { publicUrl },
  } = supabase.storage.from('generated-images').getPublicUrl(storagePath);
  return publicUrl;
}
