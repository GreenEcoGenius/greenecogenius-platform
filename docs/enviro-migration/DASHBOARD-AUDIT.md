# Phase 6 — Dashboard user audit

> **Statut** : checkpoint Phase 6.0 — read-only audit.
> **Branche cible** : `enviro-adoption/v1` (commits Phase 6.x suivront).
> **Décisions amont** (validées) :
> - Layout : sidebar forcée, toggle collapse 280 ↔ 72 px, pas de bi-mode.
> - Tone sidebar : forest-900 + lime active.
> - Ordre : Path B (simple → critique) avec 3 STOPs.
> - Charts : palette GEG d'origine, wrap card en `EnviroCard`.
> - PDF jsPDF, wallet blockchain, ChatProvider + Genius : préservés à 100 %.

---

## a) Cartographie des 13 sections

Le segment `apps/web/app/[locale]/home/(user)/*` contient **13 sections premier niveau**. Source de vérité de la nav (ordre strict) : `apps/web/config/personal-account-navigation.config.tsx` (2 groupes, 8 + 4 entrées).

### Groupe **Plateforme** (8 entrées de nav)

| # | Route | `page.tsx` | LOC | Sous-routes | `_components` files | `_lib/server` |
|---|---|---|---|---|---|---|
| 0 | `/home` | `page.tsx` | **408** | — | utilise `_components/{kpi-card,section-header,section-footer-image}` | `_lib/server/load-user-workspace.ts` |
| 1 | `/home/marketplace` | `marketplace/page.tsx` | 161 | `[id]/page.tsx`, `[id]/confirmation/page.tsx`, `new/page.tsx` | 0 (réutilise `~/home/_components/listing-card`) | — |
| 2 | `/home/carbon` | `carbon/page.tsx` | **548** | `assessment/page.tsx` | **11** (charts Recharts ×2, cards, tables, export) | `carbon/_lib/carbon-actions.ts` |
| 3 | `/home/esg` | `esg/page.tsx` | 128 | `csrd/page.tsx`, `data-entry/page.tsx`, `reports/page.tsx`, `wizard/page.tsx` | **17** (le segment le plus dense) | — |
| 4 | `/home/traceability` | `traceability/page.tsx` | 132 | — | **9** (charts Recharts ×2, blockchain table, banner, equivalences) | — |
| 5 | `/home/rse` | `rse/page.tsx` | 131 | `diagnostic/page.tsx`, `roadmap/page.tsx` | **9** | `rse/_lib/{rse-actions.ts, rse-pdf.ts}` |
| 6 | `/home/compliance` | `compliance/page.tsx` | 237 | — | **9** | — |
| 7 | `/home/external-activities` | `external-activities/page.tsx` | 225 | — | **4** (incl. document-uploader Server Action) | `external-activities/_lib/server/server-actions.ts` |

### Groupe **Mon compte** (4 entrées de nav)

| # | Route | `page.tsx` | LOC | Sous-routes | `_components` files | `_lib/server` |
|---|---|---|---|---|---|---|
| 8 | `/home/settings` | `settings/page.tsx` | 64 | — | **3** (incl. `profile-actions.tsx`) | layout dédié `settings/layout.tsx` |
| 9 | `/home/my-listings` | `my-listings/page.tsx` | 80 | — | 0 (réutilise composants partagés) | — |
| 10 | `/home/wallet` | `wallet/page.tsx` | 102 | — | **6** (incl. `transaction-history.tsx`, `confirm-delivery-button.tsx`) | — |
| 11 | `/home/billing` | `billing/page.tsx` | **390** | `return/page.tsx` | **7** | `billing/_lib/server/{personal-account-billing-page.loader, server-actions, user-billing.service}` + `_lib/schema/personal-account-checkout.schema.ts` |
| 12 | `/home/pricing` | `pricing/page.tsx` | 341 | — | 0 | — |

### Hors nav (mais dans le segment, traités en sweep avec leur parent)

| Route | Note |
|---|---|
| `/home/transactions/[id]` | Page détail transaction marketplace + signature Docusign. Composant `signature-status-row.tsx`. Server Action `sendContractForSignature`. |

**Totaux** : 13 entrées de nav, 23 routes (avec sous-routes), **~3 650 LOC** côté pages, **~80 fichiers `_components`**.

