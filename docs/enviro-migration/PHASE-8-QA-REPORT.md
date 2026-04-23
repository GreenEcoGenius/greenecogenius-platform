# Phase 8 - QA global Enviro migration

> **Statut** : checkpoint Phase 8 - QA cross-segment avant deploy Phase 9.
> **Branche** : `enviro-adoption/v1`
> **Commits Phase 8** : 88899c81 (TS baseline) + d51300de (a11y + cleanup) + commit courant.
> **Couverture** : 71 routes, 28 namespaces i18n, 40 composants Enviro, 5 segments + 1 backlog.

---

## Executive summary

| Severity | Count | Scope |
|---|---|---|
| Bloquant | 0 | - |
| Majeur | **1** | Team account workspace (`/home/[account]/*`) jamais migré, legacy Makerkit UI |
| Mineur | 3 | A11Y x2 (resolved), i18n cleanup x1 (resolved) |
| Cosmétique | 4 | Em-dashes pre-existing, hardcoded EN aria-label, TODO placeholders, console.error logging |

**Recommandation Phase 9** : **GO conditionnel**. La migration des 5 segments scope explicit (marketing, auth, dashboard user, admin, docs) est complète et build / typecheck verts. Le segment team account hors scope initial est non-migré et reste sur le legacy Makerkit UI, ce qui crée une discontinuité visuelle dans les contextes multi-tenant. Voir section 7 pour les options de mitigation.

---

## 1. Build metrics

| Métrique | Valeur |
|---|---|
| `pnpm --filter web typecheck` | **VERT** (était 2 erreurs avant Commit 1) |
| `pnpm --filter web build` | **VERT** (compiled in 9.5s) |
| Routes générées | 71 page routes + 50+ API routes + middleware |
| Namespaces i18n | 28 (FR + EN, 100% symétriques) |
| Total clés i18n | 3 156 par locale (6 312 strings) |
| Composants Enviro | 40 sous `apps/web/components/enviro/*` |
| Linter | 0 erreur sur fichiers touchés |

Notes :
- Le build Next.js 16 ne ressort pas la colonne "First Load JS / kB" en sortie standard, donc pas de mesure delta vs main. Les bundles statiques se trouvent sous `apps/web/.next/static/*` si besoin d'analyse manuelle ultérieure.
- L'erreur initiale sandbox `database.types.ts not found` était un artefact `com.apple.provenance` de macOS bloquant le sandbox shell et non un vrai défaut. Lancer le typecheck hors sandbox suffit (cf. note Phase 7.3).

---

## 2. Inventaire des routes par segment

### 2.1 Marketing (19 routes) - statut : VERT

| Route | Phase | Statut |
|---|---|---|
| `/` | 4 | OK |
| `/about`, `/solutions`, `/normes`, `/pricing`, `/faq`, `/contact` | 4 | OK |
| `/blog`, `/blog/[slug]` | 4 | OK |
| `/changelog`, `/changelog/[slug]` | 4 | OK |
| `/explorer`, `/explorer/[category]`, `/explorer/region/[region]` | 4 | OK (legacy console.error logging acceptable, voir 6.4) |
| `/privacy-policy`, `/terms-of-service`, `/cookie-policy` | 4 | OK |
| `/(_preview)/enviro-components`, `/(_preview)/enviro-dashboard` | 1-6 | OK (preview gated par feature flag) |

Aucune anomalie technique. Findings cross-cutting (em-dashes, aria-hidden) déjà corrigés en Commit 2 ou flagués backlog.

### 2.2 Auth (5 routes) - statut : VERT

| Route | Phase | Statut |
|---|---|---|
| `/auth/sign-in`, `/auth/sign-up`, `/auth/password-reset`, `/auth/verify`, `/auth/callback/error` | 7.1 | OK |

Wrap Enviro fonctionne autour des containers `@kit/auth/*` READ-ONLY. MFA + OAuth callback redirects préservés.

### 2.3 Dashboard user `/home/(user)/*` (23 routes) - statut : VERT

