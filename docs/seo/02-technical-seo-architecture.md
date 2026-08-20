# Technical SEO Architecture — SoftwareGlimpse

**Document:** `/docs/seo/02-technical-seo-architecture.md`  
**Date:** 2026-08-15  
**Baseline:** [`01-technical-seo-baseline.md`](./01-technical-seo-baseline.md)  
**Current status / sustain:** [`03-technical-seo-current-status.md`](./03-technical-seo-current-status.md)  
**Code root:** `src/seo/`

> **Live scorecard:** Technical SEO Health **100/100**, Overall **83/100**, SEO-HEALTH **0** open findings (FULL, 2026-08-15). Historical “65” in score history is **not** current.

---

## Purpose

Centralize technical SEO so metadata, robots, canonicals, sitemap eligibility, breadcrumbs, and JSON-LD share one policy. Page routes should call helpers — not invent titles, robots, or canonicals ad hoc.

---

## Module map

| Module | Role |
| --- | --- |
| `src/seo/canonical.ts` | Path normalization, aliases, absolute canonical URLs, brand-suffix strip, default OG image |
| `src/seo/indexability.ts` | `IndexabilityDecision` + page-type gates (entity, seo flag, product tab, feature, requirement, pricing, utility) |
| `src/seo/metadata.ts` | `buildPageMetadata` / `buildPageMetadataFromDecision` / `SeoPageDefinition` → Next.js `Metadata` |
| `src/seo/sitemap.ts` | `getSitemapEntries()` — published ∩ indexable ∩ canonical only |
| `src/seo/breadcrumbs.ts` | Shared breadcrumb model (UI + JSON-LD use the same paths) |
| `src/seo/structured-data.tsx` | Conservative schema builders + `JsonLdScript` |
| `src/seo/index.ts` | Public barrel |
| `src/lib/urls.ts` | Deprecated re-export of canonical helpers |
| `src/app/sitemap.ts` | Next MetadataRoute adapter |
| `src/app/robots.ts` | Crawler allow/disallow + sitemap host (no noindex rules) |
| `public/og/default.png` | Static share image fallback |

Conceptual `SEOPageDefinition`:

```ts
{
  canonicalPath: string;
  title: string;
  description: string;
  indexability: IndexabilityDecision; // indexable + nofollow + reason
  pageType: SeoPageType;
  breadcrumbs?: BreadcrumbItem[];
  ogType?: "website" | "article";
  ogImage?: string | null;
}
```

Use `metadataFromSeoDefinition` or `buildPageMetadataFromDecision` at the route boundary.

---

## Canonical rules

1. **Host:** `getSiteUrl()` (default `https://www.softwareglimpse.com`).
2. **Path:** leading `/`, **trailing slash required**, lowercase, collapse duplicate slashes.
3. **Query/hash:** stripped from canonicals (facet/tool `?from=` params do not create alternate documents).
4. **Aliases:** rewritten in `PATH_ALIASES` (e.g. `/features/call-functionality/` → `/features/calling/`). HTTP **301** redirects remain in `next.config.ts` for backward compatibility.
5. **Consumers:** metadata `alternates.canonical`, sitemap URLs, breadcrumb/`item` JSON-LD, and internal helpers should call `canonicalUrl` / `normalizePath`.

**Do not** set a sitewide canonical on the root layout — children that omit `alternates` must not inherit `/`.

---

## Robots rules

### `robots.txt`

- Allow `/`
- Disallow `/go/` (affiliate hops) and `/api/preview`
- Advertise sitemap + host
- **Never** put `noindex` (or equivalent) into `robots.txt`

### Page-level robots (via `buildPageMetadata`)

| Intent | `index` | `follow` |
| --- | --- | --- |
| Published researched content | true | true |
| Soft-publish / gated editorial | false | **true** (default) |
| Private utility (search, preview, `/dev/`) | false | false when `nofollow: true` |
| Product hub section tabs | false | true |
| Affiliate `/go/` | header `X-Robots-Tag` + disallow | — |

Soft-published pages stay crawlable so links and future index flips are discoverable. Explicit `nofollow` is reserved for search/preview/dev-style surfaces.

---

## Indexability engine

Prefer `src/seo/indexability.ts` over scattering robots flags:

| Helper | When |
| --- | --- |
| `indexabilityForEntity` | Domain quality gates (software, guide, comparison, …) |
| `indexabilityFromSeoFlag` | Taxonomy soft flag + publication window |
| `indexabilityForProductTab` | Always noindex (UX sections) |
| `indexabilityForFeaturePage` | Substantive overview + tagline |
| `indexabilityForRequirementPage` | Pillar + overview + hero |
| `indexabilityForPricingPage` | Available + non-fixture research |
| `indexabilityForUtility` | search / preview / personalized / private / dev |

Sitemap and `generateMetadata` should apply the **same** decision where practical.

---

## Sitemap rules

`getSitemapEntries()` includes a URL only when:

1. Entity/page is **publishable** (existing public getters / registry status), **and**
2. **Indexable** under the helpers above, **and**
3. A **canonical path** exists.

**Excluded:** drafts, soft noindex, redirects (`/go/`), search, preview, `/dev/`, software tabs, industries (until `seo.indexable`), nested industry combo pages, fixture pricing, stack-builder / generic software-finder landings.

`lastModified` is set only when content metadata provides a known date. Static hubs may omit it.

**Current scale:** ~**527** URLs (was ~275 at baseline).

---

## Metadata rules

1. Pass **bare titles** (no `| SoftwareGlimpse`) — root layout `title.template` owns branding; `stripSiteNameSuffix` defends against double brand.
2. Every public route should set its own canonical via `buildPageMetadata*`.
3. Descriptions must be real entity/copy strings — no placeholder SERP text.
4. OG/Twitter: title, description, url, and **images** (default `/og/default.png` unless overridden). No runtime OG image generation.
5. Page types map to `SeoPageType` for future analytics/reporting; generators stay thin wrappers around the shared builder.

---

## Breadcrumbs

- UI (`Breadcrumbs`) and `breadcrumbJsonLd` use the same `BreadcrumbItem[]` `{ name, path }`.
- Absolute `item` URLs come from `buildBreadcrumbs` → `canonicalUrl`.
- Hierarchical content (features, requirements, industries, tools, …) should emit both visible crumbs and JSON-LD.

---

## Structured data

| Type | Policy |
| --- | --- |
| Organization / WebSite | Sitewide where appropriate |
| BreadcrumbList | Shared model |
| WebPage | Tools / hubs with real titles |
| SoftwareApplication | Factual fields only — **no** fabricated `aggregateRating` / `offers` |
| FAQPage | Only Q&A already on the page |
| VideoObject | Requires name + contentUrl + **thumbnailUrl**; otherwise omit |
| Product / Review / Offer | Avoid unless eligibility is proven |

Conservative by default: missing eligibility ⇒ no schema, not invented fields.

---

## Publication / 404

- Missing / invalid slugs → `notFound()` (true **404**), not a 200 “unavailable” shell.
- Soft-published content may render **200** with **noindex,follow** so crawlers can see the directive.
- Unpublished industries remain intentional noindex until research completes.

---

## URL normalization & redirects

| Concern | Policy |
| --- | --- |
| Trailing slash | Enforced (`trailingSlash: true`) |
| Case | Lowercase in canonical helper |
| Feature aliases | 301 in `next.config.ts` + alias map in canonical resolver |
| Compare slug order | Existing 308 to canonical order (keep) |
| Internal CTAs | Prefer final indexable destinations (e.g. CRM hub drops Best CTA while gated) |

Do not mass-rewrite public URLs without 301s.

---

## Server rendering

SEO-critical content should be in initial HTML:

- Metadata / JSON-LD from server components
- Visible breadcrumbs
- At least one real `<h1>` outside client-only Suspense islands for tool landings (TCO, implementation planner)

Interactive calculators may hydrate below the SSR heading.

---

## Testing

| Suite | Coverage |
| --- | --- |
| `src/seo/technical-seo.test.ts` | Canonical/aliases, title strip, robots follow defaults, product-tab noindex, feature/requirement gates, sitemap inclusion/exclusion, breadcrumb↔JSON-LD alignment, conservative schema |
| `src/services/category-hub/category-hub.test.ts` | Explore CTAs do not promote gated `/best/` when Finder exists |

