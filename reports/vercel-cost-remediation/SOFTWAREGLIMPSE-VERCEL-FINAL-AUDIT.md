# SoftwareGlimpse Vercel final audit

Audit date: 2026-09-23. Repository state: current working tree. Next.js **16.3.0**. No application code was changed. Nothing was pushed or deployed.

A local `npm run build` completed successfully (exit 0). The prebuild step rewrote `src/data/generated/search-index.json`; that file was restored to its pre-build contents afterward.

Production checks against `https://www.softwareglimpse.com` were read-only header probes on the same day. They match the rendering behavior of the current source. The live deployment itself is older than this working tree (cache `age` about 12 days on prerendered HTML).

The existing detector `npm run audit:vercel-cost` still reports `draftMode()` as a public dynamic-rendering failure. That rule does not match Next.js 16.3 or production. See section 4.

---

## 1. Executive summary

Public software, guide, comparison, and category **documents are statically prerendered**. They are not Fluid-rendered on each crawl. Production responses carry `x-nextjs-prerender: 1`, `x-vercel-cache: HIT`, and `cache-control: public, max-age=0, must-revalidate`.

The current cost shape is:

1. **Build CPU.** Every production deploy prerenders **13,662** pages. The largest family is `/compare/[slug]` at **7,888** URLs, including a reverse slug for almost every comparison. Software overview plus nine tab routes add **3,150** URLs. Guides add **1,460**.
2. **Fluid CPU on hubs, not on product pages.** `/search`, `/guides`, `/compare`, `/tools`, and `/company/contact` await `searchParams`. They render on every request with `private, no-cache, no-store` and `x-vercel-cache: MISS`. Arbitrary search queries do **not** create ISR entries.
3. **Origin transfer for media.** Guide and software images are same-origin paths rewritten to Vercel Blob. A measured guide PNG is **1.67 MB**. `next/image` is `unoptimized` on guide figures, so the full PNG transits Vercel. Unknown paths under `/software/` and `/guides/` that were not prerendered are proxied to Blob and 404 there.
4. **`draftMode()` is present on public software and guide pages and does not currently dynamize them.** Next 16 returns an empty draft mode during prerender. Production HTML for those routes is prerendered. Preview still works by bypass cookie on top of that static page.

There is no image middleware on English traffic, no wildcard `remotePatterns` host, and Speed Insights is not installed. Ignored-build protection exists.

---

## 2. Current route architecture

Rendering labels used below:

| Label | Meaning in this repo |
| --- | --- |
| STATIC | No `generateStaticParams`. Prerendered at build. Build symbol `○`. |
| SSG | `generateStaticParams` prerenders the known set. Build symbol `●`. No `revalidate` export, so the page is immutable until the next deploy. |
| ISR | Time-based revalidation. Only sitemap routes (`revalidate = 86400`). |
| ON-DEMAND ISR | Not used. `dynamicParams` is left at the default `true`, but Blob `afterFiles` rewrites intercept unknown URLs under media folders before the dynamic route runs. |
| DYNAMIC | Request-time render. Build symbol `ƒ`. |
| INTENTIONAL DYNAMIC | Dynamic because the response depends on a secret, a token, or an affiliate redirect. |

There is no `/collections` route and no `/admin` route. Category pages are the collection surface. Internal tools live under `/dev`.

### Homepage and catalogue hubs

| Route | Purpose | Indexable? | Render | Revalidate | `generateStaticParams` | `searchParams` | `cookies` / `headers` / `draftMode` / `connection` / `noStore` / `force-dynamic` | Server actions | Major data | Regional / personal | Traffic / crawl |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Homepage | Yes | STATIC | none | — | No | No | No | Catalogue slices, best pages, guides | No | High. Prerendered. Production HIT. |
| `/software` | Software index | Yes | STATIC | none | — | No | No | No | `getSoftware()` | No | High. Prerendered. |
| `/software/[slug]` | Product overview | Entity gate | SSG | none | **315** | No | **`draftMode()` read only** | No | `buildSoftwareReviewModel` | No | High crawl. Prerendered in production. |
| `/software/[slug]/[tab]` | Product sections | **No** (`product-tab-section`, follow) | SSG | none | **2,835** | No | **`draftMode()` read only** | No | Same full review model | No | Linked from the hub. Noindex. Still fully built. |
| `/guides` | Guide hub | Yes | **DYNAMIC** | export `3600` is overridden | — | **Yes** (`category`, `q`, `topic`) | No | No | `buildGuidesHubModel` | No | High. Production `no-store`, MISS. |
| `/guides/[slug]` | Guide article | Entity gate | SSG | none | **1,460** | No | **`draftMode()` read only** | No | Guide seed + enrichment overlay | No | High. Production prerender HIT. Sitemap lists 593. |
| `/compare` | Comparison hub | Yes | **DYNAMIC** | none | — | **Yes** (`category`) | No | No | `buildCompareHubModel` | No | High. Production `no-store`, MISS. |
| `/compare/[slug]` | Comparison document | Entity gate | SSG | none | **7,888** | Typed, **not read** | No | No | `buildComparisonPageModel` | No | Largest build family. Production HIT. |
| `/compare/build` | Pair builder | No | **DYNAMIC** | none | — | **Yes** (`a`, `b`) | No | No | Software lookup + redirect | No | `robots` disallow. |
| `/alternatives` | Alternatives index | Yes | STATIC | none | — | No | No | No | Alternatives catalogue | No | Medium |
| `/alternatives/[slug]` | Alternatives article | Entity gate | SSG | none | **309** | No | No | No | Alternatives page + source software | No | Sitemap 310 |
| `/categories` | Category index | Yes | STATIC | none | — | No | No | No | Categories | No | Medium |
| `/categories/[...slug]` | Category hub | Entity gate | SSG | none | **24** | No | No | No | Category hub model | No | Sitemap 22 |
| `/best`, `/best/[slug]` | Best-of lists | Mixed | STATIC / SSG | none | **33** | No | No | No | Best-page model | No | Sitemap 12 |
| `/pricing`, `/pricing/[slug]` | Pricing explainers | Mixed | STATIC / SSG | none | **37** | No | No | No | CRM pricing snapshots | No | Finite |
| `/search` | Site search | No | **DYNAMIC** | export `3600` is overridden to 0 | — | **Yes** (`q`, `type`) | No | No | Prebuilt search index (6,410 docs) | Query text only | `robots` disallow. Still fully dynamic. |

### Taxonomy, tools, company, legal

