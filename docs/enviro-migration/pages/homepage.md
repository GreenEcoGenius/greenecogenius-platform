# Homepage migration — Phase 4.1

**Route:** `/` (and `/fr`, `/en`)
**File:** `apps/web/app/[locale]/(marketing)/page.tsx`
**Phase:** 4 — Marketing pages migration
**Status:** ✅ Migrated (commit `<filled at commit time>`)

---

## Sections — before / after mapping

| # | Section | Before | After (Enviro) | Notes |
|---|---|---|---|---|
| 1 | Hero | Custom: text + screenshot side by side, light background, primary green CTA | `EnviroHero` with forest AVIF background (`BG-image-1_1BG-image-1.avif`), bracket tag, TextReveal title, dark gradient overlay, dual CTA (primary ember + outlineCream) | Big visual shift to dark/dramatic. Screenshot moved to dedicated section #2 below to preserve product proof. |
| 2 | Product showcase | (none — was inside hero) | New light section, `EnviroSectionHeader` + Supabase-hosted screenshot (preserved 100%) | Splits the prior packed hero in two clearer beats. |
| 3 | Stats | `StatsSection` custom (309/42/50/12) | `EnviroStats` with values from bible (310 Mt / 42 % / 150 Mds€ / 11.5 %) and animated counters | Stat 3 moved from "EU waste market" (50 Mds€) to "EU circular economy market" (150 Mds€) per bible. Sources kept identical. |
| 4 | Tech stack logos | `TechCarousel` (custom 4-col grid, opaque cards, color logos) | `EnviroLogoStrip` grid + bracket tag + grayscale hover-color | All 10 logos preserved (Next.js, Supabase, Vercel, Polygon, Stripe, Anthropic, GitHub, Cursor, Alchemy, Docusign). |
| 5 | Regulatory timeline | `RegulatoryTimeline` (horizontal cards on desktop, vertical on mobile) | `EnviroTimeline` (vertical, year + title + description, urgent badges in ember) | All 5 milestones preserved (2024, 2025 urgent, 2026 urgent ×2, 2030). |
| 6 | Sources logos | `SourcesCarousel` | `EnviroLogoStrip` + bracket tag | 5 logos (ADEME, SINOE, Eurostat, EPA, FEDEREC). |
| 7 | 3 Pillars | `PillarCard` custom (image top + content) | 3 `EnviroCard variant="cream"` with restyled image header + body. Lime accent on icon, ember on stat. | Image, badge, title, description, extra, stat all preserved per pillar. |
| 8 | How It Works | `HowItWorks` interactive 4-step (client) | **Unchanged** — kept as-is | Has client state and complex interaction. Will be restyled in iteration 2. |
| 9 | Impact Simulator | Suspense-wrapped data-fetching | **Unchanged** — kept as-is | Critical data fetching. Will be restyled in iteration 2. |
| 10 | Frameworks logos | `FrameworksCarousel` | `EnviroLogoStrip` + bracket tag + subtitle | 7 logos (ISO 14001, GHG Protocol, GRI, CSRD/ESRS, B Corp, GreenTech, NR). |
| 11 | Comparison table | `ComparisonTable` (custom, color icons, mobile cards) | `EnviroComparisonTable` (sticky forest header, lime-bordered GEG column, automatic check/minus icons, partial-cell text) | Same 10 features, 4 columns (GEG, Greenly, Sweep, In-house). Highlight column = GEG. |
| 12 | Pricing | `PricingPreview` (3 plain cards) | 3 `EnviroPricingCard` (default Essentiel, popular Avancé with ember badge + glow, enterprise Enterprise with lime surface) | Prices kept (149 €, 449 €, sur devis). Features list now exposed per plan. |
| 13 | FAQ | `FaqSection` (custom client accordion) | `EnviroFaq` (Base UI accordion via @kit/ui) | 4 items kept identical, full a11y. |
| 14 | Latest articles | Suspense `LatestArticles` (CMS data fetching) | **Wrapped** with `EnviroSectionHeader`, internal markup preserved | CMS data fetching untouched. Internal cards will move to `EnviroBlogCard` in iteration 2. |
| 15 | Newsletter | Custom `NewsletterForm` (TODO server action) | `EnviroNewsletterCta` with magnetic ember submit, forest tone | Submit handler still TODO (no regression vs prior state, both used a placeholder). |

---

## Data preserved (no Server Action / Supabase / CMS / blockchain / Stripe touched)

- ✅ `Suspense + ImpactSimulator`: data fetch chain intact.
- ✅ `Suspense + LatestArticles`: `@kit/cms` `getContentItems` call intact (still uses the `cache(...)` wrapper).
- ✅ `HowItWorks`: client-side useState + STEPS data intact.
- ✅ All `_lib/server/*.ts`: read-only, untouched.
- ✅ Routes: still `/`, `/fr`, `/en` (no rename).
- ✅ Auth gate (`/home → /auth/sign-in`): intact.
- ✅ `/api/*` routes: intact (188+ generated).
- ✅ `/preview/enviro` (Phase 2 alias): intact.
- ✅ `/enviro-components` (Phase 3 demo): intact (now reachable thanks to proxy fix).