---

## b) Server Actions — READ-ONLY (NE JAMAIS MODIFIER)

Toutes les Server Actions et services serveur du dashboard, leur signature et leur rôle.

| Fichier | Export | Type | Rôle |
|---|---|---|---|
| `_lib/server/load-user-workspace.ts` | `loadUserWorkspace = cache(workspaceLoader)` | Server loader | Charge `accounts + workspace + user + canCreateTeamAccount` via `@kit/accounts/api`. Cached per-request. |
| `billing/_lib/server/personal-account-billing-page.loader.ts` | `loadPersonalAccountBillingPageData = cache(...)` | Server loader | Charge plan + factures + portal URL pour la page billing. |
| `billing/_lib/server/server-actions.ts` | `createPersonalAccountCheckoutSession` | `authActionClient` | Crée une session Stripe Checkout pour upgrade abonnement personnel. Schema Zod `PersonalAccountCheckoutSchema`. |
| `billing/_lib/server/server-actions.ts` | `createPersonalAccountBillingPortalSession` | `authActionClient` | Crée une session Stripe Customer Portal puis `redirect(url)`. |
| `billing/_lib/server/user-billing.service.ts` | `createUserBillingService(client)` | Service factory | Wrap les opérations Stripe (checkout + portal) sur un client Supabase. |
| `billing/_lib/schema/personal-account-checkout.schema.ts` | `PersonalAccountCheckoutSchema` | Zod schema | Validation input checkout. |
| `external-activities/_lib/server/server-actions.ts` | `createExternalActivity` | `authActionClient` | Crée une activité externe + recalcule la conformité ISO 26000/CSRD/B Corp via `evaluateAccountCompliance`. `revalidatePath` sur 2 routes. |
| `external-activities/_lib/server/server-actions.ts` | `deleteExternalActivity` | `authActionClient` | Supprime une activité externe + recalcule conformité. |
| `external-activities/_lib/external-activity.schema.ts` | `CreateExternalActivitySchema, DeleteExternalActivitySchema` | Zod schemas | Validation. |
| `transactions/_lib/server/server-actions.ts` | `sendContractForSignature` | `authActionClient` | Envoie le contrat à signature Docusign. Utilise `ContractSignatureService` (`~/lib/signature/...`). RLS-enforced sur `marketplace_transactions`. |
| `carbon/_lib/carbon-actions.ts` | `saveCarbonAssessment(formData)` | Server function | Persiste un bilan carbone Scopes 1/2/3. |
| `rse/_lib/rse-actions.ts` | `saveDiagnostic(answers)` | Server function | Persiste le diagnostic RSE ISO 26000. |
| `rse/_lib/rse-actions.ts` | `loadLatestDiagnostic()` | Server function | Charge le dernier diagnostic RSE de l'utilisateur. |
| `rse/_lib/rse-pdf.ts` | (jsPDF helpers) | Util | Génère le PDF de la feuille de route RSE. |

**Total : 14 surfaces serveur protégées.** Aucune ne sera modifiée pendant Phase 6.

---

## c) Hooks `@kit/*` utilisés (44 imports différents)

Liste exhaustive (extraite par grep) — tous **READ-ONLY** :

### Auth + workspace
- `@kit/supabase/server-client`, `@kit/supabase/server-admin-client`, `@kit/supabase/require-user`
- `@kit/supabase/hooks/use-sign-out` (client)
- `@kit/accounts/api`, `@kit/accounts/components`, `@kit/accounts/account-selector`, `@kit/accounts/personal-account-settings`
- `@kit/team-accounts/components`, `@kit/team-accounts/policies`

### Billing
- `@kit/billing`, `@kit/billing-gateway`, `@kit/billing-gateway/components`

### Notifications + AI
- `@kit/notifications/components`
- `@kit/shared/events`, `@kit/shared/logger`

