# Sitemap architecture

**Canonical discovery endpoint:** `https://www.softwareglimpse.com/sitemap.xml`  
**Canonical host:** `https://www.softwareglimpse.com` (www + HTTPS)  
**Code:** `src/seo/sitemap.ts`, `src/app/sitemap.xml/route.ts`, `src/app/sitemaps/[id]/route.ts`  
**robots.txt:** `Sitemap: https://www.softwareglimpse.com/sitemap.xml` (index only)

---

## Sitemap index architecture

`/sitemap.xml` is a **sitemap index**, not a monolithic urlset.

Each child is a named content-type urlset:

| Public URL | Content type | Role |
| --- | --- | --- |
| `/sitemap-pages.xml` | pages | Home, IA hubs, company, legal, research |
| `/sitemap-software.xml` | software | Product hubs (includes editorial reviews) |
| `/sitemap-comparisons.xml` | comparisons | INDEXABLE `/compare/{slug}/` |
| `/sitemap-guides.xml` | guides | INDEXABLE `/guides/{slug}/` |
| `/sitemap-alternatives.xml` | alternatives | Alternatives hub + pages |
| `/sitemap-categories.xml` | categories | Category hubs |
| `/sitemap-tools.xml` | tools | Available decision tools |
| `/sitemap-best.xml` | best | Best-of buying guides |
| `/sitemap-use-cases.xml` | use-cases | Use-case hubs |
| `/sitemap-capabilities.xml` | capabilities | Capability hubs |
| `/sitemap-features.xml` | features | Feature detail pages |
| `/sitemap-requirements.xml` | requirements | Requirement pillars |
| `/sitemap-resources.xml` | resources | Resource pages |
| `/sitemap-audiences.xml` | audiences | `/for/{slug}/` |
| `/sitemap-industries.xml` | industries | Industry hubs |

**Not created**

- `/sitemap-reviews.xml` — reviews are not a separate public URL surface; they live on `/software/{slug}/` and are counted under **software**.
- Empty partitions — omitted from the index entirely.
- Numeric chunks (`/sitemaps/0.xml`) — replaced by named children.

**Reconciliation:** `npm run seo:sitemap-reconcile` (optional `--live https://www.softwareglimpse.com` or local `http://127.0.0.1:3000`). Report: `docs/seo/SITEMAP-LIFECYCLE-RECONCILIATION.md`.

**Routing**

- Public: `/sitemap-{name}.xml`
- Handler: `/sitemaps/{name}.xml` via `next.config` rewrite
- Pagination (only if a type exceeds `SITEMAP_CHUNK_SIZE` = 10 000):  
  `/sitemap-comparisons-1.xml`, `/sitemap-comparisons-2.xml`, …

---

## Child sitemap counts (build-time sample)

Generated via `getSitemapDiagnostics()`:

| Sitemap | Content type | URLs |
| --- | --- | ---: |
| `/sitemap-pages.xml` | pages | 32 |
| `/sitemap-software.xml` | software | 315 |
| `/sitemap-comparisons.xml` | comparisons | 1501 |
| `/sitemap-guides.xml` | guides | 372 |
| `/sitemap-alternatives.xml` | alternatives | 312 |
| `/sitemap-categories.xml` | categories | 22 |
| `/sitemap-tools.xml` | tools | 102 |
| `/sitemap-best.xml` | best | 12 |
| `/sitemap-use-cases.xml` | use-cases | 87 |
| `/sitemap-capabilities.xml` | capabilities | 70 |
| `/sitemap-features.xml` | features | 16 |
| `/sitemap-requirements.xml` | requirements | 10 |
| `/sitemap-resources.xml` | resources | 17 |
| `/sitemap-audiences.xml` | audiences | 8 |
| `/sitemap-industries.xml` | industries | 25 |
| **Total** | | **~2 901** |

Search Console map:

```text
Sitemap index (/sitemap.xml)
  ├─ pages          → core / legal / research
  ├─ software       → product hubs (+ reviews on-page)
  ├─ comparisons    → INDEXABLE pairs only
  ├─ guides         → INDEXABLE guides only
  ├─ alternatives
  ├─ categories
  ├─ tools
  ├─ best
  └─ topical hubs   → use-cases / capabilities / features / …
```

---

## Eligibility rules

A URL enters the sitemap only when **all** applicable checks pass:

| Rule | Enforcement |
| --- | --- |
| Production HTTPS URL | `canonicalUrl()` + `getSiteUrl()` |
| Canonical hostname (`www`) | `CANONICAL_PRODUCTION_ORIGIN` / `NEXT_PUBLIC_SITE_URL` |
| Self-canonical path | trailing slash, lowercase, alias rewrite |
| Index allowed | `seo.indexable` + publish gate + type quality gate |
| Comparison worthiness | `isEntityIndexable` → `isComparisonSearchIndexWorthy` (COMPARE-AUDIT) |
| Guide worthiness | `isEntityIndexable` → `isGuideSearchIndexWorthy` (GUIDES-AUDIT) |
| Not utility / facet junk | excluded: `/search/`, `/go/`, `/compare/build/`, stack-builder, gated tools |
| Not legacy locale / WP taxonomy | never emitted; asserted in tests (ENGLISH-LEGACY-CLEANUP) |
| Not soft-published | publication context gate |

