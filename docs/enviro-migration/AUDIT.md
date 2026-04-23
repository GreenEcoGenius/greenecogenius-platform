# Phase 0 — Audit préalable adoption template Enviro

> **Statut** : checkpoint Phase 0 — read-only.
> **Branche cible** : `enviro-adoption/v1` (à créer en début de Phase 1).
> **Règle d'or** : aucun fichier `_lib/server/*.ts`, aucune route, aucun hook `@kit/*`, aucune env var, aucune migration SQL n'est touché.

---

## a) Pages marketing publiques `/(marketing)`

Routes recensées sous `apps/web/app/[locale]/(marketing)/` :

| Route publique | Fichier `page.tsx` | Type | Data fetching |
|---|---|---|---|
| `/` | `(marketing)/page.tsx` | Server Component | i18n + composants `_components/landing/*` |
| `/about` | `(marketing)/about/page.tsx` | Server Component | i18n |
| `/solutions` | `(marketing)/solutions/page.tsx` | Server Component | i18n |
| `/explorer` | `(marketing)/explorer/page.tsx` | Server Component | `_components/explorer-data.ts`, Supabase via `_lib/public-client.ts` |
| `/explorer/[category]` | `(marketing)/explorer/[category]/page.tsx` | Server Component dynamique | Supabase public client |
| `/explorer/region/[region]` | `(marketing)/explorer/region/[region]/page.tsx` | Server Component dynamique | Supabase public client |
| `/normes` | `(marketing)/normes/page.tsx` | Server Component | i18n |
| `/blog` | `(marketing)/blog/page.tsx` | Server Component | `@kit/cms` (Keystatic) |
| `/blog/[slug]` | `(marketing)/blog/[slug]/page.tsx` | Server Component dynamique | `@kit/cms` |
| `/changelog` | `(marketing)/changelog/page.tsx` | Server Component | `@kit/cms` |
| `/changelog/[slug]` | `(marketing)/changelog/[slug]/page.tsx` | Server Component dynamique | `@kit/cms` |
| `/contact` | `(marketing)/contact/page.tsx` | Server Component + form client | Server Action `_lib/server/server-actions.ts`, Zod `_lib/contact-email.schema.ts` |
| `/faq` | `(marketing)/faq/page.tsx` | Server Component | i18n |
| `/pricing` | `(marketing)/pricing/page.tsx` | Server Component | `_components/pricing-content.tsx`, `billing.config.ts` |
| `/terms-of-service` | `(marketing)/(legal)/terms-of-service/page.tsx` | Server Component | i18n / contenu statique |
| `/privacy-policy` | `(marketing)/(legal)/privacy-policy/page.tsx` | Server Component | i18n / contenu statique |
| `/cookie-policy` | `(marketing)/(legal)/cookie-policy/page.tsx` | Server Component | i18n / contenu statique |

**Total : 17 routes marketing.**

### Layout marketing actuel
`apps/web/app/[locale]/(marketing)/layout.tsx` : shell léger composé de `SiteHeader` + children + `SiteFooter`. Récupère `user` via `@kit/supabase/require-user` pour décorer le header.

### Composants marketing existants `_components/`

Liste exhaustive (24 fichiers) :

```
animate-on-scroll.tsx          (lib animation maison, IntersectionObserver)
animated-counter.tsx
hero-scroll-effect.tsx
hero-visual.tsx
landing/comparison-table.tsx
landing/faq-section.tsx
landing/foundations-section.tsx
landing/how-it-works.tsx
landing/impact-simulator.tsx
landing/latest-articles.tsx
landing/pricing-preview.tsx
landing/regulatory-timeline.tsx
landing/social-proof.tsx
landing/stats-section.tsx
logo-carousel.tsx
newsletter-form.tsx
service-overlay.tsx
site-footer.tsx                 (wrap @kit/ui/marketing Footer)
site-header.tsx                 (wrap @kit/ui/marketing Header)
site-header-account-section.tsx
site-navigation.tsx             (menu 7 items + drawer mobile inline-style)
site-navigation-item.tsx
site-page-header.tsx
```

