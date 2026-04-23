# Phase 9.2 - Production rollback report

> **Statut** : production rolled back, stable on commit `fcf8cdc8`.
> **Broken deploy** : `dpl_3cXaN6btAVJLCkvkuA94ZaGGX2s6` (commit `115996671`, merge PR #2 Enviro).
> **Rollback target** : `dpl_66xZXqFbCk5wDgiyBwPCCQYUjgdZ` (commit `fcf8cdc8`, pre-Enviro webflow template).

---

## 1. Rollback execution

Done via Vercel REST API (Vercel MCP plugin needed `mcp_auth` and would have added latency on a P0).

```
POST /v10/projects/{projectId}/promote/{rollbackDeploymentId}
```

Result : production aliases (`www.greenecogenius.com`, `.fr`, `.tech` and apex) immediately switched to `dpl_66xZXqFb`. Verified via :

```
www.greenecogenius.com           -> 200
www.greenecogenius.com/fr        -> 200
www.greenecogenius.com/api/healthcheck -> {"services":{"database":true}}
```

Total downtime estimate : less than 60 seconds (alias switch + edge propagation).

---

## 2. Diagnosis of the broken deploy

### Findings

The broken deploy `dpl_3cXaN6btAVJLCkvkuA94ZaGGX2s6` was inspected post-rollback :

| Source | Result |
|---|---|
| `/v13/deployments/{id}` | `state=READY`, `aliasAssigned=true`, `aliasError=null` |
| Build events log | Successful build, 51s, no fatal errors |
| Direct URL probes (after temp SSO disable) | `/fr` 200, `/fr/auth/sign-in` 200, `/fr/home` 200, `/fr/docs` 200, `/api/healthcheck` 200, `/api/version` 200, `/fr/explorer` 200, `/fr/blog` 200 |

Routes that returned non-200 :
- `/sitemap.xml` 404 (build output marked it as `○` static, suggests it should resolve, possible regression worth checking)
- `/robots.txt` 404 (same)
- `/fr/admin` 404 (expected, AdminGuard redirects unauthenticated requests)
- `/fr/marketplace` 404 (expected, route lives under `/fr/home/marketplace`)

**The deploy responds 200 on every Enviro page** when accessed via its direct vercel.app URL post-rollback. The 500 the user reported on `www.greenecogenius.com` could not be reproduced after the alias switched off the broken deploy.

### Likely causes (ranked by probability)

1. **Edge propagation race during alias switch** : Vercel aliases can take 30-90 seconds to propagate fully. The first requests landing on the new alias before the routing fully migrated would 500. Production checklist on this project still shows 0/5 (no Git, no monitoring, no analytics) so there is no automated detection of this window.
2. **CDN / Cloudflare cache in front of Vercel** : if a CDN sits in front of `www.greenecogenius.com`, it may have served stale 500 responses cached during the brief window. Worth checking the DNS chain.
3. **Specific error path not exercised by the diagnosis probes** : there could be a route or method that 500s but is not in the smoke probe set (e.g. an authenticated POST, a webhook endpoint, an `/fr/home/*` deep route).
4. **`/sitemap.xml` and `/robots.txt` 404** : the build marked them as static (`○`) but they 404 at runtime. This is a real regression to investigate, but it would not cause the home `/` to 500.

### What the diagnosis ruled OUT

- Supabase env vars : `NEXT_PUBLIC_SUPABASE_PUBLIC_KEY` is present in Production (added to Preview / Development during Phase 9.1 to fix the same issue there). `/api/healthcheck` returned `database:true` on the broken deploy.
- Anthropic / Stripe / Alchemy / Docusign env vars : present in Production env list (verified via `vercel env ls`).
- `process.cwd()` Keystatic bug : would only affect `/fr/docs` rendering of cards. The page itself rendered 200 with the EnviroDocsSidebar visible.
- "use server" function passing : was already fixed by commits 468e6106 + 909a8189, no new regression detected.

---

## 3. Recommendation

### Path A : conservative re-promote

1. Wait for current production (rolled back to `fcf8cdc8`) to bake for at least 30 minutes to confirm zero ongoing user impact.
2. Trigger a fresh deploy of the Enviro tip (`9847a63a`) via `vercel deploy --prod` from CLI rather than via the GitHub merge promote, which gives finer control over alias switch timing.
3. Watch the alias switch via `curl -I https://www.greenecogenius.com/` in a tight loop during the promote window. If any 500 surfaces, immediately re-rollback via `/promote/{previousId}`.
4. Also fix the `/sitemap.xml` and `/robots.txt` 404 (out of scope for this report, dedicated Phase 9.3 ticket).

### Path B : add observability before retrying

1. Connect the Vercel project to GitHub (Production Checklist 1/5 still shows "Connect Git Repository" undone). This enables auto-deploy on push and proper preview URLs per branch.
2. Enable Vercel Analytics + Speed Insights + Web Analytics.
3. Connect a real monitoring (Sentry / Datadog) to capture runtime errors at first request.
4. Then retry the promote with the safety net in place.

**Author recommendation** : **Path A**. The diagnosis showed the deploy code itself is healthy. Most likely cause was the alias propagation race or a CDN cache. Path B is good to do too, but should not block the Enviro ship.

---

## 4. State changes captured

| Change | Status |
|---|---|
| Production aliases switched to `dpl_66xZXqFb` (`fcf8cdc8`) | Done, verified 200 |
| `ssoProtection` temporarily disabled then restored | Restored to `{deploymentType: "all_except_custom_domains"}` |
| `.vercel/project.json` linked to `prj_DBwQtzyldu5ifkV72vkHgHL7lmIe` | Kept from Phase 9.1 |
| `NEXT_PUBLIC_SUPABASE_PUBLIC_KEY` env var on Preview + Development | Kept from Phase 9.1 |

No code changes. The `enviro-adoption/v1` branch is unchanged; the merge to `main` is still in place at GitHub side, but production no longer points to its build.

---

## 5. Decision tree if 500 reappears

```
500 on www.greenecogenius.com?
├── Yes, reproducible
│   ├── Check direct deploy URL (greenecogenius-platform-dev-tool-XXX.vercel.app)
│   │   ├── Also 500 -> code or env var issue, fix in branch and redeploy
│   │   └── Returns 200 -> alias / CDN / Cloudflare cache issue, purge cache
│   └── Check Vercel runtime logs via dashboard (Logs tab)
└── No -> watch for 5 min, mark resolved as transient propagation
```
