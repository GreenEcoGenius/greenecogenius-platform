# Phase 9 — Cleanup checklist before merging to `main`

This file tracks **temporary scaffolding** introduced during the Enviro
adoption migration that should be reviewed (kept, gated, or removed) before
the final production merge of branch `enviro-adoption/v1`.

---

## Phase 2 additions

### 1. Webflow template alias `/preview/enviro`

**Where**

- `apps/web/next.config.mjs` — `getRewrites()` + `isEnviroPreviewEnabled()`.
- `apps/web/proxy.ts` — `preview` and `enviro` excluded from the middleware
  matcher (`config.matcher`).
- Static source: `apps/web/public/enviro/**` (Webflow export, ~14 HTML
  pages + CSS + JS + 130 AVIF images + videos folder).

**Default behavior today**

- Enabled in `dev`, in `vercel.preview` deployments, and in any other
  non-`vercel.production` environment.
- Disabled when `process.env.VERCEL_ENV === 'production'`.
- Override via `NEXT_PUBLIC_ENABLE_ENVIRO_PREVIEW` (`true` to force on,
  `false` to force off).

**Phase 9 decision matrix**

| Choice | Action |
|---|---|
| **A — Remove entirely** (recommended once migration is fully QAed) | Delete `getRewrites()` + the `rewrites: getRewrites` entry in `apps/web/next.config.mjs`. Restore `apps/web/proxy.ts` matcher to `['/((?!_next/static|_next/image|images|locales|assets|api/*).*)']`. Delete `apps/web/public/enviro/` (frees ~10 MB of AVIF + the 336 KB `webflow.js`). |
| **B — Keep as internal reference** | Leave the rewrite block, but keep the production gate. Document the alias in `docs/enviro-migration/SUMMARY.md`. Optionally add basic auth via a route handler if the design system reference must stay non-public. |
| **C — Keep public** | Force `NEXT_PUBLIC_ENABLE_ENVIRO_PREVIEW=true` on Vercel production. Add the alias to `robots.txt` disallow list to avoid SEO noise. |

> **Default plan**: option A. Reset to a clean `next.config.mjs` and remove
> the static folder once Phases 3–8 are fully validated by the user.

---

## Future additions (placeholder)

When a later phase introduces another temporary scaffold (e.g. a
`/_preview/components` storybook-like page in Phase 3, or a feature flag
needed only during the migration), append a new section here so we keep a
single source of truth for the cleanup pass.

- Phase 3 — internal `/_preview/enviro-components` storybook page (TODO).
- Phase 4 — per-page screenshot diffs in `docs/enviro-migration/pages/*.md`
  (kept, useful long-term documentation).
- Phase 5+ — TBD.