### Server Actions à NE PAS toucher (READ-ONLY)
- `apps/web/app/[locale]/(marketing)/contact/_lib/server/server-actions.ts`
- `apps/web/app/[locale]/(marketing)/contact/_lib/contact-email.schema.ts`
- `apps/web/app/[locale]/(marketing)/explorer/_lib/public-client.ts`
- `apps/web/app/[locale]/(marketing)/explorer/_components/explorer-data.ts`

---

## b) Pages dashboard utilisateur `/home/(user)/*`

> Le segment `home/[account]/*` (team account) est **EXCLU** de la mission, conformément à la règle 9.

Routes recensées (sous-segments inclus) :

### Premier niveau (12 sections — alignées sur la sidebar)

| Route | Fichier | Domaine |
|---|---|---|
| `/home` | `home/(user)/page.tsx` | Dashboard accueil + KPIs |
| `/home/marketplace` | `home/(user)/marketplace/page.tsx` | Le Comptoir Circulaire |
| `/home/carbon` | `home/(user)/carbon/page.tsx` | Bilan carbone Scopes 1/2/3 |
| `/home/esg` | `home/(user)/esg/page.tsx` | Reporting ESG / CSRD |
| `/home/traceability` | `home/(user)/traceability/page.tsx` | Traçabilité blockchain Polygon |
| `/home/rse` | `home/(user)/rse/page.tsx` | RSE & labels |
| `/home/compliance` | `home/(user)/compliance/page.tsx` | Conformité 42 normes |
| `/home/external-activities` | `home/(user)/external-activities/page.tsx` | Activités externes / docs |
| `/home/settings` | `home/(user)/settings/page.tsx` | Profil personnel |
| `/home/my-listings` | `home/(user)/my-listings/page.tsx` | Mes annonces marketplace |
| `/home/wallet` | `home/(user)/wallet/page.tsx` | Portefeuille / livraisons |
| `/home/billing` | `home/(user)/billing/page.tsx` | Facturation Stripe |
| `/home/pricing` | `home/(user)/pricing/page.tsx` | Pricing in-app |

### Sous-routes profondes

| Route | Fichier |
|---|---|
| `/home/marketplace/new` | `marketplace/new/page.tsx` |
| `/home/marketplace/[id]` | `marketplace/[id]/page.tsx` |
| `/home/marketplace/[id]/confirmation` | `marketplace/[id]/confirmation/page.tsx` |
| `/home/carbon/assessment` | `carbon/assessment/page.tsx` |
| `/home/esg/csrd` | `esg/csrd/page.tsx` |
| `/home/esg/data-entry` | `esg/data-entry/page.tsx` |
| `/home/esg/reports` | `esg/reports/page.tsx` |
| `/home/esg/wizard` | `esg/wizard/page.tsx` |
| `/home/rse/diagnostic` | `rse/diagnostic/page.tsx` |
| `/home/rse/roadmap` | `rse/roadmap/page.tsx` |
| `/home/transactions/[id]` | `transactions/[id]/page.tsx` |
| `/home/billing/return` | `billing/return/page.tsx` |

### Layout dashboard actuel
`apps/web/app/[locale]/home/(user)/layout.tsx` : two-mode layout (`sidebar` ou `header`) selon cookie `layout-style`. Hooks utilisés :
- `loadUserWorkspace()` (Server Action `_lib/server/load-user-workspace.ts`) — **READ-ONLY**
- `UserWorkspaceContextProvider` (`@kit/accounts/components`)
- `SidebarProvider`, `Page`, `PageNavigation` (`@kit/ui`)
- `ChatProvider`, `GlobalAIAssistant`, `SidebarChatBridge`, `AppHeader`, `GlobalSearch`, `HomeSidebar`, `HomeMenuNavigation`

### Composants `_components/` du dashboard user (13 fichiers)

