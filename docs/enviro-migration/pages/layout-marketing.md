# Marketing layout migration — Phase 5

**File:** `apps/web/app/[locale]/(marketing)/layout.tsx`
**Companion files:**
- `apps/web/components/enviro/enviro-navbar.tsx` (active link state added)
- `apps/web/app/[locale]/(marketing)/_components/site-navbar-ctas.tsx` (NEW)
- `apps/web/app/[locale]/(marketing)/_components/footer-newsletter-form.tsx` (NEW)
**Phase:** 5 — Marketing layout shell
**Status:** ✅ Migrated

---

## Goal

Wire `EnviroNavbar` and `EnviroFooter` (Phase 3) as the global shell of the
public `(marketing)` segment so the 7 pages migrated in Phases 4.1 → 4.7
share the exact same chrome, and the 5 remaining pages (Phase 4.8 → 4.11)
inherit it for free.

---

## Layout — before / after

### Before

```tsx
<div className="flex min-h-[100vh] flex-col overflow-x-hidden">
  <SiteHeader user={user.data} />        // wraps @kit/ui/marketing Header
  <div className="pt-14 md:pt-20">       // manual padding to clear header
    {children}
  </div>
  <SiteFooter />                          // wraps @kit/ui/marketing Footer
</div>
```

### After

```tsx
<div className="flex min-h-[100vh] flex-col overflow-x-hidden bg-[--color-enviro-cream-50]">
  <EnviroNavbar
    brand={<AppLogo … />}
    links={[ /about, /solutions, /explorer, /normes, /blog, /pricing, /contact ]}
    tone="forest"
    sticky
    showLocaleSwitcher
    ctaSecondary={<SiteNavbarCtas user={…} slot="secondary" />}
    ctaPrimary={<SiteNavbarCtas user={…} slot="primary" />}
    mobileMenuLabel={t('common.openMenu')}
    closeMenuLabel={t('common.closeMenu')}
  />
  <main className="flex-1">{children}</main>
  <EnviroFooter
    brand={<AppLogo … invert />}
    description={t('marketing.footerDescription')}
    sections={[ "À propos", "Produit (incl. FAQ)", "Mentions légales" ]}
    newsletter={<FooterNewsletterForm />}
    copyright={…copyright + footerSecurityBadge…}
    tone="forest"
  />
</div>
```

The previous `pt-14 md:pt-20` is gone — `EnviroNavbar` is sticky and lives
naturally in the document flow, so the page content under it does not
need padding.

---

## Navbar specification (Phase 5 strict)

### Desktop

- Brand on the left: existing `AppLogo` (Next `Image`) clipped to
  `h-10 md:h-12`, inverted (`invert brightness-0`) so it reads white on
  the forest navbar.
- Menu — **7 entry points + the logo home link = 8 navigation items in
  the strict order**:
  1. Logo → `/` (Accueil)
  2. À propos → `/about`
  3. Nos Solutions → `/solutions`
  4. Explorateur → `/explorer`
  5. Normes & Standards → `/normes`
  6. Actualités → `/blog`
  7. Tarifs → `/pricing`
  8. Contact → `/contact`
- **No "Pages" dropdown.** The previous `<NavigationMenu>` from
  `@kit/ui/navigation-menu` was wrapping items in a dropdown trigger;
  `EnviroNavbar` ships flat `<ul><li><Link>` markup, no dropdown.
- Right side: locale switcher (FR ↔ EN, built into `EnviroNavbar`),
  then auth-aware CTAs:
  - Logged out → `Sign In` (`outlineCream`) + `Sign Up` (`primary` ember).
  - Logged in → `Dashboard` (`primary` ember).
- Sticky: `position: sticky; top: 0` with `z-[--z-enviro-sticky]`. After
  scroll > 8 px, the navbar gains `backdrop-blur-md` and a subtle
  `shadow-enviro-sm`.
- **Active link state**: the new internal `isActive(pathname, href)`
  helper compares the locale-stripped pathname against each link.
  Matching entries get `aria-current="page"` and a lime underline
  (`after:bg-[--color-enviro-lime-300]`) on forest tone. The helper
  treats `href="/"` as active only on the literal root and recognises
  descendant routes (`/blog/foo` activates `/blog`).

### Mobile

- Hamburger trigger: `Menu` icon, `aria-label={common.openMenu}`.
- Drawer: full-screen, `fixed inset-0 bg-[--color-enviro-forest-900]
  text-[--color-enviro-fg-inverse]`, rendered via `createPortal` to
  `document.body`. Scroll lock applied through `document.body.style.overflow`
  (already in `EnviroNavbar`).
- Header strip: brand + close `X` button with
  `aria-label={common.closeMenu}`.