### UI primitives (28 imports)
- `@kit/ui/sidebar`, `@kit/ui/sidebar-navigation`, `@kit/ui/page` (layout shell)
- `@kit/ui/button`, `@kit/ui/card`, `@kit/ui/card-button`, `@kit/ui/input`, `@kit/ui/textarea`, `@kit/ui/select`
- `@kit/ui/checkbox`, `@kit/ui/dropdown-menu`, `@kit/ui/tabs`, `@kit/ui/tooltip`, `@kit/ui/badge`, `@kit/ui/alert`
- `@kit/ui/form`, `@kit/ui/table`, `@kit/ui/empty-state`
- `@kit/ui/sonner`, `@kit/ui/global-loader`, `@kit/ui/if`, `@kit/ui/trans`, `@kit/ui/utils`
- `@kit/ui/bordered-navigation-menu`

### Action client
- `@kit/next/safe-action` (`authActionClient`, `publicActionClient`)

**Tous wrappés**, jamais réécrits — exactement comme Phase 4.

---

## d) Tables Supabase touchées par le dashboard (data fetching)

17 tables identifiées via `grep ".from('"` dans le segment :

| Table | Usage | Pages consommatrices |
|---|---|---|
| `accounts` | personal account workspace | layout, settings |
| `listings` | marketplace listings B2B | `/home`, marketplace, my-listings |
| `material_categories` | join sur listings (label catégorie) | marketplace, my-listings |
| `listing_images` | covers et previews | marketplace |
| `marketplace_transactions` | achats/ventes signés | wallet, transactions, billing |
| `carbon_assessments` | bilans carbone Scopes 1/2/3 | carbon, esg |
| `carbon_records` | enregistrements CO₂ par transaction | `/home`, carbon |
| `circularity_scores` | scores de circularité | carbon, traceability |
| `blockchain_records` | enregistrements on-chain Polygon | `/home`, traceability |
| `traceability_certificates` | certificats blockchain PDF | `/home`, traceability |
| `wallet_balances` | soldes utilisateur | wallet |
| `esg_reports` | rapports ESG/CSRD générés | esg |
| `account_norm_compliance` | scores 37 normes par utilisateur | `/home`, compliance |
| `rse_diagnostics` | diagnostics ISO 26000 | rse |
| `subscription_plans` | plans + features | pricing, billing |
| `organization_subscriptions` | abonnement actif | billing |
| `stripe_connected_accounts` | onboarding Stripe Connect (vendeurs) | wallet, billing |

**Aucune migration SQL, aucune RLS modifiée pendant Phase 6.** Toutes les requêtes consomment les tables via `getSupabaseServerClient()` (RLS-enforced) ou `getSupabaseServerAdminClient()` (bypass RLS pour reads agrégés type `subscription_plans`).

---

## e) Routes `/api/*` consommées par le dashboard

20 routes API REST identifiées via `grep "fetch.*'/api/"` :

```
/api/billing/checkout                  /api/esg/calculate
/api/carbon/export/csv                  /api/esg/data
/api/carbon/export/pdf                  /api/esg/report/generate
/api/certificates/issue                 /api/esg/benchmarking
/api/external-activities/analyze        /api/reports/compliance-audit
/api/external-activities/upload         /api/reports/esg-full
/api/stripe/commission/config           /api/stripe/connect/dashboard
/api/stripe/connect/onboarding          /api/stripe/connect/refresh
/api/stripe/delivery/confirm            /api/stripe/subscription/checkout
/api/stripe/subscription/portal
```

Toutes restent intactes côté backend. Phase 6 ne modifie que les sites d'appel côté UI.

---

## f) Composants existants — ce qui sera **réutilisé**

### Composants partagés `home/(user)/_components/`

