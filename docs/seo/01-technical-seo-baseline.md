# Technical SEO Baseline — SoftwareGlimpse

**Document:** `/docs/seo/01-technical-seo-baseline.md`  
**Audit date:** 2026-08-15  
**Scope:** Full repository + local rendered HTML (`next-server` v16.3.0 on `:3000`) + data-layer inventory  
**Code changes:** None (audit only)  
**Site URL constant:** `https://www.softwareglimpse.com` (`NEXT_PUBLIC_SITE_URL` override supported)

> **Current scores (post-refresh, 2026-08-15):** Technical SEO Health **100/100** · Overall Website Quality **83/100** · SEO-HEALTH FULL audit **0 open findings**. See [`03-technical-seo-current-status.md`](./03-technical-seo-current-status.md). Do **not** treat the historical “65” scorecard row as current — that was a stale pre-refresh snapshot.

> **Remediation (2026-08-15):** Foundational P0/P1 fixes are implemented. See [`02-technical-seo-architecture.md`](./02-technical-seo-architecture.md) for architecture and per-finding **FIXED / DEFERRED / INVALID / REMAINING** status. Sitemap ≈ **527** URLs after expansion.

---

## Executive Summary

> **Historical baseline narrative below.** Issues listed here were the audit starting point; most P0/P1 items are **FIXED**. For live posture use `SEO-HEALTH-LATEST.md` + Website Intelligence scorecard — not this section alone.

SoftwareGlimpse has a strong **opt-in indexation architecture** (`seo.indexable` + quality gates + `buildPageMetadata` defaults to noindex) and careful affiliate/`rel=sponsored` separation. Canonical URLs are absolute, trailing-slash consistent, and www-hosted.

The baseline originally showed **material crawl/index gaps and several production-risk defects** (status as of the initial pass — many since remediated):

1. **Sitemap coverage is severely incomplete** — generator includes categories, software, comparisons, and only 2 of 7 available tools. It omits **143 indexable guides**, **all** indexable use cases / capabilities / resources / audiences / features / requirements hubs & pages, company/legal, and most tools (~**259** additional indexable URLs estimated missing).
2. **Multiple CRM ecosystem detail routes returned HTTP 500** in local Turbopack (`node:fs` client chunking failure) for use cases, capabilities, features, requirements, and industries — while hubs and metadata mark many of those URLs indexable.
3. **Document titles double-brand** on many pages (`… | SoftwareGlimpse | SoftwareGlimpse`) because callers embed the brand and the root layout also applies `template: '%s | SoftwareGlimpse'`.
4. **Non-indexable pages emit `noindex, nofollow`** (not `noindex, follow`), reducing crawl discovery from soft-published content.
5. **Product hub tab URLs** (`/software/{slug}/{tab}/`) are **indexable** with near-identical titles/descriptions to the overview — ~243 additional URLs with high duplicate-risk.
6. Editorial/product gates correctly keep **Best CRM** and **alternatives** noindex for now, but the CRM hub still promotes Best CRM as a primary explore CTA.

Structured data helpers are conservative (no fake ratings/offers). Video uses lazy thumbnail → consent → iframe. Affiliate CTAs use `rel="sponsored noopener noreferrer"`. `/go/` is disallow + `X-Robots-Tag: noindex, nofollow` + 302.

`npm run audit:site` currently **crashes** (`to.getTime is not a function` in media freshness). `npm run seo:validate` passes (fixture-based; not a technical crawl audit).

---

## Final scorecard (baseline)

| Metric | Count / note |
| --- | --- |
| Route **patterns** inspected | **45+** App Router patterns (+ API/dev) |
| Concrete public URL inventory (data + static) | **~850+** addressable URLs (incl. software tabs) |
| **Sitemap URLs** | **275** |
| Estimated **indexable** URLs (meta intent) | **~520+** (excl. software tabs) / **~760+** (incl. software tabs if left indexable) |
| **Noindex** (intentional soft-publish / gates) | Guides hub; 28 guides; industries hub + 13 industries; best + alternatives; search; newsletter; privacy-request; stack-builder; compare/build; nested industry combo pages; many pricing product pages (fixture); `/dev/` |
| **Orphan / weakly linked** | Features, capabilities, requirements **not in header/footer**; discovery mainly via CRM hub + hubs |
| **Broken links (live sample)** | Ecosystem detail routes **HTTP 500** (Turbopack); wrong-order compare slugs **308** to canonical |
| **Redirect chains** | Feature legacy aliases (301); compare slug order (308); `/go/` 302 external |
| **Canonical issues** | Inherited homepage canonical on pages that skip `buildPageMetadata` (e.g. `/dev/design-system/`); software tabs self-canonical while thin/duplicate |
| **Sitemap issues** | Massive under-inclusion; static entries lack `lastModified` |
| **Structured-data issues** | Generally safe; FAQ/Video/SoftwareApplication present where intended; CollectionPage/ItemList on hubs |
| **Metadata issues** | Double brand titles; no OG images; generic category descriptions; title/desc copied across software tabs |
| **P0** | **4** |
| **P1** | **9** |
| **P2** | **10** |
| **P3** | **6** |
| Baseline path | `docs/seo/01-technical-seo-baseline.md` |

---

## Critical Issues (P0)