```
chat-aware-content.tsx
home-account-selector.tsx
home-accounts-list.tsx
home-add-account-button.tsx
home-menu-navigation.tsx          (variant header — nav horizontale)
home-mobile-navigation.tsx
home-page-header.tsx
home-sidebar.tsx                  (variant sidebar — barre verticale)
kpi-card.tsx
mobile-sidebar-toggle.tsx
section-footer-image.tsx
section-header.tsx
user-notifications.tsx
```

### Sous-`_components/` métier (échantillon non exhaustif, totalité 91 fichiers)
- `carbon/_components/` : `carbon-by-material-chart.tsx`, `carbon-export-button.tsx`, `carbon-hero-metrics.tsx`, `carbon-transactions-table.tsx`
- `esg/_components/` : `benchmark-card.tsx`, `csrd-compliance-chart.tsx`, `esg-status-header.tsx`, `no-subscription-preview.tsx`
- `rse/_components/` : `rse-actions-list.tsx`, `rse-score-gauge.tsx`
- `traceability/_components/` : `ecosystem-banner.tsx`, `traceability-activity-feed.tsx`, `traceability-equivalences.tsx`, `traceability-evolution-chart.tsx`
- `compliance/_components/` : `label-eligibility-section.tsx`
- `external-activities/_components/` : `document-uploader.tsx`
- `wallet/_components/` : `confirm-delivery-button.tsx`
- `transactions/[id]/_components/` : `signature-status-row.tsx`

### Server Actions à NE PAS toucher (READ-ONLY) — segment `home/(user)`
- `home/(user)/_lib/server/load-user-workspace.ts`
- `home/(user)/billing/_lib/server/personal-account-billing-page.loader.ts`
- `home/(user)/billing/_lib/server/server-actions.ts`
- `home/(user)/billing/_lib/server/user-billing.service.ts`
- `home/(user)/billing/_lib/schema/personal-account-checkout.schema.ts`
- `home/(user)/carbon/_lib/carbon-actions.ts`
- `home/(user)/external-activities/_lib/server/server-actions.ts`
- `home/(user)/external-activities/_lib/external-activity.schema.ts`
- `home/(user)/rse/_lib/rse-actions.ts`
- `home/(user)/rse/_lib/rse-pdf.ts`
- `home/(user)/transactions/_lib/server/server-actions.ts`

### Source de vérité de la sidebar
`apps/web/config/personal-account-navigation.config.tsx` — déjà conforme au plan (2 groupes, 8 + 4 items, libellés via clés i18n `common.routes.*`). **À conserver tel quel**, le restyle Enviro consistera uniquement à habiller `HomeSidebar` (composant React de présentation).

---

## c) Composants `@kit/ui` utilisés dans pages publiques et dashboard

Liste agrégée (imports `@kit/ui/*` détectés dans les pages, layouts et `_components/`) :

```
@kit/ui/marketing            Header, Footer, Hero, GradientSecondaryText, ...
@kit/ui/navigation-menu      NavigationMenu, NavigationMenuList
@kit/ui/page                 Page, PageNavigation
@kit/ui/sidebar              SidebarProvider + sub-components
@kit/ui/trans                Trans (i18n inline)
@kit/ui/utils                cn helper
@kit/ui/button               Button + variants
@kit/ui/card                 Card, CardHeader, CardContent, CardFooter, CardTitle
@kit/ui/input                Input
@kit/ui/textarea             Textarea
@kit/ui/select               Select + sub
@kit/ui/dialog               Dialog
@kit/ui/sheet                Sheet
@kit/ui/dropdown-menu        DropdownMenu + sub
@kit/ui/tabs                 Tabs, TabsList, TabsTrigger, TabsContent
@kit/ui/accordion            Accordion + sub
@kit/ui/badge                Badge
@kit/ui/separator            Separator
@kit/ui/tooltip              Tooltip + Provider
@kit/ui/skeleton             Skeleton
@kit/ui/progress             Progress
@kit/ui/checkbox             Checkbox
@kit/ui/switch               Switch
@kit/ui/form                 Form, FormField, FormItem, FormLabel, FormMessage
@kit/ui/spinner              Spinner
@kit/ui/alert                Alert
@kit/ui/loading-overlay      LoadingOverlay
@kit/ui/navigation-schema    NavigationConfigSchema
@kit/ui/sub-heading          SubHeading
```

