# Phase 7 - Auth + Admin + Docs audit

> **Statut** : checkpoint Phase 7.0 - read-only audit.
> **Branche cible** : `enviro-adoption/v1` (commits Phase 7.x suivront).
> **Décisions amont** (issues du brief) :
> - Auth : split-screen Enviro avec form left + hero illustration right.
> - Admin : tone ember accent (différencier du dashboard user lime).
> - Docs : Keystatic-backed avec sidebar Enviro + TOC sticky.

---

## 1. Découverte critique - surfaces majoritairement `@kit/*` READ-ONLY

Trois segments, **trois réalités différentes** côté propriété du code :

### Auth (5 routes, 329 LOC) - chrome only

Les pages auth de `apps/web/app/[locale]/auth/*` sont des **wrappers minces autour de containers `@kit/auth/*`** :

| Page | Container kit utilisé |
|---|---|
| `/auth/sign-in` | `SignInMethodsContainer` (`@kit/auth/sign-in`) |
| `/auth/sign-up` | `SignUpMethodsContainer` (`@kit/auth/sign-up`) |
| `/auth/password-reset` | `PasswordResetRequestContainer` (`@kit/auth/password-reset`) |
| `/auth/verify` | `MultiFactorChallengeContainer` (`@kit/auth/mfa`) |
| `/auth/callback/error` | `ResendAuthLinkForm` (`@kit/auth/resend-email-link`) |

Le layout actuel utilise `AuthLayoutShell` de `@kit/auth/shared` (lui aussi READ-ONLY).

**Conséquence pour Phase 7** : nous ne pouvons re-skinner ni les inputs (email, password, OTP), ni les boutons OAuth, ni les validations Zod inline. Notre marge de manœuvre est :

1. **Layout shell custom** - remplacer `AuthLayoutShell` par notre propre `EnviroAuthLayout` au niveau `apps/web` (split-screen Enviro). Le contenu des pages reste inchangé, juste l'enveloppe.
2. **Heading + subheading + footer link** - remplacer `Heading` + `Trans` + `Button variant="link"` par des helpers Enviro (`EnviroDashboardSectionHeader` ou variant simplifié, `EnviroButton variant="ghost"`).
3. **Tokens Enviro sur la surface** - passer le fond de cream à un split forest/cream avec illustration à droite.

Les containers `@kit/auth/*` héritent automatiquement du theme Tailwind global (focus ring, primary color, etc.) tant que l'on n'altère pas leur markup.

### Admin (4 routes, 281 LOC) - chrome + sidebar custom

| Page | Container kit utilisé |
|---|---|
| `/admin` | `AdminDashboard` + `AdminGuard` (`@kit/admin/components`) |
| `/admin/accounts` | `AdminAccountsTable` + `AdminCreateUserDialog` + `AdminGuard` (`@kit/admin/components`) + `ServerDataLoader` (`@makerkit/data-loader-supabase-nextjs`) |
| `/admin/accounts/[id]` | (à confirmer) |
| `/admin` layout | `AdminSidebar` + `AdminMobileNavigation` (composants **custom** dans `apps/web/app/[locale]/admin/_components/`) |

**Conséquence pour Phase 7** : marge identique à l'auth pour les pages individuelles (chrome only), MAIS le shell admin (sidebar) est entièrement réécrit-able car custom. C'est l'opportunité principale du segment.

### Docs (2 routes + 8 components, 461 LOC) - pleinement re-skinnable

| Élément | Propriété | Re-skin |
|---|---|---|
| `/docs` page (index) | Custom | OUI |
| `/docs/[...slug]` page (article) | Custom | OUI |
| `/docs` layout | Custom (utilise `@kit/ui/sidebar` SidebarProvider) | OUI |
| 8 composants `_components/*.tsx` | Custom | OUI |
| `_lib/server/docs.loader.ts` | `@kit/cms` Keystatic backend | READ-ONLY ✅ |
| `_lib/utils.ts` (`buildDocumentationTree`) | Custom | Préserver logique |

**Conséquence pour Phase 7** : le segment docs est de loin le plus re-skinnable end-to-end. C'est l'opportunité de livrer une expérience prose Enviro complète (similaire à `/blog/[slug]` Phase 4.6).

---

## 2. Cartographie détaillée

### 2.1 Auth segment

#### Routes (7 fichiers, 329 LOC totaux)