---

## i18n additions (FR + EN, perfectly symmetric)

In `apps/web/i18n/messages/{fr,en}/marketing.json`, inside `landing.*`:

```
heroTag, statsTag, techTag, timelineTag, sourcesTag, pillarsTag, howTag,
frameworksTag, compTag, pricingTag, faqTag, blogTag, newsletterTag
productShowcaseTag, productShowcaseTitle, productShowcaseSub, productShowcaseAlt
stat1Value, stat1Suffix, stat2Value, stat2Suffix, stat3Value, stat3Suffix, stat4Value, stat4Suffix
planEssentielCta, planAvanceCta, planEnterpriseCta
newsletterPlaceholder, newsletterCtaLabel, newsletterConsent
compHeaderFeature, compHeaderGeg, compHeaderGreenly, compHeaderSweep, compHeaderInternal
compPriceGeg, compPriceGreenly, compPriceSweep, compPriceInternal
compYesPartial
```

In `apps/web/i18n/messages/{fr,en}/common.json`:

```
openMenu, closeMenu          (used by EnviroNavbar aria-labels)
```

**No existing key was modified or deleted.** All Phase 4 additions are append-only.

---

## Side-effect fixes

### Proxy matcher refinement

In `apps/web/proxy.ts` the matcher excluded `preview` and `enviro` substrings (without trailing slash). This was correct for `/preview/enviro/*` (Phase 2 static alias) and `/enviro/*` (legacy direct access), but it also accidentally caught any URL starting with those substrings:

- `/enviro-components` (Phase 3 demo) → 404 instead of 200.
- A future `/preview-something` route would also get 404.

Fixed by adding the trailing slash: `preview/` and `enviro/`. The Webflow alias and the static legacy folder still bypass middleware as intended; real Next.js routes whose first segment merely *starts* with `preview` or `enviro` now reach the middleware and render correctly.

### Aria labels for `EnviroNavbar`

Two new optional props (`mobileMenuLabel`, `closeMenuLabel`) accept the i18n strings from the caller. Defaults remain `'Open menu'` / `'Close menu'` (English fallbacks) so no caller is broken.

---

## Validation

| Check | Result |
|---|---|
| `pnpm --filter web typecheck` | 39 pre-existing errors (zod3↔zod4 in @hookform/resolvers), **0 new** |
| `pnpm --filter web build` | ✅ OK (~50 s, all routes generated) |
| `GET /` | 200, ~440 KB SSR HTML |
| `GET /fr` | 200, ~590 KB SSR HTML |
| `GET /en` | 307 → `/` (default locale, expected) |
| `GET /preview/enviro` | 200 (Phase 2 alias intact) |
| `GET /preview/enviro/css/normalize.css` | 200 `text/css` (sub-resources intact) |
| `GET /enviro-components` | 200 (Phase 3 demo, restored after proxy fix) |
| `GET /enviro/index.html` | 200 (legacy direct intact) |
| `GET /home` | 307 → `/auth/sign-in?next=/home` (auth gate intact) |
| Em-dash in `(marketing)/page.tsx` | 0 |
| Em-dash in new i18n keys | 0 |
| Em-dash in `enviro-navbar.tsx` | 0 |
| Em-dash in pre-existing rendered HTML | 3 (heroDescription, compSub, copyright; **out of scope, Phase 8 cleanup script**) |
| `prefers-reduced-motion` | All animations honour it (helpers from Phase 3) |
| Hardcoded UI strings | None — every text passes through `t('marketing.*')` |
| Inter font | Applied to display/sans tokens (`font-[family-name:var(--font-enviro-display|sans|mono)]`) |

---

## Visual checklist (manual, to perform before Phase 4.2 starts)

Open the URLs below in a fresh browser tab and confirm:

- [ ] **`/fr`**: hero forest dramatic, title revealed word by word, dual CTA visible, scroll triggers stats counter animation.
- [ ] **`/en`**: same content but with EN strings (heroTitle "The circular platform for responsible companies", stats labels in English, etc.).
- [ ] Stats: 4 figures with sources, all under bracket tag "[ Le marché ]" / "[ The market ]".
- [ ] Tech logos: 10 logos in grayscale, color on hover.
- [ ] Timeline: 5 milestones visible, urgent badges in ember on 2025+2026.
- [ ] Comparison table: GEG column highlighted with lime border, sticky header forest.
- [ ] Pricing: middle card "Avancé" lifted with ember badge "Plus populaire" / "Most popular".
- [ ] FAQ: 4 items, accordion expands smoothly with reduced motion fallback (test by toggling OS setting).
- [ ] Newsletter: forest section, ember magnetic button, input with Enviro pill radius.
- [ ] Mobile (375 / 414): hero title shrinks with clamp, sections stack, comparison table scrolls horizontally.
- [ ] Reduced motion: enable OS reduce-motion, refresh — animations disabled, stats snap to final value.