| Cluster | Routes | Phase |
|---|---|---|
| Home | `/home`, `/home/settings`, `/home/billing`, `/home/billing/return`, `/home/pricing`, `/home/wallet` | 6.1-6.3, 6.5, 6.7 |
| Marketplace | `/home/marketplace`, `/home/marketplace/new`, `/home/marketplace/[id]`, `/home/marketplace/[id]/confirmation`, `/home/my-listings` | 6.4, 6.10 |
| Carbon | `/home/carbon`, `/home/carbon/assessment` | 6.11 |
| ESG | `/home/esg`, `/home/esg/csrd`, `/home/esg/data-entry`, `/home/esg/wizard`, `/home/esg/reports` | 6.12.a, 6.12.b |
| RSE | `/home/rse`, `/home/rse/diagnostic`, `/home/rse/roadmap` | 6.9 |
| Compliance + Traceability | `/home/compliance`, `/home/traceability` | 6.13, 6.14 |
| External activities | `/home/external-activities` | 6.8 |
| Transactions | `/home/transactions/[id]` | 6.6 |

Active state lime, EnviroSidebarProvider + cookie collapse OK, Genius drawer sur le right slot, locale switcher dans EnviroUserMenu.

### 2.4 Admin (4 routes) - statut : VERT

| Route | Phase | Statut |
|---|---|---|
| `/admin`, `/admin/accounts`, `/admin/accounts/[id]` | 7.2 | OK |
| `/admin` layout (compté comme route 4 dans le brief) | 7.2 | OK |

Active state ember différencié du user lime, AdminGuard HOC chain préservé, EnviroSidebarProvider partagé via cookie `enviro_sidebar_collapsed`.

### 2.5 Docs (2 routes) - statut : VERT

| Route | Phase | Statut |
|---|---|---|
| `/docs`, `/docs/[...slug]` | 7.3 | OK |

Sidebar fixe 300px desktop + drawer mobile + FAB. Active state forest-300 neutre. EnviroDocsProse with deterministic ID injection. EnviroDocsTOC sticky xl+. Keystatic CMS contract intact.

### 2.6 Backlog hors-scope - team account `/home/[account]/*` (9 routes) - statut : ROUGE

| Route | Statut UI |
|---|---|
| `/home/[account]` | Legacy Makerkit (PageBody, DashboardDemo, AppHeader) |
| `/home/[account]/billing`, `/home/[account]/billing/return` | Legacy `@kit/ui/page` + kit Card |
| `/home/[account]/marketplace`, `/home/[account]/marketplace/new`, `/home/[account]/marketplace/[id]`, `/home/[account]/marketplace/[id]/confirmation` | Legacy `Button`, `text-muted-foreground`, ListingCard legacy |
| `/home/[account]/members` | Legacy kit `Card`, `AccountMembersTable` raw |
| `/home/[account]/my-listings` | Legacy idem marketplace |
| `/home/[account]/settings`, `/home/[account]/settings/profile` | Legacy `TeamAccountSettingsContainer` brut |

Voir finding **MAJ-1** section 5 et options de mitigation section 7.

---

## 3. Per-segment audit details

### 3.1 Marketing
- **Layout** : `apps/web/app/[locale]/(marketing)/layout.tsx` → EnviroNavbar + EnviroFooter sous (legacy navbar / footer) Makerkit (non-Enviro mais hors scope migration marketing initiale).
- **Composants Enviro consommés** : EnviroPageHero, EnviroStats, EnviroSectionHeader, EnviroFaq, EnviroBlogCard, EnviroPricingCard, EnviroComparisonTable, EnviroNewsletterCta, EnviroLogoStrip, EnviroTimeline, EnviroHero, animations.
- **A11Y** : tous les findings résolus en Commit 2 (Menu/X/Globe icons + 2 boutons mobile menu).
- **Performance** : `useReducedMotionSafe` couvert sur AnimatedCounter, parallax-container, magnetic-wrapper, fade-in-section, stagger-container, text-reveal, page-transition.

