# Blog page migration — Phase 4.6

**Routes:** `/blog`, `/fr/blog`, `/en/blog`, `/blog/[slug]`,
`/fr/blog/[slug]`, `/en/blog/[slug]`
**Files:**
- `apps/web/app/[locale]/(marketing)/blog/page.tsx` (list)
- `apps/web/app/[locale]/(marketing)/blog/[slug]/page.tsx` (article — file untouched, only `Post` re-skinned)
- `apps/web/app/[locale]/(marketing)/blog/_components/post.tsx`
- `apps/web/app/[locale]/(marketing)/blog/_components/post-header.tsx`
- `apps/web/app/[locale]/(marketing)/blog/_components/post-share.tsx` (NEW)
- `apps/web/app/[locale]/(marketing)/blog/_components/cover-image.tsx`
- `apps/web/app/[locale]/(marketing)/blog/_components/blog-pagination.tsx`
- `apps/web/i18n/messages/{fr,en}/blog.json` (NEW namespace)
- `apps/web/i18n/request.ts`
**Phase:** 4.6 — Marketing pages migration
**Status:** ✅ Migrated

---

## Sections — before / after

### List `/blog`

| # | Section | Before | After (Enviro) |
|---|---|---|---|
| 1 | Hero | `SitePageHeader` minimal | `EnviroPageHero tone="cream"` with bracket tag `[ Blog ]` |
| 2 | Posts grid | `PostsGridList` + custom `PostPreview` link | `EnviroBlogCard` (Phase 3) inside a `StaggerContainer` / `StaggerItem` for reveal-on-scroll. 3 cols desktop, 1 col mobile. |
| 3 | Pagination | `BlogPagination` with shadcn `Button outline` | `BlogPagination` now uses `EnviroButton variant="secondary"` |

### Article `/blog/[slug]`

| # | Section | Before | After (Enviro) |
|---|---|---|---|
| 1 | Header | Centered title + small date + cover image | New PostHeader: bracket `[ ← Retour aux actualités ]` link, bracket `[ Article ]` tag, display title, font-mono "Publié le ...", localised date via `getFormatter`, optional dangerously-set HTML description, hero cover image 3:2 with explicit `sizes` |
| 2 | Body | Single column markdoc article | 12-col grid: `article col-span-8` with **prose Enviro** (`prose-headings:font-[Inter display]`, `prose-a:text-[--color-enviro-cta]`, `prose-img:rounded-[--radius-enviro-xl]`, `prose-blockquote:border-l-[--color-enviro-lime-400]`), sidebar `col-span-4` sticky |
| 3 | Sidebar (NEW) | (none) | `PostShare` toolbar (LinkedIn / X / email / copy-link with `Clipboard API`, all `<button>` to avoid nested anchors) + a "À lire aussi / Read also" panel linking back to `/blog` |
| 4 | Newsletter footer (NEW) | (none) | `EnviroNewsletterCta` forest tone reusing the Phase 3 component |

---

## CMS preserved (no `@kit/cms` modified)

- `getContentItems` (list) and `getContentItemBySlug` (article) still
  use `@kit/cms` `createCmsClient()` with the same params.
- `ContentRenderer` (markdoc) is rendered as-is, only the wrapping
  `<article>` gets Enviro typography utilities via Tailwind `prose-*`.
- Keystatic content pipeline untouched.
- All draft / publish / cache / `react.cache` semantics preserved.

---

## Image `sizes` warning fixed

`CoverImage` (`<Image fill>`) now accepts a `sizes` prop with a sensible
default for the 3-col grid teaser (`(max-width: 768px) 100vw,
(max-width: 1280px) 50vw, 33vw`). The article hero overrides it with
`(max-width: 1024px) 100vw, 1024px`. This silences the Next.js
warning seen for `/images/posts/economie-circulaire-*.jpg`.

---

## i18n — new dedicated `blog` namespace

- Created `apps/web/i18n/messages/{fr,en}/blog.json` (24 keys per
  locale, perfectly symmetric).
- Registered `blog` in `apps/web/i18n/request.ts`.
- Existing flat `marketing.blog*` keys (used by other places like the
  landing footer link "Actualités") **kept unchanged** for backward
  compatibility.

### Key buckets

```
title, subtitle, heroTag, categoryTag, noPosts, readMore,
paginationPrevious, paginationNext, backToBlog,
publishedOn, readingTime,
shareTitle, shareLinkedin, shareTwitter, shareEmail,
shareCopy, shareCopied,
tocTitle, relatedTitle,
ctaTag, ctaTitle, ctaSub, ctaButton
```

---

## Hydration safety

- `getFormatter()` from next-intl provides locale-aware date formatting
  on the server, avoiding the `toLocaleDateString` pitfall.
- `PostShare` is a Client Component but its initial state is fully
  deterministic (`copied = false`); the SSR markup matches the client's
  first render.
- `StaggerContainer` / `StaggerItem` use the hydration-safe
  `useReducedMotionSafe` hook from commit `b529f157`.
- `PostShare` uses `<button>` (no nested anchors) when sharing to
  external networks.

---

## Validation

| Check | Result |
|---|---|
| `pnpm --filter web typecheck` | 39 pre-existing errors, **0 new** |
| `pnpm --filter web build` | ✅ OK (~65 s) |
| `GET /blog` | 200, ~284 KB SSR HTML |
| `GET /fr/blog` | 200, ~439 KB SSR HTML |
| `GET /fr/explorer/plastiques` (former `{volume}` bug page) | 200 |
| FORMATTING_ERROR in next start logs | **0** (was: emitted on every `/explorer/[category]` request) |
| Nested `<a><a>` in HTML | **0** |
| Em-dash in NEW Phase 4.6 deliverables | 0 (2 in rendered HTML come from pre-existing env var + copyright, scope of Phase 8) |
| Other pages | `/`, `/about`, `/normes`, `/solutions` all 200 |

---

## Visual checklist (manual)

- [ ] **`/fr/blog`**: cream hero with bracket `[ Blog ]`, centered title, 3-col grid of `EnviroBlogCard` with stagger reveal.
- [ ] **`/en/blog`**: same with EN strings (title "News", tag "[ Blog ]").
- [ ] Each card: 3:2 image with hover scale, bracket category, font-mono date, hover lift, no nested anchors when clicked.
- [ ] Pagination: `EnviroButton` secondary outline, arrow icons, only renders previous when `page > 0` / next when more posts.
- [ ] **Article page** (when a post is published in the CMS): hero with bracket back link + bracket `[ Article ]` tag + display title + font-mono "Publié le ...". Cover image 3:2 rounded.
- [ ] Article body: prose Enviro, lime-bordered blockquotes, ember accent on links, headings in Inter display.
- [ ] Sidebar sticky on desktop: PostShare toolbar (LinkedIn + X + email + copy with green confirmation), "À lire aussi" panel with back-to-blog button.
- [ ] Footer: newsletter CTA forest section.
- [ ] Mobile 375 / 414: cards stack 1 col, sidebar moves below the article, share toolbar wraps.
- [ ] Toggle reduced motion: stagger reveal disabled, no flash on hydration.