### P0-1 — Sitemap omits large share of indexable URLs — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | `getSitemapEntries()` does not emit guides, use cases, capabilities, requirements, features, resources, audiences (`/for/`), company/legal, most tools, or indexable hubs beyond a small static set. |
| **Affected routes** | 143 guides; 17 use cases; 16 capabilities; 16 resources; 8 audiences; 24 features; 10 requirements; hubs; 5/7 available tools; company/legal |
| **Component/file** | `src/seo/sitemap.ts`, `src/app/sitemap.ts` |
| **Evidence** | Sitemap count **275** = 7 static + 10 cats + 27 software + 231 comparisons. Breakdown: guides/industries/use-cases/capabilities/requirements/features/resources/company/legal/for = **0**. Live `/sitemap.xml` matches. |
| **Recommended fix** | Extend sitemap generation to all URLs that pass the same indexability gates as `generateMetadata`. Optionally split by type once >~1k URLs. |
| **Effort** | M (1–2 days) |
| **Risk** | Low (additive); watch sudden crawl budget spike |

### P0-2 — CRM ecosystem detail pages HTTP 500 (local Turbopack) — **FIXED** (verify prod build)

| Field | Detail |
| --- | --- |
| **Issue** | `/use-cases/{slug}/`, `/capabilities/{slug}/`, `/features/{slug}/`, `/requirements/{slug}/`, `/industries/{slug}/` return **500** with Turbopack error: chunking context does not support external `node:fs`. |
| **Affected routes** | Sampled: pipeline-management use case/capability; workflow-automation feature; separate-sales-processes requirement; saas industry. Hubs for these types often still **200**. |
| **Component/file** | App routes under `src/app/(site)/{use-cases,capabilities,features,requirements,industries}/…`; likely a client component importing server/fs code |
| **Evidence** | Live fetch 500; RSC error text cites `Failed to write app endpoint /(site)/use-cases/[slug]/page` / `node:fs`. |
| **Recommended fix** | Isolate `node:fs` to server-only modules; verify production `next build` output for these routes; add smoke tests for HTTP 200 on representative CRM ecosystem URLs. |
| **Effort** | M–L |
| **Risk** | High until fixed — indexable URLs that 500 are catastrophic if reproduced in prod |

### P0-3 — Indexable metadata on routes that currently fail to render — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | Use cases, capabilities, features, requirements set `indexable: true` (features hardcoded) while detail pages 500 — crawlers may see error documents or soft failures. |
| **Affected routes** | Same as P0-2 |
| **Component/file** | `generateMetadata` in respective `page.tsx` files |
| **Evidence** | Data flags + live 500s; hubs indexable and linking to detail URLs |
| **Recommended fix** | Fix render first (P0-2). Until then, do not sitemap these URLs; consider temporary noindex only if prod also fails. |
| **Effort** | S (policy) + depends on P0-2 |
| **Risk** | Medium |

### P0-4 — Site audit CLI unavailable for regression — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | `npm run audit:site` throws `TypeError: to.getTime is not a function` in research freshness / media governance. |
| **Affected routes** | N/A (tooling) |
| **Component/file** | `src/services/research/utils.ts` → `src/services/product-media/governance.ts` → site-audit research checks |
| **Evidence** | CLI stack trace 2026-08-15 |
| **Recommended fix** | Coerce date fields before `getTime`; add fixture covering string dates. |
| **Effort** | S |
| **Risk** | Low |

---

## High Priority (P1)

### P1-1 — Title template doubles brand suffix — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | Root layout `title.template = '%s \| SoftwareGlimpse'` plus titles that already include `\| SoftwareGlimpse`. |
| **Affected routes** | Guides, resources, several tools (TCO, implementation planner), others using branded `seo.title` strings |
| **Component/file** | `src/app/layout.tsx`, `src/seo/metadata.ts`, tool `TITLE` constants, seed `seo.title` |
| **Evidence** | Live titles e.g. `CRM Implementation Guide… \| SoftwareGlimpse \| SoftwareGlimpse` |
| **Recommended fix** | Pass bare titles into metadata; let template own the brand — or disable template when title already branded. |
| **Effort** | S–M |
| **Risk** | Low |

### P1-2 — `noindex` always pairs with `nofollow` — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | `buildPageMetadata` sets `follow: indexable`, so soft-published pages are `noindex, nofollow`. |
| **Affected routes** | All non-indexable pages using helper (guides soft-publish set, industries, best, search, etc.) |
| **Component/file** | `src/seo/metadata.ts` |
| **Evidence** | Helper unit check + live meta on `/guides/what-is-crm/`, `/best/crm-software/`, `/guides/` |
| **Recommended fix** | Default soft-publish to `noindex, follow` unless `nofollow` explicitly requested. |
| **Effort** | S |
| **Risk** | Low–medium (policy change) |

### P1-3 — Software hub tabs indexable near-duplicates — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | `/software/{slug}/{tab}/` uses same review title/description as overview; `indexable` follows product gate; unique self-canonicals. |
| **Affected routes** | 27 products × 9 tabs ≈ **243** URLs |
| **Component/file** | `src/app/(site)/software/[slug]/[tab]/page.tsx`, `hub-tabs.ts` |
| **Evidence** | Live `/software/pipedrive/features/` — index,follow; title/desc match overview; canonical ends with `/features/` |
| **Recommended fix** | Prefer `noindex,follow` for tabs **or** unique titles/descriptions + clear canonical to overview if tabs are UX-only. |
| **Effort** | S–M |
| **Risk** | Medium (index bloat / cannibalization) |

### P1-4 — No Open Graph / Twitter images — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | `buildPageMetadata` sets OG/Twitter text only — no `images`. |
| **Affected routes** | Global |
| **Component/file** | `src/seo/metadata.ts` |
| **Evidence** | Live HTML `OG_IMAGE: false` on all sampled pages |
| **Recommended fix** | Default site OG image + per-type overrides (product logo, guide hero). |
| **Effort** | M |
| **Risk** | Low |