### Entry fields

- `<loc>` — always
- `<lastmod>` — **only** when backed by entity/document `updatedAt` / `publishedAt` / legal `lastUpdatedAt`
- **No** `<priority>` / `<changefreq>` (not meaningful for ranking)

Index child `<lastmod>` uses the max legitimate timestamp among that child’s URLs (omitted when none).

---

## Excluded route classes

| Class | Example | Notes |
| --- | --- | --- |
| Noindex / ineligible guides | factory packs, product explainers in IMPROVE queue | GUIDES-AUDIT → IMPROVE (temporary noindex) |
| Ineligible comparisons | Cartesian mesh without declared relationship | COMPARE-AUDIT → IMPROVE (temporary noindex) |
| Soft-publish entities | scheduled / draft | publish gate |
| Utilities | `/search/`, `/go/`, `/api/`, `/dev/` | robots Disallow + not in builder |
| Compare builder | `/compare/build/` | noindex utility |
| Gated category tools | pillar category not public yet | pillar gate |
| Merged feature twins | hub-page twins | skipped |
| Locale prefixes | `/fr/…`, `/de/…` | Proxy 301/410; never sitemap |
| WP taxonomy | `/tag/`, `/category/`, `/author/` | Proxy 410/301; never sitemap |
| Product tabs | `/software/{slug}/{tab}/` | noindex tabs |
| Parameter / facet duplicates | query strings | stripped by canonical |

### Exclusion counts (sample)

| Bucket | Count |
| --- | ---: |
| Noindex / ineligible guides | ~1 549 |
| Ineligible comparisons | ~3 102 |
| Noindex alternatives | ~3 |
| Noindex categories | ~23 |
| Noindex best pages | ~22 |
| Gated category tools | ~16 |
| Ineligible features / requirements | ~11 |

---

## Canonical domain choice

| Decision | Value |
| --- | --- |
| Canonical origin | **`https://www.softwareglimpse.com`** |
| Apex (`https://softwareglimpse.com`) | Not used in sitemap, robots, canonical tags, OG, or JSON-LD |
| Constant | `CANONICAL_PRODUCTION_ORIGIN` in `src/seo/english-only-cutover.ts` |
| Site helper | `getSiteUrl()` defaults to www |
| robots `host` + `Sitemap` | www index only |

Do not mix www and non-www in absolute URLs. DNS/platform should 301 apex → www (ops); app emissions always use www.

---

## robots.txt relationship

```text
User-Agent: *
Allow: /
Disallow: /go/ /api/ /search/ /dev/ /compare/build/ /newsletter/

Host: https://www.softwareglimpse.com
Sitemap: https://www.softwareglimpse.com/sitemap.xml
```

- References the **index**, not each child.
- Does **not** Disallow `/sitemap` or `/sitemaps`.
- Does **not** Disallow locale prefixes (Proxy must be fetched for 301/410).

---

## Test coverage

| Area | Location |
| --- | --- |
| Index + named children, no duplicates, no priority/changefreq | `src/seo/technical-seo.test.ts` |
| Guide + comparison eligibility | same + compare/guides worthiness tests |
| Legacy locale/taxonomy never in sitemap | `src/seo/english-only-cutover.test.ts` |
| Diagnostics fail-closed on prohibited/dup/host drift | `getSitemapDiagnostics()` assertions |

Automatic validations:

1. Sitemap XML / index XML shape  
2. Sampled locs are canonical www HTTPS  
3. No duplicate URLs across children  
4. No locale / WP taxonomy paths  
5. No noindex guides or ineligible comparisons  
6. Hostname consistency  

Tests fail when prohibited classes appear. Incomplete catalogue data alone does not fail production build unless a URL would be incorrectly exposed as indexable.

---

## How to add a future content type safely

1. Confirm a **real public route** exists (do not invent empty sitemaps).
2. Add a `SitemapContentType` + `PARTITION_META` slug/label in `src/seo/sitemap.ts`.
3. Push eligible URLs into that partition only when index gates pass.
4. Prefer real `lastModified` metadata; omit when unknown.
5. Re-run `getSitemapDiagnostics()` — empty partitions stay omitted.
6. Extend tests for eligibility + “not in wrong child”.
7. Update this doc’s count table after the next audit run.

**Pagination:** if a partition approaches 10 000 URLs, `buildSitemapChildFiles()` automatically emits `/sitemap-{slug}-1.xml`, `-2.xml`, … Deterministic order (sorted by URL).

---

## Related audits

- `docs/seo/GUIDES-AUDIT.md` — guide INDEXABLE / IMPROVE lifecycle policy  
- `docs/seo/COMPARE-AUDIT.md` — comparison INDEXABLE / IMPROVE lifecycle policy
- `data/seo/content-lifecycle.json` — promotion registry (`promoteToIndexable`)
- `docs/seo/ENGLISH-LEGACY-CLEANUP.md` — locale + WP taxonomy cutover  