### 3.2 Auth
- **Composants Enviro** : EnviroAuthLayout, EnviroAuthHero, EnviroAuthHeading, EnviroAuthLoading.
- **Contrat préservé** : SignInMethodsContainer / SignUpMethodsContainer / etc. READ-ONLY, juste re-skin du chrome.
- **Redirect OAuth callback** : préservé (pas de touch sur `/auth/callback/route.ts`).

### 3.3 Dashboard user
- **Shell** : EnviroDashboardShell wrap KitSidebarProvider (no-op pour SidebarChatBridge legacy). EnviroSidebarProvider drive le visuel.
- **Cookie** : `enviro_sidebar_collapsed` via `ENVIRO_SIDEBAR_COOKIE_NAME`, partagé avec admin.
- **Genius drawer** : monté via `rightDrawer` slot, GlobalAIAssistant inchangé.
- **Composants dashboard utilisés** : EnviroDashboardTopbar, EnviroDashboardBreadcrumb, EnviroDashboardSectionHeader, EnviroSidebar (lime accent), EnviroSidebarNavItem, EnviroUserMenu (locale switcher), EnviroStatCard + Grid (4 variants), EnviroDataTable, EnviroEmptyState, EnviroChartCard, EnviroFilterChips.

### 3.4 Admin
- **Shell** : EnviroAdminShell (mini-topbar slim, pas de Genius/locale switcher, pas de global search).
- **AdminGuard** : préservé via `@kit/admin/components` READ-ONLY. Pas de double-wrap.
- **Active state** : ember sur EnviroSidebar via prop `accent="ember"`.
- **i18n** : namespace `admin` (17 keys FR/EN symétriques).

### 3.5 Docs
- **Shell** : EnviroDocsSidebarProvider local (pas de cookie persistence, transient state).
- **Sidebar** : 300px fixe desktop, off-canvas mobile drawer.
- **Prose** : `EnviroDocsProse` ne touche pas `markdoc.css` partagé avec le blog. Stylesheet scoped via `<style>` JSX, ID injection h2/h3 déterministe via `slugifyDocsHeading`.
- **TOC** : auto-extraction h2/h3 + IntersectionObserver active tracking.
- **i18n** : namespace `docs` (19 keys FR/EN symétriques).

---

## 4. Cross-cutting concerns

### 4.1 Accessibility

| Vérif | Résultat |
|---|---|
| `useReducedMotionSafe` ou `motion-reduce` | 14 fichiers sous `components/enviro/animations/*` couvrent les animations décoratives |
| `focus-visible:` styling | 16 composants Enviro, pattern uniforme `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-...]/60` |
| `aria-label` sur icônes isolées | 15 composants, dont EnviroFloatingDocsNavButton, EnviroSidebar close, EnviroDashboardTopbar mobile menu, EnviroAdminShell mobile menu |
| `aria-hidden="true"` sur icônes décoratives dans boutons avec aria-label | Couvert sur tous les nouveaux composants Phase 7. 4 oublis Phase 4-5 corrigés en Commit 2 (Menu, X, Globe, Minus) |
| `aria-expanded` sur collapsibles | OK sur EnviroDocsSidebar collapsible nodes, EnviroSidebar collapse toggle |
| `aria-current="page"` sur nav active | OK sur EnviroDocsSidebar links et EnviroSidebarNavItem |
| Heading hierarchy h1 → h2 → h3 | OK (1 seul h1 par page, h2/h3 cohérents dans EnviroDocsProse) |
| Keyboard navigation | Tab order délégué aux primitives base-ui qui handle correctement |
| Contraste WCAG AA | Tokens forest-900 sur cream-50 = 12.6:1, lime-300 sur forest-900 = 10.8:1, ember-300 sur forest-900 = 5.7:1 (AA pour 18px+) |

### 4.2 Responsive

| Breakpoint | Vérif | Résultat |
|---|---|---|
| 375px (iPhone SE) | `w-screen`, `min-w-[Npx]`, `overflow-x-scroll` | 0 occurrence dans `components/enviro/*` |
| 375px | `overflow-x-hidden` global | Présent sur `EnviroDashboardShell main` et `EnviroAdminShell main` |
| 768px (tablette) | Breakpoints `md:` cohérents | OK, pattern uniforme sur les grids et flex |
| 1024px (desktop) | Sidebar collapse toggle | Présent uniquement `lg+`, drawer mobile sinon |