### P1-5 — Available tools missing from sitemap — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | Only `/tools/`, crm-finder, crm-cost-calculator in sitemap. Missing scorecard, TCO, requirements builder, implementation planner, migration planner (all indexable). |
| **Affected routes** | `/tools/crm-vendor-scorecard/`, `/tools/crm-tco-calculator/`, `/tools/crm-requirements-builder/`, `/tools/crm-implementation-planner/`, `/tools/crm-migration-planner/` |
| **Component/file** | `src/seo/sitemap.ts`, `src/data/config/tools/registry.ts` |
| **Evidence** | Inventory script `TOOL_IN_SITEMAP … false` |
| **Recommended fix** | Generate from `TOOLS_REGISTRY` where `status==='available'` and page `indexable`. |
| **Effort** | S |
| **Risk** | Low |

### P1-6 — CRM hub promotes noindex destinations as primary CTAs — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | Explore paths push `/best/crm-software/` (noindex) and `/guides/how-to-choose-crm/` (soft noindex). |
| **Affected routes** | `/categories/crm/` → those URLs |
| **Component/file** | `src/services/category-hub/build-hub-model.ts`, category hub profile |
| **Evidence** | Hub model explorePaths; live best/guide robots noindex |
| **Recommended fix** | Point primary CTAs at indexable guides/tools until editorial gate flips; or accelerate Best CRM publish. |
| **Effort** | S |
| **Risk** | Low |

### P1-7 — Features pages hardcode `indexable: true` — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | Unlike other entities, feature detail metadata ignores `seo.indexable` / quality gates. |
| **Affected routes** | `/features/{slug}/` (24) |
| **Component/file** | `src/app/(site)/features/[slug]/page.tsx` |
| **Evidence** | Source: `indexable: true` unconditional when model exists |
| **Recommended fix** | Wire through entity/editorial gate consistent with requirements pillars. |
| **Effort** | S |
| **Risk** | Medium |

### P1-8 — Inherited root canonical when page omits `alternates` — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | Root layout spreads `buildPageMetadata({ path: '/' })`, so children that only set `title`/`robots` inherit homepage canonical. |
| **Affected routes** | `/dev/design-system/` (confirmed); any future page skipping helper |
| **Component/file** | `src/app/layout.tsx`, `src/app/dev/design-system/page.tsx` |
| **Evidence** | Live canonical `https://www.softwareglimpse.com/` on design-system while noindex |
| **Recommended fix** | Do not set canonical on root layout; require every route to set its own via helper. |
| **Effort** | S |
| **Risk** | Low–medium |

### P1-9 — Guides hub noindex while 143 child guides indexable — **FIXED**

| Field | Detail |
| --- | --- |
| **Issue** | `/guides/` is noindex; discovery depends on internal links / sitemaps (and sitemap currently excludes guides). |
| **Affected routes** | `/guides/`, all indexable `/guides/{slug}/` |
| **Component/file** | `src/app/(site)/guides/page.tsx`, `src/seo/sitemap.ts` |
| **Evidence** | Live hub robots noindex; 143 guides indexable in data |
| **Recommended fix** | Index the hub once listing quality is acceptable **and** add guides to sitemap. |
| **Effort** | S |
| **Risk** | Low |

---

## Medium Priority (P2)

| ID | Issue | Routes / files | Evidence | Fix | Effort |
| --- | --- | --- | --- | --- | --- |
| P2-1 | Tool landings missing SSR H1 (title in client app / Suspense) | TCO, implementation planner | Live H1_COUNT 0 | Server-render a real `<h1>` outside client island | S |
| P2-2 | Industries intentionally all `seo.indexable: false` while linked from CRM hub & footer | 13 industries + hub | Data + live hub noindex | Keep noindex until research complete; avoid promoting as if live SEO | S |
| P2-3 | Nested industry combo routes always noindex (OK) but still crawlable via links | `/industries/{}/capabilities\|use-cases\|features\|requirements/{}` | `generateMetadata` indexable:false | Ensure no sitemap inclusion; consider `nofollow` only if crawl waste | S |
| P2-4 | Compare hub filter URLs (`?category=`) share hub canonical (good) but nav uses hash+query | Header compare children | `site-header.tsx` | Document as intentional; keep canonical on `/compare/` | S |
| P2-5 | Generic metadata on catalogue hubs | `/categories/`, `/software/` | Live desc “Browse…” | Stronger unique copy | S |
| P2-6 | Homepage meta description is tagline only | `/` | `SITE_TAGLINE` | Richer SERP description | S |
| P2-7 | Footer omits features / capabilities / requirements / for | Global footer | `site-footer.tsx` | Add CRM ecosystem links | S |
| P2-8 | Header omits ecosystem IA (only Categories/Best/Compare/Tools/Guides) | Global header | `site-header.tsx` | Optional “CRM” megamenu section | M |
| P2-9 | Pricing product pages largely noindex (fixture research) while `/pricing/` indexable | `/pricing/{slug}/` | Live pipedrive pricing noindex | Expected until live verification; don’t sitemap | — |
| P2-10 | `lastModified` absent on 7 static sitemap URLs | Home, hubs, tools stubs | Sitemap entries | Set build/content dates | S |

---

## Low Priority (P3)

