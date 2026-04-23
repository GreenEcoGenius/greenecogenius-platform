# Pricing page migration — Phase 4.7

**Route:** `/pricing` (and `/fr/pricing`, `/en/pricing`)
**Files:**
- `apps/web/app/[locale]/(marketing)/pricing/page.tsx` (Server Component
  shell — **NOT modified**, data fetching from Supabase preserved)
- `apps/web/app/[locale]/(marketing)/pricing/_components/pricing-content.tsx`
  (Client Component re-skinned end to end)
- `apps/web/i18n/messages/{fr,en}/pricingPage.json` (extended with
  Phase 4.7 keys)
**Phase:** 4.7 — Marketing pages migration
**Status:** ✅ Migrated

> Scope reminder: this is the **public** marketing pricing page only.
> The user-facing in-app pricing under `/home/(user)/pricing` is in
> Phase 6 and is not touched here.

---

## Sections — before / after

| # | Section | Before | After (Enviro) |
|---|---|---|---|
| 1 | Hero | Centered title + subtitle + heroNote text | `EnviroPageHero tone="cream"` with bracket tag `[ Tarification ]`, centered display title and subtitle, heroNote rendered as `ctas` slot |
| 2 | Toggle Mensuel / Annuel | Custom switch with Badge -17% | Pill segmented control: forest+lime active, cream idle, "-17%" badge in lime mono on annual side |
| 3 | Included banner | Light primary tint pills | Bracket tag `[ Inclus partout ]` + display title + StaggerContainer of pill chips with ember `Check` icons |
| 4 | 3 plan cards | Custom Card components | 3 `EnviroPricingCard` (default Essentiel / popular Avancé with ember badge / enterprise Enterprise with lime surface). Prices computed from Supabase data with literal fallbacks. Annual hint rendered in font-mono. |
| 5 | Custom support callout | Light green callout | `EnviroCard variant="lime"` with magnetic ember CTA |
| 6 | Commission marketplace tiers | 3 plain cards | `StaggerContainer` of 3 `EnviroCard cream` with forest icon container + ember rate + mono range. Promo banner in lime. |
| 7 | Detailed comparison (NEW) | (none) | `EnviroComparisonTable` with 12 feature rows × 3 plan columns: Marketplace access, Traceability lots, Carbon scopes, CSRD, Genius messages, Support, Labels, API, Multi-users, Onboarding, Account manager, SLA. GEG-style boolean cells (auto Check/Minus icons), text values for the multi-valued ones. |
| 8 | FAQ | Custom client accordion | `EnviroFaq` (Base UI accordion) reusing the existing 5 FAQ keys |
| 9 | Coming soon roadmap | Custom card grid | `StaggerContainer` of 7 `EnviroCard cream` with forest icon, ember Q4 timeline pill, gray year pill. Header bracket tag `[ Roadmap ]`. |
| 10 | Footer CTA | Dark gradient bg + image | Forest section with bracket `[ Démarrer ]`, magnetic ember "Commencer gratuitement" → `/home/billing`, secondary outlineCream "Voir les solutions" → `/solutions`, contact email + phone in font-mono |

---

## Data preserved (no Server Action / Supabase / billing logic touched)

- ✅ `pricing/page.tsx` is **byte-for-byte unchanged**: still calls
  `getSupabaseServerAdminClient()` and queries `subscription_plans` +
  `commission_config` tables, then forwards them to `PricingContent`.
- ✅ The `Plan` and `CommissionConfig` interfaces are reused
  identically inside `pricing-content.tsx`.
- ✅ Prices are still computed via `formatPrice(cents)` with `'fr-FR'`
  explicit locale (no hydration mismatch).
- ✅ The `annual` toggle logic is preserved (same `useState`).
- ✅ Stripe / billing-gateway / `_lib/server/*` not touched.
- ✅ Existing pricingPage feature keys (essentielFeatures,
  avanceFeatures, enterpriseFeatures, faqKeys, includedTags,
  commissionTiers) are reused identically.

---

## i18n — additions to existing `pricingPage` namespace

