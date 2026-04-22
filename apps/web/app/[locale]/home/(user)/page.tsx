import Link from 'next/link';

import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  ClipboardList,
  Leaf,
  Link2,
  Recycle,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
} from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  EnviroDashboardSectionHeader,
  EnviroEmptyState,
  EnviroStatCard,
  EnviroStatCardGrid,
} from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
} from '~/components/enviro/enviro-card';
import { loadUserWorkspace } from './_lib/server/load-user-workspace';

import { EnviroListingCard } from './marketplace/_components/enviro-listing-card';

export const generateMetadata = async () => {
  const t = await getTranslations('marketplace');
  return { title: t('myDashboard') };
};

async function UserHomePage() {
  const client = getSupabaseServerClient();
  const t = await getTranslations('marketplace');
  const tDashboard = await getTranslations('dashboard');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();

  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) return null;

  // Best-effort greeting derived from the workspace name (account display
  // name) so it works for both personal and team-mode setups. We do not
  // touch loadUserWorkspace which is a cached READ-ONLY loader.
  let greetingName: string | null = null;
  try {
    const workspace = await loadUserWorkspace();
    greetingName = workspace.workspace?.name?.trim()?.split(/\s+/)[0] ?? null;
  } catch {
    greetingName = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = client as any;

  // Same 8 KPI Promise.all the legacy page issued. Byte-identical.
  const [
    { count: totalActive },
    { count: mySellCount },
    { count: myCollectCount },
    { data: myListings },
    { data: carbonRows },
    { count: blockchainCount },
    { count: certCount },
    { data: complianceRows },
  ] = await Promise.all([
    c
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    c
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', userId)
      .eq('listing_type', 'sell'),
    c
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', userId)
      .eq('listing_type', 'collect'),
    c
      .from('listings')
      .select('*, material_categories(name, name_fr, slug)')
      .eq('account_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    c
      .from('carbon_records')
      .select('co2_avoided, weight_kg')
      .eq('account_id', userId),
    c.from('blockchain_records').select('*', { count: 'exact', head: true }),
    c
      .from('traceability_certificates')
      .select('*', { count: 'exact', head: true })
      .eq('issued_to_account_id', userId),
    c.from('account_norm_compliance').select('status').eq('account_id', userId),
  ]);

  const co2AvoidedKg = (carbonRows ?? []).reduce(
    (sum: number, r: { co2_avoided?: number }) =>
      sum + Number(r.co2_avoided ?? 0),
    0,
  );
  const tonnesRecycled =
    (carbonRows ?? []).reduce(
      (sum: number, r: { weight_kg?: number }) =>
        sum + Number(r.weight_kg ?? 0),
      0,
    ) / 1000;
  const co2AvoidedT = Math.round((co2AvoidedKg / 1000) * 10) / 10;
  const tonnesRecycledT = Math.round(tonnesRecycled * 10) / 10;

  const complianceList = (complianceRows ?? []) as Array<{ status: string }>;
  const normsCompliant = complianceList.filter(
    (r) => r.status === 'compliant',
  ).length;
  const normsTotal = complianceList.length;
  const complianceScore =
    normsTotal > 0 ? Math.round((normsCompliant / normsTotal) * 100) : 0;

  const greeting = greetingName
    ? tDashboard('homeGreeting', { name: greetingName })
    : tDashboard('homeGreetingFallback');

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tDashboard('homeTitle')}
        title={greeting}
        subtitle={tDashboard('homeDesc')}
        actions={
          <EnviroButton
            variant="primary"
            size="sm"
            magnetic
            render={(buttonProps) => (
              <Link {...buttonProps} href="/home/marketplace/new">
                <Recycle aria-hidden="true" className="h-4 w-4" />
                {t('createListing')}
              </Link>
            )}
          />
        }
      />

      <EnviroStatCardGrid cols={4}>
        <EnviroStatCard
          variant="forest"
          label={t('dashboard.marketplace')}
          value={totalActive ?? 0}
          subtitle={t('dashboard.activeListings')}
          icon={<Store aria-hidden="true" className="h-5 w-5" />}
          metrics={[
            {
              label: t('dashboard.mySales'),
              value: `${mySellCount ?? 0}`,
            },
            {
              label: t('dashboard.collections'),
              value: `${myCollectCount ?? 0}`,
            },
          ]}
          actionLabel={t('dashboard.leComptoir')}
          actionHref="/home/marketplace"
        />

        <EnviroStatCard
          variant="lime"
          label={t('dashboard.environmentalImpact')}
          value={co2AvoidedT}
          fractionDigits={1}
          suffix=" t"
          subtitle={t('dashboard.co2Avoided')}
          icon={<Leaf aria-hidden="true" className="h-5 w-5" />}
          metrics={[
            {
              label: t('dashboard.tonsRecycled'),
              value: `${tonnesRecycledT} t`,
            },
            {
              label: t('dashboard.tracedLots'),
              value: `${blockchainCount ?? 0}`,
            },
          ]}
          actionLabel={t('dashboard.carbonImpact')}
          actionHref="/home/carbon"
        />

        <EnviroStatCard
          variant="cream"
          label={t('dashboard.compliance')}
          value={normsTotal > 0 ? complianceScore : undefined}
          valueDisplay={normsTotal > 0 ? undefined : <span>-</span>}
          suffix={normsTotal > 0 ? ' %' : undefined}
          subtitle={t('dashboard.globalScore')}
          icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />}
          metrics={[
            {
              label: t('dashboard.compliantStandards'),
              value:
                normsTotal > 0 ? `${normsCompliant}/${normsTotal}` : '-',
            },
          ]}
          actionLabel={t('dashboard.complianceAction')}
          actionHref="/home/compliance"
        />

        <EnviroStatCard
          variant="ember"
          label={t('dashboard.tracedLots')}
          value={blockchainCount ?? 0}
          subtitle={t('dashboard.circularityScore')}
          icon={<Link2 aria-hidden="true" className="h-5 w-5" />}
          metrics={[
            {
              label: t('dashboard.tracedLots'),
              value: `${certCount ?? 0}`,
            },
          ]}
        />
      </EnviroStatCardGrid>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <EnviroCard
          variant="cream"
          hover="none"
          padding="md"
          className="lg:col-span-2"
        >
          <EnviroCardHeader>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
              <Sparkles
                aria-hidden="true"
                className="h-4 w-4 text-[--color-enviro-cta]"
              />
              {t('dashboard.recommendedActions')}
            </h2>
          </EnviroCardHeader>
          <EnviroCardBody className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
            <ActionCard
              icon={<BarChart3 aria-hidden="true" className="h-4 w-4" />}
              title={t('dashboard.completeScope3')}
              description={t('dashboard.completeScope3Desc')}
              href="/home/esg/wizard?step=3"
              badge={t('dashboard.highImpact')}
            />
            <ActionCard
              icon={<Recycle aria-hidden="true" className="h-4 w-4" />}
              title={t('dashboard.publishListing')}
              description={t('dashboard.publishListingDesc')}
              href="/home/marketplace/new"
              badge={t('dashboard.recommended')}
            />
            <ActionCard
              icon={<Award aria-hidden="true" className="h-4 w-4" />}
              title={t('dashboard.improveRseScore')}
              description={t('dashboard.improveRseScoreDesc')}
              href="/home/rse/roadmap"
              badge={t('dashboard.highImpact')}
            />
            <ActionCard
              icon={<Link2 aria-hidden="true" className="h-4 w-4" />}
              title={t('dashboard.issueCertificates')}
              description={t('dashboard.issueCertificatesDesc')}
              href="/home/traceability"
              badge={t('dashboard.fiveLots')}
            />
            <ActionCard
              icon={<TrendingUp aria-hidden="true" className="h-4 w-4" />}
              title={tDashboard('homeCtaCarbon')}
              description={tDashboard('homeCtaCarbonDesc')}
              href="/home/carbon/assessment"
            />
            <ActionCard
              icon={<ClipboardList aria-hidden="true" className="h-4 w-4" />}
              title={tCommon('routes.externalActivities')}
              description={tDashboard('externalDesc')}
              href="/home/external-activities"
            />
          </EnviroCardBody>
        </EnviroCard>

        <EnviroCard variant="cream" hover="none" padding="md">
          <EnviroCardHeader>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
              <Bell
                aria-hidden="true"
                className="h-4 w-4 text-[--color-enviro-forest-700]"
              />
              {t('dashboard.recentActivity')}
            </h2>
          </EnviroCardHeader>
          <EnviroCardBody className="pt-4">
            <EnviroEmptyState
              icon={<Bell aria-hidden="true" className="h-7 w-7" />}
              title={t('dashboard.noActivityYet')}
              body={t('dashboard.noActivityDesc')}
            />
          </EnviroCardBody>
        </EnviroCard>
      </div>

      {myListings && myListings.length > 0 ? (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
              {tDashboard('homeMyListings')}
            </h2>
            <EnviroButton
              variant="ghost"
              size="sm"
              render={(buttonProps) => (
                <Link {...buttonProps} href="/home/my-listings">
                  {tDashboard('homeViewAllListings')}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myListings.slice(0, 3).map((listing: Record<string, unknown>) => (
              <EnviroListingCard
                key={listing.id as string}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                listing={listing as any}
              />
            ))}
          </div>
        </section>
      ) : null}

      <EnviroCard variant="dark" hover="none" padding="lg">
        <EnviroCardBody className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="flex flex-col gap-2 md:max-w-xl">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
              <span aria-hidden="true">[</span>
              <span className="px-1">{tCommon('routes.carbon')}</span>
              <span aria-hidden="true">]</span>
            </span>
            <h3 className="text-balance text-xl font-semibold leading-tight text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-display)] md:text-2xl">
              {t('dashboard.environmentalImpact')}
            </h3>
            <p className="text-sm text-[--color-enviro-fg-inverse-muted]">
              {tDashboard('carbonDesc')}
            </p>
          </div>
          <EnviroButton
            variant="lime"
            size="md"
            magnetic
            render={(buttonProps) => (
              <Link {...buttonProps} href="/home/carbon">
                <Leaf aria-hidden="true" className="h-4 w-4" />
                {t('dashboard.carbonImpact')}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            )}
          />
        </EnviroCardBody>
      </EnviroCard>

      <p className="sr-only" aria-live="polite">
        {locale}
      </p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  href,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex gap-3 rounded-[--radius-enviro-md] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] p-4 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[--color-enviro-lime-400] hover:shadow-[--shadow-enviro-sm] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[--radius-enviro-sm] bg-[--color-enviro-lime-100] text-[--color-enviro-lime-700]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-[--color-enviro-forest-900]">
            {title}
          </p>
          {badge ? (
            <span className="inline-flex items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-100] px-2 py-0.5 text-[10px] font-semibold text-[--color-enviro-lime-800]">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs text-[--color-enviro-forest-700]">
          {description}
        </p>
      </div>
      <ArrowRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-[--color-enviro-forest-700] opacity-0 transition-opacity group-hover:opacity-100"
      />
    </Link>
  );
}

export default UserHomePage;