Tous ces composants seront **wrappés** (jamais réécrits) dans `apps/web/components/enviro/` via des composants Enviro qui composent les primitives `@kit/ui` et leur appliquent les tokens `enviro-*`.

---

## d) Tokens existants dans `apps/web/styles/theme.css`

Synthèse du contenu actuel (à **préserver intégralement**) :

### Bloc `@theme` (≈ 115 lignes)
- **Brand emerald** (`--color-brand-*`) : palette complète 50→900, base `#1BAF6A`.
- **Brand accent lime** (`--color-brand-accent-*`) : palette complète 50→900, base `#7EC845`.
- **Primary** (`--color-primary-*`) : alias de brand.
- **Accent green** (`--color-accent-green*`).
- **Circuit blues tech** (`--color-circuit-*`) : `#00d4ff`, `#2eafcf`, `#5bc4d6`, `#a8e4f0`, palette 50→700.
- **Tech verts** (`--color-tech-*`) : neon, emerald, mint.
- **Metal gris bleutés** (`--color-metal-*`) : palette 50→900, neutres premium.
- **KPI gradients** (`--color-kpi-*`).
- **Indicators** (`--color-indicator-*`) : success, warning, error, info, purple.
- **Badges** (`--color-badge-*-bg/-text`).
- **Chart palette** (`--color-chart-*`).

### Bloc `:root` (light mode)
- `--background: #f4f6f8`, `--foreground: #111827`, `--primary: #1BAF6A`, `--ring: #1BAF6A`, `--radius: 0.75rem`, plus sidebar tokens.

### Bloc `.dark` (dark mode)
- `--background: #0f172a`, ..., palette adaptée.

### Verdict
**Aucun token `enviro-*` actuellement**. La Phase 1 ajoutera un nouveau bloc dans `@theme`, en **annexe** des tokens existants, sans aucune modification ni écrasement.

### Autres CSS d'`apps/web/styles/`
- `globals.css` (entrypoint, importe theme + makerkit + shadcn-ui + markdoc)
- `makerkit.css` (overrides Makerkit)
- `shadcn-ui.css` (mapping shadcn ↔ tokens sémantiques)
- `markdoc.css` (typographie docs)

Aucun de ces fichiers ne sera modifié en Phase 1 (sauf si une dépendance technique apparaît, auquel cas elle sera signalée avant changement).

---

## e) Présence du dossier `public/enviro/`

**STATUT : PRÉSENT** — pas de TODO de décompression.

```
apps/web/public/enviro/
├── index.html
├── about-us.html
├── pricing.html
├── service.html
├── project.html
├── blog-post.html
├── contact.html
├── 404.html
├── style-guide.html
├── license.html
├── changelog.html
├── detail_services.html
├── detail_blog.html
├── detail_project.html
├── css/
│   ├── normalize.css                                 (355 lignes)
│   ├── webflow.css                                   (1797 lignes)
│   └── erviss-greenecogenius-fantastic-site.webflow.css   (6915 lignes)
├── js/
│   └── webflow.js                                    (336 KB minifié, 1 ligne)
├── images/                                           (130 fichiers AVIF + SVG + PNG OG)
└── videos/                                           (présent — à inspecter)
```

### Tokens couleur Enviro extraits du CSS principal (sondage initial)

```
--primary-color:       #063232   (forest deep — fond dominant)
--green-100:           #1f4646   (forest mid — surfaces secondaires)
--dark-gray:           #2b5151   (slate vert profond)
--green-light-color:   #c2df93   (lime clair — accents)
--secondary-color:     #e3572b   (orange ember — CTA)
--sky-blue-color:      #ecf8f8   (cream / sky — fonds clairs)
--off-white-color:     #e5e5e5   (off-white)
--off-white-text-color:#ffffffb3 (texte sur fond sombre, alpha ≈ 70%)
--white-color:         #fff
```