| ID | Issue | Notes |
| --- | --- | --- |
| P3-1 | Sitemap split by type | Not needed at 275 URLs; **will be useful** after guides+ecosystem (~500–1000+) |
| P3-2 | CollectionPage / ItemList on hubs | Present; validate against visible lists periodically |
| P3-3 | Brand logo strip `sr-only` names on xs | Acceptable if images have alt |
| P3-4 | DM Sans via `next/font` | Good; ensure no extra webfont FOIT |
| P3-5 | Faceted tool query params (`?from=tco`) | Canonical strips to clean tool path — verify all tools |
| P3-6 | Alternatives still linked with sponsored CTAs while noindex | Fine commercially; don’t sitemap |

---

## 1. Route / indexation audit

### URL architecture conventions (actual)

| Rule | Behavior |
| --- | --- |
| Host | `www.softwareglimpse.com` |
| Protocol | HTTPS assumed via absolute canonical helper |
| Trailing slash | **Required** (`trailingSlash: true` in `next.config.ts`) |
| Case | Lowercase slug paths |
| Affiliate redirects | `/go/{product}/[[...destination]]` — **disallow** + noindex header |
| Preview | `/api/preview` — disallow |

### Route pattern table

Legend: **IDX** = intended indexable when gates pass; **robots** = typical live directive when page renders; **SM** = in sitemap today.