| Route | Purpose | Indexable? | Render | `generateStaticParams` | Dynamic APIs | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `/use-cases`, `/use-cases/[slug]` | Use-case hubs | Mixed | STATIC / SSG **120** | No | Linked from product model |
| `/capabilities`, `/capabilities/[slug]` | Capability hubs | Mixed | STATIC / SSG **70** | No | |
| `/features`, `/features/[slug]` | Feature pages | Mixed | STATIC / SSG **24** | No | Thin pages noindex |
| `/requirements`, `/requirements/[slug]` | Requirement pages | Mixed | STATIC / SSG **14** | No | |
| `/resources`, `/resources/[slug]` | Downloadable resources | Mixed | STATIC / SSG **17** | No | |
| `/industries`, `/industries/[slug]` | Industry hubs | Mixed | STATIC / SSG **25** | No | |
| `/industries/[slug]/capabilities/[capability]` | Industry × capability | **No** | SSG **150** | No | Hardcoded `indexable: false` |
| `/industries/[slug]/use-cases/[useCase]` | Industry × use case | **No** | SSG **126** | No | Hardcoded `indexable: false` |
| `/industries/[slug]/features/[feature]` | Industry × feature | **No** | SSG **2** | No | Noindex |
| `/industries/[slug]/requirements/[requirement]` | Industry × requirement | **No** | SSG **2** | No | Noindex |
| `/for`, `/for/[slug]` | Audience pages | Mixed | STATIC / SSG **8** | No | |
| `/tools` | Tools hub | Yes | **DYNAMIC** | — | **`searchParams.category` in page and metadata** | Production `no-store` |
| `/tools/[toolSlug]` | Category tools | Yes when pillar exists | SSG **96** | No | Calculators are client islands on a static shell |
| `/tools/crm-*`, `/tools/sales-intelligence-*`, `/tools/software-*` | Named tools | Yes | STATIC (28 routes) | No | Same pattern |
| `/authors`, `/authors/[slug]` | Author | Yes | STATIC / SSG **1** | No | |
| `/company/contact` | Contact | Yes | **DYNAMIC** | — | **`searchParams.reason`** | Lower traffic than hubs |
| `/company/*`, `/legal/*`, `/about`, policy aliases | Company and legal | Yes | STATIC | — | No | Finite, keep |
| `/research`, `/research/crm-pricing`, `/research/crm-pricing-history` | Research | Yes | STATIC | — | No | |
| `/newsletter/confirm` | Confirm token | No | **INTENTIONAL DYNAMIC** | — | `searchParams.token` | `robots` disallow |
| `/newsletter/thanks`, `/newsletter/preferences` | Newsletter UX | No | STATIC | — | No | |
| `/privacy-request` | Privacy form | Yes | STATIC | — | No | |

### Affiliate, API, preview, dev

| Route | Purpose | Render | Why |
| --- | --- | --- | --- |
| `/go/[product]/[[...destination]]` | Legacy affiliate redirect | **INTENTIONAL DYNAMIC** `force-dynamic`, `revalidate = 0` | `robots` disallow. New CTAs use the external affiliate URL directly. Production probe: `302`, `cache-control: no-store`. |
| `/api/preview`, `/api/preview/disable` | Draft cookie on/off, then redirect | DYNAMIC | Only place that calls `draft.enable()` / `draft.disable()`. |
| `/api/search/suggest` | Autocomplete | DYNAMIC route handler | `Cache-Control: s-maxage=3600` set on the response. Does not create page ISR entries. |
| `/api/contact`, `/api/newsletter/subscribe` | Form posts | DYNAMIC | Request body. |
| `/api/analytics/affiliate-click` | Click beacon | **INTENTIONAL DYNAMIC** `force-dynamic`, `revalidate = 0` | |
| `/api/dev/product-testing` | Internal | DYNAMIC | Not public. |
| `/dev/growth` | Internal dashboard | **INTENTIONAL DYNAMIC** `force-dynamic` | Secret query. |
| `/dev/product-testing` | Internal workspace | DYNAMIC via `searchParams` | Secret query. `notFound()` otherwise. |
| `/dev/design-system` | Internal | STATIC | |
| `/research/crm-pricing/download`, `/research/crm-pricing/charts/[chart]` | Research file responses | DYNAMIC route handlers | Read the request URL. Not HTML catalogue pages. |
| `/sitemap.xml`, `/sitemaps/[id]`, `/llms.txt` | Discovery files | ISR **1 day** | Build showed `1d` / `1y`. 15 child sitemaps. |
| `/robots.txt` | Crawl rules | STATIC | Disallows `/go/`, `/api/`, `/search/`, `/dev/`, `/compare/build/`, `/newsletter/`. |

No route in `src/app` exports `"use server"`. No public route calls `cookies()`, `headers()`, `connection()`, `unstable_noStore()`, or `cache: "no-store"`.

---

## 3. Dynamic API sweep

| API | Public request path? | Where | Effect on Next 16.3 |
| --- | --- | --- | --- |
| `draftMode()` | Yes, read of `isEnabled` | `/software/[slug]`, `/software/[slug]/[tab]`, `/guides/[slug]` | During prerender the work unit is `prerender-legacy`. `draft-mode.js` returns an empty provider and does **not** call `trackDynamicDraftMode`. `enable()` / `disable()` are what mark the route dynamic. Those run only in `/api/preview`. |
| `draftMode().enable/disable` | No | `/api/preview`, `/api/preview/disable` | Sets or clears `__prerender_bypass`. |
| `cookies()` from `next/headers` | No direct calls | — | |
| `headers()` from `next/headers` | No | `/go` uses `request.headers.get("referer")` on an already dynamic handler | |
| `connection()` | No | | |
| `unstable_noStore` / `noStore` | No | | |
| `cache: "no-store"` | No public page | | |
| `force-dynamic` | `/go/...` only among public routes | Also `/dev/growth`, `/api/analytics/affiliate-click` | |
| `revalidate = 0` | `/go`, affiliate-click API | | |
| `searchParams` awaited | **Yes** | `/search`, `/guides`, `/compare`, `/tools` (page and metadata), `/company/contact`, `/compare/build`, `/newsletter/confirm` | Legacy prerender throws and sets `revalidate = 0`. Cache-Control becomes `private, no-cache, no-store`. |
| `searchParams` typed but not read | `/compare/[slug]` | Props include `tab`, the function only reads `params` | Stays SSG. Production HIT confirms this. |

`npm run audit:vercel-cost` result on this tree: **FAIL 3** (the three `draftMode()` pages), **WARN 2** (ignore-command filename check, image variant budget). It did not flag `searchParams` hubs. That is the higher current Fluid cost.

---

## 4. draftMode trace

### Call chain

```
GET /api/preview?secret=&slug=/software/pipedrive/
  → draftMode().enable() sets __prerender_bypass
  → redirect(slug) onto the public URL

GET /software/[slug]          (and /software/[slug]/[tab], /guides/[slug])
  → generateMetadata awaits draftMode().isEnabled
  → page awaits draftMode().isEnabled again
  → previewEnabled is passed into the view
  → guides also pass includeUnpublished: previewEnabled into resolveGuide
```