| Route | LOC | Container kit | i18n keys utilisées |
|---|---|---|---|
| `auth/layout.tsx` | 9 | `AuthLayoutShell` (`@kit/auth/shared`) | aucune |
| `auth/loading.tsx` | 3 | (loading minimal) | aucune |
| `auth/sign-in/page.tsx` | 71 | `SignInMethodsContainer` | `auth.signIn`, `auth.signInHeading`, `auth.signInSubheading`, `auth.doNotHaveAccountYet` |
| `auth/sign-up/page.tsx` | 62 | `SignUpMethodsContainer` | `auth.signUp`, `auth.signUpHeading`, `auth.signUpSubheading`, `auth.alreadyHaveAnAccount` |
| `auth/password-reset/page.tsx` | 56 | `PasswordResetRequestContainer` | `auth.passwordResetLabel`, `auth.passwordResetSubheading`, `auth.passwordRecoveredQuestion` |
| `auth/verify/page.tsx` | 54 | `MultiFactorChallengeContainer` (MFA) | `auth.signIn` (titre uniquement) |
| `auth/callback/error/page.tsx` | 74 | `ResendAuthLinkForm` + `Alert` + custom switch | `auth.authenticationErrorAlertHeading/Body`, `auth.signIn` |

#### Hooks et imports `@kit/*` (READ-ONLY)

```
@kit/auth/sign-in              → SignInMethodsContainer
@kit/auth/sign-up              → SignUpMethodsContainer
@kit/auth/password-reset       → PasswordResetRequestContainer
@kit/auth/mfa                  → MultiFactorChallengeContainer
@kit/auth/resend-email-link    → ResendAuthLinkForm
@kit/auth/shared               → AuthLayoutShell
@kit/shared/utils              → getSafeRedirectPath
@kit/supabase/check-requires-mfa
@kit/supabase/server-client    → getSupabaseServerClient (verify page only)
@kit/ui/alert + @kit/ui/heading + @kit/ui/button + @kit/ui/trans
```

#### Server Actions / API routes touchées

**Aucune** côté nos fichiers. Toutes les Server Actions auth (sign-in, sign-up, password reset, OAuth callback, MFA challenge) vivent dans `@kit/auth/*` ou sont des routes natives Supabase Auth. Phase 7 ne les touche pas.

#### i18n auth (extrait)

`apps/web/i18n/messages/{fr,en}/auth.json` existe et compte ~80 keys déjà documentées (signIn, signUp, password reset, providers, captcha, MFA, invite flow). **Pas de nouveau namespace nécessaire** ; juste ajouter quelques keys layout (e.g. `auth.layoutHeroTagline`, `auth.layoutHeroSubtitle`) pour le split-screen hero.

---

### 2.2 Admin segment

#### Routes (4 fichiers, 281 LOC totaux)

| Route | LOC | Container kit | Reskin scope |
|---|---|---|---|
| `admin/layout.tsx` | 44 | `SidebarProvider` (`@kit/ui/sidebar`) | Layout entier ré-écrit-able |
| `admin/page.tsx` | 15 | `AdminDashboard` + `AdminGuard` (`@kit/admin/components`) | Chrome only |
| `admin/accounts/page.tsx` | 77 | `AdminAccountsTable` + `AdminCreateUserDialog` + `AdminGuard` + `ServerDataLoader` | Chrome only |
| `admin/accounts/[id]/page.tsx` | 47 | (à confirmer en Phase 7.2) | Chrome only |
| `admin/_components/admin-sidebar.tsx` | (custom) | Custom | RÉÉCRITURE COMPLÈTE en `EnviroAdminSidebar` ember tone |
| `admin/_components/mobile-navigation.tsx` | (custom) | Custom | Réécriture |

#### Décision Phase 7 sur l'admin sidebar

L'audit a recommandé un **tone ember** (orange, par opposition au lime du dashboard user) pour différencier visuellement les deux contextes. Cohérent avec :
- forest-900 background (cohérent avec le dashboard user pour ne pas paraître étranger)
- ember-300 accent à la place du lime-300 pour le active state + indicateur gauche
- `[ Super Admin ]` bracket tag mono ember au lieu de lime sur le brand

#### i18n admin

**Aucun namespace** `admin` n'existe à ce jour. Les pages utilisent `Super Admin` hardcodé en anglais. Phase 7.2 créerait un nouveau namespace `admin` avec une dizaine de clés (sidebar labels, page titles).

---

### 2.3 Docs segment