Aucun risque structurel détecté code-side pour le 375px. Validation visuelle à confirmer pendant les STOPs.

### 4.3 i18n

| Vérif | Résultat |
|---|---|
| Symétrie FR/EN par count | 28 namespaces, 100% égaux |
| Symétrie FR/EN par chemin clé | 0 clé asymétrique sur les 3 156 chemins |
| Em-dashes dans i18n | 73 occurrences toutes en marketing/dashboard/marketplace/carbon/rse/etc. Typographiquement correctes en FR. Voir COSM-1 |
| Em-dashes dans `components/enviro/*` | 0 (le rule projet est respecté côté code) |
| Accents FR cohérents | OK (`référence`, `précédent`, `mis à jour` sont propres dans Phase 7.x) |
| Clés mortes | 2 corrigées en Commit 2 (`marketing.documentation`, `marketing.documentationSubtitle`) |

### 4.4 Performance

| Vérif | Résultat |
|---|---|
| Build vert | OK (compiled in 9.5s) |
| Bundle size delta vs main | Non mesuré (Next.js 16 build output ne sort pas la colonne kB) |
| Animations respectent `prefers-reduced-motion` | OK sur tous les composants `animations/*` |
| Transitions CSS pures (300ms) | Acceptables hors `prefers-reduced-motion` car non-décoratives |

### 4.5 Cleanup

| Vérif | Résultat |
|---|---|
| `console.log/warn/info/debug` dans Enviro components | 0 |
| `console.error` dans app code | 3 (marketing/explorer + 2 legacy non-Enviro). Logging légitime, voir COSM-4 |
| `TODO/FIXME/XXX/HACK` dans Enviro | 0 |
| `TODO` dans app code | 2 placeholders dans newsletter forms (pre-existing, voir COSM-3) |
| Imports morts | tsc strict ne flag aucun import inutilisé |
| Variables non utilisées | tsc strict OK |

---

## 5. Findings détaillés

### MAJ-1 : Team account workspace non-migré

**Severity** : Majeur
**Scope** : `/home/[account]/*` (9 routes + layout + ~20 composants `_components/`)
**Origine** : Phase 7 a documenté "23 routes user dashboard" mais a omis les 9 routes team account contextuelles. Les Phases 6-7 sont complètes pour `/home/(user)/*` (personal account) seulement.

**Détail** :
- `apps/web/app/[locale]/home/[account]/layout.tsx` utilise `Page` + `PageNavigation` + `SidebarProvider` legacy de `@kit/ui/sidebar`, pas EnviroDashboardShell.
- Les 9 pages utilisent `PageBody` + `TeamAccountLayoutPageHeader` + `Card`/`Button` legacy `@kit/ui/*` au lieu d'EnviroCard / EnviroButton.
- Pas de tokens `--color-enviro-*`, juste `text-muted-foreground` shadcn.
- Pas de fonts `font-enviro-*`.
- Icônes lucide (`Plus`, `Search`, `TriangleAlert`) sans `aria-hidden`.
- Sidebar `WorkspaceDropdown` + `TeamAccountLayoutSidebarNavigation` sont des composants Makerkit non-rebrandés.

**Risque production** : `enableTeamAccounts` flag par défaut `true`. Donc en production avec `NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS` non override, les utilisateurs créant ou rejoignant une team workspace voient le UI legacy. Discontinuité visuelle vs `/home/(user)/*` migré.

**Risque accru si `enableTeamsOnly=true`** : tous les users sont redirect via `redirectIfTeamsOnly` vers `/home/[account]/*` legacy. Voir `apps/web/app/[locale]/home/(user)/layout.tsx:103-126`. Donc en mode "teams only" toute la surface user pointe sur le legacy.

**Mitigation Phase 9** : 3 options non-exclusives détaillées section 7.

### A11Y-1 : Icônes lucide manquantes `aria-hidden` (RÉSOLU)