`src/services/publishing/preview.ts` only decides eligibility. It does not call `draftMode()`. The root layout banner (`DevPreviewBanner`) is compile-time dead in production (`NODE_ENV === "production"` returns null). It does not read the draft cookie.

Layouts for `(site)`, `/software`, and `/guides/[slug]` are static shells. They do not call draft APIs.

### Does it dynamize public pages?

**No, not on Next 16.3, and not in production.**

Evidence:

- Next 16 source: prerender cases return a null draft provider. Reading `isEnabled` is false and does not set `revalidate = 0`. Only `enable()` / `disable()` track dynamic usage.
- Local build symbols: `/software/[slug]` **● 315**, `/software/[slug]/[tab]` **● 2,835**, `/guides/[slug]` **● 1,460**.
- Production, 2026-09-23:
  - `/software/pipedrive/` — `x-nextjs-prerender: 1`, `x-vercel-cache: HIT`, `age` ~12 days, `x-matched-path: /software/pipedrive`
  - `/software/pipedrive/pricing/` — same, prerender HIT
  - `/guides/what-is-crm/` — same, prerender HIT

When the bypass cookie is present, that one request skips the static cache and re-renders. Public crawlers do not send the cookie. Fluid CPU from `draftMode()` on the public estate is **not** the current burn.

### Can preview be isolated?

Yes, and it should be, so a later Next change or an accidental `enable()` on the page cannot dynamize 4,900 content URLs.

Recommended shape, not implemented:

- Public pages always render the published record. They do not import `draftMode`.
- `/api/preview` remains the secret check, but redirects to a dedicated dynamic tree such as `/preview/software/[slug]` and `/preview/guides/[slug]`, or one `/preview/[...path]` segment with `robots` noindex and a matcher that is not linked from the sitemap.
- That tree is `force-dynamic` (or reads `draftMode`) and is the only place `includeUnpublished` is true.
- Exit stays on `/api/preview/disable`.

Do not keep the draft read on the public page “just in case”. The static output is already the public document. The cookie bypass is the only reason the public module imports `draftMode` today.

---

## 5. Software product graph

Representative route: `/software/[slug]`, traced for Pipedrive.

```
generateStaticParams
  → getSoftware()                         315 published products

generateMetadata
  → getSoftwareBySlug(slug)
  → draftMode().isEnabled                 false during prerender
  → buildSoftwareReviewModel(software)    full graph
  → buildPageMetadata

Page
  → getSoftwareBySlug(slug)
  → draftMode().isEnabled
  → buildSoftwareReviewModel(software)    full graph again
  → resolveAffiliateLink
  → buildSoftwareLinkPlan                 second graph walk
  → SoftwareProductHub (all tabs' data is on the model; initialTab selects the view)
```

`buildSoftwareReviewModel` is a plain function. It is not wrapped in React `cache()`. `generateMetadata` and the page each call it. Next does not dedupe those two synchronous calls.

Warm timings after the catalogue is already in memory (local, one process):

| Slug | One model build |
| --- | --- |
| pipedrive | 39 ms |
| hubspot | 105 ms |
| salesforce | 96 ms |
| close | 61 ms |
| zoho-crm | 66 ms |
| freshsales | 64 ms |
| salesflare | 51 ms |
| folk | 54 ms |
| **average of these** | **67 ms** |

Per software URL the build does at least two model builds (metadata + page). Across 3,150 software URLs that is about **6,300** model builds, on the order of **7 minutes of CPU** before React render, JSON-LD, and link planning. Seven workers hide some of that in wall clock. It is still a large share of deploy CPU, and it is repeated for every tab even though the tab page only displays one slice.

What one model build loads:

| Concern | Work inside `buildSoftwareReviewModel` |
| --- | --- |
| Software record | `getSoftwareBySlug` / `getAllSoftwareUnfiltered` |
| Review and scores | `loadReview`, `loadAssessment`, methodology |
| Research | `loadEnrichment`, `loadManualSources`, SEO overlay |
| Pricing | Embedded pricing, `listCrmPricingSnapshots()`, price history summary |
| Categories | `getCategories({ includeUnpublished: true })` |
| Features | `enrichment.featureSupport` joined to the canonical feature seed |
| Use cases | `getUseCases()` filtered to the product |
| Alternatives / competitors | `resolveCompetitorSlugs`, `resolveAlternativeSlugs`, up to 6 cards, compare hrefs |
| Comparisons | `getSoftwareLinkGroups` → comparison links |
| Guides | `getGuidesByProduct` plus link-plan guides, capped at 12 |
| Integrations | `enrichment.integrationSupport`, logos from the software list or `/brands/*` |
| Media | `selectProductVideos`, implementation videos, screenshots on the model |
| Evidence | `buildEvidenceCenterModel` |
| Affiliate | Separate `resolveAffiliateLink` on the page, not inside the model |
| Deep review | `buildDeepReviewLayer` |

The tab route repeats this entire function. It does not build a tab-sized model.

`/compare/[slug]` has the same metadata/page split: `loadComparisonWithEnrichment` and `buildComparisonPageModel` run in both. Reverse slugs `permanentRedirect` before that work, so they are cheaper per page but still occupy a static-generation slot.

---

## 6. Software tab estate

Tabs in `SOFTWARE_HUB_TABS`:

| Tab | URL | Indexable? | Unique canonical? | Unique metadata? | Unique body? | Same full model? | Render | In `generateStaticParams`? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Overview | `/software/{slug}/` | Entity gate | Yes, self | Yes | Yes | Yes | SSG | Yes (315) |
| Features | `/software/{slug}/features/` | No, follow | Path is the tab URL | Title suffix only | Tab view of the same model | Yes | SSG | Yes |
| Pricing | `.../pricing/` | No, follow | Tab URL | Title suffix | Same | Yes | SSG | Yes |
| Guides | `.../guides/` | No, follow | Tab URL | Title suffix | Same | Yes | SSG | Yes |
| Use cases | `.../use-cases/` | No, follow | Tab URL | Title suffix | Same | Yes | SSG | Yes |
| Comparisons | `.../comparisons/` | No, follow | Tab URL | Title suffix | Same | Yes | SSG | Yes |
| Alternatives | `.../alternatives/` | No, follow | Tab URL | Title suffix | Same | Yes | SSG | Yes |
| Reviews & evidence | `.../evidence/` | No, follow | Tab URL | Title suffix | Same | Yes | SSG | Yes |
| Methodology | `.../methodology/` | No, follow | Tab URL | Title suffix | Same | Yes | SSG | Yes |
| FAQ | `.../faq/` | No, follow | Tab URL | Title suffix | Same | Yes | SSG | Yes |