### Tokens typo Enviro

```
--_typography---font-family--primary-font: Inter, sans-serif;
display sizes: 16, 18, 20, 22, 24, 28, 32, 40, 48, 64, 170 px (display-1 → display-13)
weights: 400 normal, 500 medium, 600 semi-bold, 700 bold
line-heights: 100, 110, 120, 130, 150 %
```

### Tokens spatiaux Enviro
- `--_size---border-radius--*` : 10, 20, 40, 50, 100 px (`2xsm` → `xlg` + pill)
- `--_size---padding--*` : 8, 10, 16, 18, 20, 24, 30, 32, 40 px
- `--_size---gap--*` : 6, 8, 10, 12, 16, 24, 40, 56, 80 px
- `--_size---margin--*` : 10, 16, 20, 24, 30, 32, 102 px

> La Phase 1 produira un mapping exhaustif `--enviro-color-*`, `--font-enviro-*`, `--radius-enviro-*`, `--shadow-enviro-*`, `--spacing-enviro-*` dans `theme.css` et un miroir TypeScript dans `apps/web/lib/enviro-tokens.ts`.

### URL preview prévue
- En l'état (Next.js sert `public/` à la racine), `index.html` est accessible à `http://localhost:3000/enviro/index.html`.
- L'objectif Phase 2 est de garantir un alias propre `/preview/enviro.html` (soit via redirect dans `next.config.mjs`, soit via une route statique dédiée). À traiter en Phase 2.

---

## f) Animations & dépendances visuelles

État actuel des dépendances dans `apps/web/package.json` :

| Dépendance | Présente ? | Version | Usage prévu Enviro |
|---|---|---|---|
| `framer-motion` | **NON** | — | Reveal sections, page transitions, magnetic buttons |
| `gsap` | **NON** | — | ScrollTrigger pour AnimatedCounter, parallax, magnetic cursor (`gsap.quickTo`) |
| `lenis` | **NON** | — | Smooth scrolling global |
| `tw-animate-css` | OUI | catalog | déjà présent — animations utilitaires Tailwind |
| `recharts` | OUI | catalog | charts dashboard (à restyler avec palette Enviro) |
| `lucide-react` | OUI | catalog | icônes |

→ **Action Phase 1 : installer `framer-motion`, `gsap`, `lenis`** dans `apps/web/package.json` (versions stables récentes, à figer après vérif `pnpm view`).

### Animation maison déjà existante
- `apps/web/app/[locale]/(marketing)/_components/animate-on-scroll.tsx` : IntersectionObserver simple — sera conservé en parallèle, pourra cohabiter avec Framer Motion ou être progressivement remplacé.
- `animated-counter.tsx`, `hero-scroll-effect.tsx` : à wrapper / rebrancher sur GSAP ScrollTrigger en Phase 3 sans suppression brutale.

---

## g) Fonts actuellement chargées

`apps/web/lib/fonts.ts` :

```ts
import { Plus_Jakarta_Sans as SansFont } from 'next/font/google';
const sans = SansFont({ subsets: ['latin'], variable: '--font-sans-fallback', weight: ['300','400','500','600','700'], ... });
const heading = sans;
```