Corrigé en Commit 2 (`d51300de`). 4 occurrences :
- `enviro-navbar.tsx` : `Menu` (mobile open), `X` (mobile close), `Globe` (locale switch)
- `enviro-comparison-table.tsx` : `Minus`

### A11Y-2 : `focus-visible:` manquant sur 2 boutons mobile menu (RÉSOLU)

Corrigé en Commit 2 (`d51300de`). 2 occurrences dans `enviro-navbar.tsx` :
- Ligne 192-202 : bouton mobile open
- Ligne 255-262 : bouton mobile close drawer

Ajouté `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60` sur les 2.

### CLEAN-1 : Clés i18n mortes après Phase 7.3 (RÉSOLU)

Corrigé en Commit 2 (`d51300de`). Suppression de :
- `marketing.documentation`
- `marketing.documentationSubtitle`

Plus aucun consumer dans le codebase après migration vers `docs.title` / `docs.subtitle`.

---

## 6. Pre-existing issues hors scope Phase 8

### COSM-1 : Em-dashes dans i18n (73 occurrences)

**Scope** : `i18n/messages/{fr,en}/*.json` (13 fichiers : marketing, dashboard, marketplace, carbon, rse, compliance, common, blockchain, externalActivities, pricingPage, verify, pricing).

**Pourquoi pas Phase 8** :
- Typographiquement corrects en français (em-dash = ponctuation parenthétique)
- Aucune occurrence dans `components/enviro/*` (rule code respectée)
- Toucher 73 strings sur 13 fichiers crée un risque de régression visuelle sur copy marketing
- Le rule projet "zéro em-dash" semblait viser le code et les commits, pas les translations user-facing

**Recommandation** : backlog cleanup dédié si décision projet de stricte interprétation. Sinon, accepter les em-dashes en copy.

### COSM-2 : `aria-label="no"` hardcodé en EN dans `enviro-comparison-table.tsx:155`

Phase 5 legacy. Correction propre nécessite ajout de prop `noLabel` sur le composant + propagation dans tous les call-sites. Hors scope a11y polish Phase 8.

### COSM-3 : 2 TODO placeholders newsletter forms

Markers explicites pour wiring server action future. Non introduits par Phase 7+. À traiter quand le wiring sera fait.

### COSM-4 : 3 `console.error` legacy

`marketing/explorer/page.tsx` (2 hits), `home/[account]/marketplace/new/_components/create-listing-form.tsx`, `home/[account]/members/_lib/server/members-page.loader.ts`. Logging légitime côté serveur sur erreurs Supabase. Acceptable.

### TS-Pre1 (RÉSOLU) : 2 erreurs TS baseline Phase 6

Corrigé en Commit 1 (`88899c81`).

---

## 7. Recommandation Phase 9

### Statut technique : GO conditionnel

**Argumentaire GO** :
- 5 segments scope Phase 1-7 validés et build vert
- Typecheck 100% propre après Commit 1
- i18n parity 100% sur 28 namespaces
- A11Y polish complet sur le périmètre Enviro
- 0 bloquant identifié

**Argumentaire NO-GO strict** :
- Le segment team account `/home/[account]/*` reste sur le UI legacy Makerkit
- Discontinuité visuelle visible pour tous les users en context multi-tenant
- Effet amplifié si `enableTeamsOnly` activé (toute la surface user devient legacy)

### Options de mitigation Phase 9

**Option 1 : GO direct, accepter le legacy team account**
- Phase 9 deploy maintenant avec les 5 segments migrés
- Communication produit : "team workspaces conservent le UI legacy v1, refonte v2 en backlog"
- Risque : feedback users "le design n'est pas cohérent quand je change de workspace"
- Délai : 0h

**Option 2 : Phase 7.4 team account avant Phase 9**
- Créer `EnviroTeamWorkspaceShell` mirror de `EnviroDashboardShell`
- Migrer les 9 routes team account vers EnviroCard / EnviroButton / tokens Enviro
- Wrapper `WorkspaceDropdown`, `AccountMembersTable`, etc. sans toucher aux internals @kit
- Estimation : 4-6h (ratio Phase 6.x sur 9 routes denses avec containers @kit READ-ONLY)
- Risque : faible, pattern bien établi
- Avantage : Phase 9 ship complet sans gap UX

