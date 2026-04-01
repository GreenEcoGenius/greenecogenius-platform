import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle,
  Leaf,
  Link2,
  Recycle,
  Shield,
  ShoppingCart,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Card, CardContent } from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';

import { KpiCard, KpiCardGrid } from './_components/kpi-card';
import { SectionFooterImage } from './_components/section-footer-image';

export const generateMetadata = async () => {
  const t = await getTranslations('marketplace');
  return { title: t('myDashboard') };
};

async function UserHomePage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) return null;

  const t = await getTranslations('marketplace');

  const [
    { count: totalActive },
    { count: mySellCount },
    { count: myBuyCount },
    { count: myCollectCount },
    { data: myListings },
  ] = await Promise.all([
    client
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    client
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', userId)
      .eq('listing_type', 'sell'),
    client
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', userId)
      .eq('listing_type', 'buy'),
    client
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', userId)
      .eq('listing_type', 'collect'),
    client
      .from('listings')
      .select('*, material_categories(name, name_fr, slug)')
      .eq('account_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return (
    <PageBody>
      <div className="space-y-8">
        {/* 3 KPI Cards */}
        <KpiCardGrid>
          <KpiCard
            variant="teal"
            title={t('dashboard.marketplace')}
            value={`${totalActive ?? 0}`}
            subtitle={t('dashboard.activeListings')}
            icon={<Store className="h-6 w-6 text-white" />}
            metrics={[
              { label: t('dashboard.mySales'), value: `${mySellCount ?? 0}` },
              {
                label: t('dashboard.myPurchases'),
                value: `${myBuyCount ?? 0}`,
              },
              {
                label: t('dashboard.collections'),
                value: `${myCollectCount ?? 0}`,
              },
            ]}
            actionLabel={t('dashboard.leComptoir')}
            actionHref="/home/marketplace"
          />
          <KpiCard
            variant="emerald"
            title={t('dashboard.environmentalImpact')}
            value="545.5 t"
            subtitle={t('dashboard.co2Avoided')}
            icon={<Leaf className="h-6 w-6 text-white" />}
            metrics={[
              { label: t('dashboard.tonsRecycled'), value: '306.6 t' },
              { label: t('dashboard.tracedLots'), value: '30' },
              { label: t('dashboard.circularityScore'), value: '67%' },
            ]}
            actionLabel={t('dashboard.carbonImpact')}
            actionHref="/home/carbon"
          />
          <KpiCard
            variant="green"
            title={t('dashboard.compliance')}
            value="78%"
            subtitle={t('dashboard.globalScore')}
            icon={<Shield className="h-6 w-6 text-white" />}
            metrics={[
              { label: t('dashboard.compliantStandards'), value: '28/42' },
              { label: t('dashboard.rseScore'), value: '62/100' },
              { label: t('dashboard.esgReporting'), value: '72%' },
            ]}
            actionLabel={t('dashboard.complianceAction')}
            actionHref="/home/compliance"
          />
        </KpiCardGrid>

        {/* Content grid: Quick actions + Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold">
                    <Sparkles className="mr-2 inline h-4 w-4 text-emerald-500" />
                    {t('dashboard.recommendedActions')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ActionCard
                    icon={<BarChart3 className="h-5 w-5 text-teal-600" />}
                    title={t('dashboard.completeScope3')}
                    description={t('dashboard.completeScope3Desc')}
                    href="/home/esg/wizard?step=3"
                    badge={t('dashboard.highImpact')}
                    badgeColor="bg-slate-100 text-slate-700"
                  />
                  <ActionCard
                    icon={<Recycle className="h-5 w-5 text-emerald-600" />}
                    title={t('dashboard.publishListing')}
                    description={t('dashboard.publishListingDesc')}
                    href="/home/marketplace/new"
                    badge={t('dashboard.recommended')}
                    badgeColor="bg-emerald-100 text-emerald-700"
                  />
                  <ActionCard
                    icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                    title={t('dashboard.improveRseScore')}
                    description={t('dashboard.improveRseScoreDesc')}
                    href="/home/rse/roadmap"
                    badge="+8 pts"
                    badgeColor="bg-teal-100 text-teal-700"
                  />
                  <ActionCard
                    icon={<Link2 className="h-5 w-5 text-teal-600" />}
                    title={t('dashboard.issueCertificates')}
                    description={t('dashboard.issueCertificatesDesc')}
                    href="/home/traceability"
                    badge={t('dashboard.fiveLots')}
                    badgeColor="bg-teal-100 text-teal-700"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold">
                    <Bell className="mr-2 inline h-4 w-4 text-slate-400" />
                    {t('dashboard.recentActivity')}
                  </h2>
                </div>

                <div className="space-y-0 divide-y">
                  <ActivityItem
                    icon={<CheckCircle className="h-4 w-4 text-emerald-500" />}
                    text={t('dashboard.activityLotCertified')}
                    time={t('dashboard.time2h')}
                  />
                  <ActivityItem
                    icon={<ShoppingCart className="h-4 w-4 text-teal-500" />}
                    text={t('dashboard.activityOfferReceived')}
                    time={t('dashboard.time5h')}
                  />
                  <ActivityItem
                    icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                    text={t('dashboard.activityRseScore')}
                    time={t('dashboard.timeYesterday')}
                  />
                  <ActivityItem
                    icon={<Leaf className="h-4 w-4 text-emerald-500" />}
                    text={t('dashboard.activityCarbonCredit')}
                    time={t('dashboard.timeYesterday')}
                  />
                  <ActivityItem
                    icon={<Users className="h-4 w-4 text-teal-500" />}
                    text={t('dashboard.activityNetworkJoin')}
                    time={t('dashboard.time3d')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Listings */}
        {myListings && myListings.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">{t('myArticles')}</h2>
                <Link
                  href="/home/my-listings"
                  className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  {t('viewAll')} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground border-b text-left text-xs font-semibold tracking-wider uppercase">
                      <th className="pb-3">{t('materialLabel')}</th>
                      <th className="pb-3">{t('typeLabel')}</th>
                      <th className="pb-3">{t('quantityLabel')}</th>
                      <th className="pb-3">{t('statusLabel')}</th>
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
                            <p className="font-medium">
                              {listing.title as string}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {cat?.name_fr ?? cat?.name}
                            </p>
                          </td>
                          <td className="py-3">
                            <TypeBadge
                              type={listing.listing_type as string}
                              label={
                                {
                                  sell: t('dashboard.typeSell'),
                                  buy: t('dashboard.typeBuy'),
                                  collect: t('dashboard.typeCollect'),
                                }[listing.listing_type as string] ??
                                (listing.listing_type as string)
                              }
                            />
                          </td>
                          <td className="py-3 text-xs">
                            {listing.quantity as number}{' '}
                            {listing.unit as string}
                          </td>
                          <td className="py-3">
                            <StatusBadge
                              status={listing.status as string}
                              label={
                                {
                                  active: t('dashboard.statusActive'),
                                  draft: t('dashboard.statusDraft'),
                                  sold: t('dashboard.statusSold'),
                                  expired: t('dashboard.statusExpired'),
                                }[listing.status as string] ??
                                (listing.status as string)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <SectionFooterImage
          src="/images/normes/circular-infinity-aerial.png"
          alt={t('dashboard.circularEconomy')}
        />
      </div>
    </PageBody>
  );
}

function ActionCard({
  icon,
  title,
  description,
  href,
  badge,
  badgeColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <Link
      href={href}
      className="group flex gap-3 rounded-lg border p-4 transition-all hover:shadow-sm"
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{title}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColor}`}
          >
            {badge}
          </span>
        </div>
        <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
      </div>
      <ArrowRight className="text-muted-foreground h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

function ActivityItem({
  icon,
  text,
  time,
}: {
  icon: React.ReactNode;
  text: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="shrink-0">{icon}</div>
      <p className="flex-1 text-sm">{text}</p>
      <span className="text-muted-foreground shrink-0 text-xs">{time}</span>
    </div>
  );
}

function TypeBadge({ type, label }: { type: string; label: string }) {
  const styles: Record<string, string> = {
    sell: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    buy: 'bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400',
    collect: 'bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[type] ?? ''}`}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const styles: Record<string, string> = {
    active:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    sold: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
    expired:
      'bg-slate-100 text-slate-600 dark:bg-slate-950/30 dark:text-slate-400',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? ''}`}
    >
      {label}
    </span>
  );
}

export default UserHomePage;