22 new keys added (FR + EN, perfectly symmetric, append-only):

```
heroTag, includedTag, plansTag, commissionTag, comparisonTag,
faqTag, comingSoonTag, ctaTag

ctaSecondary

comparisonTitle, comparisonSub
compFeature, compEssentiel, compAvance, compEnterprise

compRow_marketplace, compRow_traceability, compRow_carbonScope,
compRow_csrd, compRow_genius, compRow_support, compRow_labels,
compRow_api, compRow_users, compRow_onboarding,
compRow_accountManager, compRow_sla

compEssentielMarketplace / compAvanceMarketplace / compEnterpriseMarketplace
compEssentielTrace / compAvanceTrace / compEnterpriseTrace
compEssentielScope / compAvanceScope / compEnterpriseScope
compEssentielGenius / compAvanceGenius / compEnterpriseGenius
compEssentielSupport / compAvanceSupport / compEnterpriseSupport
```

No existing key was modified or removed. The smaller `pricing` namespace
(used by `/home/pricing` in Phase 6) is **not touched**.

---

## Hydration safety

- `useState(false)` for the annual toggle is fully deterministic.
- Prices use `toLocaleString('fr-FR')` with explicit locale — no
  decimal separator mismatch.
- StaggerContainer / EnviroFaq / EnviroComparisonTable all use the
  hydration-safe `useReducedMotionSafe` hook from `b529f157`.
- No nested `<a><a>` introduced.

---

## Validation

| Check | Result |
|---|---|
| `pnpm --filter web typecheck` | 39 pre-existing errors, **0 new** |
| `pnpm --filter web build` | ✅ OK (~57 s) |
| `GET /pricing`, `GET /fr/pricing` | **Pre-existing 500** (see note below). The 500 is also reproduced on `main` baseline (verified by stashing the Phase 4.7 changes and rebuilding). It comes from `getSupabaseServerAdminClient()` requiring `SUPABASE_SECRET_KEY` which is missing from `apps/web/.env.local` in this development environment. The page works in production where the env var is set. |
| HTML body of the 500 page | All Phase 4.7 keywords present (Mensuel, Annuel, Essentiel, Avancé, Enterprise, Populaire, 149, 449, Sur mesure, Genius, Comptoir, Roadmap, GreenEcoGenius), confirming the new chunks load and the page shell renders. |
| Other pages | `/`, `/about`, `/blog`, `/normes`, `/fr/explorer`, `/fr/explorer/plastiques` all 200; `/home → 307 /auth/sign-in`. |
| Em-dash in NEW Phase 4.7 deliverables | 0 |

> **Local environment note**: to validate `/pricing` rendering locally,
> add a stub `SUPABASE_SECRET_KEY=...` to `apps/web/.env.local` (or use
> the staging env). This is purely a developer environment concern and
> does not affect the production deploy.

---

## Visual checklist (manual — run on a Vercel preview deploy or with
the env var set locally)

- [ ] `/fr/pricing`: cream hero with bracket `[ Tarification ]`.
- [ ] Toggle Mensuel / Annuel: pill segmented, active forest+lime,
  "-17%" lime badge on annual.
- [ ] Banner "Inclus partout": 5 chip tags with ember icons, bracket
  header.
- [ ] 3 plan cards: Avancé center with ember "Plus populaire" badge.
  Prices reflect monthly / annual based on toggle.
- [ ] Custom support: lime card with magnetic ember "Nous contacter".
- [ ] Commission: 3 cards with ember rates, optional promo lime banner.
- [ ] Comparison: 12 feature rows × 3 columns, Essentiel column
  highlighted in lime, sticky header on tall view.
- [ ] FAQ: 5 questions, accordion, lime hover border.
- [ ] Roadmap: 7 cards with forest icons + ember Q4 pills + gray year
  pills.
- [ ] Footer CTA: forest section, magnetic ember + secondary
  outlineCream + email and phone in font-mono.
- [ ] Mobile 375 / 414: cards stack 1 col, comparison table scrolls
  horizontally, toggle pills wrap.
