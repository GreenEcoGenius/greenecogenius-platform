import Link from 'next/link';

import {
  Activity,
  Leaf,
  Package,
  Plus,
  Search,
  TrendingUp,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { ListingCard } from '~/home/_components/listing-card';

export const generateMetadata = async () => {
  const t = await getTranslations('common');

  return { title: t('routes.marketplace') };
};

async function MarketplacePage() {
  const client = getSupabaseServerClient();
  const t = await getTranslations('marketplace');

  const { data: listings } = await client
    .from('listings')
    .select('*, material_categories(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50);

  const listingCount = listings?.length ?? 0;

  return (
    <PageBody>
      {/* Section 1 -- Marketplace Banner */}
      <div className="from-primary/10 via-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent p-8">
        <div className="relative z-10">
          <h2 className="text-xl font-bold md:text-2xl">
            Le Comptoir Circulaire
          </h2>
          <p className="text-muted-foreground mt-1 text-base">
            {t('marketplaceBanner')}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1"
            >
              <Package className="h-3.5 w-3.5" />
              {listingCount > 0 ? listingCount : 12} {t('kpiComptoir')}
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1"
            >
              <Activity className="h-3.5 w-3.5" />8 entreprises
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              48 000 EUR de volume
            </Badge>
          </div>
        </div>
      </div>

      {/* Section 2 -- 4 KPI Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MarketKpiCard
          icon={<Package className="h-5 w-5 text-[#1b9e77]" />}
          value={listingCount > 0 ? `${listingCount}` : '12'}
          label={t('kpiComptoir')}
        />
        <MarketKpiCard
          icon={<TrendingUp className="h-5 w-5 text-[#457b9d]" />}
          value="48 200 EUR"
          label={t('kpiVolume')}
        />
        <MarketKpiCard
          icon={<Activity className="h-5 w-5 text-[#e8943a]" />}
          value="7"
          label={t('kpiTransactions')}
        />
        <MarketKpiCard
          icon={<Leaf className="h-5 w-5 text-[#2e8b6e]" />}
          value="8.3t"
          label={t('kpiCO2Market')}
        />
      </div>

      <div className="mt-6 flex items-center justify-end">
        <Button
          render={
            <Link href="/home/marketplace/new">
              <Plus className="mr-2 h-4 w-4" />
              <Trans i18nKey="marketplace.createListing" />
            </Link>
          }
          nativeButton={false}
        />
      </div>

      {listings && listings.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing.id} className="flex flex-col">
              <ListingCard listing={listing} account="" />
              <div className="bg-card -mt-1 flex items-center gap-1.5 rounded-b-lg border border-t-0 px-5 py-2 text-xs text-[#2e8b6e]">
                <Leaf className="h-3 w-3" />
                CO₂ evite estime :{' '}
                {(((listing.quantity ?? 0) * 0.8) / 1000).toFixed(1)}t
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Search className="text-muted-foreground h-12 w-12" />
          <p className="text-muted-foreground">
            <Trans i18nKey="marketplace.noListings" />
          </p>
          <Button
            render={
              <Link href="/home/marketplace/new">
                <Plus className="mr-2 h-4 w-4" />
                <Trans i18nKey="marketplace.createFirstListing" />
              </Link>
            }
            nativeButton={false}
          />
        </div>
      )}
    </PageBody>
  );
}

function MarketKpiCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className="text-muted-foreground text-xs font-medium">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default MarketplacePage;
