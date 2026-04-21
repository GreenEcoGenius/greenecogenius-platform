# Normes & Standards page migration — Phase 4.5

**Route:** `/normes` (and `/fr/normes`, `/en/normes`)
**Files:**
- `apps/web/app/[locale]/(marketing)/normes/page.tsx`
- `apps/web/app/[locale]/(marketing)/normes/_components/norms-tabbed-content.tsx`
- `apps/web/i18n/messages/fr/normes.json` (NEW)
- `apps/web/i18n/messages/en/normes.json` (NEW)
- `apps/web/i18n/request.ts` (namespace registration)
**Phase:** 4.5 — Marketing pages migration
**Status:** ✅ Migrated

---

## Sections — before / after

| # | Section | Before | After (Enviro) |
|---|---|---|---|
| 1 | Hero | Custom centered light bg, h1 + 5 small counters in a row | `EnviroPageHero tone="cream"` with bracket tag `[ Conformité ]`, centered display title and subtitle |
| 2 | Stats | 5 small inline counters (42, 6, 15, 12, 4) | `EnviroStats` 4-col grid with bigger animated counters (42 normes / 6 piliers / 30+ frameworks / 100 % open data), each citing its source in font-mono |
| 3 | Filters intro | (none, tabs were unintroduced) | New section header `[ Filtres ]` "Explorer par pilier" |
| 4 | Pillar tabs | Underline tabs primary green | **Filter chips** in pill shape: forest bg + lime text active, cream bg + forest text idle, sticky on scroll |
| 5 | Pillar hero (per tab) | Big image with gradient + light caption | Same image with deeper forest gradient overlay + bracket tag `[ N normes intégrées ]` + Inter display title |
| 6 | Norm cards | Custom card with IntersectionObserver per item | `StaggerContainer` + `StaggerItem` orchestrate the appearance, cards use Enviro tokens (cream surface, ember reference, lime "On-chain" badge), PDF download as button |
| 7 | Labels preparation callout | Green primary gradient | Forest dark panel (rendered only on `labels` tab) |
| 8 | Frameworks strip | (none) | **NEW** Wrap of 15 framework chips (ISO 14001, ISO 26000, ISO 59014:2024, GHG Protocol, GRI, CSRD/ESRS E1-E5, TCFD, B Corp, GreenTech, NR, Lucie, ADEME, Eurostat, AGEC, EcoVadis) with stagger reveal |
| 9 | Audit CTA | (none) | **NEW** Forest section "Demander un audit de conformité" → magnetic ember button to `/contact` + secondary outlineCream to `/solutions` |

---

## i18n — new dedicated namespace `normes`

A new top-level namespace was introduced because the page outgrew the
catch-all `marketing.*` namespace. Migration:

- Created `apps/web/i18n/messages/fr/normes.json` and
  `apps/web/i18n/messages/en/normes.json` with all page + tabbed content
  keys (44 keys per locale, perfectly symmetric).
- Registered `normes` in `apps/web/i18n/request.ts`.
- Removed the previous flat `marketing.normes*` and `marketing.normesTab*`
  keys from `marketing.json` (FR + EN). The marketing nav menu key
  `marketing.normes` (label "Normes & Standards") is preserved unchanged.
- Updated the page (`getTranslations('normes')`) and the tabbed content
  client component (`useTranslations('normes')`) to read from the new
  namespace.

### Key buckets

```
title, desc, subDesc, heroTag, statsTag, filtersTag,
frameworksTag, auditTag

stat1Value..stat4Value, stat1Label..stat4Label,
stat1Source..stat4Source, stat3Suffix, stat4Suffix

filtersTitle, filtersSub
ctaDiscover, ctaPricing
tabCircular, tabCarbon, tabReporting, tabTraceability, tabData, tabLabels

frameworksTitle, frameworksSub,
framework_iso14001, framework_iso26000, framework_iso59014,
framework_ghg, framework_gri, framework_csrd, framework_tcfd,
framework_bcorp, framework_greentech, framework_nr, framework_lucie,
framework_ademe, framework_eurostat, framework_agec, framework_ecovadis

labelsPreparation, labelsPreparationDesc
downloadPdf, onChain
auditTitle, auditSub, auditCta, auditSecondary
integrated, pillars, iso, regulations, labelsCount,
frameworksCount, openData
```