#### Routes (2 pages + 8 components, 461 LOC totaux)

| Élément | LOC | Description |
|---|---|---|
| `docs/page.tsx` | 55 | Index docs : grid de cartes (parents niveau 0) |
| `docs/[...slug]/page.tsx` | (à mesurer Phase 7.3) | Article doc deep-link avec MDX/Markdoc rendu |
| `docs/layout.tsx` | 50 | SidebarProvider + DocsSidebar + DocsHeader |
| `docs/_components/docs-back-button.tsx` | (~20) | Bouton "back" |
| `docs/_components/docs-card.tsx` | (~50) | Card de doc parent |
| `docs/_components/docs-cards.tsx` | (~30) | Grid wrapper |
| `docs/_components/docs-header.tsx` | (~40) | Header docs avec search ? |
| `docs/_components/docs-nav-link.tsx` | (~30) | Item de nav sidebar docs |
| `docs/_components/docs-navigation.tsx` | (~80) | Sidebar navigation tree |
| `docs/_components/docs-navigation-collapsible.tsx` | (~70) | Wrapper collapsible group |
| `docs/_components/floating-docs-navigation-button.tsx` | (~40) | Bouton mobile flottant |

#### Backend docs (READ-ONLY)

```
_lib/server/docs.loader.ts → cache(docsLoader) → cms.getContentItems({ collection: 'documentation', language, limit: Infinity, content: false })
_lib/utils.ts → buildDocumentationTree(pages)
```

`createCmsClient` provient de `@kit/cms` qui wrap Keystatic ou Markdoc selon la config. **Phase 7 ne touche ni le CMS ni la fonction `buildDocumentationTree`.**

#### i18n docs

Pas de namespace dédié. `marketing.documentation` + `marketing.documentationSubtitle` existent. Création d'un namespace `docs` (15-20 keys : sidebar labels, search placeholder, breadcrumbs, "On this page" TOC, etc.) recommandée pour Phase 7.3.

---

## 3. Composants Enviro à créer / réutiliser

### Auth (Phase 7.1)

| Composant | Statut | Description |
|---|---|---|
| `EnviroAuthLayout` | **NOUVEAU** | Split-screen 50/50 desktop : form left (cream surface) + hero right (forest dark + tagline + Enviro brand mark + decorative SVG/illustration). Mobile : single column form, hero compressé en banner top. |
| `EnviroAuthHeading` | **NOUVEAU** | Variant simplifié de section header : bracket tag mono (e.g. `[ Sign in ]`) + display title + subtitle. Plus compact que `EnviroDashboardSectionHeader`. |
| `EnviroButton ghost` | Réutilisé | Pour les liens footer "déjà un compte ?" / "pas de compte ?" |
| `EnviroAuthHero` | **NOUVEAU** | Hero illustration component sur la moitié droite. Forest dark + lime accent + Leaf brand glyph + bracket tagline + 2-3 bullet points "Why GreenEcoGenius" optionnel. |
| Existing `@kit/auth/*` containers | INTACT | Les forms keep their kit styling, surface cream + tokens primary OK. |

### Admin (Phase 7.2)

| Composant | Statut | Description |
|---|---|---|
| `EnviroAdminSidebar` | **NOUVEAU** | Refonte de `admin-sidebar.tsx`. Forest-900 + ember-300 active + `[ Super Admin ]` bracket. Réutilise `EnviroSidebarProvider` + `useEnviroSidebar` du dashboard user. |
| `EnviroAdminMobileNavigation` | **NOUVEAU** | Refonte de `mobile-navigation.tsx`. Drawer ember accent. |
| `EnviroAdminLayout` | **MODIFIÉ** | `admin/layout.tsx` consomme `EnviroAdminSidebar` + `EnviroDashboardTopbar` (réutilisé du user) + slot `rightDrawer={null}` (pas de Genius en admin). |
| `EnviroDashboardSectionHeader` | Réutilisé | Section headers admin avec bracket `[ Super Admin ]` ember |

### Docs (Phase 7.3)

