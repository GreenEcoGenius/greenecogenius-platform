import Link from 'next/link';

import { Activity, Inbox, Leaf, Package, Plus, TrendingUp } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  EnviroDashboardSectionHeader,
  EnviroEmptyState,
  EnviroStatCard,
  EnviroStatCardGrid,
} from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';

import { EnviroListingCard } from './_components/enviro-listing-card';

export const generateMetadata = async () => {
  const t = await getTranslations('common');

  return { title: t('routes.marketplace') };
};

async function MarketplacePage() {
  const client = getSupabaseServerClient();
  const t = await getTranslations('marketplace');
  const tDashboard = await getTranslations('dashboard');
  const tCommon = await getTranslations('common');
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
      : '-';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.marketplace')}
        title={tDashboard('marketplaceTitle')}
        subtitle={tDashboard('marketplaceDesc')}
        actions={
          <EnviroButton
            variant="primary"
            size="sm"
            magnetic
            render={(buttonProps) => (
              <Link {...buttonProps} href="/home/marketplace/new">
                <Plus aria-hidden="true" className="h-4 w-4" />
                {t('createListing')}
              </Link>
            )}
          />
        }
      />

      <EnviroStatCardGrid cols={4}>
        <EnviroStatCard
          variant="forest"
          label={t('kpiComptoir')}
          value={listingCount}
          icon={<Package aria-hidden="true" className="h-5 w-5" />}
        />
        <EnviroStatCard
          variant="cream"
          label={t('kpiVolume')}
          valueDisplay={
            <span className="tabular-nums">{volumeLabel}</span>
          }
          icon={<TrendingUp aria-hidden="true" className="h-5 w-5" />}
        />
        <EnviroStatCard
          variant="cream"
          label={t('kpiTransactions')}
          valueDisplay={
            <span className="tabular-nums">{sellerCount > 0 ? sellerCount : '-'}</span>
          }
          subtitle={t('totalSellers')}
          icon={<Activity aria-hidden="true" className="h-5 w-5" />}
        />
        <EnviroStatCard
          variant="lime"
          label={t('kpiCO2Market')}
          valueDisplay={<span className="tabular-nums">-</span>}
          icon={<Leaf aria-hidden="true" className="h-5 w-5" />}
        />
      </EnviroStatCardGrid>

      {listingRows.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listingRows.map((listing) => (
            <EnviroListingCard
              key={listing.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              listing={listing as any}
              showCo2Footer
            />
          ))}
        </div>
      ) : (
        <EnviroEmptyState
          icon={<Package aria-hidden="true" className="h-7 w-7" />}
          tag={tCommon('routes.marketplace')}
          title={t('noListings')}
          actions={
            <EnviroButton
              variant="primary"
              size="sm"
              magnetic
              render={(buttonProps) => (
                <Link {...buttonProps} href="/home/marketplace/new">
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  {t('createFirstListing')}
                </Link>
              )}
            />
          }
        />
      )}
    </div>
  );
}

export default MarketplacePage;
