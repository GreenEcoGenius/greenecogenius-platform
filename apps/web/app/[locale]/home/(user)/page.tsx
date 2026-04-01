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
            title="Marketplace"
            value={`${totalActive ?? 0}`}
            subtitle="annonces actives"
            icon={<Store className="h-6 w-6 text-white" />}
            metrics={[
              { label: 'Mes ventes', value: `${mySellCount ?? 0}` },
              { label: 'Mes achats', value: `${myBuyCount ?? 0}` },
              { label: 'Collectes', value: `${myCollectCount ?? 0}` },
            ]}
            actionLabel="Le Comptoir"
            actionHref="/home/marketplace"
          />
          <KpiCard
            variant="emerald"
            title="Impact Environnemental"
            value="545.5 t"
            subtitle="CO2 evite"
            icon={<Leaf className="h-6 w-6 text-white" />}
            metrics={[
              { label: 'Tonnes recyclees', value: '306.6 t' },
              { label: 'Lots traces', value: '30' },
              { label: 'Score circularite', value: '67%' },
            ]}
            actionLabel="Impact Carbone"
            actionHref="/home/carbon"
          />
          <KpiCard
            variant="green"
            title="Conformite"
            value="78%"
            subtitle="score global"
            icon={<Shield className="h-6 w-6 text-white" />}
            metrics={[
              { label: 'Normes conformes', value: '28/42' },
              { label: 'Score RSE', value: '62/100' },
              { label: 'Reporting ESG', value: '72%' },
            ]}
            actionLabel="Conformite"
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
                    Actions recommandees
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ActionCard
                    icon={<BarChart3 className="h-5 w-5 text-teal-600" />}
                    title="Completer le Scope 3"
                    description="4 categories manquantes dans votre bilan carbone"
                    href="/home/esg/wizard?step=3"
                    badge="Impact eleve"
                    badgeColor="bg-slate-100 text-slate-700"
                  />
                  <ActionCard
                    icon={<Recycle className="h-5 w-5 text-emerald-600" />}
                    title="Publier une annonce"
                    description="Valorisez vos dechets sur Le Comptoir"
                    href="/home/marketplace/new"
                    badge="Recommande"
                    badgeColor="bg-emerald-100 text-emerald-700"
                  />
                  <ActionCard
                    icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                    title="Ameliorer le score RSE"
                    description="3 actions prioritaires identifiees par l'IA"
                    href="/home/rse/roadmap"
                    badge="+8 pts"
                    badgeColor="bg-teal-100 text-teal-700"
                  />
                  <ActionCard
                    icon={<Link2 className="h-5 w-5 text-teal-600" />}
                    title="Emettre des certificats"
                    description="5 lots prets pour la certification blockchain"
                    href="/home/traceability"
                    badge="5 lots"
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
                    Activite recente
                  </h2>
                </div>

                <div className="space-y-0 divide-y">
                  <ActivityItem
                    icon={<CheckCircle className="h-4 w-4 text-emerald-500" />}
                    text="Lot #2847 certifie blockchain"
                    time="2h"
                  />
                  <ActivityItem
                    icon={<ShoppingCart className="h-4 w-4 text-teal-500" />}
                    text="Offre recue : 50t carton ondule"
                    time="5h"
                  />
                  <ActivityItem
                    icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                    text="Score RSE : 62/100 (+3 pts)"
                    time="Hier"
                  />
                  <ActivityItem
                    icon={<Leaf className="h-4 w-4 text-emerald-500" />}
                    text="Credit carbone : 12.4t CO2eq"
                    time="Hier"
                  />
                  <ActivityItem
                    icon={<Users className="h-4 w-4 text-teal-500" />}
                    text="EcoRecycle SAS a rejoint le reseau"
                    time="3j"
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
                            <TypeBadge type={listing.listing_type as string} />
                          </td>
                          <td className="py-3 text-xs">
                            {listing.quantity as number}{' '}
                            {listing.unit as string}
                          </td>
                          <td className="py-3">
                            <StatusBadge status={listing.status as string} />
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
          alt="Economie circulaire"
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

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    sell: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    buy: 'bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400',
    collect:
      'bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400',
  };
  const labels: Record<string, string> = {
    sell: 'Vente',
    buy: 'Achat',
    collect: 'Collecte',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[type] ?? ''}`}
    >
      {labels[type] ?? type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    sold: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
    expired: 'bg-slate-100 text-slate-600 dark:bg-slate-950/30 dark:text-slate-400',
  };
  const labels: Record<string, string> = {
    active: 'Actif',
    draft: 'Brouillon',
    sold: 'Vendu',
    expired: 'Expire',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? ''}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default UserHomePage;
