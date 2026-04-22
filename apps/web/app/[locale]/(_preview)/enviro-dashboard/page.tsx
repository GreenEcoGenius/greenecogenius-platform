import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  ArrowDownToLine,
  Leaf,
  PackagePlus,
  PackageSearch,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  EnviroChartCard,
  EnviroDashboardBreadcrumb,
  EnviroDashboardSectionHeader,
  EnviroDataTable,
  EnviroEmptyState,
  EnviroStatCard,
  EnviroStatCardGrid,
  EnviroTableBody,
  EnviroTableCell,
  EnviroTableHead,
  EnviroTableHeader,
  EnviroTableRow,
} from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import featureFlagsConfig from '~/config/feature-flags.config';

import { FilterChipsDemo } from './_components/filter-chips-demo';
import { ShellPreview } from './_components/shell-preview';

export const metadata: Metadata = {
  title: 'Enviro Dashboard Components Preview',
  robots: { index: false, follow: false },
};

export default async function EnviroDashboardPreviewPage() {
  if (!featureFlagsConfig.enableEnviroPreview) {
    notFound();
  }

  return (
    <div className="min-h-dvh bg-[--color-enviro-bg] text-[--color-enviro-fg] font-[family-name:var(--font-enviro-sans)]">
      <PageIntro />

      <div className="mx-auto flex w-full max-w-[--container-enviro-xl] flex-col gap-20 px-4 py-16 lg:px-8">
        <ShellSection />
        <BreadcrumbSection />
        <SectionHeaderSection />
        <StatsSection />
        <FilterChipsSection />
        <DataTableSection />
        <EmptyStateSection />
        <ChartCardSection />
      </div>
    </div>
  );
}

async function PageIntro() {
  const t = await getTranslations('enviroPreview.dashboard.page');

  return (
    <header className="border-b border-[--color-enviro-cream-200] bg-[--color-enviro-cream-50]">
      <div className="mx-auto flex w-full max-w-[--container-enviro-xl] flex-col gap-3 px-4 py-12 lg:px-8 lg:py-16">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
          <span aria-hidden="true">[</span>
          <span className="px-1">{t('tag')}</span>
          <span aria-hidden="true">]</span>
        </span>

        <h1 className="text-balance text-3xl leading-tight tracking-tight font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)] md:text-5xl">
          {t('title')}
        </h1>

        <p className="max-w-3xl text-base leading-relaxed text-[--color-enviro-forest-700] md:text-lg">
          {t('subtitle')}
        </p>

        <p className="max-w-3xl text-sm leading-relaxed text-[--color-enviro-forest-700]/80">
          {t('description')}
        </p>
      </div>
    </header>
  );
}

async function ShellSection() {
  const t = await getTranslations('enviroPreview.dashboard');

  return (
    <section id="shell" className="flex flex-col gap-6">
      <EnviroDashboardSectionHeader
        tag={t('shell.tag')}
        title={t('shell.title')}
        subtitle={t('shell.subtitle')}
      />

      <p className="text-xs text-[--color-enviro-forest-700]">
        {t('shell.viewport')}
      </p>

      <ShellPreview
        labels={{
          groupPlatform: t('sidebar.groupPlatform'),
          groupAccount: t('sidebar.groupAccount'),
          links: {
            home: t('sidebar.linkHome'),
            marketplace: t('sidebar.linkMarketplace'),
            carbon: t('sidebar.linkCarbon'),
            esg: t('sidebar.linkEsg'),
            traceability: t('sidebar.linkTraceability'),
            rse: t('sidebar.linkRse'),
            compliance: t('sidebar.linkCompliance'),
            external: t('sidebar.linkExternal'),
            profile: t('sidebar.linkProfile'),
            listings: t('sidebar.linkListings'),
            wallet: t('sidebar.linkWallet'),
            billing: t('sidebar.linkBilling'),
          },
          collapseLabel: t('sidebar.collapseLabel'),
          expandLabel: t('sidebar.expandLabel'),
          brandLabel: t('sidebar.brandLabel'),
          searchPlaceholder: t('topbar.searchPlaceholder'),
          notificationsLabel: t('topbar.notificationsLabel'),
          geniusLabel: t('topbar.geniusLabel'),
          userMenuLabel: t('topbar.userMenuLabel'),
          userDisplayName: t('userMenu.displayName'),
          userEmail: t('userMenu.email'),
          userLabelProfile: t('userMenu.labelProfile'),
          userLabelBilling: t('userMenu.labelBilling'),
          userLabelLanguage: t('userMenu.labelLanguage'),
          userLabelSignOut: t('userMenu.labelSignOut'),
          breadcrumbHome: t('breadcrumb.demoHome'),
          breadcrumbEsg: t('breadcrumb.demoEsg'),
          breadcrumbCsrd: t('breadcrumb.demoCsrd'),
        }}
      />

      <p className="text-xs italic text-[--color-enviro-forest-700]/80">
        {t('shell.viewportNote')}
      </p>
    </section>
  );
}

