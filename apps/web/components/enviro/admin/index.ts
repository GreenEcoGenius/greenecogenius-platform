/**
 * Enviro admin segment components barrel.
 *
 * The admin shell reuses the dashboard `EnviroSidebar` + `EnviroSidebarProvider`
 * but layers a slimmer mini-topbar (no Genius drawer, no global search, no
 * locale switcher) and the ember accent color on active nav items so super
 * admins immediately recognize the privileged context.
 *
 * @kit/admin/components (AdminGuard, AdminDashboard, AdminAccountsTable,
 * AdminCreateUserDialog, AdminAccountPage) and the underlying Supabase
 * queries are READ-ONLY per the Phase 7 contract; the Enviro admin shell
 * wraps them, never their internals.
 */

export { EnviroAdminShell } from './enviro-admin-shell';