`indexabilityForProductTab` always returns noindex. Sitemap `software.xml` has **314** URLs, not 3,150. Tabs are omitted from the sitemap and still fully prerendered.

The tab strip is real `<Link>` URLs (`software-product-hub-tabs.tsx`), so crawlers that render the overview still discover the tab URLs.

```
315 products
× 9 tab routes
= 2,835 tab URLs

+ 315 overview URLs
= 3,150 software URLs
```

That is **23%** of the 13,662-page build. Almost all of the tab share is noindex UX. Building it on every deploy is not a sensible Vercel default. It is also not safe to delete from `generateStaticParams` until Blob rewrites move to `fallback` (section 10). Today a non-prerendered `/software/{slug}/pricing/` is served by Blob and 404s, which production confirmed for an unknown software path.

---

## 7. generateStaticParams inventory

Local build counter: **13,662** static pages. Wall time **14 min 53 s** (compile **2.5 min**, then 7 workers). No out-of-memory failure. Typecheck is skipped (`typescript.ignoreBuildErrors: true`).

| Route | Generated | Data work per page | Build impact | Change frequency | SEO | Traffic | Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/compare/[slug]` | **7,888** | Canonical: full comparison model twice. Reverse: `permanentRedirect` only. | **Largest family (58%)** | Content deploys | 2,138 in sitemap | High for canonical indexable pairs | Keep SSG for indexable canonicals. **Remove reverse slugs from SSG.** Non-indexable canonicals: finite, reconsider. |
| `/software/[slug]/[tab]` | **2,835** | Full review model twice, then one tab view | Very high | Content deploys | Noindex | User navigation, some crawl via links | Do not SSG once rewrites are `fallback`, or redirect tabs at `next.config` and render one overview. |
| `/guides/[slug]` | **1,460** | `resolveGuide` twice (seed, product guide, enrichment overlay) plus related guides | High | Editorial deploys | 593 in sitemap | High for indexable guides | Keep SSG for indexable guides. Stop prerendering guides that fail the index gate. |
| `/software/[slug]` | **315** | Full review model twice + link plan | High per page, small count | Content deploys | 314 in sitemap | High | **KEEP SSG** |
| `/alternatives/[slug]` | **309** | Alternatives model | Medium | Content deploys | ~310 in sitemap | Medium | **KEEP SSG** for indexable |
| `/industries/[slug]/capabilities/[capability]` | **150** | Industry capability model twice | Medium | Rare | Hardcoded noindex | Low | **REMOVE from SSG** or on-demand after measuring links |
| `/industries/[slug]/use-cases/[useCase]` | **126** | Industry use-case model | Medium | Rare | Hardcoded noindex | Low | **REMOVE from SSG** |
| `/use-cases/[slug]` | **120** | Use-case hub model twice | Medium | Occasional | 87 in sitemap | Medium | **KEEP SSG** for indexable |
| `/tools/[toolSlug]` | **96** | Tool kit built at request of static generation | Medium | Rare | In tools sitemap | Tool use | **SMALL FINITE — KEEP** |
| `/capabilities/[slug]` | **70** | Capability hub | Medium | Occasional | 70 in sitemap | Medium | **KEEP SSG** |
| `/pricing/[slug]` | **37** | Pricing snapshot | Low | Pricing updates | Subset | Medium | **SMALL FINITE — KEEP** |
| `/best/[slug]` | **33** | Best-page model | Low | Occasional | 12 in sitemap | Medium | Keep indexable; drop the rest from SSG |
| `/categories/[...slug]` | **24** | Category hub | Low | Rare | 22 in sitemap | High per URL | **KEEP SSG** |
| `/features/[slug]` | **24** | Feature detail | Low | Rare | 16 in sitemap | Low | **SMALL FINITE — KEEP** |
| `/industries/[slug]` | **25** | Industry hub | Low | Rare | 25 in sitemap | Medium | **KEEP SSG** |
| `/resources/[slug]` | **17** | Resource hub | Low | Rare | 17 | Low | **SMALL FINITE — KEEP** |
| `/sitemaps/[id]` | **15** | Sitemap XML | Low | Daily ISR | n/a | Crawl | **KEEP** (already ISR 1 day) |
| `/requirements/[slug]` | **14** | Requirement detail | Low | Rare | 10 | Low | **SMALL FINITE — KEEP** |
| `/for/[slug]` | **8** | Audience hub | Low | Rare | 8 | Low | **SMALL FINITE — KEEP** |
| Industry feature / requirement nests | **2 + 2** | Detail model | Trivial | Rare | Noindex | Low | **REMOVE** |
| `/authors/[slug]` | **1** | Author | Trivial | Rare | Yes | Low | **KEEP** |

Comparison reverse URLs are the single largest avoidable build family. `/compare/` is **not** in the Blob rewrite list, so dropping reverse slugs does not depend on the media-rewrite fix. A `next.config` redirect or a tiny redirect in `generateStaticParams`-free handling is enough. Today both `act-vs-affinity` and `affinity-vs-act` are prerendered; the non-canonical one only redirects.

Software × tab SSG is the second build family. It is real Build CPU. It is not current Fluid CPU.

---

## 8. Guide architecture

| Question | Finding |
| --- | --- |
| Count | **1,460** prerendered by this build. Catalogue helper outside the production publication filter returned 1,715. Sitemap `guides.xml` lists **593**. |
| Indexability | Per guide, `isEntityIndexable`. Hub `/guides` is indexable but dynamically rendered. |
| Render mode | Article: **SSG**. Hub: **DYNAMIC** because the page awaits `searchParams` (`category`, `q`, `topic`). |
| `draftMode` | Article pages call it. They still SSG. Hub does not call it. |
| `generateStaticParams` | 1,460. `dynamicParams` default true, but `/guides/:path*` Blob rewrites steal unknown slugs (section 10). |
| Metadata / page duplicate | Both call `resolveGuide` (educational seed, else product-guide repository, then enrichment overlay merge). The page also resolves related guides and calls `buildGuideLinkPlan`. |
| Content size | Article HTML for `/guides/what-is-crm/` was **277 KB**. Hero PNG was **1.67 MB**. |
| Data dependencies | Guide repository, category tools, product media bundles, internal link plan, author. |
| Revalidation | None on the article. Stale only on the next deploy. |

**Recommendation:** keep **SSG** for indexable guides. They change with content deploys, not per request, and they are a primary SEO surface. Do not move the indexable set to on-demand ISR. Stop prerendering guides that are outside the sitemap index gate if they are not linked as public documents.

The hub should be a **static shell**. Filter state (`category`, `topic`, `q`) belongs in the client. The current `revalidate = 3600` on `/search` does not apply to `/guides`, and even on `/search` it does not win (section 9).

---

## 9. Search architecture

```
/search
  export const revalidate = 3600          intended to cache the empty hub
  metadata is static (no searchParams)
  page awaits searchParams
    empty q → buildDiscoveryHub()
    q set    → runSearch() over the in-memory index (limit 48)
