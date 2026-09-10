# TechnicalSEOAuditAgent report

**Agent:** TechnicalSEOAuditAgent  
**Mode:** FULL  
**Started:** 2026-09-09T18:51:22.510Z  
**Finished:** 2026-09-09T18:51:28.850Z  

> Report-only. This agent does **not** change canonicals, robots, content, scores, or affiliate links.

## Run status

| Checks | Count |
| --- | ---: |
| Completed | 6 |
| Skipped | 0 |
| Failed | 0 |
| Findings | 9 |

## Summary

Technical scan (FULL): 9 finding(s), 8 P0. Sitemap + canonical policy inspected. Live probes against https://www.softwareglimpse.com.

## Checks

| Check | Status | Reason |
| --- | --- | --- |
| `sitemap-entries` | completed | 3133 URLs |
| `canonical-policy` | completed | — |
| `url-consistency` | completed | — |
| `robots-meta-live-html` | completed | 34 pages from https://www.softwareglimpse.com |
| `status-codes-live` | completed | 34 HTTP probes |
| `mobile-parity` | completed | App Router single responsive template; viewport meta expected (no separate mobile templates) |

## Findings

### SEO-STATUS-COMPARE-CRISP-VS-TIDIO-4AE9 — P0

| Field | Value |
| --- | --- |
| Severity | P0 |
| Area | technical |
| Problem | Page returns HTTP 404 |
| Evidence | `/compare/crisp-vs-tidio/` status=404 |
| Affected pages | `/compare/crisp-vs-tidio/` |
| Likely cause | Missing route, bad redirect, or unpublished entity still linked |
| Recommended action | Restore the page (IMPROVE → 200+noindex), add a 301, or remove inbound links |
| Files/components | `src/app`, `src/seo/sitemap.ts` |
| Expected impact | Stops crawl waste and soft-404 indexing risk |
| Effort | medium |
| Confidence | 95% |

### SEO-STATUS-BEST-SOCIAL-MEDIA-MARKETING--A462 — P0

| Field | Value |
| --- | --- |
| Severity | P0 |
| Area | technical |
| Problem | Page returns HTTP 404 |
| Evidence | `/best/social-media-marketing-software/` status=404 |
| Affected pages | `/best/social-media-marketing-software/` |
| Likely cause | Missing route, bad redirect, or unpublished entity still linked |
| Recommended action | Restore the page (IMPROVE → 200+noindex), add a 301, or remove inbound links |
| Files/components | `src/app`, `src/seo/sitemap.ts` |
| Expected impact | Stops crawl waste and soft-404 indexing risk |
| Effort | medium |
| Confidence | 95% |

### SEO-STATUS-RESEARCH-CRM-PRICING-13DD — P0

| Field | Value |
| --- | --- |
| Severity | P0 |
| Area | technical |
| Problem | Page returns HTTP 404 |
| Evidence | `/research/crm-pricing/` status=404 |
| Affected pages | `/research/crm-pricing/` |
| Likely cause | Missing route, bad redirect, or unpublished entity still linked |
| Recommended action | Restore the page (IMPROVE → 200+noindex), add a 301, or remove inbound links |
| Files/components | `src/app`, `src/seo/sitemap.ts` |
| Expected impact | Stops crawl waste and soft-404 indexing risk |
| Effort | medium |
| Confidence | 95% |

### SEO-STATUS-FR-MON-HISTOIRE-7B8E — P0

| Field | Value |
| --- | --- |
| Severity | P0 |
| Area | technical |
| Problem | Page returns HTTP 404 |
| Evidence | `/fr/mon-histoire/` status=404 |
| Affected pages | `/fr/mon-histoire/` |
| Likely cause | Missing route, bad redirect, or unpublished entity still linked |
| Recommended action | Restore the page (IMPROVE → 200+noindex), add a 301, or remove inbound links |
| Files/components | `src/app`, `src/seo/sitemap.ts` |
| Expected impact | Stops crawl waste and soft-404 indexing risk |
| Effort | medium |
| Confidence | 95% |

### SEO-STATUS-FR-7512 — P0

| Field | Value |
| --- | --- |
| Severity | P0 |
| Area | technical |
| Problem | Page returns HTTP 404 |
| Evidence | `/fr/` status=404 |
| Affected pages | `/fr/` |
| Likely cause | Missing route, bad redirect, or unpublished entity still linked |
| Recommended action | Restore the page (IMPROVE → 200+noindex), add a 301, or remove inbound links |
| Files/components | `src/app`, `src/seo/sitemap.ts` |
| Expected impact | Stops crawl waste and soft-404 indexing risk |
| Effort | medium |
| Confidence | 95% |

### SEO-STATUS-DE-F68B — P0

| Field | Value |
| --- | --- |
| Severity | P0 |
| Area | technical |
| Problem | Page returns HTTP 404 |
| Evidence | `/de/` status=404 |
| Affected pages | `/de/` |
| Likely cause | Missing route, bad redirect, or unpublished entity still linked |
| Recommended action | Restore the page (IMPROVE → 200+noindex), add a 301, or remove inbound links |
| Files/components | `src/app`, `src/seo/sitemap.ts` |
| Expected impact | Stops crawl waste and soft-404 indexing risk |
| Effort | medium |
| Confidence | 95% |

### SEO-STATUS-TAG-PIPEDRIVE-1F9F — P0

| Field | Value |
| --- | --- |
| Severity | P0 |
| Area | technical |
| Problem | Page returns HTTP 404 |
| Evidence | `/tag/pipedrive/` status=404 |
| Affected pages | `/tag/pipedrive/` |
| Likely cause | Missing route, bad redirect, or unpublished entity still linked |
| Recommended action | Restore the page (IMPROVE → 200+noindex), add a 301, or remove inbound links |
| Files/components | `src/app`, `src/seo/sitemap.ts` |
| Expected impact | Stops crawl waste and soft-404 indexing risk |
| Effort | medium |
| Confidence | 95% |

### SEO-STATUS-CATEGORY-RANDOM-THIN-TAG-XYZ-1169 — P0

| Field | Value |
| --- | --- |
| Severity | P0 |
| Area | technical |
| Problem | Page returns HTTP 404 |
| Evidence | `/category/random-thin-tag-xyz/` status=404 |
| Affected pages | `/category/random-thin-tag-xyz/` |
| Likely cause | Missing route, bad redirect, or unpublished entity still linked |
| Recommended action | Restore the page (IMPROVE → 200+noindex), add a 301, or remove inbound links |
| Files/components | `src/app`, `src/seo/sitemap.ts` |
| Expected impact | Stops crawl waste and soft-404 indexing risk |
| Effort | medium |
| Confidence | 95% |

### SEO-ROBOTS-TOOLS-SOFTWARE-FINDER-9DD0 — P1

| Field | Value |
| --- | --- |
| Severity | P1 |
| Area | technical |
| Problem | Policy-noindex route missing noindex in live HTML |
| Evidence | path=`/tools/software-finder/` robots=`index, follow, index, follow` |
| Affected pages | `/tools/software-finder/` |
| Likely cause | Page omitted robots noindex despite policy gate |
| Recommended action | Emit robots noindex via buildPageMetadata |
| Files/components | `src/seo/metadata.ts`, `src/app` |
| Expected impact | Prevents soft-indexing of gated surfaces |
| Effort | small |
| Confidence | 85% |


---

_Generated by `technical-seo-audit-agent` v1.0.0. No auto-fixes applied._