> **DIVERGENCE détectée** vs hypothèse du méga-prompt : la plateforme utilise actuellement **Plus Jakarta Sans**, **PAS Inter**.
>
> **Décision recommandée à valider avant Phase 1** :
> - **Option A (recommandée pour fidélité visuelle Enviro)** : ajouter `Inter` via `next/font/google` dans `lib/fonts.ts`, exposer `--font-enviro-display` et `--font-enviro-sans`, tout en gardant `Plus Jakarta Sans` comme fallback. Les composants Enviro pourront mapper sur Inter, le reste de la plateforme reste sur Plus Jakarta Sans pendant la transition.
> - **Option B** : conserver Plus Jakarta Sans partout (économise un download de font, mais l'esthétique Enviro perdra son caractère typographique).
>
> **Question pour toi (point bloquant Phase 1)** : Option A ou Option B ?

---

## h) Intégrations sensibles — NO-TOUCH

| Intégration | Surface technique | Fichiers / packages concernés | Statut |
|---|---|---|---|
| **Supabase** | Auth, DB, RLS, storage, realtime | `@kit/supabase`, `@kit/auth`, `apps/web/supabase/`, `apps/web/lib/database.types.ts` | **READ-ONLY** : aucune migration, aucune policy RLS, aucun `getSupabaseServerClient` modifié |
| **Vercel** | Déploiement, cron, edge runtime | `apps/web/vercel.json`, `apps/web/next.config.mjs` | **READ-ONLY** : aucune env var ni config rewrite/redirect modifiée |
| **Docusign** | Signatures électroniques contrats marketplace | `apps/web/lib/signature/docusign-client.ts`, `contract-signature-service.ts`, `on-contract-fully-signed.ts` | **READ-ONLY** : implémentation custom (REST API), aucun npm `@docusign/*` à toucher |
| **Alchemy + Polygon** | Blockchain L2, certificats traçabilité | `apps/web/lib/blockchain/alchemy-service.ts`, `contracts/GEGTraceability.sol`, dep `ethers ^6.16.0` | **READ-ONLY** : pas de re-déploiement contrat, pas de RPC change |
| **Anthropic (Genius IA)** | Assistant IA contextuel, RSE/CSRD copilot | `@anthropic-ai/sdk ^0.39.0`, `apps/web/lib/ai/{client,orchestrator,genius-context,prompts}`, `apps/web/components/ai/*` | **READ-ONLY** : seul le `GlobalAIAssistant` rendu peut recevoir des skins enviro (sans toucher la logique chat) |
| **Stripe** | Billing personal + team | `@kit/billing-gateway` + provider `stripe` (catalog), `apps/web/config/billing.config.ts` | **READ-ONLY** : aucun webhook, schema, ni Stripe Customer touché |
| **next-intl** | i18n bilingue FR/EN | `apps/web/i18n/{request,messages}`, `@kit/i18n` | **EXTENSION ONLY** : ajout de nouvelles clés autorisé, jamais de renommage/suppression |
| **`@kit/*`** | 18 packages workspace | `packages/{accounts, admin, analytics, auth, billing, billing-gateway, cms, database-webhooks, email-templates, features, i18n, mailers, mcp-server, monitoring, next, notifications, otp, policies, shared, supabase, team-accounts, ui}` | **READ-ONLY** : aucune modification interne aux packages — uniquement consommation depuis `apps/web/components/enviro/` |
| **CMS Keystatic** | Blog, changelog | `@kit/cms`, `apps/web/content/`, env `CMS_CLIENT=keystatic` | **READ-ONLY** : structure des collections inchangée |

### Variables d'environnement critiques (extrait `.env`)

```
NEXT_PUBLIC_SITE_URL                    NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_PRODUCT_NAME                SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_TITLE                  STRIPE_SECRET_KEY (et NEXT_PUBLIC_STRIPE_*)
NEXT_PUBLIC_BILLING_PROVIDER=stripe     ANTHROPIC_API_KEY
NEXT_PUBLIC_AUTH_PASSWORD               ALCHEMY_API_KEY (référencé via lib/blockchain)
NEXT_PUBLIC_AUTH_MAGIC_LINK             DOCUSIGN_INTEGRATION_KEY (et autres DOCUSIGN_*)
CMS_CLIENT=keystatic                    MAILER_PROVIDER
NEXT_PUBLIC_KEYSTATIC_CONTENT_PATH      NEXT_PUBLIC_LANGUAGE_PRIORITY
NEXT_PUBLIC_LOCALES_PATH                NEXT_PUBLIC_USER_NAVIGATION_STYLE
NEXT_PUBLIC_DEFAULT_THEME_MODE          NEXT_PUBLIC_HOME_SIDEBAR_COLLAPSED
NEXT_PUBLIC_THEME_COLOR / *_DARK        NEXT_PUBLIC_SIDEBAR_COLLAPSIBLE_STYLE
... + ENABLE_TEAM_ACCOUNTS_*, FEATURE_FLAGS_*, MONITORING_*, CAPTCHA_*
```

**Aucune env var ne sera ajoutée, modifiée ou supprimée pendant cette mission.** Les nouveaux composants Enviro lisent leurs valeurs depuis i18n et tokens CSS.

---

## i) i18n — namespaces existants

`apps/web/i18n/messages/{fr,en}/` — **18 namespaces parfaitement symétriques FR ⇄ EN** :

```
account.json          billing.json          carbon.json
auth.json             blockchain.json       common.json
compliance.json       dashboard.json        esg.json
externalActivities.json   marketing.json    marketplace.json
pricing.json          pricingPage.json      rse.json
teams.json            verify.json           wallet.json
```

`marketing.json` est déjà très étoffé (505+ lignes en FR, contient hero, stats, features, blockchain, faq, comparison-table, regulatory-timeline, social-proof, etc.).

**Stratégie i18n pour l'adoption Enviro :**
- Aucun namespace renommé.
- Aucune clé existante supprimée.
- Nouvelles clés ajoutées au sein des namespaces existants (`marketing.*` pour les pages publiques, `dashboard.*` / `common.*` pour le dashboard).
- Si un nouveau cluster sémantique apparaît (ex: bracket-tags, magnetic CTA labels), création d'une sous-section comme `marketing.enviro.*` plutôt qu'un nouveau namespace.

---

## j) Inventaire des routes hors mission marketing/dashboard user

### `/admin` (mission Phase 7.2 — restyle accent ember, logique CRUD intacte)
- `/admin` → `admin/page.tsx`
- `/admin/accounts` → `admin/accounts/page.tsx` + `loading.tsx`
- `/admin/accounts/[id]` → `admin/accounts/[id]/page.tsx`
- Composants : `admin/_components/admin-sidebar.tsx`, `mobile-navigation.tsx`
- Layout : `admin/layout.tsx`

### `/auth` (mission Phase 7.1 — split-screen forêt Enviro)
- `/auth/sign-in`, `/auth/sign-up`, `/auth/password-reset`, `/auth/verify`, `/auth/callback/error`
- Route handlers (READ-ONLY) : `/auth/callback/route.ts`, `/auth/confirm/route.ts`
- Layout : `auth/layout.tsx` + `loading.tsx`

### `/docs` (mission Phase 7.3 — DocsShell prose Enviro)
- `/docs` (index)
- `/docs/[...slug]` (catch-all)
- Composants : `docs-back-button`, `docs-card`, `docs-cards`, `docs-header`, `docs-nav-link`, `docs-navigation`, `docs-navigation-collapsible`, `floating-docs-navigation-button`
- Loader : `_lib/server/docs.loader.ts` (READ-ONLY)

### Autres routes top-level
- `/identities` → `identities/page.tsx` (Phase 7.4)
- `/update-password` → `update-password/page.tsx` (Phase 7.4)
- `/join` → `join/page.tsx` (Phase 7.5)
- `/verify` (root + `[hash]`) → `verify/page.tsx`, `verify/[hash]/page.tsx`
- `/home/create-team` → `home/create-team/page.tsx`

### Hors scope explicite
- **`/home/[account]/*`** (team account) — 9 pages — **EXCLUS** (règle 9).

---

## k) Risques identifiés & points de vigilance

| # | Risque | Mitigation |
|---|---|---|
| R1 | Police divergente (Plus Jakarta Sans vs Inter) | Décision A/B avant Phase 1, communication explicite dans `enviro-tokens.ts` |
| R2 | `webflow.js` (336 KB) ne sera **jamais** chargé en runtime app | Réécriture animations en Framer Motion / GSAP. Le JS Webflow ne sert que pour la preview HTML statique. |
| R3 | Existence de composants landing déjà custom (`_components/landing/*`) | Les wrapper progressivement dans Enviro plutôt que les remplacer. Garder le contenu de `marketing.json` qui les alimente. |
| R4 | Layout dashboard supporte 2 styles via cookie (`sidebar` / `header`) | Le restyle Enviro doit fonctionner pour les **deux** modes ou imposer `sidebar` comme défaut Enviro (à arbitrer Phase 6). |
| R5 | `home/[account]/*` partage des composants avec `home/(user)/*` (ex: `marketplace/[id]`, `billing`, `settings`) | Restyler les composants partagés sans casser le rendu côté team account même si non explicitement migré. |
| R6 | Route `/home/pricing` dupliquée avec `/pricing` public | Conserver les deux, ne pas fusionner ; styler les deux indépendamment. |
| R7 | `next.config.mjs` n'a pas de redirect ni rewrite vers `/preview/enviro` | Phase 2 ajoutera soit un redirect (`/preview/enviro` → `/enviro/index.html`), soit un service direct. À choisir Phase 2. |
| R8 | `@kit/ui/marketing` Header & Footer sont les wrappers actuels du site | Le `EnviroNavbar` / `EnviroFooter` ne remplaceront ces primitives **que** dans `apps/web/app/[locale]/(marketing)/_components/site-header.tsx` et `site-footer.tsx`. Le package `@kit/ui` reste intact. |
| R9 | `react-compiler` activable via `ENABLE_REACT_COMPILER` | Vérifier à chaque phase que les composants client (Framer Motion, GSAP) restent compatibles |
| R10 | Plusieurs `_components/` consomment `useSignOut` et autres hooks `@kit/supabase/hooks` | Préserver ces hooks à l'identique dans les wrappers Enviro |

---

## l) Décisions à valider avant le démarrage de la Phase 1

1. **Font Inter ?** (point R1 / Option A vs B ci-dessus)
2. **Branche dédiée** : OK pour `enviro-adoption/v1` à créer maintenant ?
3. **Layout style dashboard par défaut** : forcer `sidebar` ou laisser le toggle cookie ? (impact Phase 6)
4. **Preview Enviro** : alias `/preview/enviro` ou laisser l'URL `/enviro/index.html` directe ? (impact Phase 2)
5. **Animations dépendances** : OK pour installer `framer-motion`, `gsap`, `lenis` (3 nouvelles deps prod sur `apps/web`) ?
6. **`/home/pricing` (route in-app)** : la traiter en Phase 6 ou en Phase 4 avec la route publique `/pricing` ?

---

## m) Ce qui sera créé en Phase 1 (preview)

Sans modifier l'existant :

1. `apps/web/styles/theme.css` — **AJOUT** d'un bloc `/* === ENVIRO DESIGN TOKENS === */` à la fin du `@theme` existant (couleurs, fonts, radii, shadows, spacings, transitions).
2. `apps/web/lib/enviro-tokens.ts` — **NOUVEAU** miroir TypeScript des tokens (consommable depuis Recharts, GSAP, Framer Motion).
3. `apps/web/package.json` — **AJOUT** des trois dépendances animation.
4. (Optionnel selon décision) `apps/web/lib/fonts.ts` — **EXTENSION** pour exposer Inter aux composants `enviro/`.

Aucun fichier existant d'`apps/web/app/`, d'`apps/web/components/` (hors `enviro/`), ni des packages `@kit/*` ne sera modifié en Phase 1.

---

## ✅ Conclusion Phase 0

L'audit est complet. Aucun blocage majeur détecté.
**Cinq points bloquants attendent une décision** (section l). Je STOP et j'attends ton feu vert.

Ensuite : Phase 1 — extraction des tokens Enviro et installation des dépendances d'animation.
