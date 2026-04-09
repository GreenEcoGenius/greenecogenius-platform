import Link from 'next/link';

import {
  Activity,
  Leaf,
  Package,
  Plus,
  Search,
  TrendingUp,
} from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { ListingCard } from '~/home/_components/listing-card';

import { SectionFooterImage } from '../_components/section-footer-image';
import { SectionHeader } from '../_components/section-header';

export const generateMetadata = async () => {
  const t = await getTranslations('common');

  return { title: t('routes.marketplace') };
};

async function MarketplacePage() {
  const client = getSupabaseServerClient();
  const t = await getTranslations('marketplace');
  const locale = await getLocale();

  const { data: listings } = await client
    .from('listings')
    .select('*, material_categories(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50);

  const listingRows = listings ?? [];
  const listingCount = listingRows.length;
  const sellerCount = new Set(listingRows.map((l) => l.account_id)).size;
  const volumeEur = listingRows.reduce((sum, l) => {
    const qty = Number(l.quantity ?? 0);
    const price = l.price_per_unit != null ? Number(l.price_per_unit) : 0;
    return sum + qty * price;
  }, 0);
  const volumeLabel =
    volumeEur > 0
      ? new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }).format(volumeEur)
      : '—';

  return (
    <PageBody>
      <SectionHeader titleKey="marketplaceTitle" descKey="marketplaceDesc" />

      {/* KPI Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MarketKpiCard
          icon={<Package className="h-5 w-5 text-[#1b9e77]" />}
          value={`${listingCount}`}
          label={t('kpiComptoir')}
        />
        <MarketKpiCard
          icon={<TrendingUp className="h-5 w-5 text-[#457b9d]" />}
          value={volumeLabel}
          label={t('kpiVolume')}
        />
        <MarketKpiCard
          icon={<Activity className="h-5 w-5 text-[#e8943a]" />}
          value="—"
          label={t('kpiTransactions')}
        />
        <MarketKpiCard
          icon={<Leaf className="h-5 w-5 text-[#2e8b6e]" />}
          value="—"
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

      {listingRows.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listingRows.map((listing) => (
            <div key={listing.id} className="flex flex-col">
              <ListingCard listing={listing} account="" />
              <div className="bg-card -mt-1 flex items-center gap-1.5 rounded-b-lg border border-t-0 px-5 py-2 text-xs text-[#2e8b6e]">
                <Leaf className="h-3 w-3" />
                {t('co2AvoidedEstimated')}{' '}
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

      <SectionFooterImage
        src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Home%20Page/A_wide_cinematic_202604051229.png"
        alt="Le Comptoir Circulaire"
        className="object-[center_35%]"
      />
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
