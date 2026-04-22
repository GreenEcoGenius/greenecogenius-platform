/**
 * Internal-only barrel for the Phase 6.1.1 dashboard shell composition.
 * Exposes:
 *   - server components rendering the sidebar with translated labels
 *     bound to `common.routes.*`;
 *   - client components wiring the topbar to the legacy chat / search /
 *     sign-out hooks without modifying `apps/web/components/ai/*`.
 */

export { EnviroDashboardSidebar } from './enviro-dashboard-sidebar';
export { EnviroSidebarBrand } from './enviro-sidebar-brand';
export { EnviroDynamicBreadcrumb } from './enviro-dynamic-breadcrumb';
export { EnviroTopbarActions } from './enviro-topbar-actions';
