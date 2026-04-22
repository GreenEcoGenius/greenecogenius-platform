import Link from 'next/link';

import { PackagePlus } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';

import {
  MyListingsTable,
  type MyListingRow,
} from './_components/my-listings-table';

export const generateMetadata = async () => {
  const t = await getTranslations('common');

  return { title: t('routes.myListings') };
};

async function MyListingsPage() {
  const client = getSupabaseServerClient();
  const t = await getTranslations('marketplace');
  const tCommon = await getTranslations('common');

  const user = await requireUser(client);
  const userId = user.data?.id;

  const { data: listings } = userId
    ? await client
        .from('listings')
        .select('*, material_categories(*)')
        .eq('account_id', userId)
        .order('created_at', { ascending: false })
    : { data: [] };

  const locale = await getLocale();

  // Project the rows down to a stable client-friendly shape so the
  // <MyListingsTable> client component does not have to know about the
  // wide listings row type returned by the Supabase generated types.
  const rows: MyListingRow[] = (listings ?? []).map((l) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cat = (l as any).material_categories as
      | { name?: string; name_fr?: string }
      | null;

    const categoryLabel = cat
      ? locale === 'fr'
        ? cat.name_fr ?? cat.name ?? null
        : cat.name ?? cat.name_fr ?? null
      : null;

    return {
      id: l.id as string,
      title: (l.title as string) ?? '',
      listing_type: (l.listing_type as string) ?? '',
      status: (l.status as string) ?? '',
      quantity:
        l.quantity != null ? Number(l.quantity as number | string) : null,
      unit: (l.unit as string) ?? null,
      price_per_unit:
        l.price_per_unit != null
          ? Number(l.price_per_unit as number | string)
          : null,
      currency: (l.currency as string) ?? null,
      location_city: (l.location_city as string) ?? null,
      location_country: (l.location_country as string) ?? null,
      created_at: (l.created_at as string) ?? null,
      category_label: categoryLabel,
    };
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.marketplace')}
        title={tCommon('routes.myListings')}
        subtitle={t('myListingsSubtitle')}
        actions={
          <EnviroButton
            variant="primary"
            size="sm"
            magnetic
            render={(buttonProps) => (
              <Link {...buttonProps} href="/home/marketplace/new">
                <PackagePlus aria-hidden="true" className="h-4 w-4" />
                {t('createListing')}
              </Link>
            )}
          />
        }
      />

      <MyListingsTable listings={rows} />
    </div>
  );
}

export default MyListingsPage;