**Option 3 : GO Phase 9 avec feature flag temporaire**
- Override `NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS=false` en production initiale
- Désactive création de teams et redirect des routes `/home/[account]/*`
- Phase 7.4 team account peut être faite post-deploy en preview env
- Risque : perte de feature multi-tenant en production v1
- Délai déploiement : 0h, mais coupe une fonctionnalité

### Recommandation auteur du rapport

**Option 2** est la plus sûre pour cohérence UX et minimise le risque de feedback négatif. 4-6h de Phase 7.4 contre une migration complète et cohérente vaut le coût. Si timing serré, Option 3 (feature flag) reste un fallback acceptable.

Option 1 n'est recommandée que si le marketing produit assume publiquement le legacy team workspace comme "v1, en cours de refonte".

---

## 8. Décision attendue

Avant Phase 9 deploy, arbitrage utilisateur requis :

1. **Décision team account** : Option 1, 2 ou 3 ?
2. **Décision em-dashes i18n** : strict cleanup en backlog ou acceptation typographique FR ?
3. **Décision smoke tests pré-deploy** : faut-il une suite Playwright minimale (sign-in, dashboard load, marketplace browse, docs index) avant le ship Vercel ?

Une fois ces 3 décisions prises, Phase 9 deploy peut être planifié.

---

## Annexe A : Commits Phase 8

| Commit | Scope | Files | Insertions / Deletions |
|---|---|---|---|
| `88899c81` | TS baseline fixes | 2 | +17 / -13 |
| `d51300de` | A11Y polish + i18n cleanup | 4 | +6 / -10 |
| (commit courant) | QA report | 1 | this file |

## Annexe B : Composants Enviro inventoriés (40)

Sous `apps/web/components/enviro/` :

- **Marketing (15)** : EnviroButton, EnviroCard, EnviroPageHero, EnviroHero, EnviroStats + AnimatedCounter, EnviroSectionHeader, EnviroFaq, EnviroNavbar, EnviroFooter, EnviroBlogCard, EnviroPricingCard, EnviroComparisonTable, EnviroNewsletterCta, EnviroLogoStrip, EnviroTimeline.
- **Animations (8)** : AnimatedCounter, FadeInSection, StaggerContainer, StaggerItem, MagneticWrapper, ParallaxContainer, PageTransition, TextReveal + useReducedMotionSafe hook.
- **Dashboard (13)** : EnviroDashboardShell, EnviroSidebarProvider + cookie, EnviroSidebar (lime/ember accent), EnviroSidebarNavItem, EnviroDashboardTopbar, EnviroUserMenu (locale switcher), EnviroDashboardBreadcrumb, EnviroStatCard + Grid (4 variants), EnviroDashboardSectionHeader, EnviroDataTable, EnviroEmptyState, EnviroChartCard, EnviroFilterChips.
- **Auth (4)** : EnviroAuthLayout, EnviroAuthHero, EnviroAuthHeading, EnviroAuthLoading.
- **Admin (1)** : EnviroAdminShell.
- **Docs (8)** : EnviroDocsSidebar + Provider, EnviroDocsTOC, EnviroDocsCard, EnviroDocsHeader, EnviroDocsProse, EnviroDocsBackButton, EnviroDocsNavLink, EnviroFloatingDocsNavButton + slugify util.

## Annexe C : Namespaces i18n (28)

`account`, `admin`, `auth`, `billing`, `blockchain`, `blog`, `carbon`, `changelog`, `common`, `compliance`, `contact`, `dashboard`, `docs`, `enviroPreview`, `esg`, `externalActivities`, `faq`, `legal`, `marketing`, `marketplace`, `normes`, `pricing`, `pricingPage`, `rse`, `teams`, `transactions`, `verify`, `wallet`.

3 156 clés par locale. Symétrie FR/EN structurellement vérifiée (0 chemin asymétrique).
