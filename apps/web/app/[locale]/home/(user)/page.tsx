import Link from 'next/link';

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle,
  FileCheck,
  Leaf,
  Link2,
  Package,
  Recycle,
  Shield,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Badge } from '@kit/ui/badge';
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

  const myTotalListings =
    (mySellCount ?? 0) + (myBuyCount ?? 0) + (myCollectCount ?? 0);

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
      <HomeLayoutPageHeader title="Le Comptoir Circulaire" description="" />

      <div className="flex flex-col gap-8">
        {/* Section 1 -- Welcome Banner */}
        <div className="from-primary/10 via-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent p-8">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold md:text-3xl">
              {t('welcomeTitle')} 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              {t('ecosystemActive')}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-3 py-1"
              >
                <Package className="h-3.5 w-3.5" />
                {myTotalListings} {locale === 'fr' ? 'annonces' : 'listings'}
              </Badge>
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-3 py-1"
              >
                <Leaf className="h-3.5 w-3.5" />
                545.5t CO₂ {locale === 'fr' ? 'evite' : 'avoided'}
              </Badge>
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-3 py-1"
              >
                <Link2 className="h-3.5 w-3.5" />
                30 {locale === 'fr' ? 'lots traces' : 'traced lots'}
              </Badge>
            </div>
          </div>
          <div className="absolute -top-8 -right-8 opacity-5">
            <Recycle className="h-48 w-48" />
          </div>
        </div>

        {/* Section 2 -- 6 KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <KpiCard
            href="/home/marketplace"
            icon={<ShoppingCart className="h-5 w-5" />}
            value={`${myTotalListings > 0 ? myTotalListings : 2}`}
            label={t('kpiComptoir')}
            color="emerald"
          />
          <KpiCard
            href="/home/traceability"
            icon={<Link2 className="h-5 w-5" />}
            value="30"
            label={t('kpiLots')}
            color="blue"
          />
          <KpiCard
            href="/home/carbon"
            icon={<Leaf className="h-5 w-5" />}
            value="545.5t"
            label={t('kpiCO2')}
            color="green"
          />
          <KpiCard
            href="/home/esg"
            icon={<BarChart3 className="h-5 w-5" />}
            value="72%"
            label={t('kpiReporting')}
            color="purple"
          />
          <KpiCard
            href="/home/rse"
            icon={<TrendingUp className="h-5 w-5" />}
            value="62/100"
            label={t('kpiRSE')}
            color="amber"
          />
          <KpiCard
            href="/home/compliance"
            icon={<Shield className="h-5 w-5" />}
            value="78%"
            label={t('kpiCompliance')}
            sublabel="28/42"
            color="teal"
          />
        </div>

        {/* Section 3 -- Existing Listings Table */}
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
                  value="545.5t"
                  icon={<TrendingUp className="h-4 w-4 text-[#1b9e77]" />}
                />
                <MetricRow
                  label={t('renewedMaterials')}
                  value="1 240t"
                  icon={<Recycle className="h-4 w-4 text-[#2e8b6e]" />}
                />
                <MetricRow
                  label={t('avgLogisticsImpact')}
                  value="12.3 kg/t"
                  icon={<Truck className="h-4 w-4 text-[#e8943a]" />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 -- AI Recommended Actions */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="text-primary h-5 w-5" />
            {t('aiActions')}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ActionCard
              icon={<FileCheck className="h-5 w-5 text-[#1b9e77]" />}
              title={
                locale === 'fr'
                  ? '3 certificats a emettre'
                  : '3 certificates to emit'
              }
              description={
                locale === 'fr'
                  ? 'Des lots termines attendent leur certificat de tracabilite blockchain.'
                  : 'Completed lots are waiting for their blockchain traceability certificate.'
              }
              href="/home/traceability"
            />
            <ActionCard
              icon={<BarChart3 className="h-5 w-5 text-[#457b9d]" />}
              title={
                locale === 'fr' ? 'ESG a completer' : 'ESG report to complete'
              }
              description={
                locale === 'fr'
                  ? 'Votre reporting ESG Q1 2026 est a 72%. Finalisez les indicateurs manquants.'
                  : 'Your Q1 2026 ESG report is at 72%. Finalize the missing indicators.'
              }
              href="/home/esg"
            />
            <ActionCard
              icon={<Zap className="h-5 w-5 text-[#e8943a]" />}
              title={
                locale === 'fr'
                  ? 'Opportunite de matching'
                  : 'Matching opportunity'
              }
              description={
                locale === 'fr'
                  ? 'Un acheteur recherche 200t de PET recycle correspondant a votre stock.'
                  : 'A buyer is looking for 200t of recycled PET matching your stock.'
              }
              href="/home/marketplace"
            />
            <ActionCard
              icon={<AlertTriangle className="h-5 w-5 text-[#e63946]" />}
              title={
                locale === 'fr'
                  ? 'Alerte conformite RGPD'
                  : 'GDPR compliance alert'
              }
              description={
                locale === 'fr'
                  ? "2 sous-traitants n'ont pas signe leur DPA. Action requise avant le 15/04."
                  : '2 subcontractors have not signed their DPA. Action required before 04/15.'
              }
              href="/home/compliance"
            />
          </div>
        </div>

        {/* Section 5 -- Recent Activity Feed */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Bell className="text-primary h-5 w-5" />
            {t('recentActivity')}
          </h3>
          <div className="bg-card divide-y rounded-xl border">
            <ActivityItem
              icon={<CheckCircle className="h-4 w-4 text-[#1b9e77]" />}
              text={
                locale === 'fr'
                  ? 'Lot #2847 certifie sur la blockchain Polygon'
                  : 'Lot #2847 certified on Polygon blockchain'
              }
              time={locale === 'fr' ? 'Il y a 2h' : '2h ago'}
            />
            <ActivityItem
              icon={<ShoppingCart className="h-4 w-4 text-[#457b9d]" />}
              text={
                locale === 'fr'
                  ? 'Nouvelle offre recue pour 50t de carton ondule'
                  : 'New offer received for 50t of corrugated cardboard'
              }
              time={locale === 'fr' ? 'Il y a 5h' : '5h ago'}
            />
            <ActivityItem
              icon={<TrendingUp className="h-4 w-4 text-[#2e8b6e]" />}
              text={
                locale === 'fr'
                  ? 'Score RSE mis a jour : 62/100 (+3 points)'
                  : 'RSE score updated: 62/100 (+3 points)'
              }
              time={locale === 'fr' ? 'Hier' : 'Yesterday'}
            />
            <ActivityItem
              icon={<Leaf className="h-4 w-4 text-[#1b9e77]" />}
              text={
                locale === 'fr'
                  ? 'Credit carbone genere : 12.4t CO₂eq pour le lot #2841'
                  : 'Carbon credit generated: 12.4t CO₂eq for lot #2841'
              }
              time={locale === 'fr' ? 'Hier' : 'Yesterday'}
            />
            <ActivityItem
              icon={<Users className="h-4 w-4 text-[#457b9d]" />}
              text={
                locale === 'fr'
                  ? 'EcoRecycle SAS a rejoint votre reseau fournisseurs'
                  : 'EcoRecycle SAS joined your supplier network'
              }
              time={locale === 'fr' ? 'Il y a 3j' : '3d ago'}
            />
          </div>
        </div>
      </div>
    </PageBody>
  );
}

