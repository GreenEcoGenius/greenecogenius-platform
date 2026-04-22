/**
 * Enviro dashboard components barrel.
 *
 * All components in this folder are dashboard-only complements to the
 * Phase 3 Enviro library (`apps/web/components/enviro/`). They follow the
 * same conventions:
 *   - never re-implement logic that already exists in `@kit/ui` or `@kit/*`;
 *   - never hard-code user-facing strings (i18n is the caller's job);
 *   - never run animations without honouring `prefers-reduced-motion`;
 *   - own no Genius / chat / Supabase logic. Phase 6.1.1 wires the shell
 *     into `home/(user)/layout.tsx` while preserving `apps/web/components/ai/*`.
 */

export {
  EnviroSidebarProvider,
  useEnviroSidebar,
  ENVIRO_SIDEBAR_COOKIE_NAME,
} from './enviro-sidebar-context';

export type { EnviroSidebarGroupConfig } from './enviro-sidebar';
export {
  EnviroSidebar,
  ENVIRO_SIDEBAR_WIDTH_EXPANDED,
  ENVIRO_SIDEBAR_WIDTH_COLLAPSED,
} from './enviro-sidebar';
export { EnviroSidebarNavItem } from './enviro-sidebar-nav-item';
export { EnviroDashboardShell } from './enviro-dashboard-shell';
export { EnviroDashboardTopbar } from './enviro-dashboard-topbar';
export { EnviroUserMenu } from './enviro-user-menu';

export type { EnviroBreadcrumbItem } from './enviro-dashboard-breadcrumb';
export { EnviroDashboardBreadcrumb } from './enviro-dashboard-breadcrumb';

export { EnviroDashboardSectionHeader } from './enviro-dashboard-section-header';

export type { EnviroStatMetric } from './enviro-stat-card';
export {
  EnviroStatCard,
  EnviroStatCardGrid,
  enviroStatCardClasses,
} from './enviro-stat-card';

export {
  EnviroDataTable,
  EnviroTableHeader,
  EnviroTableHead,
  EnviroTableBody,
  EnviroTableRow,
  EnviroTableCell,
} from './enviro-data-table';

export { EnviroEmptyState } from './enviro-empty-state';
export { EnviroChartCard } from './enviro-chart-card';

export type { EnviroFilterChipItem } from './enviro-filter-chips';
export { EnviroFilterChips } from './enviro-filter-chips';