async function BreadcrumbSection() {
  const t = await getTranslations('enviroPreview.dashboard.breadcrumb');

  return (
    <section id="breadcrumb" className="flex flex-col gap-6">
      <EnviroDashboardSectionHeader
        tag={t('tag')}
        title="EnviroDashboardBreadcrumb"
        subtitle="Lime separator, mono caps."
      />

      <div className="rounded-[--radius-enviro-md] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] px-4 py-3">
        <EnviroDashboardBreadcrumb
          items={[
            { label: t('demoHome'), href: '/home' },
            { label: t('demoEsg'), href: '/home/esg' },
            { label: t('demoCsrd') },
          ]}
        />
      </div>
    </section>
  );
}

async function SectionHeaderSection() {
  const t = await getTranslations('enviroPreview.dashboard.sectionHeader');

  return (
    <section id="section-header" className="flex flex-col gap-6">
      <EnviroDashboardSectionHeader
        tag={t('tag')}
        title={t('title')}
        actions={
          <EnviroButton variant="primary" size="sm">
            <ArrowDownToLine aria-hidden="true" className="h-4 w-4" />
            {t('demoCta')}
          </EnviroButton>
        }
      />

      <div className="rounded-[--radius-enviro-md] border border-dashed border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] p-6">
        <EnviroDashboardSectionHeader
          tag={t('demoTag')}
          title={t('demoTitle')}
          subtitle={t('demoSubtitle')}
          actions={
            <EnviroButton variant="primary" size="sm">
              <ArrowDownToLine aria-hidden="true" className="h-4 w-4" />
              {t('demoCta')}
            </EnviroButton>
          }
        />
      </div>
    </section>
  );
}

async function StatsSection() {
  const t = await getTranslations('enviroPreview.dashboard.stat');

  return (
    <section id="stats" className="flex flex-col gap-6">
      <EnviroDashboardSectionHeader
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <EnviroStatCardGrid cols={4}>
        <EnviroStatCard
          variant="forest"
          label={t('card1Label')}
          value={Number(t('card1Value'))}
          subtitle={t('card1Subtitle')}
          icon={<PackageSearch aria-hidden="true" className="h-5 w-5" />}
          metrics={[
            {
              label: t('card1MetricA'),
              value: t('card1MetricAValue'),
            },
            {
              label: t('card1MetricB'),
              value: t('card1MetricBValue'),
            },
          ]}
          actionLabel={t('card1Cta')}
          actionHref="/home/marketplace"
        />

        <EnviroStatCard
          variant="lime"
          label={t('card2Label')}
          value={Number(t('card2Value'))}
          fractionDigits={1}
          suffix={t('card2Suffix')}
          subtitle={t('card2Subtitle')}
          icon={<Leaf aria-hidden="true" className="h-5 w-5" />}
          metrics={[
            {
              label: t('card2MetricA'),
              value: t('card2MetricAValue'),
            },
            {
              label: t('card2MetricB'),
              value: t('card2MetricBValue'),
            },
          ]}
        />

        <EnviroStatCard
          variant="cream"
          label={t('card3Label')}
          value={Number(t('card3Value'))}
          suffix={t('card3Suffix')}
          subtitle={t('card3Subtitle')}
          icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />}
          metrics={[
            {
              label: t('card3MetricA'),
              value: t('card3MetricAValue'),
            },
          ]}
          actionLabel={t('card3Cta')}
          actionHref="/home/compliance"
        />

        <EnviroStatCard
          variant="ember"
          label={t('card4Label')}
          value={Number(t('card4Value'))}
          suffix={t('card4Suffix')}
          subtitle={t('card4Subtitle')}
          icon={<Wallet aria-hidden="true" className="h-5 w-5" />}
        />
      </EnviroStatCardGrid>
    </section>
  );
}

async function FilterChipsSection() {
  const t = await getTranslations('enviroPreview.dashboard.chips');

  return (
    <section id="chips" className="flex flex-col gap-6">
      <EnviroDashboardSectionHeader
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="rounded-[--radius-enviro-md] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] p-6">
        <FilterChipsDemo
          ariaLabel={t('title')}
          initial="all"
          items={[
            { value: 'all', label: t('all'), count: 184 },
            { value: 'metals', label: t('metals'), count: 42 },
            { value: 'plastics', label: t('plastics'), count: 67 },
            { value: 'glass', label: t('glass'), count: 31 },
            { value: 'wood', label: t('wood'), count: 24 },
          ]}
        />
      </div>
    </section>
  );
}