| Composant | Statut | Description |
|---|---|---|
| `EnviroDocsSidebar` | **NOUVEAU** | Sidebar docs forest-900 plus dense que la nav dashboard (groupes documentaires + sous-sections collapsibles). Style proche de Stripe / Vercel docs. |
| `EnviroDocsTOC` | **NOUVEAU** | Table-of-contents sticky desktop (right rail), forest-700 sur active heading. |
| `EnviroDocsCard` | **NOUVEAU** | Card de section docs (cream + lime accent + icône + titre + description + arrow chevron). |
| `EnviroDocsHeader` | **NOUVEAU** | Top bar docs avec breadcrumb + search trigger. |
| `EnviroDocsProse` | **NOUVEAU** | Wrapper Tailwind `prose` Enviro (lime headings underline, forest body, mono inline code, lime ember code blocks). Variant léger du `ContentRenderer` du blog Phase 4.6. |
| `EnviroDocsBackButton` | **NOUVEAU** | Refonte minimale (forest ghost button). |
| `EnviroDocsNavLink` | **NOUVEAU** | Item de nav sidebar docs avec active state lime. |
| `EnviroFloatingDocsNavButton` | **NOUVEAU** | Bouton mobile FAB ember pour ouvrir drawer docs. |

**Total Phase 7** : **12-14 nouveaux composants Enviro**, dont 5 réutilisables au-delà du segment d'origine (`EnviroAuthLayout` réutilisable pour error pages globales, `EnviroDocsProse` réutilisable pour CGU/legal/changelog).

---

## 4. Stratégie i18n Phase 7

### Décision : 3 extensions de namespaces existants + 0 nouveau

| Namespace | Action | Keys |
|---|---|---|
| `auth` | **Étendre** | +5 keys layout (`layoutHeroTagline`, `layoutHeroSubtitle`, `layoutHeroBullet1`, `layoutHeroBullet2`, `layoutHeroBullet3`) |
| `admin` | **NOUVEAU namespace** | ~12 keys (`title`, `dashboard`, `accounts`, `createUser`, `searchPlaceholder`, etc.) |
| `docs` | **NOUVEAU namespace** | ~18 keys (`searchPlaceholder`, `tocTitle`, `backToList`, `editOnGitHub`, `lastUpdated`, etc.) |

**Total ajouté Phase 7** : 35 keys × 2 locales = 70 keys (au-delà des ~1 963 actuelles → ~2 033).

---

## 5. Plan migration (4 commits planifiés + audit)

### Phase 7.0 - Audit (CE COMMIT)

`docs/enviro-migration/PHASE7-AUDIT.md` - ce document.

### Phase 7.1 - Auth pages (1 commit, ~3 h estimées)

| Fichier | Modification |
|---|---|
| `apps/web/components/enviro/auth/enviro-auth-layout.tsx` | NOUVEAU |
| `apps/web/components/enviro/auth/enviro-auth-heading.tsx` | NOUVEAU |
| `apps/web/components/enviro/auth/enviro-auth-hero.tsx` | NOUVEAU |
| `apps/web/components/enviro/auth/index.ts` | NOUVEAU barrel |
| `apps/web/app/[locale]/auth/layout.tsx` | Remplacer `AuthLayoutShell` par `EnviroAuthLayout` |
| `apps/web/app/[locale]/auth/sign-in/page.tsx` | Heading → `EnviroAuthHeading`, bouton link → `EnviroButton ghost` |
| `apps/web/app/[locale]/auth/sign-up/page.tsx` | idem |
| `apps/web/app/[locale]/auth/password-reset/page.tsx` | idem |
| `apps/web/app/[locale]/auth/verify/page.tsx` | Heading + intro |
| `apps/web/app/[locale]/auth/callback/error/page.tsx` | Heading + Alert + bouton retour |
| `apps/web/app/[locale]/auth/loading.tsx` | Spinner Enviro lime |
| `apps/web/i18n/messages/{fr,en}/auth.json` | +5 keys layout |

**STOP critique** après ce commit (premier contact users).

### Phase 7.2 - Admin segment (1 commit, ~2 h estimées)

| Fichier | Modification |
|---|---|
| `apps/web/components/enviro/admin/enviro-admin-sidebar.tsx` | NOUVEAU (forest-900 + ember active) |
| `apps/web/components/enviro/admin/enviro-admin-mobile-navigation.tsx` | NOUVEAU |
| `apps/web/components/enviro/admin/index.ts` | NOUVEAU barrel |
| `apps/web/app/[locale]/admin/layout.tsx` | Wrap avec `EnviroAdminLayout` |
| `apps/web/app/[locale]/admin/page.tsx` | `EnviroDashboardSectionHeader` ember |
| `apps/web/app/[locale]/admin/accounts/page.tsx` | Header + EnviroButton primary "Create user" wrap |
| `apps/web/app/[locale]/admin/accounts/[id]/page.tsx` | Header + breadcrumb |
| `apps/web/i18n/request.ts` | +1 namespace `admin` |
| `apps/web/i18n/messages/{fr,en}/admin.json` | NOUVEAU 12 keys × 2 |

