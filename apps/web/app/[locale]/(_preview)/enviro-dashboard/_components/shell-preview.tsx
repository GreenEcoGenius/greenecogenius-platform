'use client';

import {
  Award,
  Bell,
  ClipboardList,
  CreditCard,
  FileBarChart,
  Home,
  Leaf,
  Link2,
  PackageSearch,
  Recycle,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from 'lucide-react';

import { cn } from '@kit/ui/utils';

import {
  EnviroDashboardBreadcrumb,
  EnviroSidebarNavItem,
  EnviroSidebarProvider,
  EnviroUserMenu,
  useEnviroSidebar,
} from '~/components/enviro/dashboard';

interface ShellPreviewLabels {
  groupPlatform: string;
  groupAccount: string;
  links: {
    home: string;
    marketplace: string;
    carbon: string;
    esg: string;
    traceability: string;
    rse: string;
    compliance: string;
    external: string;
    profile: string;
    listings: string;
    wallet: string;
    billing: string;
  };
  collapseLabel: string;
  expandLabel: string;
  brandLabel: string;
  searchPlaceholder: string;
  notificationsLabel: string;
  geniusLabel: string;
  userMenuLabel: string;
  userDisplayName: string;
  userEmail: string;
  userLabelProfile: string;
  userLabelBilling: string;
  userLabelLanguage: string;
  userLabelSignOut: string;
  breadcrumbHome: string;
  breadcrumbEsg: string;
  breadcrumbCsrd: string;
}

interface ShellPreviewProps {
  labels: ShellPreviewLabels;
}

/**
 * Self-contained preview of the dashboard shell using `position: relative`
 * instead of `fixed`. The real `EnviroDashboardShell` is full-viewport and
 * cannot be embedded in a preview page; this lightweight version wires the
 * same building blocks (`EnviroSidebarNavItem`, `EnviroDashboardBreadcrumb`,
 * `EnviroUserMenu`) inside a fixed-height card so reviewers can see the
 * styling, the active state, the collapse behaviour and the breadcrumb in
 * context.
 */
export function ShellPreview({ labels }: ShellPreviewProps) {
  return (
    <EnviroSidebarProvider initialCollapsed={false}>
      <ShellPreviewInner labels={labels} />
    </EnviroSidebarProvider>
  );
}

function ShellPreviewInner({ labels }: ShellPreviewProps) {
  const { collapsed, toggle } = useEnviroSidebar();

  const railWidth = collapsed ? '4.5rem' : '17.5rem';

  return (
    <div className="relative isolate flex h-[640px] w-full overflow-hidden rounded-[--radius-enviro-2xl] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg]">
      <div
        className="relative shrink-0 bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: railWidth }}
      >
        <div
          className={cn(
            'flex h-14 items-center border-b border-[--color-enviro-forest-700]',
            collapsed ? 'justify-center px-2' : 'justify-between px-4',
          )}
        >
          {!collapsed ? (
            <span className="text-sm font-semibold tracking-tight text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-display)]">
              {labels.brandLabel}
            </span>
          ) : (
            <Leaf
              aria-hidden="true"
              className="h-5 w-5 text-[--color-enviro-lime-300]"
            />
          )}
        </div>

        <nav className="px-3 py-4">
          {!collapsed ? (
            <h2 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[--color-enviro-lime-300]/70 font-[family-name:var(--font-enviro-mono)]">
              {labels.groupPlatform}
            </h2>
          ) : null}
          <ul className="flex flex-col gap-1">
            <li>
              <EnviroSidebarNavItem
                href="/home"
                label={labels.links.home}
                icon={<Home aria-hidden="true" />}
                highlightMatch="^/home$"
              />
            </li>
            <li>
              <EnviroSidebarNavItem
                href="/home/marketplace"
                label={labels.links.marketplace}
                icon={<Recycle aria-hidden="true" />}
              />
            </li>
            <li>
              <EnviroSidebarNavItem
                href="/home/carbon"
                label={labels.links.carbon}
                icon={<Leaf aria-hidden="true" />}
              />
            </li>
            <li>
              <EnviroSidebarNavItem
                href="/home/esg"
                label={labels.links.esg}
                icon={<FileBarChart aria-hidden="true" />}
              />
            </li>
            <li>
              <EnviroSidebarNavItem
                href="/home/traceability"
                label={labels.links.traceability}
                icon={<Link2 aria-hidden="true" />}
              />
            </li>
            <li>
              <EnviroSidebarNavItem
                href="/home/rse"
                label={labels.links.rse}
                icon={<Award aria-hidden="true" />}
              />
            </li>
            <li>
              <EnviroSidebarNavItem
                href="/home/compliance"
                label={labels.links.compliance}
                icon={<ShieldCheck aria-hidden="true" />}
              />
            </li>
            <li>
              <EnviroSidebarNavItem
                href="/home/external-activities"
                label={labels.links.external}
                icon={<ClipboardList aria-hidden="true" />}
              />
            </li>
          </ul>

          {!collapsed ? (
            <h2 className="mt-6 mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[--color-enviro-lime-300]/70 font-[family-name:var(--font-enviro-mono)]">
              {labels.groupAccount}
            </h2>
          ) : null}
          <ul className="flex flex-col gap-1">
            <li>
              <EnviroSidebarNavItem
                href="/home/settings"
                label={labels.links.profile}
                icon={<User aria-hidden="true" />}
              />
            </li>
            <li>
              <EnviroSidebarNavItem
                href="/home/my-listings"
                label={labels.links.listings}
                icon={<PackageSearch aria-hidden="true" />}
              />
            </li>
            <li>
              <EnviroSidebarNavItem
                href="/home/wallet"
                label={labels.links.wallet}
                icon={<Wallet aria-hidden="true" />}
              />
            </li>
            <li>
              <EnviroSidebarNavItem
                href="/home/billing"
                label={labels.links.billing}
                icon={<CreditCard aria-hidden="true" />}
              />
            </li>
          </ul>
        </nav>

        <div className="absolute inset-x-3 bottom-3 border-t border-[--color-enviro-forest-700] pt-3">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={!collapsed}
            className={cn(
              'flex w-full items-center gap-2 rounded-[--radius-enviro-md] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[--color-enviro-fg-inverse-muted] transition-colors duration-200 hover:bg-white/[0.04] hover:text-[--color-enviro-fg-inverse]',
              collapsed && 'justify-center px-2',
              'font-[family-name:var(--font-enviro-mono)]',
            )}
          >
            <span aria-hidden="true">{collapsed ? '»' : '«'}</span>
            {!collapsed ? (
              <span>
                {collapsed ? labels.expandLabel : labels.collapseLabel}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[--color-enviro-cream-200] bg-[--color-enviro-cream-50] px-4 font-[family-name:var(--font-enviro-sans)]">
          <EnviroDashboardBreadcrumb
            items={[
              { label: labels.breadcrumbHome, href: '/home' },
              { label: labels.breadcrumbEsg, href: '/home/esg' },
              { label: labels.breadcrumbCsrd },
            ]}
          />

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label={labels.searchPlaceholder}
              className="hidden h-8 items-center gap-2 rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] px-3 text-xs text-[--color-enviro-forest-700] transition-colors hover:border-[--color-enviro-lime-400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60 md:inline-flex"
            >
              <Search aria-hidden="true" className="h-3.5 w-3.5" />
              <span>{labels.searchPlaceholder}</span>
              <span className="ml-2 rounded-[--radius-enviro-xs] bg-[--color-enviro-cream-100] px-1.5 py-0.5 text-[10px] font-semibold text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
                K
              </span>
            </button>

            <button
              type="button"
              aria-label={labels.notificationsLabel}
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] text-[--color-enviro-forest-900] transition-colors hover:border-[--color-enviro-lime-400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60"
            >
              <Bell aria-hidden="true" className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[--color-enviro-cta]" />
            </button>

            <button
              type="button"
              aria-label={labels.geniusLabel}
              className="inline-flex h-8 items-center gap-1.5 rounded-[--radius-enviro-pill] bg-[--color-enviro-forest-900] px-3 text-xs font-semibold text-[--color-enviro-lime-300] transition-colors hover:bg-[--color-enviro-forest-700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60"
            >
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Genius</span>
            </button>

            <EnviroUserMenu
              displayName={labels.userDisplayName}
              email={labels.userEmail}
              initials="CD"
              items={[
                {
                  label: labels.userLabelProfile,
                  href: '/home/settings',
                  icon: <User aria-hidden="true" className="h-4 w-4" />,
                },
                {
                  label: labels.userLabelBilling,
                  href: '/home/billing',
                  icon: <CreditCard aria-hidden="true" className="h-4 w-4" />,
                },
              ]}
              languageLabel={labels.userLabelLanguage}
              signOutLabel={labels.userLabelSignOut}
              onSignOut={() => {
                /* preview only */
              }}
              ariaLabel={labels.userMenuLabel}
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[--color-enviro-bg] p-6">
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
              [ Main content area ]
            </p>
            <p className="text-sm text-[--color-enviro-forest-700]">
              Sidebar + topbar are wired with real components.
              <br />
              Click items to switch active state. Toggle the sidebar to test
              collapse.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