| Route pattern | Page type | Indexable? | Robots (typical) | Canonical | SM | Status (sample) | Title / H1 notes | Breadcrumb | Structured data | Primary hub | Maturity |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Home | Yes | index,follow | self | Y | 200 | H1 present; weak desc | — | Organization, WebSite | — | Live |
| `/categories/` | Hub | Yes | index,follow | self | Y | 200 | Generic | — | — | Home | Live |
| `/categories/[...slug]/` | Category | Gate | index if gate | self | Y | 200 CRM | Strong H1 | Yes + JSON-LD | Breadcrumb, FAQ | Categories | CRM deep; others thinner |
| `/software/` | Hub | Yes | index,follow | self | Y | 200 | Generic | — | — | Home | Live |
| `/software/[slug]/` | Product review | Gate | index if gate | self | Y | 200 | Strong | Yes | SoftwareApplication, FAQ, VideoObject, Breadcrumb | Category | CRM researched |
| `/software/[slug]/[tab]/` | Product section | Same as product | index if gate | **tab URL** | N | 200 | Duplicate title/desc | Yes | Breadcrumb | Product | Duplicate risk |
| `/best/` | Hub | Conditional | **noindex** (no indexable children) | self | N | 200 | H1 ok | Yes | Collection-ish | Home | Shell |
| `/best/[slug]/` | Best list | Gate | **noindex** (CRM not approved) | self | N | 200 | Strong page, noindex | Yes | WebPage, FAQ | Category | Research in-progress |
| `/compare/` | Hub | Yes | index,follow | self | N | 200 | Strong | Yes | CollectionPage | Home | Live |
| `/compare/[slug]/` | Comparison | Gate | index if gate | self (ordered slug) | Y | 200 | Strong | Yes | Breadcrumb | Compare hub | 231 published |
| `/compare/build/` | Tool | No | noindex | self | N | — | Builder | — | — | Compare | Utility |
| `/alternatives/` | Hub | Conditional | likely noindex | self | N | — | — | — | — | — | Thin |
| `/alternatives/[slug]/` | Alternatives | Gate | **noindex** | self | N | 200 | Provisional copy | Yes | WebPage | Product | Not approved |
| `/guides/` | Hub | **No** | noindex,nofollow | self | N | 200 | H1 ok | Yes | CollectionPage | Home | Soft |
| `/guides/[slug]/` | Guide | Gate | 143 index / 28 noindex | self | **N** | 200 | Double brand title | Yes | WebPage, Breadcrumb | Guides / CRM | Mixed |
| `/use-cases/` | Hub | Yes | index,follow | self | N | 200 | H1 ok | Yes | WebPage | CRM | Live |
| `/use-cases/[slug]/` | Use case | Flagged yes | intended index | self | **N** | **500** | — | — | — | Use-cases hub | Flagged researched |
| `/capabilities/` | Hub | Yes | index,follow | self | N | 200 | H1 ok | Yes | WebPage | CRM | Live |
| `/capabilities/[slug]/` | Capability | Flagged yes | intended index | self | **N** | **500** | — | — | — | Capabilities hub | Flagged |
| `/requirements/` | Hub | Yes | index,follow | self | N | 200 | H1 ok | Yes | WebPage | CRM | Live |
| `/requirements/[slug]/` | Requirement | Pillar gate (10) | intended index | self | **N** | **500** | — | — | — | Requirements hub | Pillars ready |
| `/features/` | Hub | Yes | index,follow | self | N | 200 | H1 ok | Yes | WebPage | CRM | Live |
| `/features/[slug]/` | Feature | Hardcoded yes | intended index | self | **N** | **500** | — | — | — | Features hub | 24 pages |
| `/resources/` | Hub | Yes | index,follow | self | N | 200 | H1 ok | Yes | WebPage | CRM | Live |
| `/resources/[slug]/` | Resource | Flagged yes | index | self | **N** | 200 | Double brand | Yes | WebPage, FAQ | Resources | Live |
| `/industries/` | Hub | **No** | noindex | self | N | 200 | H1 ok | Yes | WebPage | CRM | Researching |
| `/industries/[slug]/` | Industry | All false | noindex | self | N | **500** | — | — | — | Industries hub | in-progress |
| `/industries/.../(cap\|uc\|feat\|req)/` | Nested combo | **No** | noindex | self | N | — | — | Yes | FAQ possible | Industry | Supporting |
| `/for/` | Audience hub | Yes | index,follow | self | N | 200 | H1 ok | Yes | WebPage | CRM | Live |
| `/for/[slug]/` | Audience | Flagged yes | index | self | **N** | 200 | H1 ok | Yes | WebPage, FAQ | For hub | Live |
| `/tools/` | Tools hub | Yes | index,follow | self | Y | 200 | H1 ok | Yes | ItemList | Home | Live |
| `/tools/crm-finder/` | Finder | Yes | index,follow | self | Y | 200 | H1 ok | Yes | WebPage, FAQ | Tools | Live |
| `/tools/crm-cost-calculator/` | Calculator | Yes | index,follow | self | Y | — | — | Yes | WebPage | Tools | Live |
| `/tools/crm-tco-calculator/` | TCO | Yes | index,follow | self | **N** | 200 | **No SSR H1** | Yes | WebPage, FAQ | Tools | Live |
| `/tools/crm-vendor-scorecard/` | Scorecard | Yes | index,follow | self | **N** | 200 | H1 ok | Yes | WebPage, FAQ | Tools | Live |
| `/tools/crm-requirements-builder/` | Builder | Yes | index,follow | self | **N** | — | — | Yes | WebPage, FAQ | Tools | Live |
| `/tools/crm-implementation-planner/` | Planner | Yes | index,follow | self | **N** | 200 | **No SSR H1** | Yes | WebPage, FAQ | Tools | Live |
| `/tools/crm-migration-planner/` | Planner | Yes | index,follow | self | **N** | — | — | Yes | WebPage, FAQ | Tools | Live |
| `/tools/software-finder/` | Coming soon | No | noindex | self | N | — | — | — | — | Tools | Partial |
| `/tools/software-stack-builder/` | Partial | No | noindex | self | N | — | — | — | — | Tools | Partial |
| `/pricing/` | Hub | Yes | index,follow | self | Y | 200 | H1 ok | Yes | Breadcrumb | Home | Live |
| `/pricing/[slug]/` | Product pricing | !fixture | often **noindex** | self | N | 200 | H1 ok | Yes | Breadcrumb | Pricing | Fixture-gated |
| `/search/` | Search | No | noindex | self | N | 200 | H1 Search | — | — | — | Utility |
| `/company/*` | Company | Yes | index,follow | self | **N** | 200 about | H1 ok | some | Breadcrumb on contact | Footer | Live |
| `/legal/*` | Legal | Yes (configured) | index,follow | self | **N** | 200 privacy | H1 ok | — | — | Footer | Live |
| `/privacy-request/` | Form | No | noindex | self | N | — | — | — | — | Legal | Utility |
| `/newsletter/*` | Flows | No | noindex | self | N | — | — | — | — | — | Utility |
| `/go/[product]/…` | Affiliate redirect | No | X-Robots noindex + disallow | n/a | N | **302** | — | — | — | — | Compat only |
| `/dev/design-system/` | Internal | No | noindex | **wrong → /** | N | 200 | H1 ok | — | — | — | Dev |
| `/api/*` | API | Block | disallow preview | n/a | N | — | — | — | — | — | Private |

### Content maturity summary

| Cluster | State |
| --- | --- |
| CRM category hub | Deep, indexable, strong internal graph (~316 unique hrefs in hub model) |
| CRM comparisons | 231 indexable, in sitemap |
| CRM products | 27 indexable, in sitemap |
| CRM guides | 143 indexable **not** in sitemap; 28 soft noindex fundamentals/selection |
| Best CRM | Published URL, editorial **not** approved → noindex |
| Alternatives | noindex / incomplete research |
| Use cases / capabilities / features / requirements | Content flagged mature; **render broken** in current local Turbopack |
| Industries | Published shells, research in-progress, **all noindex** |
| Resources / for / tools | Largely indexable; sitemap lag |

---

## 2. Canonical audit

### Global behavior (working)

- Absolute canonicals via `canonicalUrl()` + `getSiteUrl()`
- Trailing slash normalized
- www host default
- Self-referencing on pages using `buildPageMetadata`
- Search query (`?q=`) canonicalizes to `/search/`
- Compare wrong order slug → **308** to canonical ordered slug (`pipedrive-vs-close` → `close-vs-pipedrive`)
- Feature legacy paths redirected 301 in `next.config.ts`

### Issues found

| Issue | Severity | Notes |
| --- | --- | --- |
| Missing/incorrect inherited canonical | P1 | Pages without `alternates` inherit `/` |
| Software tab self-canonicals | P1 | Duplicate documents |
| Canonical to noindex page | P2 | Soft-published guides still self-canonical (OK) but hub CTAs point at them |
| Canonical loops | — | Not observed |
| Canonical to 404 | — | Not observed on samples |
| Sitemap ≠ canonical set | P0 | Many canonical indexable URLs absent from sitemap |
| HTTP/HTTPS / www | — | Consistent in helpers |
| Query duplicates | P2 | Monitor tool `?from=` params |

---

## 3. Robots / noindex audit

### `robots.txt` (live)

```
User-Agent: *
Allow: /
Disallow: /go/
Disallow: /api/preview
Host: https://www.softwareglimpse.com
Sitemap: https://www.softwareglimpse.com/sitemap.xml
```

**Assessment:** Appropriate — does **not** use robots.txt as a noindex substitute for drafts. Drafts use meta robots. `/go/` blocked from crawl (also noindex header).

### Classification map

| Class | Examples |
| --- | --- |
| **INDEX** | Home, categories, software, comparisons (gated), indexable guides/resources/tools/for/features hubs, etc. |
| **NOINDEX,FOLLOW** (desired for soft-publish) | *Not implemented* — currently noindex⇒nofollow |
| **NOINDEX** (actual: noindex,nofollow) | Soft guides, industries, best, alternatives, search, newsletter, compare/build, stack-builder, design-system, fixture pricing |
| **BLOCK CRAWL** | `/go/`, `/api/preview` |
| **PRIVATE** | Preview draft mode responses (`preview.ts` forces noindex,nofollow) |

---

## 4. Sitemap audit

| Check | Result |
| --- | --- |
| Only canonical URLs | Yes (absolute www + slash) |
| Only indexable (within included types) | Yes for cats/software/comparisons via `isEntityIndexable` |
| Includes drafts/noindex | No for best/alternatives/guides (but guides **should** be included when indexable) |
| Includes redirects `/go/` | No |
| Duplicate locs | None detected |
| lastModified | Present on entity URLs; missing on 7 static |
| Split needed? | **Not yet** at 275; **yes after** adding guides+ecosystem |

### Inclusion vs exclusion (actual)

**Included:** `/`, `/software/`, `/categories/`, `/tools/`, crm-finder, crm-cost-calculator, `/pricing/`, indexable categories, software, comparisons.

**Excluded (problem if indexable):** guides, use cases, capabilities, requirements, features, resources, for, company, legal, most tools, compare/best hubs.

---

## 5. Metadata audit

| Pattern | Severity | Notes |
| --- | --- | --- |
| Double `\| SoftwareGlimpse` | P1 | Template + branded titles |
| Missing OG/Twitter images | P1 | Global |
| Software tab title/desc clones | P1 | Cannibalization |
| Generic hub descriptions | P2 | Categories/software index |
| Homepage description = tagline | P2 | Thin SERP snippet |
| Feature titles formulaic | P3 | Consistent but OK |
| Unescaped entities | — | HTML entities in titles (`&amp;`) normal in source |

---

## 6. Heading / semantic HTML audit

| Check | Result |
| --- | --- |
| `<main>` landmark | Present (root layout) |
| Header/footer nav | Present |
| One H1 (samples) | Generally yes on content pages |
| Missing H1 | TCO & implementation planner (client/Suspense) |
| Tables | Mobile alternate lists used (comparison/pricing) — good |
| Multiple H1 | Not broadly observed |

---

## 7. Internal linking audit

### Expected CRM graph vs actual

```
CRM Hub (/categories/crm/)
  ├─ Best CRM          → EXISTS but NOINDEX (promoted anyway)
  ├─ Finder / Cost calc → indexable
  ├─ Compare hub        → indexable
  ├─ Guides             → mix; explore CTA → noindex how-to-choose-crm
  ├─ Capabilities hub + detail → hub OK; details 500
  ├─ Requirements hub + detail → hub OK; details 500
  ├─ Resources          → indexable; not in sitemap
  ├─ Use cases          → details 500
  ├─ Industries         → all noindex; details 500
  ├─ Features           → details 500
  ├─ Products / compares → strong
  └─ For / business types → indexable; weak global nav
```

### Graph issues

| Issue | Severity |
| --- | --- |
| Orphan-ish: features / capabilities / requirements absent from header & footer | P2 |
| Industries / use cases / resources footer-only (besides CRM hub) | P2 |
| Hub → noindex Best + soft guide | P1 |
| Indexable guides not in sitemap → rely on HTML links only | P0 |
| Broken detail targets (500) from hub cards | P0 |
| JS-only critical links | Not dominant — Next `Link`/`<a>` used for crawl paths |
| Affiliate vs editorial links separated | Good |

### Orphan pages (practical)

Not true orphans (linked from CRM hub and/or footer), but **weak discovery**:

- `/features/*`, `/capabilities/*`, `/requirements/*` (no global nav)
- Company/legal (footer only; missing sitemap)
- Most tools beyond finder/cost calc (hub linked; missing sitemap)

---

## 8. External link audit

| Type | Mechanism | rel | Notes |
| --- | --- | --- | --- |
| Affiliate | `AffiliateAnchor` / `SoftwareCta` | `sponsored noopener noreferrer` | Live sponsored counts on home/product/alternatives |
| Official / evidence | `ExternalLink` / `EvidenceSourceLink` | normal / not sponsored | Blocks affiliate-network sources as evidence |
| `/go/` compat | 302 + noindex + robots disallow | — | Not used for new markup |
| UGC | — | N/A | No public UGC surfaces sampled |

Broken external destinations: not exhaustively probed (out of scope for offline baseline); architecture prevents affiliate URLs as evidence.

---

## 9. Structured data audit

### Types emitted

| Type | Where | Safety notes |
| --- | --- | --- |
| Organization | Home | Minimal (name, url) |
| WebSite | Home | No SearchAction spam |
| BreadcrumbList | Most content | Absolute items via helper |
| WebPage | Tools, guides, ecosystem hubs | OK |
| CollectionPage | Guides/compare hubs | OK |
| ItemList | Tools hub | OK |
| FAQPage | Many pages when FAQ rendered | Helper filters empty |
| SoftwareApplication | Product overview | **No fabricated ratings** |
| VideoObject | Product when eligible | Requires name, contentUrl, thumbnailUrl |

### Flags

- No Review/AggregateRating spam observed in helpers — **good**
- FAQ JSON-LD only when FAQ content exists — **good**
- VideoObject only with thumbnail — **good**
- Avoid shipping schema on 500 pages (currently no HTML) — **incident**

Unsupported/unsafe: none intentionally shipped; watch Feature pages if thin content becomes indexable without substance.

---

## 10. JavaScript / rendering SEO audit

| Critical element | SSR? | Notes |
| --- | --- | --- |
| Title / meta / robots / canonical | Yes | Next Metadata API |
| JSON-LD | Yes | `<script type="application/ld+json">` in RSC pages |
| H1 / intro (editorial pages) | Mostly yes | Exceptions: some tools |
| Primary internal links | Yes | `<Link href>` |
| Product/category names | Yes | |
| Article/guide body | Yes | Guide blocks server-rendered |
| Tool results | Client | Correctly noindex personalized states; landing copy should stay SSR |
| Video iframe | Client after consent | Thumbnail SSR — good |
| Affiliate click tracking | onClick on real `<a href>` | Crawlable |

**Risk:** Tool apps are heavy client components — ensure marketing H1/intro remain outside islands (P2-1).

---

## 11. URL architecture

| Topic | Finding |
| --- | --- |
| Readability | Strong slug IA (`/use-cases/pipeline-management/`) |
| Hierarchy | Clear type prefixes; CRM nested industry paths for combos |
| Duplicate families | Software tabs vs overview; `/pricing/{slug}` vs `/software/{slug}/pricing/` |
| IDs in public URLs | Avoided |
| Facets | Query on hubs (`?category=`) — canonicalized to hub |
| Deprecated | Feature aliases redirected; `/go/` legacy |
| Trailing slash | Consistent |

---

## 12. 404 / redirect audit

| Item | Behavior |
| --- | --- |
| `not-found` | Custom page, H1 “Page not found”, links to categories/finder — **no soft-200 empty shells observed** |
| Feature redirects | 301 call-functionality → calling; reporting → reporting-dashboards |
| Compare slug order | 308 to canonical pair order |
| `/go/` | 302 external + noindex |
| Redirect chains | Not observed beyond single hop samples |
| Sitemap 404s | Unlikely for current 275 (data-gated); ecosystem URLs not listed |
| Soft 404 | Design-system returns 200 noindex (OK for dev) |

---

## 13. Mobile SEO

| Check | Result |
| --- | --- |
| Same metadata | Yes (responsive CSS, not separate URLs) |
| Core content | Not removed; tables get mobile list alternatives |
| Nav | Hamburger `< lg`; links still in DOM when menu open |
| Images | `next/image` widely used on hubs/heroes |
| Risk | Fixed bottom tool bars on mobile — watch CLS/INP (perf) |

No evidence of mobile-only content removal for primary SEO text.

---

## 14. Performance baseline (architecture — not field CWV)

> Lab ≠ field. No Lighthouse CI run in this audit. Observations are architectural.

| Area | Observation | CWV risk |
| --- | --- | --- |
| LCP | Hero images / brand logos preloaded on some pages; guide/industry heroes via `next/image` | Medium on media-heavy hubs |
| INP | Heavy client tools (scorecard, planners, TCO, requirements builder) | High on tool pages |
| CLS | Video uses `aspect-video`; watch cookie banner + newsletter popup + mobile sticky bars | Medium |
| TTFB | Data-heavy RSC hub models (CRM) | Medium |
| JS | Consent provider + analytics sink + newsletter popup global | Medium |
| Fonts | `next/font` DM Sans | Low |
| Third parties | YouTube/Vimeo only after consent + click; analytics gated | Good |
| Hydration | Large client islands on tools | High for INP |

**Targets:** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 — **not measured** this run.

### Suggested local follow-up (next step, not done)

- Production build smoke + Lighthouse on representative routes listed in §17
- Bundle analysis for tool entrypoints

---

## 15. Image SEO / performance

| Topic | Finding |
| --- | --- |
| `next/image` | Used for heroes, guides, industries, features, resources, scorecards |
| Width/height / aspect | Generally reserved via aspect classes |
| Lazy / priority | Priority on LCP candidates in places; video thumbs lazy |
| Alt text | Guide heroes require alt in template rules; decorative video thumbs often `alt=""` |
| OG images | **Missing** |
| Vendor logos | `/brands/*.png` preloaded on some pages — watch weight |

---

## 16. Video SEO / performance

| Check | Result |
| --- | --- |
| Mass iframes | **No** — thumbnail first |
| Lazy player | Yes (`OfficialProductVideo`) |
| Consent gate | Marketing cookies required |
| VideoObject | Only with required fields |
| CLS | aspect-video wrapper |
| Fake metadata | Helper rejects incomplete objects |

---

## 17. Page performance by type (qualitative)

| Route type | Render weight | SEO-critical SSR | Main risks |
| --- | --- | --- | --- |
| Homepage | Medium | Good | Many cards/images |
| CRM category | **Heavy** | Good | Large hub model, many links |
| Best CRM | Heavy | noindex | OK until publish |
| Product review | Medium–heavy | Good + VideoObject | Tab duplication |
| Comparison | Heavy HTML | Good | Large tables |
| Industry / use case / capability / feature / requirement | — | **500 locally** | Fix render |
| Guide | Medium | Good | Image weight |
| Finder | Medium + client | Landing SSR | INP after interact |
| Cost / TCO / Scorecard / Planners | **Heavy client** | Mixed H1 | INP/CLS sticky UI |
| Resources | Medium | Good | — |

---

## Quick wins

1. Add guides + resources + for + tools + company/legal + ecosystem hubs/pages to sitemap (respect gates).
2. Stop double-branding titles (template vs string).
3. Change soft-publish robots to `noindex, follow`.
4. `noindex` software tabs or unique + canonicalize to overview.
5. Add default OG image.
6. Fix `audit:site` date parsing.
7. Server-render H1 on TCO / implementation planner.
8. Point CRM explore “Guides” CTA at an **indexable** guide until soft set is released.
9. Remove root-layout homepage canonical inheritance.
10. Smoke-test ecosystem detail routes on production build.

---

## Architectural fixes

1. **Single indexability → sitemap → robots pipeline**  
   One function decides indexability; metadata + sitemap both consume it (guides already have `isEntityIndexable`; features should too).

2. **Server/client boundary lint for `node:fs`**  
   Prevent Turbopack/client chunk failures on content routes.

3. **Tab URL policy**  
   Decide: UX tabs with noindex, or true indexable section pages with unique metadata.

4. **CRM IA in global nav**  
   Surface capabilities / requirements / features / use cases beyond footer/hub.

5. **Publish gates for Best + Alternatives**  
   Either finish editorial approval or demote CTAs.

6. **Performance budgets for tools**  
   Split landing (RSC) vs app (lazy client) consistently.

---

## Recommended implementation sequence

1. **Stabilize render** — P0-2/P0-3 (ecosystem 500s) + production smoke  
2. **Crawl unlock** — P0-1 sitemap expansion + P1-5 tools  
3. **Index hygiene** — P1-2 follow policy, P1-3 software tabs, P1-7 features gate  
4. **SERP/snippet** — P1-1 titles, P1-4 OG images, P2 hub copy  
5. **Internal links** — P1-6 CTA targets, P2-7/P2-8 nav/footer  
6. **Tool SSR polish** — P2-1 H1s  
7. **Tooling** — P0-4 audit CLI  
8. **Measure** — Lighthouse/CWV on §17 set; then sitemap split (P3-1) if needed  

---

## Severity issue ledger (compact)

| ID | Sev | Issue | Effort | Risk |
| --- | --- | --- | --- | --- |
| P0-1 | P0 | Sitemap under-inclusion | M | Low |
| P0-2 | P0 | Ecosystem detail HTTP 500 (Turbopack/fs) | M–L | High |
| P0-3 | P0 | Indexable flags on failing routes | S+ | Med |
| P0-4 | P0 | audit:site crash | S | Low |
| P1-1 | P1 | Double brand titles | S–M | Low |
| P1-2 | P1 | noindex⇒nofollow | S | Low–Med |
| P1-3 | P1 | Software tab duplicates | S–M | Med |
| P1-4 | P1 | No OG images | M | Low |
| P1-5 | P1 | Tools missing from sitemap | S | Low |
| P1-6 | P1 | Hub CTAs to noindex | S | Low |
| P1-7 | P1 | Features hardcoded indexable | S | Med |
| P1-8 | P1 | Inherited `/` canonical | S | Low–Med |
| P1-9 | P1 | Guides hub noindex + no sitemap | S | Low |
| P2-* | P2 | See Medium Priority table | S–M | Low–Med |
| P3-* | P3 | Refinements | S | Low |

---

## Method notes / limitations

- HTML sampling against local `next dev` (Turbopack). Some 500s may be dev-bundler specific — **must re-verify on `next build` + `next start`** before treating as production outage.
- External link liveness and field CWV not measured.
- Editorial `audit:site` could not complete.
- Full link graph of all 800+ URLs not exhaustively crawled; CRM hub model + nav/footer + samples used.
- No code was modified for this baseline.

---

## Appendix A — Inventory counts (2026-08-15)

| Entity | Total | Indexable (gate/flag) | In sitemap |
| --- | --- | --- | --- |
| Categories | 10 | 10 | 10 (+ hub) |
| Software | 27 | 27 | 27 (+ hub) |
| Software tabs | 243 | ~243 if product indexable | 0 |
| Comparisons | 231 | 231 | 231 |
| Guides | 171 | 143 | 0 |
| Use cases | 17 | 17 flagged | 0 |
| Capabilities | 16 | 16 flagged | 0 |
| Resources | 16 | 16 flagged | 0 |
| Audiences (`/for`) | 8 | 8 flagged | 0 |
| Industries | 13 | 0 | 0 |
| Features | 24 | 24 hardcoded | 0 |
| Requirements | 14 | 10 pillars | 0 |
| Best | 1 | 0 | 0 |
| Alternatives (public) | 1 | 0 | 0 |
| Tools available | 7 | 7 | 2 (+ tools hub) |
| Sitemap total | — | — | **275** |

## Appendix B — Sample live fetches (local)

| Path | HTTP | Robots | Notes |
| --- | --- | --- | --- |
| `/` | 200 | index,follow | Organization+WebSite |
| `/categories/crm/` | 200 | index,follow | FAQ+Breadcrumb; 222 links |
| `/best/crm-software/` | 200 | noindex,nofollow | Strong page, gated |
| `/software/pipedrive/` | 200 | index,follow | VideoObject; sponsored links |
| `/software/pipedrive/features/` | 200 | index,follow | Duplicate meta |
| `/compare/close-vs-pipedrive/` | 200 | index,follow | OK |
| `/guides/crm-implementation/` | 200 | index,follow | Double title brand |
| `/guides/what-is-crm/` | 200 | noindex,nofollow | Soft publish |
| `/resources/crm-evaluation-checklist/` | 200 | index,follow | Not in sitemap |
| `/use-cases/pipeline-management/` | **500** | — | Turbopack fs |
| `/robots.txt` | 200 | — | Disallow /go/, preview |
| `/go/pipedrive/` | 302 | X-Robots noindex | External affiliate |

---

*End of technical SEO baseline.*
