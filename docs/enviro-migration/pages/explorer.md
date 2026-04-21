# Explorer page migration — Phase 4.2.3

**Route:** `/explorer` (and `/fr/explorer`, `/en/explorer`, sub-routes
`/explorer/[category]`, `/explorer/region/[region]`)
**Files:**
- `apps/web/app/[locale]/(marketing)/explorer/page.tsx`
- `apps/web/app/[locale]/(marketing)/explorer/_components/explorer-content.tsx`
- `apps/web/app/[locale]/(marketing)/explorer/_components/zone-selector.tsx`
- `apps/web/app/[locale]/(marketing)/explorer/_components/material-category-card.tsx`
- `apps/web/app/[locale]/(marketing)/explorer/_components/public-cta.tsx`
**Phase:** 4.2 — Marketing pages migration
**Status:** ✅ Migrated (presentation only, **all data fetching preserved**)

---

## Critical: data fetching is 100% untouched

Per the user instructions, the entire data layer is read-only. This includes:

- ✅ `apps/web/app/[locale]/(marketing)/explorer/_lib/public-client.ts`:
  the `getPublicSupabaseClient()` factory — **NOT TOUCHED**.
- ✅ `apps/web/app/[locale]/(marketing)/explorer/_components/explorer-data.ts`:
  Supabase types, `aggregateByCategory`, `cleanSource`, `formatVolume`,
  `formatPrice`, `formatRate`, `slugFromCategory`, etc. — **NOT TOUCHED**.
- ✅ `page.tsx` data block (Promise.all over `material_stats_national` and
  `material_stats_by_region`, EU/FR/USA aggregation logic) — **NOT TOUCHED**.
- ✅ Sub-routes `/explorer/[category]/page.tsx` and
  `/explorer/region/[region]/page.tsx` — **NOT TOUCHED** (will be restyled
  in iteration 2).
- ✅ Maps (`MaterialsMap`, `EuropeMap`, `UsaMap`), `MarketTrends`,
  `SourceBadge`, `DataSourceBadge`, `SourcesDisclaimer`, `RegionTable`,
  `CategoryKpis` — **NOT TOUCHED** (data viz logic too complex for this
  re-skin pass).

---

## Sections — before / after

| # | Section | Before | After (Enviro) |
|---|---|---|---|
| 1 | Hero | Custom centered light pill badge + title + DataSourceBadge | `EnviroPageHero tone="cream"` with bracket tag `[ Données Open Data ]`, DataSourceBadge floats centered just below the hero |
| 2 | Zone selector | Pill buttons green primary fill | Pill buttons `aria-pressed`, active state = forest bg + lime text + Enviro shadow, idle = cream bg with hover transitions |
| 3 | Categories grid section header | Plain h2 + small p | New bracket tag `[ Zone ]` + display title + subtitle Inter typography |
| 4 | MaterialCategoryCard | Plain rounded white card with colored icon pills | Enviro card: forest icon container with lime icon, **AnimatedCounter on volume value** (with adaptive Mt/kt/t suffix), font-mono recycling rate + price line, hover lift + forest border |
| 5 | Map section header | Centered h2 + p | Centered bracket tag + display title + subtitle |
| 6 | Map content | Same `MaterialsMap` / `EuropeMap` / `UsaMap` | **Untouched** (data viz preserved) |
| 7 | Market trends | Same `MarketTrends` | **Untouched** (data viz preserved) |
| 8 | Public CTA | Light primary tinted card | Forest section with lime icons, magnetic ember CTA, lime underline link to /pricing |
| 9 | Sources disclaimer | Custom | **Untouched** |

---

## Animated counters

The number on each `MaterialCategoryCard` now animates on viewport enter via
`AnimatedCounter`. To keep the value readable across magnitudes, a local
`splitVolume(tonnes)` helper decomposes the raw figure into:

- `value < 1_000` → `Math.round(tonnes)` t
- `value < 1_000_000` → `Math.round(tonnes / 1_000)` kt
- `value >= 1_000_000` → `tonnes / 1_000_000` (with 1 fraction digit when
  not whole) Mt

The animation honours `prefers-reduced-motion: reduce` (snap to final value)
via the shared `useReducedMotionSafe` helper.

---

## i18n

**No new keys.** All existing `marketing.explorer.*` keys are reused unchanged.

---

## Validation

| Check | Result |
|---|---|
| `pnpm --filter web typecheck` | 39 pre-existing errors, **0 new** |
| `pnpm --filter web build` | ✅ OK (~64 s) |
| `GET /explorer` | 200, ~323 KB SSR HTML |
| `GET /fr/explorer` | 200, ~475 KB SSR HTML |
| `GET /fr/explorer/plastiques` (sub-route) | 200 (data fetching intact) |
| `GET /about`, `GET /solutions`, `GET /` | 200 (no regression) |
| Em-dash in NEW Phase 4.2.3 deliverables | 0 |
| Em-dash in pre-existing comment line 28 of page.tsx | 1 (untouched, scope of Phase 8 cleanup script) |
| Server Action / `_lib/server` modified | 0 |
| Supabase / `@kit/*` modified | 0 |

---

## Visual checklist (manual)

- [ ] **`/fr/explorer`**: cream hero with bracket `[ Données Open Data ]`.
- [ ] DataSourceBadge floats centered just below hero.
- [ ] Zone selector: 3 pills France / Europe UE-27 / États-Unis. Active = forest fill + lime text. Idle = cream bg with subtle border.
- [ ] Switch zones → grid re-renders with the right country data, animated counters re-trigger.
- [ ] Material cards: forest+lime icon, large display number with adaptive unit (Mt / kt / t), small mono line for recycling rate + price.
- [ ] Map section: bracket tag + display title centered, map widget unchanged.
- [ ] PublicCTA: dark forest panel, lime feature icons, magnetic ember CTA "Créer un compte gratuit".
- [ ] Sub-routes `/fr/explorer/plastiques`, `/fr/explorer/region/ile-de-france`: still render fully (will get the Enviro skin in iteration 2).
- [ ] Mobile 375 / 414: zone pills wrap, cards stack 1 col, CTA pads.
