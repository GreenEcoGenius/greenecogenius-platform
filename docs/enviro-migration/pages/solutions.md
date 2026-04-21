# Solutions page migration — Phase 4.2.2

**Route:** `/solutions` (and `/fr/solutions`, `/en/solutions`)
**File:** `apps/web/app/[locale]/(marketing)/solutions/page.tsx`
**Phase:** 4.2 — Marketing pages migration
**Status:** ✅ Migrated

---

## Sections — before / after

| # | Section | Before | After (Enviro) |
|---|---|---|---|
| 1 | Hero | Light pill badge + title + description, centered | `EnviroPageHero tone="cream"` with bracket tag `[ Nos solutions ]`, centered display title and subtitle |
| 2 | 6 alternating modules | Custom alt grid, badge subtitle, primary green pill icon, dot bullets, ArrowRight CTA | Same structure: image (4:3 rounded) + content column, alternating order via `lg:order-1/2`. Inter typography, lime-bullet features, EnviroButton primary. Subtitle becomes bracket tag. |
| 3 | Comparison | (none) | **NEW** `EnviroComparisonTable` reusing the landing data (10 features × 4 columns, GEG highlighted lime) |
| 4 | CTA | (none) | **NEW** Forest section with bracket tag, magnetic ember "Réserver une démo" → `/contact`, secondary outlineCream "Essayer gratuitement" → `/auth/sign-up` |

---

## Data preserved

- ✅ All existing i18n keys: `solBadge`, `solTitle`, `solDesc`, `solMarketplace*`, `solTrace*`, `solCarbon*`, `solEsg*`, `solCompliance*`, `solLabels*`, `solStartFree`, `solLearnMore`.
- ✅ All 6 module images preserved (`circular-zero-waste.png`, `traceability-blockchain-chain.png`, `carbon-counter-1000t.png`, `reporting-esg-meeting.png`, `labels-globe-recycle.png`, the supabase-hosted labels image).
- ✅ All 6 module hrefs unchanged (`/auth/sign-up`).
- ✅ Comparison data reused from `landing.comp_*` keys (no duplication).

---

## i18n additions (FR + EN, 9 new keys, append-only)

```
solHeroTag                                           ("Nos solutions" / "Our solutions")
solCompTag, solCompTitle, solCompSub                 (comparison header)
solCtaTag, solCtaTitle, solCtaSub, solCtaLabel       (demo CTA)
solCtaSecondary                                      ("Essayer gratuitement")
```

No existing key modified.

---

## Validation

| Check | Result |
|---|---|
| `pnpm --filter web typecheck` | 39 pre-existing errors, **0 new** |
| `pnpm --filter web build` | ✅ OK |
| `GET /solutions` | 200, ~332 KB SSR HTML |
| `GET /fr/solutions` | 200, ~484 KB SSR HTML |
| `GET /about` | 200 (intact) |
| `GET /` | 200 (landing intact) |
| Em-dash in NEW sol-* i18n keys | 0 |
| Em-dash in `solutions/page.tsx` | 0 |
| Em-dash in rendered HTML | 2 (from pre-existing env var + copyright, scope of Phase 8 cleanup script) |
| Wrappers vs rewrites | All Enviro components used as wrappers, no @kit/ui rewritten |

---

## Visual checklist (manual)

- [ ] **`/fr/solutions`**: cream hero with bracket `[ Nos solutions ]`, centered title.
- [ ] 6 modules in alternating image-text rhythm (image left/right swaps every other).
- [ ] Each subtitle (e.g. "Marketplace B2B") rendered as bracket tag in mono lime forest.
- [ ] Each module icon in dark forest container with lime icon color.
- [ ] Lime dot bullets for features.
- [ ] EnviroButton primary "Commencer gratuitement" per module.
- [ ] Comparison table: GEG column highlighted lime, sticky header.
- [ ] CTA forest: magnetic "Réserver une démo" → /contact, secondary outlineCream → /auth/sign-up.
- [ ] Mobile 375 / 414: image + text stack, comparison scrolls horizontally.