---

## Data preserved (no Server Action / Supabase / @kit/* touched)

- ✅ `~/lib/data/norms-database` — the 42-norm database, `localizeNorm`,
  `getLocalizedPillarInfo`, `PRIORITY_COLORS`, types — **not touched**.
- ✅ `/api/normes/pdf?id=...&locale=...` — same endpoint, same params,
  triggered through the same `window.open(...)` pattern.
- ✅ URL hash deep-link (`#circular_economy`, `#labels`, etc.) and
  smooth-scroll-to-tab behaviour preserved.
- ✅ `_lib/server/*`, Supabase, billing, blockchain — untouched.

---

## Hydration safety

- All 4 stat counters use the new `useReducedMotionSafe` hook and
  `useLocale()` fallback shipped in `b529f157` → no decimal separator
  mismatch, no reduced-motion mismatch.
- Norm card animation moved from a custom IntersectionObserver to
  `StaggerContainer` + `StaggerItem`, which already honour
  `prefers-reduced-motion`.

---

## Validation

| Check | Result |
|---|---|
| `pnpm --filter web typecheck` | 39 pre-existing errors, **0 new** |
| `pnpm --filter web build` | ✅ OK (~91 s) |
| `GET /normes` | 200, ~299 KB SSR HTML |
| `GET /fr/normes` | 200, ~454 KB SSR HTML |
| 15 framework chips visible in HTML | ISO 14001, ISO 26000, ISO 59014, GHG Protocol, GRI, CSRD/ESRS E1-E5, TCFD, B Corp, GreenTech, NR (INR), Lucie 26000, ADEME Base Carbone, Eurostat, AGEC Score, EcoVadis |
| Nested `<a><a>` in HTML | **0** |
| AnimatedCounter SSR initial state | `0` (integers, no fraction) — locale-aware ✅ |
| Em-dash in NEW Phase 4.5 deliverables (page.tsx, norms-tabbed-content.tsx, normes.json FR+EN) | **0** |
| Em-dash in rendered HTML | 2 (pre-existing env var + copyright, scope of Phase 8 cleanup) |
| Other pages | `/`, `/about`, `/solutions`, `/fr/explorer`, `/home → /auth/sign-in` all intact |
| PDF download endpoint | `window.open('/api/normes/pdf?id=...')` preserved |

---

## Visual checklist (manual)

- [ ] **`/fr/normes`**: cream hero with bracket `[ Conformité ]`, centered display title.
- [ ] Stats: 4 animated counters in a row on desktop (1 col on mobile), with bracket section header `[ En chiffres ]`. Sources cited in font-mono below each value.
- [ ] Filter chips: 6 pills (Économie circulaire, Bilan carbone, Reporting ESG, Traçabilité, Données et SaaS, Labels), active = forest bg + lime text + Enviro shadow, idle = cream bg with hover border. Sticky on scroll. Click triggers smooth scroll + URL hash sync.
- [ ] Per-tab hero: image with deep forest gradient, lime bracket tag "[ N normes intégrées ]", display title.
- [ ] Norm cards: 3-col grid desktop, 1-col mobile. Stagger reveal at scroll. Ember reference top, forest title, lime "On-chain" badge when applicable. PDF download icon as button (no nested anchor).
- [ ] Labels preparation panel: only on `labels` tab, forest dark with lime accent.
- [ ] Frameworks strip: 15 pill chips, white bg, forest text, mono font, stagger reveal.
- [ ] Audit CTA: forest section, magnetic ember "Demander un audit" → `/contact`, secondary outlineCream "Voir les solutions" → `/solutions`.
- [ ] Mobile 375 / 414: stats stack 1 col, filter chips horizontal scroll, framework chips wrap, audit buttons stack.
- [ ] Toggle OS reduce-motion → counters snap, stagger collapses, no parallax.