/api/search/suggest?q=
  same index, Cache-Control s-maxage=3600
prebuild
  scripts/build-search-index.ts writes src/data/generated/search-index.json
  this build: 6,410 documents, 6.4 MB on disk, built in 2.6 s
```

`getSearchRuntime()` reads that JSON from disk on cold start and keeps it on the module. Every query still runs scoring inside the function because the page is dynamic.

### Do `/search?q=a`, `?q=b`, `?q=c` create ISR entries?

**No.**

Next 16 docs: `searchParams` is a request-time API and opts the page into dynamic rendering. Source: `makeErroringSearchParams` → `throwToInterruptStaticGeneration` sets `revalidate = 0`. `getCacheControlHeader` then emits `private, no-cache, no-store, max-age=0, must-revalidate`.

Production, 2026-09-23:

| URL | Cache-Control | `x-vercel-cache` | `age` | `x-nextjs-prerender` |
| --- | --- | --- | --- | --- |
| `/search/` | private, no-store | MISS | 0 | absent |
| `/search/?q=pipedrive` | private, no-store | MISS | 0 | absent |
| `/search/?q=zzzz-audit-probe` | private, no-store | MISS | 0 | absent |

The `revalidate = 3600` export does not create a persistent entry for the empty hub or for any query. The comment in the page (“Cache the empty hub”) is not what this Next version does.

Same `no-store` + MISS behavior: `/guides/`, `/compare/`, `/tools/`, `/company/contact/`.

### Cost

Each search, including a crawler that ignores `robots`, is Fluid Active CPU and holds the search index in Fluid memory for the life of the instance. There is no ISR write amplification. That is still a high-priority architecture problem, of a different kind than unbounded ISR keys.

`/api/search/suggest` is already the controlled API, with an hour `s-maxage`. The page should not repeat that work.

### Safest target (not implemented)

- `/search` is a static shell (no awaited `searchParams`).
- The query lives in client state.
- Results come from `/api/search/suggest` or a sibling route with a bounded query, a max length (already 80 on suggest), and `s-maxage`.
- Do not render arbitrary `q` in the RSC page.

Apply the same shell split to `/guides`, `/compare`, and `/tools`. Their filters are finite category slugs, not free text, and they are currently more crawlable than `/search` (`/search` is disallowed; the hubs are not).

---

## 10. Media architecture

### Source and storage

Site media is gitignored under `public/{guides,software,capabilities,use-cases,vendor-ui,industries,features,resources,requirements,for}/`. Local disk currently holds about **6.7 GB** and **~6,000** files in those trees (guides alone: 3,735 files, 5.2 GB). `scripts/upload-public-to-blob.mjs` uploads them to the public Blob store with pathname = path under `public/`, `addRandomSuffix: false`, `cacheControlMaxAge` 30 days.

`/brands/` and `/og/` and `/brand/` are not in that gitignore list. `/brands/slack.png` is served by the deployment (`cache-control: public, max-age=604800`) and did not show `x-vercel-origin: blob`.

### Application URL → optimizer → rewrite → Blob

```
content path
  /guides/what-is-crm-hero.png
  /software/pipedrive/diagrams/pipeline-management.png
  /vendor-ui/pipedrive/product-view.png
        │
        ▼
GuideFigure uses next/image with unoptimized
  browser requests the path directly (plus ?dpl=<deployment id>)
Product screenshots and ProductLogo use <img>, not next/image
        │
        ▼
next.config rewrites() array  →  afterFiles
  /guides|software|capabilities|use-cases|vendor-ui|industries|features|resources|requirements|for/:path*
  → ${BLOB_PUBLIC_HOST}/...
  enabled when BLOB_PUBLIC_HOST is set and (VERCEL=1 or BLOB_MEDIA_REWRITES=1)
        │
        ▼