| Fichier | Rôle | Statut Phase 6 |
|---|---|---|
| `chat-aware-content.tsx` | Décale le contenu de 380 px quand le panneau Genius IA est ouvert | **Préservé** (consommé par layout) |
| `home-account-selector.tsx` | Sélecteur d'organisation (si team accounts on) | Préservé (déclenché par `enableTeamAccounts`) |
| `home-accounts-list.tsx` + `home-add-account-button.tsx` | Listing organisations dans dropdown | Préservé |
| `home-menu-navigation.tsx` | Nav horizontale (mode header — sera retiré car bi-mode supprimé) | **À retirer** (décision : sidebar forcée) |
| `home-mobile-navigation.tsx` | Drawer mobile pour mode header | **À retirer** (décision : sidebar forcée) |
| `home-page-header.tsx` | Wrapper `PageHeader` `@kit/ui` | **À supprimer ou redéfinir** (sera remplacé par `EnviroSectionHeader` interne dashboard) |
| `home-sidebar.tsx` | `Sidebar` `@kit/ui` + `SidebarNavigation` driven by config | **Réécrit en `EnviroSidebar`** (forest tone, lime active) |
| `kpi-card.tsx` (+ `KpiCardGrid`) | Cards KPI avec gradient (teal/emerald/green) | **Restylé en `EnviroStatCard`** (tokens enviro-*) |
| `mobile-sidebar-toggle.tsx` | Trigger mobile pour sidebar | Préservé / restylé |
| `section-footer-image.tsx` | Image décorative pied de page section | Préservé / restylé léger |
| `section-header.tsx` | Header de section (h1 + p) avec i18n `dashboard.*Title/Desc` | **Étendu en `EnviroDashboardSectionHeader`** (bracket tag mono lime) |
| `user-notifications.tsx` | Wrap notifications `@kit/notifications` | Préservé (logic intact) |

### Composants liés au shell (hors `_components/`)

| Fichier | Rôle | Statut Phase 6 |
|---|---|---|
| `apps/web/components/layout/app-header.tsx` | Top-bar dashboard (search + Genius + locale + avatar) | **Restylé en `EnviroDashboardTopbar`** |
| `apps/web/components/layout/global-search.tsx` | Cmd+K palette | Préservé (wrap visuel uniquement) |
| `apps/web/components/ai/global-ai-assistant.tsx` | Drawer Genius right-side 380px | **PRÉSERVÉ 100 %** (décision validée) |
| `apps/web/components/ai/chat-context.tsx` + `sidebar-chat-bridge.tsx` | Provider + bridge sidebar↔chat | **PRÉSERVÉ 100 %** |

---

## g) Nouveaux composants Enviro à créer

`apps/web/components/enviro/dashboard/` (nouveau sous-dossier dédié) :

| # | Composant | Rôle | Wrap de |
|---|---|---|---|
| 1 | **`EnviroDashboardShell`** | Layout principal : `<div>` flex sidebar + main + Genius drawer area. Inclut `SidebarProvider`, `ChatProvider`, `SidebarChatBridge`, `GlobalAIAssistant` au bon endroit du tree | `@kit/ui/sidebar` + Phase 5 patterns |
| 2 | **`EnviroSidebar`** | Sidebar forest-900 sticky h-dvh, brand top, 2 groupes ("Plateforme" + "Mon compte"), active state lime + underline gauche, collapse 280↔72 (cookie `sidebar_state` préservé) | `@kit/ui/sidebar` + `personal-account-navigation.config` |
| 3 | **`EnviroSidebarNavItem`** | Item de nav forest sidebar : icône + label + active style + tooltip en collapse mode | `@kit/ui/sidebar` MenuItem |
| 4 | **`EnviroDashboardTopbar`** | Top-bar 64-72px : breadcrumb + search button + Genius toggle + locale + avatar dropdown. Auto-hide on scroll down (existant). | wrap `app-header.tsx` actuel |
| 5 | **`EnviroUserMenu`** | Avatar + dropdown : Profil, Facturation, Sign out. Réutilise hooks @kit/supabase | `@kit/ui/dropdown-menu` |
| 6 | **`EnviroDashboardBreadcrumb`** | Breadcrumb dynamique (route → label i18n) à gauche du topbar | `@kit/ui/...` ou implémentation native |
| 7 | **`EnviroStatCard`** (+ `EnviroStatCardGrid`) | KPI card forest-900 ou cream + lime accent + icône lucide + value display + sub-metrics + CTA arrow | nouveau (remplace `KpiCard`) |
| 8 | **`EnviroDashboardSectionHeader`** | Section heading dashboard : bracket tag mono lime + display title + subtitle + slot CTA optionnel | extend `EnviroSectionHeader` Phase 3 |
| 9 | **`EnviroDataTable`** | Wrapper `@kit/ui/table` avec styling Enviro : header forest, rows alterning, hover lime, pagination chips | `@kit/ui/table` ou `@kit/ui/enhanced-data-table` |
| 10 | **`EnviroEmptyState`** | État vide forest icon + bracket tag + display title + CTA | wrap `@kit/ui/empty-state` |
| 11 | **`EnviroChartCard`** | Card cream qui wrappe un chart Recharts (palette GEG préservée) avec header bracket + slot export | `EnviroCard` + Recharts existants |
| 12 | **`EnviroFilterChips`** (réutilisable des Phase 4.9 / 4.11) | Pills filter forest+lime active, cream idle | déjà existe en Phase 4 — extraire en composant générique |