- 8 vertical link entries with the active link in `lime-300`.
- Footer of the drawer: locale switcher + auth-aware CTAs (same elements
  as the desktop strip) so the drawer is a complete navigation surface.

---

## Footer specification

### Layout

```
[ Brand block (logo + description + security badge in copyright row) ]   [ Newsletter inline ]

À propos              Produit                  Mentions légales
- À propos            - Explorateur            - Conditions générales
- Nos Solutions       - Tarifs                 - Politique de confidentialité
- Normes & Standards  - FAQ          ◀──┐      - Politique de cookies
- Contact             - Actualités       │     
                      - Changelog        │ FAQ uniquement ici, jamais dans la nav
```

### Newsletter

A minimal Client Component (`FooterNewsletterForm`) with email input + Enviro
ember submit. Same placeholder semantics as the existing landing
`NewsletterForm` (no real backend wired yet, success appears after a 1 s
delay). The form uses the existing `marketing.newsletterHeading`,
`newsletterSubheading`, `newsletterPlaceholder`, `newsletterButton`,
`newsletterSuccess` and `newsletterDisclaimer` keys.

### Copyright row

- Localised copyright string from `marketing.copyright` (with `product`
  and `year` interpolation).
- Inline `ShieldCheck` lime icon + `marketing.footerSecurityBadge`
  ("Hébergé sur infrastructure certifiée ISO 27001 & SOC 2 (Supabase,
  Vercel) · Données dans l'UE (RGPD) · Blockchain Polygon Mainnet").

---

## EnviroNavbar component change

`apps/web/components/enviro/enviro-navbar.tsx` gained:

1. `import { usePathname } from 'next/navigation';`
2. `function isActive(pathname, href)` helper at the top of the file
   (locale-prefix aware, root-link safe).
3. Each navigation `<Link>` now sets `aria-current="page"` and a tone-
   appropriate active class (lime underline on forest, ember underline
   on cream).
4. The mobile `<MobileMenu>` accepts a `pathname` prop and applies the
   same active styling to its vertical link list.

This change is **backward compatible** with every other consumer of
`EnviroNavbar` (Phase 3 demo page, future shells); none of them passed a
sentinel for the active link, the helper just decides per render.

---

## Logic preserved (no Server Action / Supabase / `@kit/*` modified)

- ✅ `requireUser` + `getSupabaseServerClient` are still called once per
  layout render in the `Server Component`. The `JWTUserData` is forwarded
  to `SiteNavbarCtas` (Client Component) so the auth-aware buttons are
  rendered without leaking server-only code.
- ✅ `apps/web/app/[locale]/layout.tsx` (the `LocaleLayout` shell —
  `RootProviders`, `Toaster`, `CookieBanner`, fonts, analytics, `next-intl`
  provider) is **not touched**. The marketing layout sits one level below
  it.
- ✅ The 7 already-migrated pages do **not** declare their own navbar /
  footer; the smoke test confirms exactly 1 occurrence of the `aria-label="Primary"` nav per page.

---

## i18n

**Zero new namespace required.** Phase 5 reuses existing keys:

```
auth.signIn, auth.signUp                          (CTA labels)
common.dashboardTabLabel                          (Dashboard CTA when signed in)
common.openMenu, common.closeMenu                 (mobile drawer aria)
marketing.about, solutions, explorerNav, normes,
  blog, pricing, contact                          (navbar items)
marketing.about, product, legal                   (footer column headings)
marketing.about, solutions, normes, contact,
  explorerNav, pricing, faq, blog, changelog,
  termsOfService, privacyPolicy, cookiePolicy     (footer link labels)
marketing.footerDescription, copyright,
  footerSecurityBadge                             (footer brand block)
marketing.newsletterHeading, newsletterSubheading,
  newsletterPlaceholder, newsletterButton,
  newsletterSuccess, newsletterDisclaimer          (footer inline form)
```

Every label is rendered through `next-intl` (`getTranslations` server-side,
`useTranslations` / `Trans` client-side). No hardcoded strings in any of
the three new / modified files.

---

## Hydration safety

- `EnviroNavbar` already shipped hydration-safe (`useEffect` for the
  scroll listener and the `mounted` portal flag, deterministic initial
  state).
- The new `usePathname` call on the server tree returns a stable string
  by the time the client first renders (Next.js feeds it via context),
  so the active-link computation matches SSR ↔ client.
- `FooterNewsletterForm` initial `status='idle'` is deterministic.
- `SiteNavbarCtas` is a thin wrapper around `EnviroButton` + `Trans`,
  no client-only state.

---

## Validation

