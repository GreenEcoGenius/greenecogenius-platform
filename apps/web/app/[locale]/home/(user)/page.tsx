import Link from 'next/link';

import {
  ArrowRight,
  Leaf,
  Package,
  Recycle,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageBody } from '@kit/ui/page';

import { HomeLayoutPageHeader } from './_components/home-page-header';

export const generateMetadata = async () => {
  const t = await getTranslations('marketplace');

  return {
    title: t('myDashboard'),
  };
};

async function UserHomePage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;
  const t = await getTranslations('marketplace');
  const locale =
    (await getTranslations())('common.languageCode' as never) === 'fr'
      ? 'fr'
      : 'en';

  const [
    { count: totalActive },
    { count: mySellCount },
    { count: myBuyCount },
    { count: myCollectCount },
    { data: recentListings },
    { data: categories },
    { data: myListings },
  ] = await Promise.all([
    client
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    client
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', userId!)
      .eq('listing_type', 'sell'),
    client
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', userId!)
      .eq('listing_type', 'buy'),
    client
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', userId!)
      .eq('listing_type', 'collect'),
    client
      .from('listings')
      .select('*, material_categories(name, name_fr, slug)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5),
    client.from('material_categories').select('id, name, name_fr, slug'),
    client
      .from('listings')
      .select('*, material_categories(name, name_fr, slug)')
      .eq('account_id', userId!)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const categoryStats = (categories ?? [])
    .map((cat) => {
      const count = (recentListings ?? []).filter(
        (l: Record<string, unknown>) =>
          (l.material_categories as Record<string, unknown>)?.slug === cat.slug,
      ).length;
      return { ...cat, count };
    })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <PageBody>
      <HomeLayoutPageHeader
        title={t('myDashboard')}
        description={t('myDashboardDesc')}
      />

      <div className="flex flex-col gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<Package className="h-5 w-5 text-[#1b9e77]" />}
            label={t('totalListingsActive')}
            value={totalActive ?? 0}
            color="primary"
          />
          <StatCard
            icon={<ShoppingCart className="h-5 w-5 text-[#457b9d]" />}
            label={t('myArticles')}
            value={
              (mySellCount ?? 0) + (myBuyCount ?? 0) + (myCollectCount ?? 0)
            }
            color="info"
          />
          <StatCard
            icon={<Truck className="h-5 w-5 text-[#e8943a]" />}
            label={t('myCollections')}
            value={myCollectCount ?? 0}
            color="warning"
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-[#2e8b6e]" />}
            label={t('myPurchases')}
            value={myBuyCount ?? 0}
            color="secondary"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* My Listings */}
          <div className="bg-card rounded-xl border p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t('myArticles')}</h3>
              <Link
                href="/home/my-listings"
                className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
              >
                {t('viewAll')} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {myListings && myListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground border-b text-left">
                      <th className="pb-3 font-medium">{t('materialLabel')}</th>
                      <th className="pb-3 font-medium">{t('typeLabel')}</th>
                      <th className="pb-3 font-medium">{t('quantityLabel')}</th>
                      <th className="pb-3 font-medium">{t('priceLabel')}</th>
                      <th className="pb-3 font-medium">{t('statusLabel')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {myListings.map((listing: Record<string, unknown>) => {
                      const cat = listing.material_categories as Record<
                        string,
                        string
                      > | null;
                      return (
                        <tr
                          key={listing.id as string}
                          className="hover:bg-muted/50"
                        >
                          <td className="py-3">
                            <div>
                              <p className="font-medium">
                                {listing.title as string}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {locale === 'fr' ? cat?.name_fr : cat?.name}
                              </p>
                            </div>
                          </td>
                          <td className="py-3">
                            <TypeBadge
                              type={listing.listing_type as string}
                              t={t}
                            />
                          </td>
                          <td className="py-3">
                            {listing.quantity as number}{' '}
                            {listing.unit as string}
                          </td>
                          <td className="py-3">
                            {listing.price_per_unit
                              ? `€${listing.price_per_unit}/${listing.unit as string}`
                              : t('negotiable')}
                          </td>
                          <td className="py-3">
                            <StatusBadge
                              status={listing.status as string}
                              t={t}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                <Recycle className="mb-3 h-10 w-10 opacity-40" />
                <p>{t('noListingsYet')}</p>
                <Link
                  href="/home/marketplace/new"
                  className="text-primary mt-3 text-sm font-medium hover:underline"
                >
                  {t('createListing')}{' '}
                  <ArrowRight className="ml-1 inline h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar: Categories + Carbon */}
          <div className="flex flex-col gap-6">
            {/* Top Categories */}
            <div className="bg-card rounded-xl border p-6">
              <h3 className="mb-4 text-lg font-semibold">
                {t('topCategories')}
              </h3>
              {categoryStats.length > 0 ? (
                <div className="space-y-3">
                  {categoryStats.slice(0, 5).map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">
                        {locale === 'fr' ? cat.name_fr : cat.name}
                      </span>
                      <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {t('noListingsYet')}
                </p>
              )}
            </div>

            {/* Carbon Metrics */}
            <div className="bg-card rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Leaf className="text-primary h-5 w-5" />
                {t('carbonMetrics')}
              </h3>
              <div className="space-y-4">
                <MetricRow
                  label={t('totalCO2Offset')}
                  value="—"
                  icon={<TrendingUp className="h-4 w-4 text-[#1b9e77]" />}
                />
                <MetricRow
                  label={t('renewedMaterials')}
                  value="—"
                  icon={<Recycle className="h-4 w-4 text-[#2e8b6e]" />}
                />
                <MetricRow
                  label={t('avgLogisticsImpact')}
                  value="—"
                  icon={<Truck className="h-4 w-4 text-[#e8943a]" />}
                />
              </div>
              <p className="text-muted-foreground mt-4 text-xs italic">
                {locale === 'fr'
                  ? 'Les métriques carbone seront calculées automatiquement à mesure que vous utilisez la plateforme.'
                  : 'Carbon metrics will be calculated automatically as you use the platform.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageBody>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const bgMap: Record<string, string> = {
    primary: 'bg-card',
    info: 'bg-card',
    warning: 'bg-card',
    secondary: 'bg-card',
  };

  return (
    <div className={`rounded-xl border p-5 ${bgMap[color] ?? ''}`}>
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className="text-muted-foreground text-xs font-medium">
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function TypeBadge({ type, t }: { type: string; t: (key: string) => string }) {
  const styles: Record<string, string> = {
    sell: 'bg-[#1b9e77]/10 text-[#1b9e77] dark:bg-[#1b9e77]/20 dark:text-[#2e8b6e]',
    buy: 'bg-[#457b9d]/10 text-[#457b9d] dark:bg-[#457b9d]/20 dark:text-[#5a9abf]',
    collect:
      'bg-[#e8943a]/10 text-[#c47a2a] dark:bg-[#e8943a]/20 dark:text-[#e8943a]',
  };

  const labels: Record<string, string> = {
    sell: t('typeSell'),
    buy: t('typeBuy'),
    collect: t('typeCollect'),
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[type] ?? ''}`}
    >
      {labels[type] ?? type}
    </span>
  );
}

function StatusBadge({
  status,
  t,
}: {
  status: string;
  t: (key: string) => string;
}) {
  const styles: Record<string, string> = {
    active:
      'bg-[#1b9e77]/10 text-[#1b9e77] dark:bg-[#1b9e77]/20 dark:text-[#2e8b6e]',
    sold: 'bg-[#6b7d8e]/10 text-[#4a5c6b] dark:bg-[#6b7d8e]/20 dark:text-[#7a9bb0]',
    expired:
      'bg-[#e63946]/10 text-[#e63946] dark:bg-[#e63946]/20 dark:text-[#e63946]',
    draft:
      'bg-[#e8943a]/10 text-[#c47a2a] dark:bg-[#e8943a]/20 dark:text-[#e8943a]',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? ''}`}
    >
      {t(`status.${status}`)}
    </span>
  );
}

function MetricRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default UserHomePage;