**Total : 12 composants à créer.** L'extraction du `EnviroFilterChips` permettra aussi de simplifier les pages existantes (`faq`, `changelog`, `explorer`, `normes`).

---

## h) Stratégie i18n dashboard

### État actuel

19 namespaces déjà actifs dans `apps/web/i18n/request.ts`. Pour le dashboard :

- `dashboard` (18 keys) : `homeTitle`, `homeDesc`, `marketplaceTitle/Desc`, ..., `externalTitle/Desc` — section headers de niveau 1.
- `marketplace` (175 keys), `carbon` (82 keys), `esg` (165 keys), `compliance` (83 keys), `rse` (198 keys), `externalActivities` (73 keys), `wallet` (45 keys), `billing`, `pricing`, `pricingPage`, `verify`, `blockchain`, `account`, `teams`, `common.routes.*` (nav labels).
- **Total existant pour dashboard : ~1 100 keys par locale**, déjà bien structurées.

### Décision : **réutiliser, pas créer**

**Pas de nouveau namespace** dédié dashboard. Chaque section a déjà son namespace : `marketplace`, `carbon`, `esg`, `compliance`, `rse`, `externalActivities`, `wallet`, `billing`, `pricing`. Phase 6 :

1. **Étendre les namespaces existants** quand un nouveau label apparaît (bracket tag, label de filtre, label CTA Enviro). Convention : préfixer ces ajouts par `enviro.*` dans le namespace pour les distinguer des keys legacy.
2. **Ajouter des keys au namespace `dashboard`** pour les sections génériques manquantes : `enviro.sidebarToggleLabel`, `enviro.notificationsTitle`, `enviro.userMenuLabel`, etc.
3. **Aucun namespace renommé.**

**Aucune key existante modifiée** — règle invariante depuis Phase 1.

---

## i) Plan de migration (ordre exact des commits)

Conformément à ta décision Path B (simple → critique), 3 STOPs avec 13 commits atomiques.

### Phase 6.1 — Shell + sidebar (FONDATION, 2 commits)

Avant tout, **on doit construire le nouveau layout shell**. Sans ça, aucune page individuelle ne peut être migrée.

| Commit | Contenu | Estimation |
|---|---|---|
| **6.1.0** Shell components | Créer `EnviroDashboardShell`, `EnviroSidebar`, `EnviroSidebarNavItem`, `EnviroDashboardTopbar`, `EnviroUserMenu`, `EnviroDashboardBreadcrumb`. Pas de page touchée encore — juste la librairie. Page démo `/_preview/enviro-dashboard` (gated). | **2-3 h** |
| **6.1.1** Shell injection | Réécrire `home/(user)/layout.tsx` : utilise `EnviroDashboardShell` (forcé sidebar, suppression bi-mode). Préserve `ChatProvider`, `SidebarChatBridge`, `GlobalAIAssistant`. **STOP intermédiaire** — toutes les pages dashboard doivent rester fonctionnelles avec le nouveau shell, juste leur contenu reste old-style. | **1-2 h** |

### STOP 1 — Groupe 1 Infrastructure (3 commits, 3 sections simples)

| Commit | Page | Estimation | Patterns testés |
|---|---|---|---|
| **6.2** | `/home/settings` (64 LOC, 3 components) | 1 h (S) | Form tabs, layout dédié `settings/layout.tsx` |
| **6.3** | `/home/pricing` (341 LOC, 0 components) | 1.5 h (M) | Reskin cards, toggle annuel/mensuel (idem `/pricing` Phase 4.7 mais en variant in-app) |
| **6.4** | `/home/my-listings` (80 LOC, 0 components) | 1 h (S) | Liste avec filtres, EnviroDataTable + EnviroFilterChips |

→ **STOP 1 dashboard** : valider shell + sidebar + 3 patterns de base. Tu valides visuellement.

### STOP 2 — Groupe 2 Data-rich (5 commits)

