# About page migration — Phase 4.2

**Route:** `/about` (and `/fr/about`, `/en/about`)
**File:** `apps/web/app/[locale]/(marketing)/about/page.tsx`
**Phase:** 4.2 — Marketing pages migration
**Status:** ✅ Migrated

---

## Sections — before / after

| # | Section | Before | After (Enviro) | Notes |
|---|---|---|---|---|
| 1 | Hero | Custom dark image hero, white text, badge w/ AppLogo name | `EnviroPageHero tone="forest"` with same background image, bracket tag `[ À propos ]`, centered display title | Bracket tag + Inter display |
| 2 | Mission + Vision | 2 cols icon + heading + text | 2 `EnviroCard` (cream + dark) with icon + body, alternating tones | Vision now in dark forest with lime-glow hover |
| 3 | History timeline | (none) | **NEW** `EnviroTimeline` with 3 milestones (2024 genesis, 2025 MVP, 2026 full platform) | Bible content from user requirements |
| 4 | Values | (none) | **NEW** 3 `EnviroCard` (Circularité / Transparence / Impact mesurable) with lime icons | Bible content from user requirements |
| 5 | Climate | Image + text 2 cols | Same layout, `aspect-[4/3]` rounded image + Inter typography | Content preserved 100% |
| 6 | GreenTech | Text + image alternating | Same layout (order swap on lg+) with Enviro tokens | Content preserved 100% |
| 7 | CSR + Carbon | 2 plain cards | 2 `EnviroCard` (cream + lime icon variant) | Content preserved 100% |
| 8 | Team founder | (none) | **NEW** Single prominent `EnviroCard` with founder name + role + bio | Bible content from user requirements |
| 9 | Structure | 2 entity cards + founder note | 2 `EnviroCard` (Tallinn OÜ + Delaware Inc.) + centered founder note | Content preserved 100%, ember accent on city |
| 10 | Security | 5 cards in 3-col grid | 5 `EnviroCard` (cream variant) with forest icon backgrounds | Content preserved 100%, hover lift uniform |
| 11 | CTA | Dark gradient + sign-up button | Forest section with bracket tag + display title + dual CTA (magnetic ember "Contact us" + outlineCream "Sign up") | New target `/contact` (not `/auth/sign-up`) for primary CTA |

---

## Data preserved

- ✅ All existing i18n keys (aboutMissionHeading, aboutMissionText, aboutVisionHeading, aboutVisionText, aboutClimateHeading, aboutClimateText, aboutGreentechHeading, aboutGreentechText, aboutCsrHeading, aboutCsrText, aboutCarbonHeading, aboutCarbonText, aboutStructureHeading, aboutStructureP1, aboutStructureEU, aboutStructureUS, aboutStructureFounder, all aboutSecurity* keys, joinPlatform, ctaHeading, ctaSubheading) reused unchanged.
- ✅ All existing images (`reporting-esg-presentation.png`, `hero-recycling-facility.png`, `greentech-energy.png`) preserved.
- ✅ AppLogo: not used on this page (was only in old hero badge); removed from imports.
- ✅ Routes: `/about`, `/fr/about`, `/en/about` unchanged.
- ✅ No Server Action, no `_lib/server/`, no Supabase, no `@kit/*` modified.

---

## i18n additions (FR + EN, 30 new keys, append-only)

Inserted after `aboutPageSubtitle` in `marketing.json`:

```
aboutTag, aboutMissionTag, aboutSectionsTag, aboutStructureTag,
aboutSecurityTag, aboutCtaTag

aboutHistoryTag, aboutHistoryTitle, aboutHistorySub
aboutHistory2024Title, aboutHistory2024Description
aboutHistory2025Title, aboutHistory2025Description
aboutHistory2026Title, aboutHistory2026Description

aboutValuesTag, aboutValuesTitle, aboutValuesSub
aboutValue1Title, aboutValue1Description     (Circularity)
aboutValue2Title, aboutValue2Description     (Transparency)
aboutValue3Title, aboutValue3Description     (Measurable impact)

aboutTeamTag, aboutTeamTitle, aboutTeamSub
aboutFounderName, aboutFounderRole, aboutFounderBio    (Ervis Ago)

aboutCtaLabel, aboutCtaTitle, aboutCtaSub
```

**No existing key was modified or removed.**

---

## Validation

| Check | Result |
|---|---|
| `pnpm --filter web typecheck` | 39 pre-existing errors, **0 new** |
| `pnpm --filter web build` | ✅ OK (~92s) |
| `GET /about` | 200, ~315 KB SSR HTML |
| `GET /fr/about` | 200, ~468 KB SSR HTML |
| `GET /` (landing) | 200 (intact) |
| `GET /home` | 307 → /auth/sign-in (auth gate intact) |
| Em-dash in `(marketing)/about/page.tsx` | 0 |
| Em-dash in NEW about-* i18n keys | 0 |
| Em-dash in rendered HTML | 2 (from pre-existing `aboutSecurityBlockchainText` and `aboutSecurityAccessText`, scope of Phase 8 cleanup) |
| `prefers-reduced-motion` | All animations honour it via shared helpers |
| Hardcoded UI strings | None |

---

## Visual checklist (manual)

- [ ] **`/fr/about`**: dark forest hero with bracket `[ À propos ]`, white title.
- [ ] Mission card cream + Vision card dark forest with lime icon and glow on hover.
- [ ] Timeline 3 milestones (2024, 2025, 2026), no urgent badges (no urgency on history).
- [ ] Values: 3 cards in a row with lime icon backgrounds, each ~equal height.
- [ ] Climate / GreenTech alternating image + text, images 4:3 rounded.
- [ ] CSR + Carbon: 2 cards, second one with lime icon variant.
- [ ] Founder block: prominent card centered, single Ervis Ago entry.
- [ ] Structure: Tallinn OÜ + Delaware Inc. side by side, ember-accented city under each title.
- [ ] Security: 5 cards 3-col grid uniform.
- [ ] CTA: forest section, magnetic "Nous contacter" button → `/contact`, secondary outlineCream "Rejoindre la plateforme" → `/auth/sign-up`.
- [ ] Mobile 375 / 414: all sections stack, founder block stacks (icon top), CTAs wrap.