https://kxxfqtgoxjcif3x5.public.blob.vercel-storage.com/<folder>/<path>
```

Measured:

| Request | Result |
| --- | --- |
| `/guides/what-is-crm-hero.png` | 200, `image/png`, **1,671,961 bytes**, `cache-control: public, max-age=2592000`, first probe MISS then HIT |
| Same URL with `?dpl=dpl_...` | Separate cache key (the HTML references the query form) |
| `/software/not-a-real-product-audit/` | **404 from Blob** (`x-vercel-origin: blob`), not a Next `notFound()` |
| `/software/pipedrive/` | Next prerender, not Blob |
| `/_next/image/?url=/brand/mark.png&w=64&q=75` | 400 `INVALID_IMAGE_OPTIMIZE_REQUEST` on the probe (trailing-slash image path and/or asset not on that deployment) |

YouTube thumbs (`i.ytimg.com`) are plain `<img>` URLs. They are not in `remotePatterns` and do not go through the optimizer.

### Rewrite order (this is the constraint)

`rewrites()` returns an array, which Next treats as **`afterFiles`**: after prerendered pages and `public/` files, **before** dynamic routes.

So:

- A path that was prerendered (the software overview, a tab, a guide article) is served as static HTML and never hits Blob.
- A path under those folders that was **not** prerendered is proxied to Blob. Unknown product URLs 404 at Blob. Media files 200 from Blob through the Vercel hostname.

On-demand ISR for `/software/[slug]` or a tab **does not work** until those rewrites are `fallback`. Otherwise the first request never reaches the App Router.

`fallback` without `dynamicParams = false` would send junk `/software/*` URLs into the Node function instead. Pair any rewrite change with `dynamicParams = false` on catalogue routes, or with explicit redirects for retired URLs.

### Unnecessary cost

| Item | Effect |
| --- | --- |
| App-origin proxy of Blob bytes | Fast Origin Transfer on cache miss, plus Blob transfer. Direct Blob (or a media hostname) avoids the app origin. |
| `unoptimized` guide PNGs at ~1–1.6 MB | Full file on every miss. Optimizer is skipped on purpose (comment: large PNGs blank the figure). |
| `?dpl=` on those URLs | New deployment id is a new CDN key even when bytes did not change. |
| `afterFiles` on `/software` and `/guides` | Crawler misses become Blob 404s. Also blocks shrinking the SSG set. |
| Optimizer variant budget | `deviceSizes` 6 × `imageSizes` 8 × `qualities` [75, 90] × formats avif+webp = **56** variants per optimized source. `audit:vercel-cost` warns (target ≤ 24). Guide heroes opt out via `unoptimized`. Vendor UI and some hub images still use `next/image`. |
| `minimumCacheTTL` | 30 days. Fine. |
| Wildcard host | **No.** `remotePatterns` is only `kxxfqtgoxjcif3x5.public.blob.vercel-storage.com`. |

No `src/middleware.ts`. Image requests do not pass through the legacy-locale proxy (section 11).

---

## 11. Middleware

Next.js 16 names this `src/proxy.ts`. The build legend prints `ƒ Proxy (Middleware)` because the file exists. The matcher does **not** cover the English site.

Matcher prefixes only:

- Locales: `/fr`, `/de`, `/es`, `/nl`, `/zh`, `/hi`, `/ar`, `/pt`, `/it`, `/ja` and their subpaths
- Legacy WordPress: `/tag`, `/category`, `/author`, `/feed`, `/comments/feed`

Behavior: 2,642 locale redirects return 301; unmapped locale and feed paths return 410 (`max-age=86400`); author archives return 404. Everything else is `NextResponse.next()`, and those requests never enter the function because they fail the matcher.

| Request class | Enters proxy? |
| --- | --- |
| Images, `/_next/static`, `/_next/image` | No |
| `/software`, `/guides`, `/compare`, hubs | No |
| `/go` affiliate redirects | No |
| Bots on English URLs | No |
| Legacy locale and feed URLs | Yes |

This is not a high-volume Edge cost on the current English crawl surface. Leave it. Do not widen the matcher.

---

## 12. Blob

| Question | Finding |
| --- | --- |
| What is stored | The gitignored media packs listed in section 10, uploaded with stable pathnames. |
| Object count / size | Not re-listed from the Vercel API in this pass. Local `public/` packs that the upload script sends are on the order of **6,000 files and ~6.7 GB**. Treat that as the application’s view of the store, not a live billing reading. |
| URL structure | `https://kxxfqtgoxjcif3x5.public.blob.vercel-storage.com/<folder>/<path>` |
| How the app resolves objects | It does not. Pages emit same-origin paths. Production rewrites proxy them. |
| App-origin proxy | **Yes** (`afterFiles`). |
| Direct Blob delivery possible? | **Yes** for `<img src>` and for `next/image` (the host is already the only `remotePattern`). Legacy same-origin URLs can stay on a **`fallback`** rewrite so old links keep working. |
| Legacy URLs to preserve | `/guides/...png`, `/software/...`, `/vendor-ui/...`, and the other rewritten folders. Do not change pathnames (`addRandomSuffix: false` was chosen so paths stay stable). |

Do not migrate as part of this audit.

---

## 13. Observability

| System | Installed? | On the public hot path? |
| --- | --- | --- |
| Vercel Web Analytics | Yes (`@vercel/analytics` 2.0.1) | Only after analytics consent. `ConsentAwareAnalytics` mounts `<Analytics />` when consent allows. Bots and users who do not opt in do not emit beacons. |
| Speed Insights | **Not installed.** No `@vercel/speed-insights` dependency and no component. | n/a |
| OpenTelemetry | No `instrumentation.ts`. No OTEL SDK in app code. | No |
| Request logging | No request logger on public routes. | No |
| `console.warn` | `/best/[slug]` warns on content-gate leaks **only when `NODE_ENV !== "production"`**. | Not in production |
| Custom product analytics | `track()` sinks are consent-gated. Affiliate redirect does not depend on the sink. | Low volume, intentional |

Speed Insights sampling: **not applicable**. Web Analytics is consent-gated rather than sampled. That is the right default for a content site. Do not mount Speed Insights at 100% later.

---

## 14. next.config

File: `next.config.ts`.

| Setting | Value | Cost note |
| --- | --- | --- |
| `trailingSlash` | true | Image optimizer path forced to `/_next/image/` to avoid 308s. |
| `staticPageGenerationTimeout` | 180 s | Exists because page generation is slow. Symptom of the 13k-page estate. |
| `typescript.ignoreBuildErrors` | true | Deploy does not typecheck. Saves a little build time. Shifts correctness to local `npm run typecheck`. |
| `images.path` | `/_next/image/` | |
| `images.formats` | avif, webp | Two outputs per optimized source. |
| `images.qualities` | 75, 90 | Doubles variants. |
| `images.deviceSizes` / `imageSizes` | 6 + 8 widths | Combined budget **56** variants. |
| `images.minimumCacheTTL` | 30 days | Good. |
| `images.remotePatterns` | one Blob host | No wildcard. |
| `serverExternalPackages` | `jspdf`, `xlsx` | Kept out of the server bundle. Fine. |
| `experimental.optimizePackageImports` | `zod` | Fine. |
| `cacheComponents` | off | Previous caching model. Dynamic APIs fully dynamize the route. |
| `redirects()` | `config/legacy-redirects.json`, **382** rules | Checked before rewrites. Not middleware. Small. |
| `rewrites()` | sitemap pretty URLs + Blob `afterFiles` | See section 10. |
| `headers()` | long cache on `/og`, `/brands`; hour cache on `/api/search/suggest`; hour/day on sitemaps | Good. No cache header can save `/search` while the page is `no-store`. |

No `src/middleware.ts`. Proxy matcher is separate (section 11).

---

## 15. Deployment workflow

| Control | State |
| --- | --- |
| Production build | `npm run build` → prebuild search index, then `next build`. |
| Local validation | `npm run validate:predeploy` (lint, typecheck, test, build). `validate:predeploy:cost` also runs the cost detector. |
| CI | `.github/workflows/engineering-quality.yml` runs typecheck, lint, and unit tests on push and PR. It does **not** run `next build`. Scheduled intelligence workflows write reports only. **No workflow deploys to Vercel.** |
| Vercel | `vercel.json` `ignoreCommand` = `node scripts/vercel/ignored-build.mjs`. Exit 0 skips the deployment. Exit 1 builds. |
| What skips | `.cursor/`, `.github/`, `content/`, `docs/`, `reports/`, `tmp/`, and markdown-only files, when every changed file is in that set. |
| What always builds | `src/`, `public/`, `scripts/`, `config/`, `data/`, lockfiles, `next.config`, `package.json`. |
| Fail-open | Missing git parent or an unclassified file proceeds with the build. |
| Preview deployments | The repo does not disable them. The ignore command applies to whatever Vercel invokes, including previews, when Vercel supplies the git range. |
| Docs-only commits | Skipped, if they do not also touch `src/` or `data/`. |
| Cursor / agent edits | A mixed docs + `src` or `data` commit still builds. This working tree has a large `src/` and `data/` diff. Pushing it is one full ~15 minute production build (local measurement; Vercel’s historical average cited in repo guardrails was ~647 s on a turbo machine for a similar page count). Failed builds still bill Build CPU. |

The cost detector’s WARN that `ignoreCommand` does not call `scripts/vercel-ignored-build.mjs` is a filename mismatch. Protection **is** present. The script name is `scripts/vercel/ignored-build.mjs`.

`typescript.ignoreBuildErrors` means a green Vercel build is not a typecheck. Keep `validate:predeploy` local. Do not push to watch Vercel compile.

---

## 16. Production build

Command: `npm run build` (Next.js 16.3.0, Turbopack), local, 7 workers, `NODE_OPTIONS=--max-old-space-size=8192`.

| Item | Result |
| --- | --- |
| Exit | 0 |
| Wall time | 14 min 53 s |
| Compile | 2.5 min |
| Static pages generated | **13,662** |
| Typecheck | Skipped (`ignoreBuildErrors`) |
| Memory | No OOM |
| Warnings | **90** Turbopack file-pattern warnings. Dynamic `existsSync` / `readFileSync` globs pull in tens of thousands of files (`public/`, `data/seo/*overlays`, research JSON, analytics imports). That is build-time trace noise and can inflate serverless bundles for routes that touch those helpers. |
| Largest SSG families | `/compare/[slug]` 7,888; `/software/[slug]/[tab]` 2,835; `/guides/[slug]` 1,460; `/software/[slug]` 315; `/alternatives/[slug]` 309 |

Dynamic routes in this build (public HTML in bold):

`/search`, **`/guides`**, **`/compare`**, **`/compare/build`**, **`/tools`**, **`/company/contact`**, `/newsletter/confirm`, `/go/[product]/[[...destination]]`, research download and chart handlers, `/api/*`, `/dev/growth`, `/dev/product-testing`.

SSG routes of record had **no** revalidate column except `/sitemaps/[id]`, `/sitemap.xml`, and `/llms.txt` (1 day).

---

## 17. Cost findings

Impact is relative (HIGH / MEDIUM / LOW), not dollars. Confidence is in the current source plus this build plus production headers.

| # | Finding | Confidence | Build CPU | Fluid CPU | Fluid memory | Origin transfer | ISR reads | ISR writes | Image transforms | Image cache writes | Edge | Observability |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13,662 SSG pages every deploy, led by 7,888 comparison URLs | HIGH | **HIGH** | LOW | LOW | LOW | LOW | LOW (new deploy replaces output) | LOW | LOW | LOW | LOW |
| 2 | Hubs and search are dynamic `no-store` | HIGH | LOW | **HIGH** | MEDIUM (search index resident) | LOW | NONE | NONE | LOW | LOW | LOW | LOW |
| 3 | Blob `afterFiles` proxy plus ~1.6 MB unoptimized PNGs and `?dpl=` keys | HIGH | LOW | LOW | LOW | **HIGH** | LOW | LOW | LOW on guides (unoptimized) | MEDIUM on miss / new `dpl` | LOW | LOW |
| 4 | Full `buildSoftwareReviewModel` twice × 3,150 software URLs, 2,835 of them noindex | HIGH | **HIGH** | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW |
| 5 | 1,460 guides prerendered, 593 in the sitemap | HIGH | MEDIUM | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW |
| 6 | Unknown `/software/*` and `/guides/*` 404 at Blob | HIGH | LOW | LOW | LOW | MEDIUM (crawler misses) | LOW | LOW | LOW | LOW | LOW | LOW |
| 7 | Optimizer allows 56 variants where `next/image` is not `unoptimized` | HIGH | LOW | LOW | LOW | MEDIUM | LOW | LOW | **MEDIUM** | **MEDIUM** | LOW | LOW |
| 8 | `draftMode()` on public software and guides | HIGH that it does **not** dynamize | LOW | LOW (cookie bypass only) | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW |
| 9 | Arbitrary-query ISR | HIGH that it does **not** happen | LOW | — | — | — | NONE | NONE | — | — | — | — |
| 10 | Legacy locale proxy (2,642 redirects) | HIGH | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW (legacy URLs only) | LOW |
| 11 | Consent-gated Web Analytics, no Speed Insights | HIGH | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW |
| 12 | Turbopack traces scanning `public/` and SEO JSON | HIGH | MEDIUM (trace time, bundle weight) | LOW | MEDIUM if those modules land in a function | LOW | LOW | LOW | LOW | LOW | LOW | LOW |
| 13 | Ignored-build gap when a commit touches `src/` or `data/` | HIGH | HIGH per push | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW | LOW |

`/go` Fluid cost is intentional and disallowed in robots. Direct affiliate URLs are already the primary CTA path.

---

## 18. Prioritized remediation plan

### P0 — current cost burn

1. **Make `/guides`, `/compare`, `/tools`, and `/search` static shells.** Move `category` / `topic` / `q` into client state. Keep result execution on `/api/search/suggest` (or a sibling with the same cache header). This removes Fluid CPU from the pages crawlers actually hit. `/search` is disallowed but still fully dynamic, including the empty hub.
2. **Stop prerendering comparison reverse slugs.** About half of the 7,888 comparison pages exist to `permanentRedirect`. Emit a redirect without a React page. `/compare` is outside the Blob rewrite list, so this does not depend on media work.
3. **Move Blob rewrites from the `afterFiles` array to `fallback`.** Keep prerendered HTML winning, and stop unknown catalogue URLs from being proxied to Blob. Set `dynamicParams = false` on software and guide routes in the same change so junk URLs do not become function invocations.
4. **After that rewrite move, stop SSG of the nine noindex software tabs** (2,835 pages), or 301 the tab paths to the overview from `next.config` (redirects run before rewrites) and keep a single overview document. Do not remove tab `generateStaticParams` before the rewrite move: those URLs would Blob-404.
5. **Point large `<img>` / unoptimized figures at the Blob host (or another media host) and drop `?dpl=` as a cache key for immutable media.** Leave a fallback rewrite for old same-origin paths.

### P1 — high leverage

1. Wrap `buildSoftwareReviewModel` (and the comparison and guide loaders) in React `cache()` so metadata and the page share one build per request. Still worth doing while overview SSG remains.
2. Prerender guides and comparisons that are actually indexable (593 guides, 2,138 comparisons), not the full public catalogue (1,460 and ~4,000 canonicals).
3. Drop SSG for hardcoded-noindex industry nests (150 + 126 + 4).
4. Narrow `next/image` widths and qualities toward a single quality and fewer widths on the images that still use the optimizer.
5. Fix the cost detector: do not describe Next 16 `draftMode().isEnabled` as “this route is dynamic”; do flag awaited `searchParams` on public hubs; recognize `scripts/vercel/ignored-build.mjs`.

### P2 — optimization

1. Isolate preview on `/preview/...` so public modules do not import `draftMode`.
2. Reduce dynamic `fs` globs that make Turbopack trace all of `public/` and `data/seo`.
3. Keep `/company/contact?reason=` as a client default so the contact page can be static.
4. `/compare/build?a=&b=` can be a client redirect to the canonical comparison.

### P3 — optional

1. Legacy locale proxy is correctly matcher-scoped. No change for cost.
2. `/go` can stay dynamic until leftover inbound links die.
3. Web Analytics stays consent-gated. Do not add unsampled Speed Insights.

---

## 19. Proposed final architecture

This is SoftwareGlimpse-specific. The URL estate is large, mostly immutable between content deploys, and split between indexable documents and noindex UI routes. Media already lives on Blob but is addressed as same-origin paths that collide with dynamic segments.

**Public SEO documents** (`/`, software overview, indexable guides, indexable canonical comparisons, categories, best, alternatives, use cases, capabilities, pricing, tools pages):

- SSG at deploy.
- No `draftMode`, no `searchParams`, no cookies.
- `dynamicParams = false`.
- Revalidate only if a document must refresh without a deploy (sitemaps already do this daily). Product and guide HTML should stay immutable until the next content deploy.

**Noindex product tabs:**

- Not separate prerendered documents.
- Either client state on the overview, or one overview URL with in-page anchors.
- Existing tab URLs 301 to the overview via `next.config` so they never depend on Blob or on a function.

**Preview:**

- `/api/preview` checks the secret and redirects to `/preview/...`.
- That tree is dynamic, noindex, not in the sitemap, not linked from public pages.
- Public modules render the published record only.

**Search and filter hubs:**

- Static shell.
- Client query state.
- `/api/search/suggest` (already cached an hour) for typeahead and results.
- Hubs do not await `searchParams`.

**Affiliate:**

- Primary path stays the external URL from `resolveCommercialCta`.
- `/go/...` stays `force-dynamic` / `no-store` while old links exist. It is already `robots` disallowed.

**Media:**

- New markup uses the Blob public URL (host already allow-listed).
- `fallback` rewrites preserve old `/guides/...` and `/vendor-ui/...` paths.
- `fallback`, not `afterFiles`, so `/software/[slug]` remains an App Router route.
- Guide figures stay full-frame. If they remain `unoptimized`, they must not be re-fetched through the app origin on every deployment id.

**Filter and calculator state:**

- Already client-side on tool pages. Keep it there.
- Do not lift finder or calculator state into RSC `searchParams`.

**Proxy:**

- Leave the locale/feed matcher as it is. Do not add a matcher for HTML or images.

---

## 20. Implementation order

1. Static shells for `/search`, `/guides`, `/compare`, `/tools`. No media-rewrite dependency. Largest Fluid win.
2. Remove comparison reverse slugs from `generateStaticParams`; redirect instead. Largest Build CPU win that is safe today.
3. Switch Blob rewrites to `fallback` and set `dynamicParams = false` on software and guides. Verify an unknown `/software/*` is a Next 404, a known overview is still HTML, and a real PNG still loads.
4. Retire software tab SSG (redirect or single overview). Only after step 3, or via redirects that are independent of the page.
5. Cut non-indexable guide and comparison SSG down to the sitemap set.
6. `cache()` around the review model for the overview pages that remain.
7. Direct Blob URLs for the heavy PNGs; stop `?dpl=` cache busting on immutable media.
8. Move `draftMode()` to `/preview/...`.
9. Update `scripts/audit-vercel-cost.ts` so the next audit matches Next 16 behavior.

Do not start by deleting `draftMode()` from public pages as a cost fix. Those pages are already prerendered. Do not convert the indexable software and guide set to on-demand ISR. A new deploy would then pay Fluid CPU when crawlers walk the sitemap, and the current `afterFiles` rewrites would 404 any path that is not already a static file.

---

## SOFTWAREGLIMPSE VERCEL AUDIT

Total build pages: **13662**

Software products: **315**

Software tab URLs: **2835**

Guides: **1460** prerendered (593 in the sitemap)

Public force-dynamic routes: **1** (`/go/[product]/[[...destination]]`)

Public draftMode routes: **3 call sites, 0 dynamically rendered** (`/software/[slug]`, `/software/[slug]/[tab]`, `/guides/[slug]` are SSG)

Public cookie routes: **0**

Public searchParams dynamic routes: **7** (`/search`, `/guides`, `/compare`, `/tools`, `/company/contact`, `/compare/build`, `/newsletter/confirm`)

Largest build family: **`/compare/[slug]` — 7888**

Search arbitrary-query ISR risk: **NO**

Image middleware: **NO**

Image wildcard: **NO**

Speed Insights sampled: **NOT INSTALLED**

Ignored build protection: **YES**

### TOP 5 COST DRIVERS

1. Prerendering 13,662 pages on every deploy, especially 7,888 comparison URLs including reverse slugs.
2. Dynamic `no-store` renders of `/guides`, `/compare`, `/tools`, and `/search` on every request.
3. Full software review-model construction twice per URL across 3,150 software routes, 2,835 of them noindex tabs.
4. Blob `afterFiles` proxy of multi-megabyte images (and of any non-prerendered path under those folders), with `?dpl=` cache keys.
5. Guide and comparison SSG sets that are much larger than the sitemap index set (1,460 vs 593 guides; 7,888 vs 2,138 comparison URLs).

### P0 REMEDIATIONS

- Static shells for `/search`, `/guides`, `/compare`, and `/tools`; query execution only through the cached search API.
- Remove comparison reverse slugs from static generation; redirect them.
- Change Blob rewrites to `fallback` and set `dynamicParams = false` before shrinking software routes.
- Stop SSG of noindex software tabs after that rewrite change (or 301 them first).
- Serve heavy media from Blob directly and stop deployment-id cache busting on immutable files.

### P1 REMEDIATIONS

- `cache()` so metadata and the page share one software (and comparison, and guide) model build.
- SSG only the indexable guide and comparison sets.
- Drop SSG for noindex industry capability and use-case nests.
- Tighten `next/image` widths and qualities.
- Correct the cost detector so it matches Next 16 (`draftMode` read vs `searchParams` hubs vs the real ignore script).

### EXPECTED BIGGEST WIN

Stop prerendering comparison reverse URLs and noindex software tabs, and stop server-rendering the guide, compare, and tools hubs on every crawl. That cuts the majority of Build CPU and the Fluid CPU that production is actually spending.

### SAFE TO BEGIN REMEDIATION

**YES**

Start with the hub/search shells and comparison reverse redirects. Do not drop software tab prerender until Blob rewrites no longer sit in front of dynamic `/software` and `/guides` routes.
