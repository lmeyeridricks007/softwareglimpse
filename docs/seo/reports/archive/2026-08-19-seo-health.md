# SEO HEALTH LATEST

**Orchestrator:** SEOHealthOrchestrator v1.0.0  
**Mode:** FULL  
**Started:** 2026-08-19T08:21:25.970Z  
**Finished:** 2026-08-19T08:22:22.896Z  

> ANALYZE → REPORT → RECOMMEND only. **No auto-fixes.** Do not change canonicals, robots, copy, scores, or affiliate links from this report alone.

> ⚠️ **Incomplete run:** 0 check(s) failed, 9 skipped. Do **not** claim clean SEO.

## SEO HEALTH SUMMARY

| Metric | Value |
| --- | ---: |
| Findings | 0 |
| P0 | 0 |
| P1 | 0 |
| P2 | 0 |
| P3 | 0 |
| Checks completed | 23 |
| Checks skipped | 9 |
| Checks failed | 0 |

## Changes since previous run

| Status | Count |
| --- | ---: |
| NEW | 0 |
| RESOLVED | 0 |
| REGRESSED | 0 |
| UNCHANGED | 0 |
| EXISTING | 0 |

### New problems

_None_

### Resolved problems

_None_

### Regressed

_None_

## Area rollup

| Area | Findings |
| --- | ---: |
| Indexability / technical | 0 |
| Internal linking | 0 |
| Content coverage | 0 |
| Structured data | 0 |
| Performance | 0 |
| Media | 0 |
| Outbound links | 0 |

## Agent status

| Agent | Findings | Failed checks | Report |
| --- | ---: | ---: | --- |
| TechnicalSEOAuditAgent | 0 | 0 | `docs/seo/reports/technical-seo-latest.md` |
| InternalLinkAuditAgent | 0 | 0 | `docs/seo/reports/internal-linking-latest.md` |
| ContentCoverageAuditAgent | 0 | 0 | `docs/seo/reports/content-coverage-latest.md` |
| StructuredDataAuditAgent | 0 | 0 | `docs/seo/reports/structured-data-latest.md` |
| PerformanceAuditAgent | 0 | 0 | `docs/seo/reports/performance-latest.md` |
| MediaSEOAuditAgent | 0 | 0 | `docs/seo/reports/media-seo-latest.md` |
| OutboundLinkAuditAgent | 0 | 0 | `docs/seo/reports/outbound-links-latest.md` |

## Checks failed

_None_

## Checks skipped

- **TechnicalSEOAuditAgent** / `robots-meta-live-html`: Requires BASE_URL / --base-url against a running origin
- **TechnicalSEOAuditAgent** / `status-codes-live`: Requires BASE_URL / --base-url against a running origin
- **InternalLinkAuditAgent** / `redirect-links`: Requires BASE_URL / --base-url against a running origin
- **StructuredDataAuditAgent** / `live-html-jsonld`: Live rendered JSON-LD requires BASE_URL / --base-url against a running origin
- **StructuredDataAuditAgent** / `jsonld-syntax`: No live DOM without BASE_URL
- **PerformanceAuditAgent** / `field-cwv`: Lab TTFB proxies need BASE_URL. First-party web_vital collector is source-checked separately; CrUX/RUM is not ingested here
- **PerformanceAuditAgent** / `client-chunks`: Dev turbopack chunks are not a production JS budget — run next build
- **MediaSEOAuditAgent** / `live-html-img-scan`: Requires BASE_URL / --base-url against a running origin
- **MediaSEOAuditAgent** / `live-embed-probe`: Requires BASE_URL / --base-url against a running origin

## P0

_None_

## P1

_None_

## P2

_None_

## P3

_None_

## Top 20 recommendations

---

_Individual agent reports live under `docs/seo/reports/*-latest.md`. Archive written for FULL mode only._