| Commit | Page | Estimation | Risques data |
|---|---|---|---|
| **6.5** | `/home/wallet` (102 LOC, 6 components) | 2 h (M) | Données blockchain Polygon, transactions list, confirm-delivery-button — tout préservé |
| **6.6** | `/home/transactions/[id]` (3 components) | 1.5 h (M) | Sub-route détail, Server Action `sendContractForSignature` Docusign |
| **6.7** | `/home/billing` (390 LOC, 7 components) | 3 h (L) | Stripe Checkout + Portal + factures, **3 server-side files**, `loadPersonalAccountBillingPageData` cache |
| **6.8** | `/home/external-activities` (225 LOC, 4 components) | 2.5 h (M) | Server Action `createExternalActivity` + `evaluateAccountCompliance` collateral, `revalidatePath` x2 |
| **6.9** | `/home/rse` + sub-routes diagnostic + roadmap (131+ LOC, 9 components) | 3 h (L) | `saveDiagnostic`, `loadLatestDiagnostic`, **PDF jsPDF intact**, formulaire ISO 26000 |

→ **STOP 2 dashboard** : valider data fetching + Server Actions complexes + PDF jsPDF.

### STOP 3 — Groupe 3 Core business (5 commits)

| Commit | Page | Estimation | Complexité |
|---|---|---|---|
| **6.10** | `/home/marketplace` + 3 sub-routes (161+ LOC) | 4 h (XL) | Grid + search + filtres + cart, page détail + confirmation, listing-card partagé. La plus visible. |
| **6.11** | `/home/carbon` + assessment (548+ LOC, 11 components) | 4 h (XL) | **Charts Recharts ×2**, export PDF, export CSV, calcul Scopes 1/2/3, `saveCarbonAssessment` |
| **6.12** | `/home/esg` + 4 sub-routes (128 + 4×, 17 components) | 5 h (XXL) | Le segment le plus dense, dashboards multi-frameworks (CSRD, GRI, GHG), `csrd-compliance-chart`, wizard, data-entry, reports |
| **6.13** | `/home/traceability` (132 LOC, 9 components) | 3 h (L) | **Charts Recharts ×2**, blockchain table Polygon, banner ecosystem, equivalences |
| **6.14** | `/home/compliance` (237 LOC, 9 components) | 3 h (L) | Forms CSRD, label-eligibility-section, score 37 normes |

→ **STOP 3 dashboard FINAL** : valider charts + PDF + blockchain + tout l'écosystème core.

### Phase 6.15 — Dashboard accueil (1 commit final)

| Commit | Page | Estimation |
|---|---|---|
| **6.15** | `/home/page.tsx` (408 LOC, **dashboard accueil le plus visible**) | 2.5 h (L) |

Volontairement **EN DERNIER** : la page d'accueil agrège tous les composants Enviro déjà créés et migrés (KpiCard → EnviroStatCard, listings table, action cards). Elle bénéficie de tous les patterns rodés.

### Total

- **15 commits Phase 6.x**, **3 STOPs intermédiaires** + 1 STOP shell.
- **Estimation totale : 35-45 heures** (4 à 6 jours de travail concentré).

---

## j) Estimation par section

| Niveau | Pages | Critère |
|---|---|---|
| **S (Simple)** 1 h | settings, my-listings | <100 LOC, 0-3 components, pas de Server Action |
| **M (Moyen)** 1.5-2.5 h | pricing in-app, wallet, transactions, external-activities | 100-250 LOC, 3-6 components, 0-1 Server Action |
| **L (Large)** 2.5-3 h | rse, traceability, compliance, dashboard accueil | 130-250 LOC, 6-9 components, +sub-routes ou +Server Action |
| **XL (Extra large)** 3-4 h | marketplace, billing, carbon | 350-550 LOC, 6-11 components, sub-routes + 2-3 Server Actions OU charts/PDF |
| **XXL** 4-5 h | esg | 17 components, 4 sub-routes, dashboards multi-frameworks |

---

## k) Risques identifiés et plan de mitigation