async function DataTableSection() {
  const t = await getTranslations('enviroPreview.dashboard.table');

  return (
    <section id="data-table" className="flex flex-col gap-6">
      <EnviroDashboardSectionHeader
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <EnviroDataTable>
        <EnviroTableHeader>
          <EnviroTableRow>
            <EnviroTableHead>{t('colMaterial')}</EnviroTableHead>
            <EnviroTableHead>{t('colType')}</EnviroTableHead>
            <EnviroTableHead>{t('colQuantity')}</EnviroTableHead>
            <EnviroTableHead>{t('colStatus')}</EnviroTableHead>
          </EnviroTableRow>
        </EnviroTableHeader>
        <EnviroTableBody>
          <EnviroTableRow>
            <EnviroTableCell className="font-medium">
              {t('row1Material')}
            </EnviroTableCell>
            <EnviroTableCell>{t('row1Type')}</EnviroTableCell>
            <EnviroTableCell className="tabular-nums">
              {t('row1Quantity')}
            </EnviroTableCell>
            <EnviroTableCell>
              <StatusPill tone="success">{t('row1Status')}</StatusPill>
            </EnviroTableCell>
          </EnviroTableRow>
          <EnviroTableRow>
            <EnviroTableCell className="font-medium">
              {t('row2Material')}
            </EnviroTableCell>
            <EnviroTableCell>{t('row2Type')}</EnviroTableCell>
            <EnviroTableCell className="tabular-nums">
              {t('row2Quantity')}
            </EnviroTableCell>
            <EnviroTableCell>
              <StatusPill tone="muted">{t('row2Status')}</StatusPill>
            </EnviroTableCell>
          </EnviroTableRow>
          <EnviroTableRow>
            <EnviroTableCell className="font-medium">
              {t('row3Material')}
            </EnviroTableCell>
            <EnviroTableCell>{t('row3Type')}</EnviroTableCell>
            <EnviroTableCell className="tabular-nums">
              {t('row3Quantity')}
            </EnviroTableCell>
            <EnviroTableCell>
              <StatusPill tone="info">{t('row3Status')}</StatusPill>
            </EnviroTableCell>
          </EnviroTableRow>
        </EnviroTableBody>
      </EnviroDataTable>
    </section>
  );
}

async function EmptyStateSection() {
  const t = await getTranslations('enviroPreview.dashboard.empty');

  return (
    <section id="empty" className="flex flex-col gap-6">
      <EnviroDashboardSectionHeader
        tag={t('tag')}
        title={t('title')}
      />

      <EnviroEmptyState
        icon={<PackageSearch aria-hidden="true" className="h-7 w-7" />}
        tag="EnviroEmptyState"
        title={t('demoTitle')}
        body={t('demoBody')}
        actions={
          <EnviroButton variant="primary" size="sm">
            <PackagePlus aria-hidden="true" className="h-4 w-4" />
            {t('demoCta')}
          </EnviroButton>
        }
      />
    </section>
  );
}

async function ChartCardSection() {
  const t = await getTranslations('enviroPreview.dashboard.chart');

  // Lightweight bar chart placeholder so the preview does not depend on
  // Recharts (which dashboards already use). The real EnviroChartCard
  // wraps any chart, including Recharts, with the GEG palette intact.
  const months = [
    { key: 'monthJan', value: 0.4 },
    { key: 'monthFeb', value: 0.55 },
    { key: 'monthMar', value: 0.62 },
    { key: 'monthApr', value: 0.45 },
    { key: 'monthMay', value: 0.78 },
    { key: 'monthJun', value: 0.88 },
  ] as const;

  return (
    <section id="chart" className="flex flex-col gap-6">
      <EnviroDashboardSectionHeader
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <EnviroChartCard
        tag={t('tag')}
        title={t('demoTitle')}
        subtitle={t('demoSubtitle')}
        actions={
          <EnviroButton variant="ghost" size="sm">
            <ArrowDownToLine aria-hidden="true" className="h-4 w-4" />
            {t('demoExport')}
          </EnviroButton>
        }
        height={240}
      >
        <div className="flex h-full items-end gap-3 px-2 pt-4 pb-8">
          {months.map((m) => (
            <div
              key={m.key}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-t-[--radius-enviro-sm] bg-gradient-to-t from-[--color-enviro-lime-400] to-[--color-enviro-lime-300]"
                style={{ height: `${m.value * 100}%` }}
                aria-hidden="true"
              />
              <span className="text-[10px] font-medium text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
                {t(m.key)}
              </span>
            </div>
          ))}
        </div>
      </EnviroChartCard>
    </section>
  );
}

function StatusPill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: 'success' | 'muted' | 'info';
}) {
  const cls =
    tone === 'success'
      ? 'bg-[--color-enviro-lime-100] text-[--color-enviro-lime-800]'
      : tone === 'info'
        ? 'bg-[--color-enviro-forest-100] text-[--color-enviro-forest-700]'
        : 'bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]';

  return (
    <span
      className={`inline-flex items-center rounded-[--radius-enviro-pill] px-2 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}
