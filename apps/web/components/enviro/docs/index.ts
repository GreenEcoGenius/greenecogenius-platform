/**
 * Enviro docs segment components barrel.
 *
 * The docs shell is intentionally lighter than the dashboard / admin shells:
 * no collapse behavior on the sidebar (fixed 300px on `lg+`, off-canvas
 * drawer below) and no Genius drawer / locale switcher in the topbar. Active
 * nav state uses a neutral forest-300 tint so this public segment stays
 * visually distinct from the user (lime) and admin (ember) accents.
 *
 * Keystatic CMS sources, `@kit/cms` consumers and `markdoc.css` (shared with
 * the blog) are READ-ONLY. The prose component ships its own scoped
 * stylesheet to keep the legacy markdoc consumers untouched.
 */

export {
  EnviroDocsSidebar,
  EnviroDocsSidebarProvider,
  useEnviroDocsSidebar,
  ENVIRO_DOCS_SIDEBAR_WIDTH,
} from './enviro-docs-sidebar';
export { EnviroDocsCard } from './enviro-docs-card';
export { EnviroDocsBackButton } from './enviro-docs-back-button';
export { EnviroDocsNavLink } from './enviro-docs-nav-link';
export {
  EnviroDocsHeader,
  type EnviroDocsHeaderBreadcrumbItem,
} from './enviro-docs-header';
export { EnviroDocsProse } from './enviro-docs-prose';
export { EnviroDocsTOC } from './enviro-docs-toc';
export { EnviroFloatingDocsNavButton } from './enviro-floating-docs-nav-button';
export { slugifyDocsHeading } from './enviro-docs-slugify';