| # | Risque | Probabilité | Sévérité | Mitigation |
|---|---|---|---|---|
| R1 | **Cache Turbopack** corrompu après refonte du shell `home/(user)/layout.tsx` (cf. Phase 5 quirk) | Haute | Moyenne | `rm -rf apps/web/.next` après commit 6.1.1 (shell injection). Documenté dans Phase 5 troubleshooting. |
| R2 | **Hydration mismatch** sur sidebar collapse cookie (`sidebar_state` lu côté serveur vs client) | Moyenne | Élevée | Reproduire pattern Phase 5 : initial state déterministe, lecture cookie via `getLayoutState()` server-side, prop forwarded. |
| R3 | **GlobalAIAssistant cassé** par re-organisation du tree React | Moyenne | Critique | Test e2e après chaque commit shell : ouvrir Genius, envoyer un message, vérifier réponse Anthropic. PRESERVE chemin exact actuel (`<ChatProvider><GlobalAIAssistant/></ChatProvider>`). |
| R4 | **Sidebar perte de l'active state** après navigation client (Next/Link) | Faible | Moyenne | Réutiliser `usePathname` + `isActive` helper créé en Phase 5 EnviroNavbar. |
| R5 | **Recharts palette GEG vs forest sidebar** : contraste insuffisant si charts dans card cream sur fond cream | Faible | Faible | Wrapper en `EnviroChartCard` avec bg `bg-white` ou `bg-cream-50` selon contexte. Décision palette charts : laisser GEG. |
| R6 | **Stripe webhook + Server Actions billing** : risque de casser le flux upgrade abonnement | Faible | Critique | Server Actions `_lib/server/*` strictement READ-ONLY. Test parcours : Sign up → Pricing → Checkout sandbox → Confirmation → Portal. |
| R7 | **PDF jsPDF rendu** dans `rse-pdf.ts` : pas de touche, mais le bouton "Exporter PDF" doit rester fonctionnel | Faible | Élevée | Ne pas toucher `rse-pdf.ts`. Juste restyler le bouton trigger. Test : générer un PDF et vérifier son rendu. |
| R8 | **Docusign integration** sur `transactions/[id]` : Server Action `sendContractForSignature` ne doit pas régresser | Faible | Critique | Server Action READ-ONLY. Test sandbox : initier signature, recevoir email Docusign, valider redirect. |
| R9 | **Blockchain Polygon write** sur `traceability` : intacte | Faible | Critique | Pas de modification des composants `traceability-table` qui invoquent Alchemy. |
| R10 | **i18n drift FR/EN** sur les ajouts `enviro.*` dans namespaces partagés | Moyenne | Faible | Symétrie key-count vérifiée à chaque commit (script grep -cE). |
| R11 | **Régression accessibilité** : sidebar forest-900 + texte muted sur fond foncé peut casser le contraste WCAG AA | Moyenne | Moyenne | Vérifier ratio min 4.5:1 sur labels nav. Texte actif lime-300 #c2df93 sur forest-900 #063232 = ratio ~10.8:1 ✅. Texte idle inverse-muted rgba(255,255,255,0.7) = ratio ~8.7:1 ✅. |
| R12 | **Mobile sidebar drawer** : transition entre desktop sidebar et mobile drawer doit rester fluide | Faible | Moyenne | Réutiliser `useSidebar()` hook + `Sheet` component de `@kit/ui/sidebar`. |

---

## l) Plan de vérification automatisée par commit

À chaque commit Phase 6.x :

```bash
# 1. Cache Turbopack reset (anticipation R1)
rm -rf apps/web/.next

# 2. Type checking baseline
pnpm --filter web typecheck 2>&1 | grep -cE 'error TS'  # doit rester 39

# 3. Build production
pnpm --filter web build  # doit passer

# 4. Smoke test toutes les routes dashboard de la STOP en cours
# (auth-protected → on simule avec un cookie de session ou on accepte 307 gate)
for route in /home /home/marketplace /home/carbon /home/esg ...; do
  curl -sI http://localhost:3000$route | head -2
done

# 5. Hydration safety
# - Pas de nested <a><a>
# - pas de toLocaleString sans locale
# - useReducedMotionSafe sur toute animation

# 6. i18n FR/EN symétrie
for ns in marketplace carbon esg ...; do
  fr=$(grep -cE '^\s+"[a-zA-Z_]+"\s*:' apps/web/i18n/messages/fr/${ns}.json)
  en=$(grep -cE '^\s+"[a-zA-Z_]+"\s*:' apps/web/i18n/messages/en/${ns}.json)
  [ "$fr" = "$en" ] || echo "DRIFT $ns fr=$fr en=$en"
done

# 7. Em-dash check sur les fichiers modifiés
git diff --name-only HEAD~1 | xargs grep -l '[—–]' || echo "clean"
```

