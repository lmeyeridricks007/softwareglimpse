# SEO HEALTH LATEST

**Orchestrator:** SEOHealthOrchestrator v1.0.0  
**Mode:** FULL  
**Started:** 2026-09-10T21:03:54.300Z  
**Finished:** 2026-09-10T21:06:13.769Z  

> ANALYZE → REPORT → RECOMMEND only. **No auto-fixes.** Do not change canonicals, robots, copy, scores, or affiliate links from this report alone.

> All registered checks completed for this mode.

## SEO HEALTH SUMMARY

| Metric | Value |
| --- | ---: |
| Findings | 2 |
| P0 | 0 |
| P1 | 1 |
| P2 | 1 |
| P3 | 0 |
| Checks completed | 32 |
| Checks skipped | 0 |
| Checks failed | 0 |

## Changes since previous run

| Status | Count |
| --- | ---: |
| NEW | 0 |
| RESOLVED | 4 |
| REGRESSED | 0 |
| UNCHANGED | 2 |
| EXISTING | 2 |

### New problems

_None_

### Resolved problems

- `PERF-TTFB-SITE-350E` — Lab TTFB above warn budget on live probe
- `PERF-TTFB-CATEGORIES-CRM-597E` — Lab TTFB above warn budget on live probe
- `PERF-TTFB-CAPABILITIES-PIPELINE-MANAGE-D148` — Lab TTFB above warn budget on live probe
- `PERF-TTFB-FEATURES-WORKFLOW-AUTOMATION-9119` — Lab TTFB above warn budget on live probe

### Regressed

_None_

## Area rollup

| Area | Findings |
| --- | ---: |
| Indexability / technical | 0 |
| Internal linking | 0 |
| Content coverage | 0 |
| Structured data | 0 |
| Performance | 2 |
| Media | 0 |
| Outbound links | 0 |

## Agent status

| Agent | Findings | Failed checks | Report |
| --- | ---: | ---: | --- |
| TechnicalSEOAuditAgent | 0 | 0 | `docs/seo/reports/technical-seo-latest.md` |
| InternalLinkAuditAgent | 0 | 0 | `docs/seo/reports/internal-linking-latest.md` |
| ContentCoverageAuditAgent | 0 | 0 | `docs/seo/reports/content-coverage-latest.md` |
| StructuredDataAuditAgent | 0 | 0 | `docs/seo/reports/structured-data-latest.md` |
| PerformanceAuditAgent | 2 | 0 | `docs/seo/reports/performance-latest.md` |
| MediaSEOAuditAgent | 0 | 0 | `docs/seo/reports/media-seo-latest.md` |
| OutboundLinkAuditAgent | 0 | 0 | `docs/seo/reports/outbound-links-latest.md` |

## Checks failed

_None_

## Checks skipped

_None_

## P0

_None_

## P1

- `PERF-TTFB-SEARCH-B82D` — Lab TTFB above warn budget on live probe

## P2

- `PERF-TTFB-REQUIREMENTS-SEPARATE-SALES--5C25` — Lab TTFB above warn budget on live probe

## P3

_None_

## Top 20 recommendations

### PERF-TTFB-SEARCH-B82D — P1

| Field | Value |
| --- | --- |
| Severity | P1 |
| Area | performance |
| Problem | Lab TTFB above warn budget on live probe |
| Evidence | `/search/` ttfb=8338ms (warn 800ms) html=83458B base=https://www.softwareglimpse.com |
| Affected pages | `/search/` |
| Likely cause | Cold server, heavy SSR, or slow data path |
| Recommended action | Profile route SSR against production/`next start`; this is lab TTFB not field CrUX LCP |
| Files/components | `src/app`, `src/performance/budgets.ts` |
| Expected impact | Better perceived load / crawl efficiency |
| Effort | medium |
| Confidence | 60% |

### PERF-TTFB-REQUIREMENTS-SEPARATE-SALES--5C25 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | performance |
| Problem | Lab TTFB above warn budget on live probe |
| Evidence | `/requirements/separate-sales-processes/` ttfb=839ms (warn 800ms) html=773953B base=https://www.softwareglimpse.com |
| Affected pages | `/requirements/separate-sales-processes/` |
| Likely cause | Cold server, heavy SSR, or slow data path |
| Recommended action | Profile route SSR against production/`next start`; this is lab TTFB not field CrUX LCP |
| Files/components | `src/app`, `src/performance/budgets.ts` |
| Expected impact | Better perceived load / crawl efficiency |
| Effort | medium |
| Confidence | 60% |

---

_Individual agent reports live under `docs/seo/reports/*-latest.md`. Archive written for FULL mode only._