Run: `npx vitest run src/seo/technical-seo.test.ts`

---

## Baseline findings — remediation status

| ID | Status | Notes |
| --- | --- | --- |
| **P0-1** Sitemap under-inclusion | **FIXED** | ~527 URLs; guides, ecosystem, tools, company/legal included when indexable |
| **P0-2** Ecosystem detail HTTP 500 (Turbopack `node:fs`) | **FIXED** (client boundary) | Client components import types-only / scorecard-keys; avoid research-store barrels. **Re-verify** on `next build` + `next start` |
| **P0-3** Indexable meta on failing routes | **FIXED** (depends on P0-2) | Render path unblocked; features/requirements use substantive gates |
| **P0-4** `audit:site` `daysBetween` crash | **FIXED** | `daysBetween` accepts `Date \| string \| number` |
| **P1-1** Double brand titles | **FIXED** | Strip suffix in metadata + bare tool titles; root template owns brand |
| **P1-2** noindex⇒nofollow | **FIXED** | Default `follow: true` unless `nofollow` |
| **P1-3** Software tab duplicates | **FIXED** | Tabs `noindex,follow` + tab-specific titles |
| **P1-4** No OG images | **FIXED** | Default static `/og/default.png` |
| **P1-5** Tools missing from sitemap | **FIXED** | Available registry tools (excl. noindex landings) |
| **P1-6** Hub CTAs to noindex | **FIXED** | `sanitizeExplorePaths` drops/rewrites Best + prefers indexable guide |
| **P1-7** Features hardcoded indexable | **FIXED** | `indexabilityForFeaturePage` |
| **P1-8** Inherited `/` canonical | **FIXED** | Root layout: `metadataBase` + title template only |
| **P1-9** Guides hub noindex | **FIXED** | Hub `indexable: true` + guides in sitemap |
| **P2-1** Tool SSR H1 | **FIXED** | TCO + implementation planner SSR `<h1>` |
| **P2-2** Industries noindex | **DEFERRED** | Intentional until vertical research |
| **P2-3** Nested industry combos noindex | **FIXED** (policy OK) | Not in sitemap |
| **P2-4** Compare filter canonical | **INVALID** as defect | Intentional self-canonical on hub |
| **P2-5** Generic catalogue hub copy | **REMAINING** | Editorial |
| **P2-6** Homepage description = tagline | **REMAINING** | Editorial |
| **P2-7** Footer ecosystem links | **REMAINING** | IA / nav |
| **P2-8** Header CRM megamenu | **DEFERRED** | Larger nav project |
| **P2-9** Pricing fixture noindex | **INVALID** as defect | Expected until verified pricing |
| **P2-10** Static sitemap lastModified | **REMAINING** | Optional polish |
| **P3-*** | **DEFERRED / REMAINING** | Split sitemap, CWV, etc. |

---

## Remaining risks

1. **Production parity for former 500s** — local Turbopack failures were fixed at import boundaries; confirm production build output for use-case / capability / feature / requirement / industry detail routes.
2. **Crawl budget** — sitemap roughly doubled; monitor Search Console coverage after deploy.
3. **Best CRM / alternatives** still noindex while some secondary surfaces may still mention them — hub primary CTAs sanitized; long-tail links remain until editorial publish.
4. **Per-type OG images** still fall back to the generic asset (acceptable; no runtime generation).
5. **Field CWV / external link liveness** not measured in this pass — primary sustain risk for keeping Technical SEO Health ≥ 80 once field data is wired.
6. **Software tabs** remain publicly reachable (UX) but noindex — ensure internal “primary” links prefer overview URLs.
7. **Wider live probe sampling** — FULL audit probe sets are bounded; expand sampling periodically so “0 findings” is not under-sampled confidence.

---

## Operator checklist

1. Prefer `@/seo/*` helpers for new routes.
2. Never add noindex patterns to `robots.txt`.
3. After flipping `seo.indexable` / quality gates, sitemap picks up URLs automatically on next build.
4. Re-run `npx vitest run src/seo/technical-seo.test.ts` after SEO policy changes.
5. Re-run `npm run audit:site` after research freshness changes (P0-4 fix).

---

*End of technical SEO architecture.*