---

## m) Ce qui sera créé (preview Phase 6.1.0)

Sans modifier aucun fichier existant :

1. `apps/web/components/enviro/dashboard/` (nouveau sous-dossier)
   - `index.ts` (barrel)
   - `enviro-dashboard-shell.tsx`
   - `enviro-sidebar.tsx`
   - `enviro-sidebar-nav-item.tsx`
   - `enviro-dashboard-topbar.tsx`
   - `enviro-user-menu.tsx`
   - `enviro-dashboard-breadcrumb.tsx`
   - `enviro-stat-card.tsx`
   - `enviro-dashboard-section-header.tsx`
   - `enviro-data-table.tsx`
   - `enviro-empty-state.tsx`
   - `enviro-chart-card.tsx`
   - `enviro-filter-chips.tsx` (extraction Phase 4 chips reusable)
2. `apps/web/app/[locale]/(_preview)/enviro-dashboard/page.tsx` — démo gated, montre tous les composants ci-dessus
3. `apps/web/i18n/messages/{fr,en}/enviroPreview.json` étendu avec quelques clés démo dashboard

---

## ✅ Conclusion Phase 6.0

Audit complet. Aucun blocage majeur. **15 commits prévus**, **3 STOPs intermédiaires + 1 STOP shell + 1 STOP final**.

### Prochaines étapes

1. **STOP audit** — tu valides ce document, tu confirmes :
   - L'ordre des sections dans chaque STOP (Path B simple → critique).
   - L'ajout d'un STOP shell intermédiaire (6.1.0 + 6.1.1) avant STOP 1.
   - La stratégie i18n (étendre namespaces existants avec préfixe `enviro.*`).
   - L'absence de nouveau namespace dédié dashboard (réutilisation).
   - Les 12 nouveaux composants Enviro à créer dans `components/enviro/dashboard/`.
   - Le retrait du bi-mode sidebar/header (`home-menu-navigation.tsx` + `home-mobile-navigation.tsx` deviennent obsolètes).

2. **Phase 6.1.0** : créer les 12 composants Enviro dashboard + page démo `(_preview)/enviro-dashboard`.

3. **Phase 6.1.1** : injecter le shell dans `home/(user)/layout.tsx` (préservant ChatProvider + Genius).

4. **STOP 1 dashboard** : commits 6.2, 6.3, 6.4 (settings, pricing in-app, my-listings).

5. **STOP 2 dashboard** : commits 6.5 → 6.9 (wallet, transactions, billing, external-activities, rse).

6. **STOP 3 dashboard** : commits 6.10 → 6.14 (marketplace, carbon, esg, traceability, compliance).

7. **Phase 6.15** final : dashboard accueil (`/home/page.tsx`).

---

## n) 5 questions à valider avant Phase 6.1.0

1. **Sidebar collapse default** : ouverte (280 px) ou collapse (72 px) au premier login ? Recommandation : ouverte, le user collapse à la demande.
2. **Topbar auto-hide on scroll** : préserver le comportement actuel (cache au scroll down) ou désactiver pour simplicité ? Recommandation : préserver (UX existante connue des users).
3. **Notifications bell** dans le topbar : conserver le composant `user-notifications.tsx` ou refondre ? Recommandation : conserver, juste re-skin visuel.
4. **Avatar user menu** items : Profil + Facturation + Sign out + (locale switch ?) + (theme toggle ?). La nav publique a un locale switcher, faut-il aussi en avoir un dans le dashboard ? Recommandation : oui, locale switcher dans `EnviroUserMenu`.
5. **Sub-routes esg** (csrd, data-entry, reports, wizard) : migrer dans le commit 6.12 (avec le hub esg) ou créer un commit dédié 6.12.b ? Recommandation : tout dans 6.12 si <6h, sinon split (à décider après audit fin du segment).

Réponds aux 5 questions et je démarre Phase 6.1.0 (création des 12 composants).
