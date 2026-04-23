/**
 * Phase 7.4 enviro shell barrel for the team account workspace.
 *
 * Mirrors the structure of `(user)/_components/enviro-shell/` so the
 * personal and team contexts share the same chrome composition rules.
 * Routes nav items through `/home/[account]/...` and uses the existing
 * `WorkspaceDropdown` (kept as the brand block) so workspace switching
 * keeps working unchanged.
 *
 * Active state stays `lime` (default) to match the rest of the user
 * dashboard surface. The team identity is conveyed by the brand
 * (workspace name + avatar) at the top of the sidebar.
 */

export { EnviroTeamSidebar } from './enviro-team-sidebar';
export { EnviroTeamSidebarBrand } from './enviro-team-sidebar-brand';
export { EnviroTeamTopbarActions } from './enviro-team-topbar-actions';
export { EnviroTeamDynamicBreadcrumb } from './enviro-team-dynamic-breadcrumb';