/* ---------- Sub-components ---------- */

function KpiCard({
  href,
  icon,
  value,
  label,
  sublabel,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel?: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: 'border-[#1b9e77]/30 hover:border-[#1b9e77]/60',
    blue: 'border-[#457b9d]/30 hover:border-[#457b9d]/60',
    green: 'border-[#2e8b6e]/30 hover:border-[#2e8b6e]/60',
    purple: 'border-[#7c3aed]/30 hover:border-[#7c3aed]/60',
    amber: 'border-[#e8943a]/30 hover:border-[#e8943a]/60',
    teal: 'border-[#0d9488]/30 hover:border-[#0d9488]/60',
  };

  const iconColorMap: Record<string, string> = {
    emerald: 'text-[#1b9e77] bg-[#1b9e77]/10',
    blue: 'text-[#457b9d] bg-[#457b9d]/10',
    green: 'text-[#2e8b6e] bg-[#2e8b6e]/10',
    purple: 'text-[#7c3aed] bg-[#7c3aed]/10',
    amber: 'text-[#e8943a] bg-[#e8943a]/10',
    teal: 'text-[#0d9488] bg-[#0d9488]/10',
  };

  return (
    <Link
      href={href}
      className={`bg-card group rounded-xl border-2 p-5 transition-all hover:shadow-md ${colorMap[color] ?? ''}`}
    >
      <div
        className={`mb-3 inline-flex rounded-lg p-2 ${iconColorMap[color] ?? ''}`}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sublabel && <p className="text-muted-foreground text-xs">{sublabel}</p>}
      <p className="text-muted-foreground mt-1 text-sm">{label}</p>
      <div className="text-primary mt-2 flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

function ActionCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-card group rounded-xl border p-5 transition-all hover:shadow-md"
    >
      <div className="mb-3">{icon}</div>
      <h4 className="group-hover:text-primary text-sm font-semibold">
        {title}
      </h4>
      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
        {description}
      </p>
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
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex-shrink-0">{icon}</div>
      <p className="flex-1 text-sm">{text}</p>
      <span className="text-muted-foreground flex-shrink-0 text-xs">
        {time}
      </span>
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
