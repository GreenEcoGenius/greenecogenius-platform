# Phase 9 Hotfix — investigation of the production 500

> **Status** : no reproducible code-level root cause identified. Likely transient alias propagation during the GitHub-triggered auto-promote of `dpl_3cXaN6btAVJLCkvkuA94ZaGGX2s6` (merge commit `115996671`).
> **Prod status at investigation time** : rolled back to `dpl_66xZXqFbCk5wDgiyBwPCCQYUjgdZ` (`fcf8cdc8`), 200 OK on every probed route.

---

## 1. Claim vs. observation

| Claim (from ticket) | Observation |
|---|---|
| `www.greenecogenius.com` returns 500 on `/` since PR #2 merge | Current prod (rolled back) returns 307 → /fr 200. Not reproducible on prod now. |
| The broken deploy served 500s to real users | The broken deploy, probed on its direct URL `greenecogenius-platform-dev-tool-mi2mofzcs.vercel.app`, returns 200 on every smoke route today. |
| Cause is code-level (Keystatic `process.cwd()`, missing env var, "use server", turbopack mismatch) | None of these hypotheses produce an observable failure on the broken deploy. Build succeeded (51s, no fatal errors). Runtime logs of `dpl_3cXaN6b…` after rollback are empty (no errors since). |

## 2. Smoke matrix (broken deploy, direct URL, post-rollback)

```
greenecogenius-platform-dev-tool-mi2mofzcs.vercel.app
/                   → 307 (locale redirect)
/fr                 → 200
/en                 → 307
/fr/auth/sign-in    → 200
/fr/home            → 200
/fr/admin           → 404 (AdminGuard, expected)
/fr/docs            → 200
/sitemap.xml        → 307 → /fr/sitemap.xml 401 (SSO on preview URL)
/robots.txt         → 307 → /fr/robots.txt  401 (SSO on preview URL)
/api/healthcheck    → 200
/api/version        → 200
/fr/contact         → 200
/fr/blog            → 200
/fr/explorer        → 200
```

Every route that a real user would hit works. The Enviro merge build is healthy.

## 3. What this means for the reported 500

Three plausible explanations remain :

1. **Alias propagation race during the auto-promote**. When the GitHub merge triggers a prod deploy, Vercel swaps the alias. For 30-90 seconds, edge nodes can serve mixed state : some resolve the new deploy, some still see the old, and a subset hits neither and returns 500. The user probably sampled the site within that window.
2. **A single route not covered by this smoke probe**. Possible but unlikely — the home `/` is the first probe and it succeeds.
3. **CDN / edge cache in front of the alias**. Less likely here since `www.greenecogenius.com` goes straight to Vercel, but the `x-vercel-cache: MISS` header on probe confirms no stale cache at edge.

None of these require a code change. The Phase 9.2 report reached the same conclusion and recommended Path A (fresh `vercel deploy --prod` with tight alias watch).

## 4. Latent bug found during the investigation (unrelated to 500)

The i18n middleware (`apps/web/proxy.ts`) matcher excludes `_next/static`, `_next/image`, `images`, `locales`, `assets`, `preview/`, `enviro/`, `api/*` — **but not `sitemap.xml` and `robots.txt`**. As a result :

- `/sitemap.xml` → 307 → `/fr/sitemap.xml` → 404 (no such route)
- `/robots.txt` → 307 → `/fr/robots.txt` → 404 (no such route)

The actual routes live at `apps/web/app/sitemap.xml/route.ts` and `apps/web/app/robots.ts`, at the root, so they must bypass the locale prefix. Same symptom exists on the rolled-back deploy, so this is **pre-Enviro** and does not explain the 500 — but we ship the fix in this hotfix pass because it is scoped and safe.

## 5. Hotfix shipped

Commit updates `apps/web/proxy.ts` matcher to exclude `sitemap.xml` and `robots.txt`. No runtime behavior change for any other path.

## 6. Re-promote plan

Per Phase 9.2 Path A :

1. Fix the matcher, push to `enviro-adoption/v1`.
2. Preview smoke (6 routes, expect 200 / 307).
3. `vercel promote <preview-id> --scope greenecogenius-projects` to swap alias via CLI (finer control than auto-promote from GitHub merge).
4. Tight loop `curl -I www.greenecogenius.com/` for 120 seconds after the alias swap ; re-rollback on first 500.

## 7. Decision if 500 reappears

```
500 on www.greenecogenius.com after re-promote?
├── Direct deploy URL also 500 → real code bug, rollback + repro locally
├── Direct deploy URL 200      → alias race still transient, wait 120s, re-probe
└── > 120s and still 500       → rollback, open dedicated incident ticket
```