| Check | Result |
|---|---|
| `pnpm --filter web typecheck` | 39 pre-existing errors, **0 new** |
| `pnpm --filter web build` | ✅ OK (~51 s, all routes regenerated) |
| 10 marketing pages probed (`/`, `/fr`, `/about`, `/fr/about`, `/solutions`, `/normes`, `/blog`, `/fr/blog`, `/fr/explorer`, `/fr/explorer/plastiques`) | All 200, all show **exactly 1 EnviroNavbar** (`aria-label="Primary"` count = 1) and the footer chrome |
| Active link `aria-current="page"` correctly applied | ✅ Verified on `/fr/blog` ("Actualités" lime underlined) and `/fr/normes` ("Normes & Standards" lime underlined) |
| FAQ link in HTML | **1 occurrence**, located in the footer Produit column. **Zero** in the navbar. |
| Footer columns: "À propos / Produit / Mentions légales" | All 3 headings present in mono lime font |
| `FooterNewsletterForm` mounted | Visible in HTML |
| Nested `<a><a>` in HTML | **0** |
| Em-dash count in `/fr` | 2 (pre-existing env var + footerSecurityBadge, scope of Phase 8) |
| Auth gate `/home → /auth/sign-in` | 307 ✅ |
| Phase 2 alias `/preview/enviro` | 200 ✅ |
| Phase 3 demo `/enviro-components` | 200 ✅ |

---

## Troubleshooting

### Turbopack stale cache after the Phase 5 hot-reload

If `pnpm --filter web dev` started serving `/fr` (or any other locale-prefixed
route) as **404** right after pulling Phase 5, that is a **Turbopack
filesystem cache corruption**, not a code regression.

**Symptom**: server logs show

```
GET /fr 404 in 6.0s (next.js: 2.5s, proxy.ts: 317ms, application-code: 3.2s)
```

with no Server Component error trace.

**Why**: introducing the new `EnviroNavbar`, `SiteNavbarCtas` and
`FooterNewsletterForm` client islands changes the
Server Component ↔ Client Component boundary in
`(marketing)/layout.tsx`. When Turbopack hot-reloads on top of an older
graph it can land in a half-baked state and silently 404 the route.

**Fix** (one of):

```bash
# Cleanest: full reset, takes ~1 minute on cold start.
rm -rf apps/web/.next apps/web/node_modules/.cache
pnpm --filter web dev

# Lighter: only the Turbopack cache, the rest of .next is preserved.
rm -rf apps/web/.next/cache apps/web/.next/types
pnpm --filter web dev
```

Turbopack actually self-detects this error and prints

```
⚠ Turbopack's filesystem cache has been deleted because we previously
  detected an internal error in Turbopack. Builds or page loads may be
  slower as a result.
```

at the next start. After that warning, all routes are 200 again.

**Prevention**: when the Phase boundary changes the Server↔Client
component graph (Phase 5 did, Phase 6 will too), prefer to stop
`pnpm dev`, run `rm -rf apps/web/.next/cache` and restart, instead of
relying on hot-reload.

**Production**: this is purely a Turbopack dev-server quirk. The
production build (`pnpm --filter web build` then `pnpm start`) is fully
deterministic; the same Phase 5 commit serves all 11 marketing routes
at 200 with the expected SSR markup sizes (560 - 605 KB on `/fr`).

---

## Visual checklist (manual)

- [ ] **Same navbar + footer on every marketing page**: `/fr`, `/fr/about`, `/fr/solutions`, `/fr/explorer`, `/fr/normes`, `/fr/blog`, `/fr/pricing`.
- [ ] Logo on the left clicks back to `/` (Accueil).
- [ ] 7 menu items appear horizontally on desktop in the strict order.
- [ ] **No "Pages" dropdown** — only flat links.
- [ ] Active page label has lime-300 colour + lime underline. Non-active labels are muted white, hovering brings them to lime-300.
- [ ] Locale switcher EN / FR works (cookie + redirect).
- [ ] Sign in button (cream-bordered) + Sign up button (ember filled) on the right when logged out.
- [ ] Dashboard button (ember filled) on the right when logged in (no Sign in / Sign up).
- [ ] Scroll: navbar gets a subtle `backdrop-blur` + `shadow-enviro-sm` after a few pixels.
- [ ] **Mobile drawer** (≤ 768 px): hamburger opens a full-screen forest-900 drawer with the 8 vertical links + locale switcher + auth CTAs at the bottom. Body scroll locks while open.
- [ ] **Footer** dark forest, 3 link columns + newsletter inline on the right, copyright row with lime ShieldCheck icon + footerSecurityBadge.
- [ ] **FAQ link only in the footer Produit column**, never in the navbar.
- [ ] Newsletter input / button work visually (no real submit yet, placeholder success after 1 s).
- [ ] DevTools console: clean (only the pre-existing `PublicEnvScript` warning ignored).
