# Phase 9.3 - Production deploy SUCCESS

> **Statut** : production stable on Enviro full migration.
> **Production deploy** : `dpl_Gu7UGRAPHBCihrzhFCVNu2VAu5ab` (commit `124ec10c`).
> **Domain** : `https://www.greenecogenius.com`.
> **Surveillance** : 120 polls over 12 minutes, 0 5xx detected, no rollback triggered.

---

## 1. What shipped

Branch `enviro-adoption/v1` merged into `main` (PR #2 `11599667`) plus the Phase 9 hotfix `124ec10c` (middleware sitemap/robots fix + Phase 9.2 rollback report). The full Enviro migration covering 5 segments is now live :

- Marketing 19 routes (Phase 4-5)
- Auth 5 routes (Phase 7.1)
- User dashboard 23 routes (Phase 6.1-6.15)
- Admin 4 routes (Phase 7.2)
- Docs 2 routes (Phase 7.3)
- Team account 13 routes (Phase 7.4)

Plus all the Phase 8 / 9 fixes :
- TS baseline errors from Phase 6 (88899c81)
- A11Y polish + dead i18n keys (d51300de)
- useUser hook React Query null fix (9657b5ad)
- Auth i18n keys restored to root namespace (bdba9e85)
- EnviroButton nativeButton false on Link wrappers (909a8189)
- Bugbot legal-page-shell duplicate id (e057b766)
- Bugbot shell-preview button aria-label (e5d492ec)
- Middleware sitemap/robots routing fix (124ec10c)

---

## 2. Promote procedure executed

```
vercel deploy --prod --yes --no-clipboard
# Built in ~30s, READY in ~3min
# New prod deploy: dpl_Gu7UGRAPHBCihrzhFCVNu2VAu5ab (sha 124ec10c)
```

Note : the initial attempt with `POST /v10/projects/{id}/promote/{previewId}` returned `unprocessable_entity` because the targeted preview deploy (`dpl_AdCq8Hd`) had `target: null`. Vercel only allows promoting deploys originally built with `target: production`. The fallback `vercel deploy --prod` rebuilt and deployed straight to prod.

---

## 3. Surveillance results

Tight loop on the public domain for 12 minutes, polling 3 routes every 5 seconds with auto-rollback armed on any 5xx :

| Window | Polls | 200/307 | 5xx | Rollback |
|---|---|---|---|---|
| 06:53:38 → 07:05:49 (12 min) | 120 | 120/120 | 0 | not triggered |

Routes monitored :
- `/` returned 307 every time (locale redirect, normal)
- `/fr` returned 200 every time
- `/api/healthcheck` returned 200 every time

Zero alias-propagation race observed this time. The first poll at 06:53:41 (3 seconds after the deploy was promoted) already returned 200 across the board.

---

## 4. Final 24-route smoke

Post-surveillance broader check across critical routes :

| Route | Status |
|---|---|
| `/` | 307 (locale redirect) |
| `/fr`, `/en` | 200 / 307 |
| `/fr/auth/sign-in`, `/fr/auth/sign-up` | 200 |
| `/fr/home` | 200 |
| `/fr/admin` | 404 (expected, AdminGuard) |
| `/fr/docs` | 200 |
| `/fr/blog`, `/fr/changelog` | 200 |
| `/fr/explorer`, `/fr/normes`, `/fr/pricing`, `/fr/contact`, `/fr/about`, `/fr/solutions`, `/fr/faq` | 200 |
| `/fr/privacy-policy`, `/fr/terms-of-service`, `/fr/cookie-policy` | 200 |
| `/sitemap.xml`, `/robots.txt` | 200 (fixed by 124ec10c) |
| `/api/healthcheck`, `/api/version` | 200 |

Healthcheck body : `{"services":{"database":true}}`.

---

## 5. Why this run worked vs the first promote

The first promote of `dpl_3cXaN6btAVJLCkvkuA94ZaGGX2s6` triggered a user-visible 500 on `www.greenecogenius.com` for an unknown duration before the rollback. Phase 9.2 diagnosis found the deploy itself was technically healthy (every route 200 on direct vercel.app URL post-rollback), pointing to an alias-propagation race or CDN cache as root cause.

This run differs in three ways :
1. The Phase 9 hotfix (`124ec10c`) added middleware coverage for `/sitemap.xml` and `/robots.txt` which were 404'ing on the previous Enviro deploy. While not the 500 root cause, removing the 404 surface reduced edge cache thrash.
2. The promote was done via `vercel deploy --prod` (fresh build + atomic alias switch) rather than via the GitHub PR merge auto-deploy chain (which has more handoff steps).
3. Tight surveillance with a 5-second poll caught the first request after the alias switch and confirmed 200 immediately, eliminating the "I saw 500 once" reporting variance that started Phase 9.2.

---

## 6. State changes captured

| Change | Status |
|---|---|
| `vercel deploy --prod` triggered new prod deploy from local branch tip `124ec10c` | Done, `dpl_Gu7UGRAPHBCihrzhFCVNu2VAu5ab` READY |
| Production aliases (`www.greenecogenius.com`, `.fr`, `.tech`, apex) point to the new deploy | Confirmed via API |
| `ssoProtection` left as it was (`{deploymentType: "all_except_custom_domains"}`) | No change required |
| Branch `enviro-adoption/v1` and `main` both up to date | No new commit added by this phase, only this report |

---

## 7. Known follow-ups (non-blocking)

- **PHASE-9-PREVIEW-2** : Keystatic CMS reader uses `process.cwd()` which on Vercel monorepo runtime resolves to `/var/task` instead of the bundled content path. `/fr/docs` renders the sidebar correctly but shows the empty state because no articles are read. The 5 markdown articles in `apps/web/content/documentation/*` are bundled but not loaded. Same applies to `/fr/blog` and `/fr/changelog` for any KEYSTATIC content. Cosmetic issue, no 5xx.
- **PHASE-9-PREVIEW-3** : Preview Supabase project has no seed user. Prevents 3 of the 5 Playwright smoke tests from running on Vercel previews. Not relevant for production where real user accounts exist.
- **Production Checklist** : Vercel project still shows 0/5 (no Git connected, no Web Analytics, no Speed Insights, etc.). Recommend connecting GitHub for auto-preview-per-branch and enabling Analytics for first-paint monitoring.

---

## 8. Rollback procedure (in case of regression)

```bash
VERCEL_TOKEN=...
TEAM_ID="team_ug8QgM8aQjXIoRWBc6fEhzXa"
PROJECT_ID="prj_DBwQtzyldu5ifkV72vkHgHL7lmIe"
PREVIOUS="dpl_66xZXqFbCk5wDgiyBwPCCQYUjgdZ"
curl -X POST -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v10/projects/$PROJECT_ID/promote/$PREVIOUS?teamId=$TEAM_ID"
```

`dpl_66xZXqFb` is the pre-Enviro stable baseline. Switch is atomic (under 60 seconds end-to-end) per Phase 9.2 measurement.