**STOP** après ce commit.

### Phase 7.3 - Docs segment (1 commit, ~5 h estimées)

| Fichier | Modification |
|---|---|
| `apps/web/components/enviro/docs/enviro-docs-sidebar.tsx` | NOUVEAU |
| `apps/web/components/enviro/docs/enviro-docs-toc.tsx` | NOUVEAU |
| `apps/web/components/enviro/docs/enviro-docs-card.tsx` | NOUVEAU |
| `apps/web/components/enviro/docs/enviro-docs-header.tsx` | NOUVEAU |
| `apps/web/components/enviro/docs/enviro-docs-prose.tsx` | NOUVEAU |
| `apps/web/components/enviro/docs/enviro-docs-back-button.tsx` | NOUVEAU |
| `apps/web/components/enviro/docs/enviro-docs-nav-link.tsx` | NOUVEAU |
| `apps/web/components/enviro/docs/enviro-floating-docs-nav-button.tsx` | NOUVEAU |
| `apps/web/components/enviro/docs/index.ts` | NOUVEAU barrel |
| `apps/web/app/[locale]/docs/layout.tsx` | Refonte avec `EnviroDocsSidebar` + `EnviroDocsHeader` |
| `apps/web/app/[locale]/docs/page.tsx` | `EnviroPageHero` + grid `EnviroDocsCard` |
| `apps/web/app/[locale]/docs/[...slug]/page.tsx` | `EnviroDocsProse` + TOC sidebar right |
| `apps/web/app/[locale]/docs/_components/*.tsx` | Refonte ou suppression (remplacés par `~/components/enviro/docs/*`) |
| `apps/web/i18n/request.ts` | +1 namespace `docs` |
| `apps/web/i18n/messages/{fr,en}/docs.json` | NOUVEAU 18 keys × 2 |

**STOP final** Phase 7 après ce commit.

---

## 6. Risques identifiés et mitigations

| # | Risque | Probabilité | Sévérité | Mitigation |
|---|---|---|---|---|
| R1 | `@kit/auth/*` containers stylés legacy → contraste mauvais sur surface cream Enviro | Moyenne | Moyenne | Vérifier visuellement sur preview que les inputs/boutons OAuth restent lisibles. Si besoin, ajouter une override CSS scoped sur `.enviro-auth-card { ... }` pour les classes que les containers exposent. |
| R2 | `AdminGuard` (HOC) pourrait casser si on wrap deux fois (Enviro layout + Guard) | Faible | Critique | `AdminGuard` reste au niveau page (`export default AdminGuard(AccountsPage)`), Enviro layout est l'enveloppe. Pas de double wrap. |
| R3 | `ServerDataLoader` (`@makerkit/data-loader-supabase-nextjs`) consomme certains classNames | Faible | Faible | Pas de modification, juste l'enveloppe extérieure. |
| R4 | Docs `buildDocumentationTree` retourne une shape spécifique → `EnviroDocsSidebar` doit la respecter | Moyenne | Moyenne | Cartographier la signature exacte avant de coder. Tests : naviguer un doc deep, vérifier que la sidebar affiche le tree correct. |
| R5 | Docs prose : Markdoc/Keystatic peut générer des classNames spécifiques (heading IDs, code blocks) | Moyenne | Moyenne | `EnviroDocsProse` utilise des sélecteurs CSS larges (`.prose h1`, `.prose pre`, etc.) compatibles Tailwind Typography + Markdoc. Test : ouvrir 2-3 docs et vérifier code/headings/lists. |
| R6 | MFA flow / OAuth callback redirect peut casser si layout shell change | Faible | Critique | `EnviroAuthLayout` n'altère pas la chaîne redirect. Test sandbox : Google OAuth + email magic link + MFA TOTP. |
| R7 | `AuthLayoutShell` du kit pourrait être consommé ailleurs (e.g. invite flow) | Faible | Moyenne | Grep avant de retirer. Si oui, garder l'import comme fallback ou créer `EnviroAuthLayout` à côté. |
| R8 | Cache Turbopack après refonte layout auth | Haute | Faible | `rm -rf apps/web/.next` avant build final, comme Phase 5/6. |
| R9 | Premier contact users (auth) : régression visible immédiatement | Haute | Élevée | Soft launch progressif : Phase 7.1 commit isolé, valider en preview Vercel AVANT Phase 7.2. |
| R10 | Admin sidebar collide avec EnviroSidebarProvider du dashboard user (cookie `enviro_sidebar_collapsed` partagé) | Faible | Moyenne | Le cookie est global mais le rendu est gated par `useEnviroSidebar` consommé dans EnviroSidebar uniquement. Admin = nouveau Provider isolé OU réutiliser le même cookie (cohérent UX). Recommandation : réutiliser, comportement unifié. |
| R11 | i18n nouveau namespace `admin` + `docs` à ajouter à `apps/web/i18n/request.ts` (sinon load fail) | Moyenne | Faible | Toujours étendre `request.ts` au même commit que la création du namespace. |

