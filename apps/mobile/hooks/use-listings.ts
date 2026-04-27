'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  fetchListings,
  fetchMaterialCategories,
  type ListingWithCategory,
  type MaterialCategory,
} from '~/lib/queries/listings';

export interface UseListingsState {
  listings: ListingWithCategory[];
  categories: MaterialCategory[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  selectedCategory: string | null;
  setSelectedCategory: (slug: string | null) => void;
  refetch: () => Promise<void>;
}

export function useListings(): UseListingsState {
  const [listings, setListings] = useState<ListingWithCategory[]>([]);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const load = useCallback(
    async (isRefresh = false, categorySlug: string | null = null) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        const [listingsData, categoriesData] = await Promise.all([
          fetchListings({ categorySlug: categorySlug ?? undefined }),
          categories.length === 0
            ? fetchMaterialCategories()
            : Promise.resolve(categories),
        ]);

        setListings(listingsData);
        if (categories.length === 0) {
          setCategories(categoriesData);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    // categories is intentionally checked .length only; we don't want to refetch when categories changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    void load(false, selectedCategory);
  }, [selectedCategory, load]);

  const refetch = useCallback(async () => {
    await load(true, selectedCategory);
  }, [load, selectedCategory]);

  return {
    listings,
    categories,
    loading,
    refreshing,
    error,
    selectedCategory,
    setSelectedCategory,
    refetch,
  };
}
