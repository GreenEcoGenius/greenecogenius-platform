import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  Bell,
  Leaf,
  Link2,
  Recycle,
  Shield,
  Sparkles,
  Store,
  TrendingUp,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = client as any;

  const [
    { count: totalActive },
    { count: mySellCount },
    { count: myBuyCount },
    { count: myCollectCount },
    { data: myListings },
    { data: carbonRows },
    { count: blockchainCount },
    { count: certCount },
    { data: complianceRows },
  ] = await Promise.all([
    c.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    c.from('listings').select('*', { count: 'exact', head: true }).eq('account_id', userId).eq('listing_type', 'sell'),
    c.from('listings').select('*', { count: 'exact', head: true }).eq('account_id', userId).eq('listing_type', 'buy'),
    c.from('listings').select('*', { count: 'exact', head: true }).eq('account_id', userId).eq('listing_type', 'collect'),
    c.from('listings').select('*, material_categories(name, name_fr, slug)').eq('account_id', userId).order('created_at', { ascending: false }).limit(5),
    c.from('carbon_records').select('co2_avoided, weight_kg').eq('account_id', userId),
    c.from('blockchain_records').select('*', { count: 'exact', head: true }),
    c.from('traceability_certificates').select('*', { count: 'exact', head: true }).eq('issued_to_account_id', userId),
    c.from('account_norm_compliance').select('status').eq('account_id', userId),
  ]);

  const co2AvoidedKg = (carbonRows ?? []).reduce(
    (sum: number, r: { co2_avoided?: number }) => sum + Number(r.co2_avoided ?? 0), 0,
  );
  const tonnesRecycled = (carbonRows ?? []).reduce(
    (sum: number, r: { weight_kg?: number }) => sum + Number(r.weight_kg ?? 0), 0,
  ) / 1000;
  const co2AvoidedT = Math.round((co2AvoidedKg / 1000) * 10) / 10;
  const tonnesRecycledT = Math.round(tonnesRecycled * 10) / 10;

  const complianceList = (complianceRows ?? []) as Array<{ status: string }>;
  const normsCompliant = complianceList.filter((r) => r.status === 'compliant').length;
  const normsTotal = complianceList.length;
  const complianceScore = normsTotal > 0 ? Math.round((normsCompliant / normsTotal) * 100) : 0;

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
            value={`${co2AvoidedT} t`}
            subtitle={t('dashboard.co2Avoided')}
            icon={<Leaf className="h-6 w-6 text-white" />}
            metrics={[
              { label: t('dashboard.tonsRecycled'), value: `${tonnesRecycledT} t` },
              { label: t('dashboard.tracedLots'), value: `${blockchainCount ?? 0}` },
              { label: t('dashboard.circularityScore'), value: `${certCount ?? 0} cert.` },
            ]}
            actionLabel={t('dashboard.carbonImpact')}
            actionHref="/home/carbon"
          />
          <KpiCard
            variant="green"
            title={t('dashboard.compliance')}
            value={normsTotal > 0 ? `${complianceScore}%` : '—'}
            subtitle={t('dashboard.globalScore')}
            icon={<Shield className="h-6 w-6 text-white" />}
            metrics={[
              { label: t('dashboard.compliantStandards'), value: normsTotal > 0 ? `${normsCompliant}/${normsTotal}` : '—' },
              { label: t('dashboard.rseScore'), value: '—' },
              { label: t('dashboard.esgReporting'), value: '—' },
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
                    <Sparkles className="text-circuit-cyan mr-2 inline h-4 w-4" />
                    {t('dashboard.recommendedActions')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ActionCard
                    icon={<BarChart3 className="text-circuit-blue h-5 w-5" />}
                    title={t('dashboard.completeScope3')}
                    description={t('dashboard.completeScope3Desc')}
                    href="/home/esg/wizard?step=3"
                    badge={t('dashboard.highImpact')}
                    badgeColor="bg-metal-frost text-metal-700"
                  />
                  <ActionCard
                    icon={<Recycle className="text-primary h-5 w-5" />}
                    title={t('dashboard.publishListing')}
                    description={t('dashboard.publishListingDesc')}
                    href="/home/marketplace/new"
                    badge={t('dashboard.recommended')}
                    badgeColor="bg-tech-mint text-tech-emerald"
                  />
                  <ActionCard
                    icon={<TrendingUp className="text-tech-neon h-5 w-5" />}
                    title={t('dashboard.improveRseScore')}
                    description={t('dashboard.improveRseScoreDesc')}
                    href="/home/rse/roadmap"
                    badge={t('dashboard.highImpact')}
                    badgeColor="bg-circuit-ice text-circuit-blue"
                  />
                  <ActionCard
                    icon={<Link2 className="text-circuit-blue h-5 w-5" />}
                    title={t('dashboard.issueCertificates')}
                    description={t('dashboard.issueCertificatesDesc')}
                    href="/home/traceability"
                    badge={t('dashboard.fiveLots')}
                    badgeColor="bg-circuit-ice text-circuit-blue"
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
                    <Bell className="text-metal-steel mr-2 inline h-4 w-4" />
                    {t('dashboard.recentActivity')}
                  </h2>
                </div>

                <div className="text-metal-500 flex flex-col items-center py-8 text-center text-sm">
                  <Bell className="text-metal-300 mb-3 h-8 w-8" />
                  <p>{t('dashboard.noActivityYet')}</p>
                  <p className="text-metal-400 mt-1 text-xs">
                    {t('dashboard.noActivityDesc')}
                  </p>
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
                    <tr className="border-metal-chrome text-metal-700 border-b text-left text-xs font-semibold tracking-wider uppercase">
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
                          className="hover:bg-metal-50"
                        >
                          <td className="py-3">
                            <p className="font-medium">
                              {listing.title as string}
                            </p>
                            <p className="text-metal-500 text-xs">
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
          src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-691ab3f4-2772-42cc-ae8b-5f039dee20c9.png"
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
      className="group border-metal-chrome flex gap-3 rounded-xl border p-4 transition-all duration-200 hover:shadow-sm"
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
        <p className="text-metal-500 mt-0.5 text-xs">{description}</p>
      </div>
      <ArrowRight className="text-metal-steel h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}


function TypeBadge({ type, label }: { type: string; label: string }) {
  const styles: Record<string, string> = {
    sell: 'bg-tech-mint text-tech-emerald',
    buy: 'bg-circuit-ice text-circuit-blue',
    collect: 'bg-badge-amber-bg text-badge-amber-text',
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
    active: 'bg-tech-mint text-tech-emerald',
    draft: 'bg-metal-frost text-metal-steel',
    sold: 'bg-circuit-ice text-circuit-blue',
    expired: 'bg-metal-frost text-metal-steel',
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