---

## 7. Estimation temps Phase 7

| Phase | LOC à toucher | Composants à créer | Estimation |
|---|---|---|---|
| 7.0 audit (ce commit) | 0 (doc only) | 0 | 30 min ✅ |
| 7.1 auth (5 routes + layout) | ~330 | 3 | **3 h** (S+) |
| 7.2 admin (4 routes + sidebar) | ~280 | 2 | **2 h** (M) |
| 7.3 docs (2 routes + 8 components) | ~460 | 8 | **5 h** (XL) |

**Total Phase 7 : ~10 h** (conforme à l'estimation initiale).

---

## 8. Décisions à valider avant Phase 7.1

| # | Question | Recommandation |
|---|---|---|
| 1 | Auth split-screen : illustration à droite forest dark vs banner top horizontal sur desktop ? | **Split 50/50** desktop, banner-top mobile. Plus brand. |
| 2 | Hero auth : illustration SVG custom vs image Supabase Storage existante vs gradient + bracket tag minimal ? | **Gradient forest + bracket + 2-3 bullet "Why GEG"**. Pas d'image (pas de hit asset). |
| 3 | Admin tone : ember partout vs ember active state seulement (sidebar reste forest comme dashboard user) ? | **Sidebar forest-900 + active state ember-300** (au lieu de lime-300). Brand mark conserve son lime. Cohérence brand + différenciation context subtile. |
| 4 | Admin sidebar : reuse `EnviroSidebarProvider` du dashboard user OU nouveau `EnviroAdminSidebarProvider` isolé ? | **Reuse** le cookie `enviro_sidebar_collapsed` partagé. Comportement unifié si user navigue entre admin et dashboard. |
| 5 | Docs : créer un nouveau namespace `docs` OU étendre `marketing` qui a déjà `documentation` + `documentationSubtitle` ? | **Nouveau namespace `docs`**. Cleaner pour 18+ keys, isole le scope, simplifie maintenance. |
| 6 | Docs prose : créer `EnviroDocsProse` from scratch OU réutiliser le `ContentRenderer` du blog Phase 4.6 ? | **Nouveau `EnviroDocsProse`**. Le blog ContentRenderer est tuné pour articles éditoriaux (lecture longue, drop cap, callouts). La doc a besoin d'un prose plus dense + code blocks lourds + heading IDs cliquables pour TOC. |
| 7 | Docs sidebar collapse : 280 ↔ 72 px comme dashboard user OU sidebar fixe (pas de collapse) car contenu dense ? | **Fixe** (300 px expanded only, drawer mobile). Docs typiquement n'ont pas besoin de collapse car la sidebar est leur surface de navigation principale. |

---

## 9. Conclusion Phase 7.0

**3 commits Phase 7 prévus** (7.1 auth + 7.2 admin + 7.3 docs), **~10 h estimées**, **12-14 nouveaux composants Enviro**, **2 nouveaux namespaces i18n** + 1 extension.

**Auth est le plus risqué** (premier contact users), **docs est le plus de travail** (8 components à refondre), **admin est le plus contenu** (chrome only, sidebar custom à réécrire).

**Recommandation ordre** : 7.1 → STOP critique soft launch → 7.2 → STOP → 7.3 → STOP final Phase 7. Cette progression permet de catch les régressions auth en isolation avant d'investir dans admin/docs.

### Prochaine étape

**STOP audit** - réponds aux 7 questions section 8 et donne le GO Phase 7.1 (auth pages).
